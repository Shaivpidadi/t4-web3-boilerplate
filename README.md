# POAPStays - Rental Platform with Web3 Integration

A modern rental platform built with the T3 Stack, featuring Dynamic authentication, multi-wallet support, and smart contract integration.

## Features

### 🔐 Authentication & Wallets

- **Dynamic Integration**: Seamless Web3 authentication
- **Multi-Wallet Support**: Connect both embedded and external wallets
- **Supported External Wallets**: MetaMask, Coinbase Wallet
- **Wallet Management**: Link, unlink, and set primary wallets
- **Chain Support**: Ethereum Mainnet, Polygon, Sepolia Testnet

### ⚡ Smart Contract Integration

- **ERC-20 Token**: POAPStays Token (PST) with 1M initial supply
- **Token Management**: Transfer, mint, and balance checking
- **Multi-Network Support**: Deploy to Ethereum, Polygon, or Sepolia
- **Owner Functions**: Mint new tokens (deployer only)
- **Real-time Updates**: Automatic balance refresh after transactions

### 🏠 Rental Platform

- User authentication and profiles
- Property listings and management
- Booking system
- Payment processing

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Dynamic
- **Smart Contracts**: Solidity + Hardhat + OpenZeppelin
- **Styling**: Tailwind CSS
- **Type Safety**: TypeScript
- **API**: tRPC
- **UI Components**: shadcn/ui

## Database Schema

### Users

```sql
CREATE TABLE "user" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "privy_user_id" text UNIQUE NOT NULL,
  "email" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "last_login_at" timestamp DEFAULT now() NOT NULL
);
```

### Wallets

```sql
CREATE TABLE "wallet" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "address" text NOT NULL,
  "type" text NOT NULL DEFAULT 'embedded', -- 'embedded' or 'external'
  "provider" text NOT NULL DEFAULT 'dynamic', -- 'dynamic', 'metamask', 'coinbase', etc.
  "chain_id" text DEFAULT '1', -- Current chain ID
  "is_primary" boolean DEFAULT false, -- Primary wallet for actions
  "is_active" boolean DEFAULT true, -- Whether wallet is active
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp
);
```

## Smart Contract

### SimpleToken Contract

```solidity
contract SimpleToken is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 1000000 * 10**18; // 1M PST

    function mint(address to, uint256 amount) public onlyOwner
    function getBalance(address account) public view returns (uint256)
    function transferTokens(address to, uint256 amount) public returns (bool)
}
```

### Contract Features

- **ERC-20 Compliant**: Standard token interface
- **Mintable**: Owner can create new tokens
- **Transferable**: Users can send tokens to others
- **Initial Supply**: 1 million PST tokens for deployer

## Wallet Management

### Supported Wallet Types

- **Embedded Wallets**: Automatically created by Dynamic for users without existing wallets
- **External Wallets**: User's existing MetaMask, Coinbase Wallet, etc.

### Wallet Features

- **Primary Wallet**: One wallet per user is designated as primary for transactions
- **Multi-Chain Support**: Switch between Ethereum, Polygon, and Sepolia
- **Balance Tracking**: Real-time balance updates for both ETH and PST tokens
- **Transaction Signing**: Sign messages and send transactions
- **Wallet Linking**: Connect external wallets through Dynamic's interface

### API Endpoints

- `GET /api/trpc/auth.getWallets` - Get user's wallets
- `POST /api/trpc/auth.upsertWallet` - Create or update wallet
- `POST /api/trpc/auth.setPrimaryWallet` - Set primary wallet
- `POST /api/trpc/auth.deactivateWallet` - Deactivate wallet

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database
- Dynamic Environment ID
- Ethereum private key (for contract deployment)

### Environment Variables

```env
# Database
POSTGRES_URL="postgresql://..."

# Dynamic
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID="your-dynamic-environment-id"
EXPO_PUBLIC_DYNAMIC_ENVIRONMENT_ID="your-dynamic-environment-id"

# Smart Contract Deployment
PRIVATE_KEY="your_private_key"
SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/your_api_key"
POLYGON_RPC_URL="https://polygon-rpc.com"
MAINNET_RPC_URL="https://eth-mainnet.g.alchemy.com/v2/your_api_key"
```

### Installation

```bash
# Install dependencies
pnpm install

# Set up database
pnpm db:push

# Deploy smart contract (optional)
cd contracts
pnpm install
pnpm compile
pnpm deploy:sepolia  # or other networks

# Start development server
pnpm dev
```

## Smart Contract Deployment

### Quick Deploy

```bash
cd contracts
pnpm install
pnpm compile
pnpm deploy:sepolia
```

### Update Frontend

After deployment, update contract addresses in `apps/nextjs/src/utils/contract.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  "11155111": "0x...", // Sepolia - Replace with deployed address
  "137": "0x...", // Polygon - Replace with deployed address
  "1": "0x...", // Ethereum - Replace with deployed address
};
```

## Wallet Integration

### For Users

1. **Sign in** with Google or email
2. **Embedded wallet** is automatically created
3. **Link external wallet** by clicking "Link External Wallet" in the dashboard
4. **Set primary wallet** for transactions
5. **Switch chains** as needed
6. **Interact with smart contracts** using the Smart Contract Panel

### For Developers

The wallet system is built around Dynamic's wallet abstraction:

```typescript
import { useWallet } from "../utils/wallet";

function MyComponent() {
  const {
    account, // Primary wallet
    wallets, // All connected wallets
    tokenBalance, // PST token balance
    contractInteractor, // Smart contract interface
    linkExternalWallet,
    setPrimaryWalletAddress,
    switchChain,
    signMessage,
    sendTransaction,
    transferTokens, // Transfer PST tokens
    mintTokens, // Mint new tokens (owner only)
  } = useWallet();
}
```

## Architecture

### Wallet Priority System

1. **Embedded wallets** are preferred as primary
2. **External wallets** are optional but supported
3. **Primary wallet** is used for all transactions
4. **Multiple wallets** can be connected per user

### Smart Contract Integration

1. **Contract Interactor**: Manages contract calls and transactions
2. **Multi-Network Support**: Deploy to different chains
3. **Real-time Updates**: Balance and status monitoring
4. **Error Handling**: Graceful fallbacks for network issues

### Database Design

- **One-to-many** relationship between users and wallets
- **Primary flag** ensures one wallet per user for transactions
- **Type and provider** fields for wallet categorization
- **Active flag** for soft deletion

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
