import { usePrivy } from '@privy-io/expo';
import { useMemo } from 'react';
import { createWalletClient, http, type WalletClient } from 'viem';
import { sepolia } from 'viem/chains';
import { ContractInteractor, createWalletClientFromPrivy } from '../utils/contract';

export function usePrivyViem() {
  const { user, authenticated, ready } = usePrivy();

  // Create wallet client from Privy user
  const walletClient = useMemo<WalletClient | undefined>(() => {
    if (!authenticated || !user?.wallet?.address) return undefined;
    
    return createWalletClientFromPrivy(user.wallet, sepolia);
  }, [authenticated, user?.wallet]);

  // Create contract interactor
  const contractInteractor = useMemo(() => {
    if (!walletClient) return null;
    
    try {
      return new ContractInteractor('11155111', walletClient); // Sepolia chain ID
    } catch (error) {
      console.error('Failed to create contract interactor:', error);
      return null;
    }
  }, [walletClient]);

  // Helper functions for the people storage contract
  const store = async (favoriteNumber: number) => {
    if (!contractInteractor) throw new Error('Contract not ready');
    return contractInteractor.store(favoriteNumber);
  };

  const retrieve = async () => {
    if (!contractInteractor) throw new Error('Contract not ready');
    return contractInteractor.retrieve();
  };

  const addPerson = async (name: string, favoriteNumber: number) => {
    if (!contractInteractor) throw new Error('Contract not ready');
    console.log('Adding person:', name, favoriteNumber);
    return contractInteractor.addPerson(name, favoriteNumber);
  };

  const getNameToFavoriteNumber = async (name: string) => {
    if (!contractInteractor) throw new Error('Contract not ready');
    return contractInteractor.getNameToFavoriteNumber(name);
  };

  const getPerson = async (index: number) => {
    if (!contractInteractor) throw new Error('Contract not ready');
    return contractInteractor.getPerson(index);
  };

  const removeLastPerson = async () => {
    if (!contractInteractor) throw new Error('Contract not ready');
    return contractInteractor.removeLastPerson();
  };

  return {
    // State
    authenticated,
    ready,
    user,
    walletClient,
    contractInteractor,
    
    // Contract functions for people storage
    store,
    retrieve,
    addPerson,
    getNameToFavoriteNumber,
    getPerson,
    removeLastPerson,
    
    // Utility
    isReady: ready && authenticated && !!contractInteractor,
  };
}
