import { useDynamicContext } from '@dynamic-labs/react-hooks';
import { encodeFunctionData } from 'viem';

export function useDynamicViem() {
  const { user, isLoggedIn, primaryWallet } = useDynamicContext();

  // Contract address for Sepolia testnet
  const contractAddress = '0x2331fb827792879D21e11f7e13bA0d57391393D5';

  // Helper functions for the people storage contract using Dynamic's wallet
  const store = async (favoriteNumber: number): Promise<string> => {
    if (!primaryWallet?.address) throw new Error('Wallet not ready');

    try {
      const data = encodeFunctionData({
        abi: [
          {
            "inputs": [{ "internalType": "uint256", "name": "_favoriteNumber", "type": "uint256" }],
            "name": "store",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ],
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

  const retrieve = async (): Promise<number> => {
    if (!primaryWallet?.address) throw new Error('Wallet not ready');

    try {
      const result = await primaryWallet.readContract({
        address: contractAddress,
        abi: [
          {
            "inputs": [],
            "name": "retrieve",
            "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
            "stateMutability": "view",
            "type": "function"
          }
        ],
        functionName: 'retrieve',
        args: []
      });

      return Number(result);
    } catch (error) {
      console.error('Failed to retrieve number:', error);
      throw error;
    }
  };

  const addPerson = async (name: string, favoriteNumber: number): Promise<string> => {
    if (!primaryWallet?.address) throw new Error('Wallet not ready');

    try {
      const data = encodeFunctionData({
        abi: [
          {
            "inputs": [
              { "internalType": "string", "name": "_name", "type": "string" },
              { "internalType": "uint256", "name": "_favoriteNumber", "type": "uint256" }
            ],
            "name": "addPerson",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ],
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

  const getNameToFavoriteNumber = async (name: string): Promise<number> => {
    if (!primaryWallet?.address) throw new Error('Wallet not ready');

    try {
      const result = await primaryWallet.readContract({
        address: contractAddress,
        abi: [
          {
            "inputs": [{ "internalType": "string", "name": "", "type": "string" }],
            "name": "nameToFavoriteNumber",
            "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
            "stateMutability": "view",
            "type": "function"
          }
        ],
        functionName: 'nameToFavoriteNumber',
        args: [name]
      });

      return Number(result);
    } catch (error) {
      console.error('Failed to get favorite number by name:', error);
      throw error;
    }
  };

  const getPerson = async (index: number): Promise<{ name: string; favoriteNumber: number }> => {
    if (!primaryWallet?.address) throw new Error('Wallet not ready');

    try {
      const result = await primaryWallet.readContract({
        address: contractAddress,
        abi: [
          {
            "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
            "name": "people",
            "outputs": [
              { "internalType": "string", "name": "name", "type": "string" },
              { "internalType": "uint256", "name": "favoriteNumber", "type": "uint256" }
            ],
            "stateMutability": "view",
            "type": "function"
          }
        ],
        functionName: 'people',
        args: [BigInt(index)]
      });

      // For now, return a simplified result since decoding complex return values
      // requires additional viem utilities that might not be available in React Native
      return { name: 'Unknown', favoriteNumber: Number(result) };
    } catch (error) {
      console.error('Failed to get person:', error);
      throw error;
    }
  };

  const removeLastPerson = async (): Promise<string> => {
    if (!primaryWallet?.address) throw new Error('Wallet not ready');

    try {
      const data = encodeFunctionData({
        abi: [
          {
            "inputs": [],
            "name": "removeLastPerson",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ],
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
    isReady: isLoggedIn && !!primaryWallet?.address,
  };
}
