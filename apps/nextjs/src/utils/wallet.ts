import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
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
  const { user, isLoggedIn, handleLogOut, handleUnlinkWallet, primaryWallet, setPrimaryWallet } = useDynamicContext();
  const [currentChainId, setCurrentChainId] = useState('11155111'); // Default to Sepolia for testing
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<string>('0');
  const [contractInteractor, setContractInteractor] = useState<ContractInteractor | null>(null);

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
      setBalance(balance.toString());
      return balance.toString();
    } catch (error) {
      console.error('Failed to get balance:', error);
      return null;
    }
  }, [primaryWallet?.address]);

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
      // Encode the transaction data
      const data = encodeFunctionData({
        abi: PEOPLE_STORAGE_ABI,
        functionName: 'store',
        args: [BigInt(favoriteNumber)]
      });

      // Send transaction through Dynamic wallet
      const hash = await primaryWallet.sendTransaction({
        to: contractInteractor.getContractAddress(),
        data,
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
      // Encode the transaction data
      const data = encodeFunctionData({
        abi: PEOPLE_STORAGE_ABI,
        functionName: 'addPerson',
        args: [name, BigInt(favoriteNumber)]
      });

      // Send transaction through Dynamic wallet
      const hash = await primaryWallet.sendTransaction({
        to: contractInteractor.getContractAddress(),
        data,
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
      await handleUnlinkWallet(walletAddress);
      return true;
    } catch (error) {
      console.error('Failed to unlink external wallet:', error);
      return false;
    }
  }, [handleUnlinkWallet]);

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

  // Load initial data when wallet is available
  useEffect(() => {
    if (isLoggedIn && primaryWallet?.address) {
      getCurrentChain();
      getBalance();
    }
  }, [isLoggedIn, primaryWallet?.address, getCurrentChain, getBalance]);

  return {
    // Wallet state
    account: primaryWallet,
    wallets: primaryWallet ? [primaryWallet] : [],
    currentChainId,
    isLoading,
    balance,
    authenticated: isLoggedIn,
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
    login: () => { }, // Dynamic handles login through UI
    logout: handleLogOut,

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
  return wallet?.connector?.id === 'dynamic' ? 'embedded' : 'external';
}

// Utility function to get wallet provider
export function getWalletProvider(wallet: any): string {
  if (wallet?.connector?.id === 'dynamic') return 'dynamic';
  if (wallet?.connector?.id === 'metamask') return 'metamask';
  if (wallet?.connector?.id === 'coinbase') return 'coinbase';
  return 'unknown';
}
