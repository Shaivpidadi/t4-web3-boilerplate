# 🧪 Testing Guide - Existing Smart Contract

This guide will help you test the smart contract integration using the existing contract on Sepolia testnet.

## 🎯 **What We're Testing**

We're using an existing verified smart contract on Sepolia testnet:
- **Contract Address**: `0x2331fb827792879D21e11f7e13bA0d57391393D5`
- **Network**: Sepolia Testnet (Chain ID: 11155111)
- **Contract Type**: ERC-20 Token
- **View on Etherscan**: [Sepolia Contract](https://sepolia.etherscan.io/address/0x2331fb827792879D21e11f7e13bA0d57391393D5)

## 🚀 **Quick Start Testing**

### 1. **Start the Application**
```bash
pnpm dev
```

### 2. **Connect to Sepolia Testnet**
- The app defaults to Sepolia testnet
- If you're on a different network, switch to Sepolia (Chain ID: 11155111)

### 3. **Get Test ETH**
- Visit [Sepolia Faucet](https://sepoliafaucet.com/)
- Enter your wallet address
- Request test ETH (you'll need some for gas fees)

## 🔧 **Testing Steps**

### **Step 1: Wallet Connection**
1. **Sign in** with Google or email
2. **Verify embedded wallet** is created
3. **Check network** - should be Sepolia testnet
4. **Verify contract status** shows "Contract Available: Yes"

### **Step 2: Token Information**
1. **View token details** in the purple "Token Information" box
2. **Check token name, symbol, and decimals**
3. **View total supply** information
4. **Click "Refresh"** to update token info

### **Step 3: Check Token Balance**
1. **View your token balance** in the green "Token Balance" box
2. **Note the token symbol** (e.g., "PST", "TOKEN", etc.)
3. **Click "Refresh"** to update balance
4. **Verify decimals** are correct

### **Step 4: Transfer Tokens**
1. **Enter recipient address** (use another wallet address)
2. **Enter amount** in tokens (not wei)
3. **Click "Transfer Tokens"**
4. **Confirm transaction** in your wallet
5. **Wait for confirmation**
6. **Check transaction hash** and view on Etherscan

## 📱 **What You Should See**

### **Contract Status Section**
- ✅ Contract Available: Yes
- ✅ Contract Address: `0x2331...393D5`
- ✅ Your Address: `0x...` (your wallet address)

### **Token Information Section**
- Token name and symbol
- Decimals (usually 18)
- Total supply amount

### **Token Balance Section**
- Your current token balance
- Token symbol
- Refresh button

### **Transfer Section**
- Recipient address input
- Amount input (in tokens)
- Transfer button

## 🧪 **Test Scenarios**

### **Scenario 1: Basic Functionality**
- [ ] Contract loads successfully
- [ ] Token info displays correctly
- [ ] Balance shows current amount
- [ ] Transfer form is accessible

### **Scenario 2: Token Transfer**
- [ ] Enter valid recipient address
- [ ] Enter reasonable amount
- [ ] Transaction submits successfully
- [ ] Transaction hash is displayed
- [ ] Balance updates after transfer

### **Scenario 3: Error Handling**
- [ ] Try transferring to invalid address
- [ ] Try transferring more than balance
- [ ] Try transferring 0 amount
- [ ] Verify error messages are clear

### **Scenario 4: Network Switching**
- [ ] Switch to different network (Ethereum mainnet)
- [ ] Verify contract shows "Not Available"
- [ ] Switch back to Sepolia
- [ ] Verify contract becomes available again

## 🔍 **Troubleshooting**

### **Common Issues**

1. **"Contract Not Available" Error**
   - Ensure you're on Sepolia testnet (Chain ID: 11155111)
   - Check if the contract address is correct
   - Verify network connection

2. **"Insufficient Balance" Error**
   - Check your token balance
   - Ensure you have enough tokens to transfer
   - Verify you have enough ETH for gas fees

3. **Transaction Fails**
   - Check gas limits and fees
   - Verify recipient address format
   - Ensure sufficient ETH for gas

4. **Balance Not Updating**
   - Wait for transaction confirmation
   - Click "Refresh" button
   - Check transaction status on Etherscan

### **Debug Information**

Check the browser console for:
- Contract initialization logs
- Transaction submission logs
- Error messages
- Network connection status

## 📊 **Expected Results**

### **Successful Test Run**
- ✅ Contract loads on Sepolia
- ✅ Token information displays
- ✅ Balance shows correctly
- ✅ Transfer completes successfully
- ✅ Transaction hash is generated
- ✅ Balance updates after transfer

### **Performance Metrics**
- Contract load time: < 2 seconds
- Balance refresh: < 1 second
- Transaction submission: < 5 seconds
- Network switching: < 3 seconds

## 🎉 **Success Criteria**

Your test is successful when:
1. **All UI elements** load correctly
2. **Contract status** shows as available
3. **Token information** displays properly
4. **Balance updates** work correctly
5. **Transfer function** completes successfully
6. **Transaction tracking** works (Etherscan links)
7. **Error handling** provides clear messages
8. **Network switching** works smoothly

## 🚨 **Important Notes**

- **Testnet Only**: This is for testing purposes only
- **No Real Value**: Tokens have no real monetary value
- **Gas Fees**: You'll need test ETH for transactions
- **Network Stability**: Sepolia may have occasional issues
- **Contract Limits**: The existing contract may have restrictions

---

**🎯 Ready to Test?** Start with the basic functionality and work your way through each scenario. The existing contract on Sepolia provides a perfect testing environment!
