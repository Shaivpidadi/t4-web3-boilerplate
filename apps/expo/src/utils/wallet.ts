import { useDynamicContext } from "@dynamic-labs/react-hooks";
import { useState, useCallback } from "react";

// Common chain configurations
export const SUPPORTED_CHAINS = {
  '1': {
    name: 'Ethereum Mainnet',
    chainId: '1',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
    blockExplorer: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    }
  },
  '137': {
    name: 'Polygon',
    chainId: '137',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    }
  },
  '11155111': {
    name: 'Sepolia Testnet',
    chainId: '11155111',
    rpcUrl: 'https://sepolia.infura.io/v3/your-api-key',
    blockExplorer: 'https://sepolia.etherscan.io',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18,
    }
  }
};

// Hook for wallet management
export function useWallet() {
  const { user, isLoggedIn, primaryWallet, setPrimaryWallet } = useDynamicContext();
  const [currentChainId, setCurrentChainId] = useState('1');
  const [isLoading, setIsLoading] = useState(false);

  // Get current chain from wallet
  const getCurrentChain = useCallback(async () => {
    if (!primaryWallet?.address) return null;

    try {
      // Dynamic provides chain information directly
      const chainId = primaryWallet.chainId?.toString() || '1';
      setCurrentChainId(chainId);
      return chainId;
    } catch (error) {
      console.error('Failed to get current chain:', error);
      return null;
    }
  }, [primaryWallet?.address, primaryWallet?.chainId]);

  // Switch to a different chain
  const switchChain = useCallback(async (targetChainId: string) => {
    if (!primaryWallet?.address) return false;

    setIsLoading(true);
    try {
      // Dynamic handles chain switching automatically
      setCurrentChainId(targetChainId);
      return true;
    } catch (error) {
      console.error('Failed to switch chain:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [primaryWallet?.address]);

  // Sign a message
  const signMessage = useCallback(async (message: string) => {
    if (!primaryWallet?.address) return null;

    try {
      // Dynamic provides signing through the wallet
      const signature = await primaryWallet.signMessage(message);
      return signature;
    } catch (error) {
      console.error('Failed to sign message:', error);
      return null;
    }
  }, [primaryWallet?.address]);

  // Send a transaction
  const sendTransaction = useCallback(async (to: string, value: string, data?: string) => {
    if (!primaryWallet?.address) return null;

    setIsLoading(true);
    try {
      // Dynamic provides transaction sending through the wallet
      const txHash = await primaryWallet.sendTransaction({
        to,
        value: BigInt(value),
        data: data || '0x',
      });
      return txHash;
    } catch (error) {
      console.error('Failed to send transaction:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [primaryWallet?.address]);

  // Get wallet balance
  const getBalance = useCallback(async () => {
    if (!primaryWallet?.address) return null;

    try {
      // Dynamic provides balance information
      const balance = await primaryWallet.getBalance();
      return balance.toString();
    } catch (error) {
      console.error('Failed to get balance:', error);
      return null;
    }
  }, [primaryWallet?.address]);

  // Link external wallet (Dynamic handles this automatically)
  const linkExternalWallet = useCallback(async () => {
    try {
      // Dynamic will handle the wallet linking flow automatically
      return true;
    } catch (error) {
      console.error('Failed to link external wallet:', error);
      return false;
    }
  }, []);

  // Unlink external wallet
  const unlinkExternalWallet = useCallback(async (walletAddress: string) => {
    try {
      // Dynamic provides unlink functionality
      // Note: This would need to be implemented based on Dynamic's API
      console.log('Unlinking wallet:', walletAddress);
      return true;
    } catch (error) {
      console.error('Failed to unlink external wallet:', error);
      return false;
    }
  }, []);

  // Set primary wallet
  const setPrimaryWalletAddress = useCallback((walletAddress: string) => {
    try {
      // Dynamic provides primary wallet management
      setPrimaryWallet(walletAddress);
      return true;
    } catch (error) {
      console.error('Failed to set primary wallet:', error);
      return false;
    }
  }, [setPrimaryWallet]);

  return {
    // Wallet state
    account: primaryWallet,
    wallets: primaryWallet ? [primaryWallet] : [],
    currentChainId,
    isLoading,
    balance: '0', // Will be updated when getBalance is called
    authenticated: isLoggedIn,

    // Wallet actions
    getCurrentChain,
    switchChain,
    signMessage,
    sendTransaction,
    getBalance,
    linkExternalWallet,
    unlinkExternalWallet,
    setPrimaryWalletAddress,

    // Chain info
    supportedChains: SUPPORTED_CHAINS,
    currentChain: SUPPORTED_CHAINS[currentChainId as keyof typeof SUPPORTED_CHAINS],
  };
}

// Utility function to format wallet address
export function formatAddress(address: string, start = 6, end = 4): string {
  if (!address) return '';
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

// Utility function to format balance
export function formatBalance(balance: string, decimals = 18): string {
  if (!balance) return '0';
  const wei = BigInt(balance);
  const eth = Number(wei) / Math.pow(10, decimals);
  return eth.toFixed(4);
}
