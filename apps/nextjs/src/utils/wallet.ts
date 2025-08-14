import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useState, useCallback, useEffect } from 'react';

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

// Hook for wallet management (web version)
export function useWallet() {
  const { user, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const [currentChainId, setCurrentChainId] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<string>('0');
  const [primaryWallet, setPrimaryWallet] = useState<any>(null);

  // Get the primary wallet (embedded wallet first, then first available)
  useEffect(() => {
    if (wallets && wallets.length > 0) {
      // Prefer embedded wallet as primary
      const embeddedWallet = wallets.find(wallet => wallet.walletClientType === 'privy');
      setPrimaryWallet(embeddedWallet || wallets[0]);
    }
  }, [wallets]);

  // Get current chain from wallet
  const getCurrentChain = useCallback(async () => {
    if (!primaryWallet?.address || !wallets.length) return null;
    
    try {
      const provider = await primaryWallet.getEthereumProvider();
      const chainId = await provider.request({ method: 'eth_chainId' });
      const chainIdDecimal = parseInt(chainId, 16).toString();
      setCurrentChainId(chainIdDecimal);
      return chainIdDecimal;
    } catch (error) {
      console.error('Failed to get current chain:', error);
      return null;
    }
  }, [primaryWallet?.address, wallets]);

  // Switch to a different chain
  const switchChain = useCallback(async (targetChainId: string) => {
    if (!primaryWallet?.address || !wallets.length) return false;
    
    setIsLoading(true);
    try {
      const provider = await primaryWallet.getEthereumProvider();
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${parseInt(targetChainId).toString(16)}` }]
      });
      setCurrentChainId(targetChainId);
      return true;
    } catch (error) {
      console.error('Failed to switch chain:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [primaryWallet?.address, wallets]);

  // Sign a message
  const signMessage = useCallback(async (message: string) => {
    if (!primaryWallet?.address || !wallets.length) return null;
    
    try {
      const provider = await primaryWallet.getEthereumProvider();
      const signature = await provider.request({
        method: 'personal_sign',
        params: [message, primaryWallet.address]
      });
      return signature;
    } catch (error) {
      console.error('Failed to sign message:', error);
      return null;
    }
  }, [primaryWallet?.address, wallets]);

  // Send a transaction
  const sendTransaction = useCallback(async (to: string, value: string, data?: string) => {
    if (!primaryWallet?.address || !wallets.length) return null;
    
    setIsLoading(true);
    try {
      const provider = await primaryWallet.getEthereumProvider();
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: primaryWallet.address,
          to,
          value: `0x${parseInt(value).toString(16)}`,
          data: data || '0x',
        }]
      });
      return txHash;
    } catch (error) {
      console.error('Failed to send transaction:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [primaryWallet?.address, wallets]);

  // Get wallet balance
  const getBalance = useCallback(async () => {
    if (!primaryWallet?.address || !wallets.length) return null;
    
    try {
      const provider = await primaryWallet.getEthereumProvider();
      const balance = await provider.request({
        method: 'eth_getBalance',
        params: [primaryWallet.address, 'latest']
      });
      setBalance(balance);
      return balance;
    } catch (error) {
      console.error('Failed to get balance:', error);
      return null;
    }
  }, [primaryWallet?.address, wallets]);

  // Link external wallet (this will trigger Privy's wallet linking flow)
  const linkExternalWallet = useCallback(async () => {
    try {
      // Privy will handle the wallet linking flow automatically
      // when the user clicks the link wallet button
      return true;
    } catch (error) {
      console.error('Failed to link external wallet:', error);
      return false;
    }
  }, []);

  // Unlink external wallet
  const unlinkExternalWallet = useCallback(async (walletAddress: string) => {
    try {
      // Note: Privy doesn't provide a direct unlink method in the client
      // This would typically be handled through the Privy dashboard or server-side
      console.log('Unlinking wallet:', walletAddress);
      return true;
    } catch (error) {
      console.error('Failed to unlink external wallet:', error);
      return false;
    }
  }, []);

  // Set primary wallet
  const setPrimaryWalletAddress = useCallback((walletAddress: string) => {
    const wallet = wallets.find(w => w.address === walletAddress);
    if (wallet) {
      setPrimaryWallet(wallet);
      return true;
    }
    return false;
  }, [wallets]);

  // Load initial data when wallet is available
  useEffect(() => {
    if (authenticated && primaryWallet?.address && wallets.length) {
      getCurrentChain();
      getBalance();
    }
  }, [authenticated, primaryWallet?.address, wallets.length, getCurrentChain, getBalance]);

  return {
    // Wallet state
    account: primaryWallet,
    wallets,
    currentChainId,
    isLoading,
    balance,
    authenticated,
    
    // Wallet actions
    getCurrentChain,
    switchChain,
    signMessage,
    sendTransaction,
    getBalance,
    linkExternalWallet,
    unlinkExternalWallet,
    setPrimaryWalletAddress,
    
    // Auth actions
    login,
    logout,
    
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

// Utility function to get wallet type
export function getWalletType(wallet: any): 'embedded' | 'external' {
  return wallet?.walletClientType === 'privy' ? 'embedded' : 'external';
}

// Utility function to get wallet provider
export function getWalletProvider(wallet: any): string {
  if (wallet?.walletClientType === 'privy') return 'privy';
  if (wallet?.walletClientType === 'metamask') return 'metamask';
  if (wallet?.walletClientType === 'coinbase_wallet') return 'coinbase';
  return 'unknown';
}
