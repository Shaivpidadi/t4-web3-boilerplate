import { createPublicClient, createWalletClient, http, parseEther, formatEther, encodeFunctionData, type Address, type PublicClient, type WalletClient } from 'viem';
import { sepolia } from 'viem/chains';

// People Storage Contract ABI
export const PEOPLE_STORAGE_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_favoriteNumber",
        "type": "uint256"
      }
    ],
    "name": "addPerson",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "nameToFavoriteNumber",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "people",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "favoriteNumber",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "removeLastPerson",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "retrieve",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_favoriteNumber",
        "type": "uint256"
      }
    ],
    "name": "store",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  '1': '0x0000000000000000000000000000000000000000', // Ethereum Mainnet - Not deployed
  '137': '0x0000000000000000000000000000000000000000', // Polygon - Not deployed
  '11155111': '0x2331fb827792879D21e11f7e13bA0d57391393D5', // Sepolia - Using existing contract
} as const;

// Contract interaction utilities using viem for React Native
export class ContractInteractor {
  private publicClient: PublicClient;
  private walletClient?: WalletClient;
  private chainId: string;
  private contractAddress: Address;

  constructor(chainId: string, walletClient?: WalletClient) {
    this.chainId = chainId;
    this.walletClient = walletClient;
    
    const address = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
    if (!address || address === '0x0000000000000000000000000000000000000000') {
      throw new Error('Contract not deployed on this network');
    }
    
    this.contractAddress = address as Address;
    
    // Create public client for reads
    this.publicClient = createPublicClient({
      chain: sepolia, // Default to sepolia, can be made dynamic
      transport: http()
    });
  }

  // Store a favorite number
  async store(favoriteNumber: number): Promise<`0x${string}`> {
    if (!this.walletClient) {
      throw new Error('Wallet client not provided for transactions');
    }
    
    try {
      if (!this.walletClient.account) {
        throw new Error('No account available for transaction');
      }
      
      const data = encodeFunctionData({
        abi: PEOPLE_STORAGE_ABI,
        functionName: 'store',
        args: [BigInt(favoriteNumber)]
      });

      const hash = await this.walletClient.sendTransaction({
        to: this.contractAddress,
        data,
        chain: sepolia,
        account: this.walletClient.account
      });
      
      return hash;
    } catch (error) {
      console.error('Error storing favorite number:', error);
      throw error;
    }
  }

  // Retrieve the stored favorite number
  async retrieve(): Promise<number> {
    try {
      const result = await this.publicClient.readContract({
        address: this.contractAddress,
        abi: PEOPLE_STORAGE_ABI,
        functionName: 'retrieve'
      });
      
      return Number(result);
      } catch (error) {
      console.error('Error retrieving favorite number:', error);
      throw error;
    }
  }

  // Add a person with name and favorite number
  async addPerson(name: string, favoriteNumber: number): Promise<`0x${string}`> {
    if (!this.walletClient) {
      throw new Error('Wallet client not provided for transactions');
    }
    
    try {
      if (!this.walletClient.account) {
        throw new Error('No account available for transaction');
      }
      
      console.log('Adding person:', name, favoriteNumber);
      const data = encodeFunctionData({
        abi: PEOPLE_STORAGE_ABI,
        functionName: 'addPerson',
        args: [name, BigInt(favoriteNumber)]
      });

      const hash = await this.walletClient.sendTransaction({
        to: this.contractAddress,
        data,
        chain: sepolia,
        account: this.walletClient.account
      });
      
      return hash;
    } catch (error) {
      console.error('Error adding person:', error);
      throw error;
    }
  }

  // Get favorite number by name
  async getNameToFavoriteNumber(name: string): Promise<number> {
    try {
      const result = await this.publicClient.readContract({
        address: this.contractAddress,
        abi: PEOPLE_STORAGE_ABI,
        functionName: 'nameToFavoriteNumber',
        args: [name]
      });
      
      return Number(result);
    } catch (error) {
      console.error('Error getting favorite number by name:', error);
      throw error;
    }
  }

  // Get person by index
  async getPerson(index: number): Promise<{ name: string; favoriteNumber: number }> {
    try {
      const result = await this.publicClient.readContract({
        address: this.contractAddress,
        abi: PEOPLE_STORAGE_ABI,
        functionName: 'people',
        args: [BigInt(index)]
      });
      
      return {
        name: result[0],
        favoriteNumber: Number(result[1])
      };
    } catch (error) {
      console.error('Error getting person:', error);
      throw error;
    }
  }

  // Remove the last person
  async removeLastPerson(): Promise<`0x${string}`> {
    if (!this.walletClient) {
      throw new Error('Wallet client not provided for transactions');
    }
    
    try {
      if (!this.walletClient.account) {
        throw new Error('No account available for transaction');
      }
      
      const data = encodeFunctionData({
        abi: PEOPLE_STORAGE_ABI,
        functionName: 'removeLastPerson',
        args: []
      });

      const hash = await this.walletClient.sendTransaction({
        to: this.contractAddress,
        data,
        chain: sepolia,
        account: this.walletClient.account
      });
      
      return hash;
    } catch (error) {
      console.error('Error removing last person:', error);
      throw error;
    }
  }

  // Check if contract is available on current network
  isContractAvailable(): boolean {
    return this.contractAddress !== '0x0000000000000000000000000000000000000000';
  }

  // Get contract address for current network
  getContractAddress(): Address {
    return this.contractAddress;
  }

  // Set wallet client (useful when wallet connects)
  setWalletClient(walletClient: WalletClient) {
    this.walletClient = walletClient;
  }
}

// Utility function to format token amount
export function formatTokenAmount(amount: string, decimals: number = 18): string {
  if (!amount) return '0';
  try {
    return formatEther(BigInt(amount));
  } catch {
    return '0';
  }
}

// Utility function to parse token amount to wei
export function parseTokenAmount(amount: string, decimals: number = 18): string {
  if (!amount) return '0';
  try {
    return parseEther(amount).toString();
  } catch {
    return '0';
  }
}

// Helper to create wallet client from Privy signer for React Native
export function createWalletClientFromPrivy(account: any, chain = sepolia) {
  return createWalletClient({
    account: account.address as Address,
    chain,
    transport: http()
  });
}
