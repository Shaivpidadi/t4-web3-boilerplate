# POAPStays - Rental Platform with Web3 Integration

A modern rental platform built with the T3 Stack, featuring Privy authentication and multi-wallet support.

## Features

### 🔐 Authentication & Wallets
- **Privy Integration**: Seamless Web3 authentication
- **Multi-Wallet Support**: Connect both embedded and external wallets
- **Supported External Wallets**: MetaMask, Coinbase Wallet
- **Wallet Management**: Link, unlink, and set primary wallets
- **Chain Support**: Ethereum Mainnet, Polygon, Sepolia Testnet

### 🏠 Rental Platform
- User authentication and profiles
- Property listings and management
- Booking system
- Payment processing

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Privy
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
  "user_id" uuid REFERENCES "user"(id) ON DELETE CASCADE,
  "address" text NOT NULL,
  "type" text NOT NULL DEFAULT 'embedded', -- 'embedded' or 'external'
  "provider" text NOT NULL DEFAULT 'privy', -- 'privy', 'metamask', 'coinbase', etc.
  "chain_id" text DEFAULT '1',
  "is_primary" boolean DEFAULT false,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp
);
```

## Wallet Management

### Supported Wallet Types
- **Embedded Wallets**: Automatically created by Privy for users without existing wallets
- **External Wallets**: User's existing MetaMask, Coinbase Wallet, etc.

### Wallet Features
- **Primary Wallet**: One wallet per user is designated as primary for transactions
- **Multi-Chain Support**: Switch between Ethereum, Polygon, and Sepolia
- **Balance Tracking**: Real-time balance updates
- **Transaction Signing**: Sign messages and send transactions
- **Wallet Linking**: Connect external wallets through Privy's interface

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
- Privy App ID

### Environment Variables
```env
# Database
POSTGRES_URL="postgresql://..."

# Privy
NEXT_PUBLIC_PRIVY_APP_ID="your-privy-app-id"
```

### Installation
```bash
# Install dependencies
pnpm install

# Set up database
pnpm db:push

# Start development server
pnpm dev
```

## Wallet Integration

### For Users
1. **Sign in** with Google or email
2. **Embedded wallet** is automatically created
3. **Link external wallet** by clicking "Link External Wallet" in the dashboard
4. **Set primary wallet** for transactions
5. **Switch chains** as needed

### For Developers
The wallet system is built around Privy's wallet abstraction:

```typescript
import { useWallet } from '../utils/wallet';

function MyComponent() {
  const {
    account,           // Primary wallet
    wallets,           // All connected wallets
    linkExternalWallet,
    setPrimaryWalletAddress,
    switchChain,
    signMessage,
    sendTransaction
  } = useWallet();
}
```

## Architecture

### Wallet Priority System
1. **Embedded wallets** are preferred as primary
2. **External wallets** are optional but supported
3. **Primary wallet** is used for all transactions
4. **Multiple wallets** can be connected per user

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
