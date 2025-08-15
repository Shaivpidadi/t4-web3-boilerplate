import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useState, useCallback, useEffect } from 'react';
import { sepolia } from 'viem/chains';
import { encodeFunctionData } from 'viem';
import { ContractInteractor, PEOPLE_STORAGE_ABI } from './contract';

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
  const [currentChainId, setCurrentChainId] = useState('11155111'); // Default to Sepolia for testing
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<string>('0');
  const [primaryWallet, setPrimaryWallet] = useState<any>(null);
  const [contractInteractor, setContractInteractor] = useState<ContractInteractor | null>(null);

  // Get the primary wallet (embedded wallet first, then first available)
  useEffect(() => {
    if (wallets && wallets.length > 0) {
      // Prefer embedded wallet as primary
      const embeddedWallet = wallets.find(wallet => wallet.walletClientType === 'privy');
      setPrimaryWallet(embeddedWallet || wallets[0]);
    }
  }, [wallets]);

  // Initialize contract interactor when wallet or chain changes
  useEffect(() => {
    if (primaryWallet && currentChainId) {
      const initializeContract = async () => {
        try {
          // For now, we'll create a contract interactor without a wallet client
          // The wallet client will be set when needed for transactions
          const interactor = new ContractInteractor(currentChainId);
          setContractInteractor(interactor);

          // Contract is now initialized and ready for use
          console.log('Contract interactor initialized successfully');
        } catch (error) {
          console.error('Failed to initialize contract interactor:', error);
          setContractInteractor(null);
        }
      };

      initializeContract();
    }
  }, [primaryWallet, currentChainId]);

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

  // Get stored favorite number from contract
  const getStoredNumber = useCallback(async () => {
    if (!contractInteractor) return null;

    try {
      const number = await contractInteractor.retrieve();
      return number;
    } catch (error) {
      console.error('Failed to get stored number:', error);
      return null;
    }
  }, [contractInteractor]);

  // Store a favorite number in contract
  const storeNumber = useCallback(async (favoriteNumber: number) => {
    if (!contractInteractor || !primaryWallet) return null;

    setIsLoading(true);
    try {
      // Get the Privy provider for transaction signing
      const provider = await primaryWallet.getEthereumProvider();

      // Encode the transaction data
      const data = encodeFunctionData({
        abi: PEOPLE_STORAGE_ABI,
        functionName: 'store',
        args: [BigInt(favoriteNumber)]
      });

      // Send transaction through Privy provider
      const hash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: primaryWallet.address,
          to: contractInteractor.getContractAddress(),
          data,
        }]
      });

      return hash;
    } catch (error) {
      console.error('Failed to store number:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [contractInteractor, primaryWallet]);

  // Add a person to the contract
  const addPerson = useCallback(async (name: string, favoriteNumber: number) => {
    if (!contractInteractor || !primaryWallet) return null;

    setIsLoading(true);
    try {
      // Get the Privy provider for transaction signing
      const provider = await primaryWallet.getEthereumProvider();

      // Encode the transaction data
      const data = encodeFunctionData({
        abi: PEOPLE_STORAGE_ABI,
        functionName: 'addPerson',
        args: [name, BigInt(favoriteNumber)]
      });

      // Send transaction through Privy provider
      const hash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: primaryWallet.address,
          to: contractInteractor.getContractAddress(),
          data,
        }]
      });

      return hash;
    } catch (error) {
      console.error('Failed to add person:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [contractInteractor, primaryWallet]);

  // Get contract information
  const getContractInfo = useCallback(async () => {
    if (!contractInteractor) return null;

    try {
      // This contract stores people data, not tokens
      const retrieved = await contractInteractor.retrieve();
      return { type: 'people-storage', retrieved };
    } catch (error) {
      console.error('Failed to get contract info:', error);
      return null;
    }
  }, [contractInteractor]);

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
    contractInteractor,

    // Wallet actions
    getCurrentChain,
    switchChain,
    signMessage,
    sendTransaction,
    getBalance,
    linkExternalWallet,
    unlinkExternalWallet,
    setPrimaryWalletAddress,

    // Contract actions
    getStoredNumber,
    storeNumber,
    addPerson,
    getContractInfo,

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
