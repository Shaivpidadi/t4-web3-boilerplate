import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useMemo } from 'react';
import { encodeFunctionData } from 'viem';
import { PEOPLE_STORAGE_ABI } from '../utils/contract';

export function usePrivyViem() {
  const { user, authenticated, ready } = usePrivy();
  const { wallets } = useWallets();

  // Get the primary wallet (embedded wallet first, then first available)
  const primaryWallet = useMemo(() => {
    if (wallets && wallets.length > 0) {
      // Prefer embedded wallet as primary
      const embeddedWallet = wallets.find(wallet => wallet.walletClientType === 'privy');
      return embeddedWallet || wallets[0];
    }
    return null;
  }, [wallets]);

  // Contract address for Sepolia testnet
  const contractAddress = '0x2331fb827792879D21e11f7e13bA0d57391393D5';

  // Helper functions for the people storage contract
  const store = async (favoriteNumber: number) => {
    if (!primaryWallet) throw new Error('Wallet not ready');

    try {
      const provider = await primaryWallet.getEthereumProvider();

      const data = encodeFunctionData({
        abi: PEOPLE_STORAGE_ABI,
        functionName: 'store',
        args: [BigInt(favoriteNumber)]
      });

      const hash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: primaryWallet.address,
          to: contractAddress,
          data,
        }]
      });

      return hash;
    } catch (error) {
      console.error('Failed to store number:', error);
      throw error;
    }
  };

  const retrieve = async () => {
    if (!primaryWallet) throw new Error('Wallet not ready');

    try {
      const provider = await primaryWallet.getEthereumProvider();

      const result = await provider.request({
        method: 'eth_call',
        params: [{
          to: contractAddress,
          data: encodeFunctionData({
            abi: PEOPLE_STORAGE_ABI,
            functionName: 'retrieve',
            args: []
          })
        }, 'latest']
      });

      return Number(result);
    } catch (error) {
      console.error('Failed to retrieve number:', error);
      throw error;
    }
  };

  const addPerson = async (name: string, favoriteNumber: number) => {
    if (!primaryWallet) throw new Error('Wallet not ready');

    try {
      const provider = await primaryWallet.getEthereumProvider();

      const data = encodeFunctionData({
        abi: PEOPLE_STORAGE_ABI,
        functionName: 'addPerson',
        args: [name, BigInt(favoriteNumber)]
      });

      const hash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: primaryWallet.address,
          to: contractAddress,
          data,
        }]
      });

      return hash;
    } catch (error) {
      console.error('Failed to add person:', error);
      throw error;
    }
  };

  const getNameToFavoriteNumber = async (name: string) => {
    if (!primaryWallet) throw new Error('Wallet not ready');

    try {
      const provider = await primaryWallet.getEthereumProvider();

      const result = await provider.request({
        method: 'eth_call',
        params: [{
          to: contractAddress,
          data: encodeFunctionData({
            abi: PEOPLE_STORAGE_ABI,
            functionName: 'nameToFavoriteNumber',
            args: [name]
          })
        }, 'latest']
      });

      return Number(result);
    } catch (error) {
      console.error('Failed to get favorite number by name:', error);
      throw error;
    }
  };

  const getPerson = async (index: number) => {
    if (!primaryWallet) throw new Error('Wallet not ready');

    try {
      const provider = await primaryWallet.getEthereumProvider();

      const result = await provider.request({
        method: 'eth_call',
        params: [{
          to: contractAddress,
          data: encodeFunctionData({
            abi: PEOPLE_STORAGE_ABI,
            functionName: 'people',
            args: [BigInt(index)]
          })
        }, 'latest']
      });

      // Decode the result (this is a simplified version)
      return { name: 'Unknown', favoriteNumber: Number(result) };
    } catch (error) {
      console.error('Failed to get person:', error);
      throw error;
    }
  };

  const removeLastPerson = async () => {
    if (!primaryWallet) throw new Error('Wallet not ready');

    try {
      const provider = await primaryWallet.getEthereumProvider();

      const data = encodeFunctionData({
        abi: PEOPLE_STORAGE_ABI,
        functionName: 'removeLastPerson',
        args: []
      });

      const hash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: primaryWallet.address,
          to: contractAddress,
          data,
        }]
      });

      return hash;
    } catch (error) {
      console.error('Failed to remove last person:', error);
      throw error;
    }
  };

  return {
    // State
    authenticated,
    ready,
    user,

    // Contract functions for people storage
    store,
    retrieve,
    addPerson,
    getNameToFavoriteNumber,
    getPerson,
    removeLastPerson,

    // Utility
    isReady: ready && authenticated && !!primaryWallet,
  };
}
