import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useMemo } from 'react';
import { encodeFunctionData } from 'viem';
import { PEOPLE_STORAGE_ABI } from '../utils/contract';

export function useDynamicViem() {
  const { user, isLoggedIn, primaryWallet } = useDynamicContext();

  // Contract address for Sepolia testnet
  const contractAddress = '0x2331fb827792879D21e11f7e13bA0d57391393D5';

  // Helper functions for the people storage contract
  const store = async (favoriteNumber: number) => {
    if (!primaryWallet) throw new Error('Wallet not ready');

    try {
      const data = encodeFunctionData({
        abi: PEOPLE_STORAGE_ABI,
        functionName: 'store',
        args: [BigInt(favoriteNumber)]
      });

      const hash = await primaryWallet.sendTransaction({
        to: contractAddress,
        data,
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
      // For read operations, we can use the wallet's provider
      const result = await primaryWallet.readContract({
        address: contractAddress,
        abi: PEOPLE_STORAGE_ABI,
        functionName: 'retrieve',
        args: []
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
      const data = encodeFunctionData({
        abi: PEOPLE_STORAGE_ABI,
        functionName: 'addPerson',
        args: [name, BigInt(favoriteNumber)]
      });

      const hash = await primaryWallet.sendTransaction({
        to: contractAddress,
        data,
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
      const result = await primaryWallet.readContract({
        address: contractAddress,
        abi: PEOPLE_STORAGE_ABI,
        functionName: 'nameToFavoriteNumber',
        args: [name]
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
      const result = await primaryWallet.readContract({
        address: contractAddress,
        abi: PEOPLE_STORAGE_ABI,
        functionName: 'people',
        args: [BigInt(index)]
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
      const data = encodeFunctionData({
        abi: PEOPLE_STORAGE_ABI,
        functionName: 'removeLastPerson',
        args: []
      });

      const hash = await primaryWallet.sendTransaction({
        to: contractAddress,
        data,
      });

      return hash;
    } catch (error) {
      console.error('Failed to remove last person:', error);
      throw error;
    }
  };

  return {
    // State
    authenticated: isLoggedIn,
    ready: isLoggedIn,
    user,

    // Contract functions for people storage
    store,
    retrieve,
    addPerson,
    getNameToFavoriteNumber,
    getPerson,
    removeLastPerson,

    // Utility
    isReady: isLoggedIn && !!primaryWallet,
  };
}
