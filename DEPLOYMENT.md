# 🚀 Quick Deployment Guide

Get your POAPStays platform with smart contract integration running in minutes!

## ⚡ **Quick Start (5 minutes)**

### 1. **Install Dependencies**
```bash
pnpm install
```

### 2. **Set Up Database**
```bash
pnpm db:push
```

### 3. **Deploy Smart Contract (Optional)**
```bash
cd contracts
pnpm install
pnpm compile
pnpm deploy:sepolia  # Deploy to Sepolia testnet
```

### 4. **Start Development Server**
```bash
pnpm dev
```

## 🔧 **Smart Contract Setup**

### **Option A: Use Pre-deployed Contract (Recommended for testing)**

If you don't want to deploy your own contract, you can use a test contract on Sepolia. Update `apps/nextjs/src/utils/contract.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  '11155111': '0x1234567890123456789012345678901234567890', // Replace with actual Sepolia address
  '137': '0x0000000000000000000000000000000000000000',
  '1': '0x0000000000000000000000000000000000000000',
};
```

### **Option B: Deploy Your Own Contract**

1. **Get Test ETH**:
   - Sepolia: [Sepolia Faucet](https://sepoliafaucet.com/)
   - Polygon: [Polygon Faucet](https://faucet.polygon.technology/)

2. **Set Environment Variables**:
   ```bash
   cd contracts
   cp .env.example .env
   # Edit .env with your private key and RPC URLs
   ```

3. **Deploy**:
   ```bash
   pnpm deploy:sepolia
   ```

4. **Update Frontend**:
   Copy the deployed address to `apps/nextjs/src/utils/contract.ts`

## 🌐 **Network Configuration**

### **Supported Networks**
- **Sepolia Testnet** (Chain ID: 11155111) - ✅ **Recommended for testing**
- **Polygon** (Chain ID: 137) - ✅ **Low gas fees**
- **Ethereum Mainnet** (Chain ID: 1) - ⚠️ **High gas fees**

### **RPC URLs**
```env
# Sepolia (Infura)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_API_KEY

# Polygon
POLYGON_RPC_URL=https://polygon-rpc.com

# Ethereum Mainnet
MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY
```

## 📱 **Testing the Integration**

### **1. Connect Wallet**
- Sign in with Google/email
- Your embedded wallet is automatically created
- Link external wallet (MetaMask, Coinbase) if desired

### **2. Switch to Testnet**
- Use Sepolia testnet for testing
- Get test ETH from faucet
- Deploy contract to testnet

### **3. Test Functions**
- **Check Balance**: View your PST token balance
- **Transfer Tokens**: Send tokens to another address
- **Mint Tokens**: Create new tokens (owner only)

## 🔍 **Troubleshooting**

### **Common Issues**

1. **"Contract Not Deployed" Error**
   - Ensure contract is deployed to current network
   - Check contract addresses in `contract.ts`
   - Verify network connection

2. **Transaction Failures**
   - Check gas limits and fees
   - Ensure sufficient test ETH
   - Verify recipient address format

3. **Balance Not Updating**
   - Click "Refresh" button
   - Wait for transaction confirmation
   - Check network status

### **Quick Fixes**

```bash
# Reset everything
pnpm clean
pnpm install
pnpm db:push

# Recompile contract
cd contracts
pnpm compile

# Restart dev server
pnpm dev
```

## 📚 **Next Steps**

### **For Developers**
1. **Customize Contract**: Modify `SimpleToken.sol` for your needs
2. **Add Functions**: Implement additional smart contract features
3. **Testing**: Write comprehensive tests for your contract
4. **Security**: Audit your smart contract before mainnet

### **For Users**
1. **Get Test Tokens**: Use faucets for testnet testing
2. **Try All Features**: Test wallet linking, transfers, and minting
3. **Switch Networks**: Test on different chains
4. **Link Wallets**: Connect multiple wallet types

## 🎯 **Production Deployment**

### **Before Mainnet**
- [ ] Audit smart contract
- [ ] Test on multiple networks
- [ ] Set up monitoring and alerts
- [ ] Configure gas optimization
- [ ] Set up backup RPC providers

### **Mainnet Checklist**
- [ ] Deploy to Ethereum mainnet
- [ ] Verify contract on Etherscan
- [ ] Set up proper gas management
- [ ] Monitor transaction costs
- [ ] Implement rate limiting

## 🆘 **Need Help?**

- **Smart Contract Issues**: Check Hardhat logs and network status
- **Frontend Problems**: Verify contract addresses and network connection
- **Database Errors**: Run `pnpm db:push` to sync schema
- **Wallet Issues**: Check Privy configuration and network settings

---

**🎉 You're all set!** Your POAPStays platform now has full smart contract integration with multi-wallet support.
