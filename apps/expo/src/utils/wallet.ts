import { usePrivy, useEmbeddedEthereumWallet, getUserEmbeddedEthereumWallet } from "@privy-io/expo";
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
  const { user } = usePrivy();
  const { wallets, create } = useEmbeddedEthereumWallet();
  const [currentChainId, setCurrentChainId] = useState('1');
  const [isLoading, setIsLoading] = useState(false);

  // Get the user's embedded wallet
  const account = getUserEmbeddedEthereumWallet(user);

  // Get current chain from wallet
  const getCurrentChain = useCallback(async () => {
    if (!account?.address || wallets.length === 0) return null;
    
    try {
      const provider = await wallets[0].getProvider();
      const chainId = await provider.request({ method: 'eth_chainId' });
      const chainIdHex = parseInt(chainId, 16).toString();
      setCurrentChainId(chainIdHex);
      return chainIdHex;
    } catch (error) {
      console.error('Failed to get current chain:', error);
      return null;
    }
  }, [account?.address, wallets]);

  // Switch to a different chain
  const switchChain = useCallback(async (targetChainId: string) => {
    if (!account?.address || wallets.length === 0) return false;
    
    setIsLoading(true);
    try {
      const provider = await wallets[0].getProvider();
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${parseInt(targetChainId).toString(16)}` }],
      });
      setCurrentChainId(targetChainId);
      return true;
    } catch (error) {
      console.error('Failed to switch chain:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [account?.address, wallets]);

  // Sign a message
  const signMessage = useCallback(async (message: string) => {
    if (!account?.address || wallets.length === 0) return null;
    
    try {
      const provider = await wallets[0].getProvider();
      const signature = await provider.request({
        method: 'personal_sign',
        params: [message, account.address],
      });
      return signature;
    } catch (error) {
      console.error('Failed to sign message:', error);
      return null;
    }
  }, [account?.address, wallets]);

  // Send a transaction
  const sendTransaction = useCallback(async (to: string, value: string, data?: string) => {
    if (!account?.address || wallets.length === 0) return null;
    
    setIsLoading(true);
    try {
      const provider = await wallets[0].getProvider();
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account.address,
          to,
          value: `0x${parseInt(value).toString(16)}`,
          data: data || '0x',
        }],
      });
      return txHash;
    } catch (error) {
      console.error('Failed to send transaction:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [account?.address, wallets]);

  // Get wallet balance
  const getBalance = useCallback(async () => {
    if (!account?.address || wallets.length === 0) return null;
    
    try {
      const provider = await wallets[0].getProvider();
      const balance = await provider.request({
        method: 'eth_getBalance',
        params: [account.address, 'latest'],
      });
      return balance;
    } catch (error) {
      console.error('Failed to get balance:', error);
      return null;
    }
  }, [account?.address, wallets]);

  return {
    // Wallet state
    account,
    wallets,
    currentChainId,
    isLoading,
    
    // Wallet actions
    create,
    getCurrentChain,
    switchChain,
    signMessage,
    sendTransaction,
    getBalance,
    
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
