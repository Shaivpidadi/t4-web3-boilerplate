import { createConfig, http, createStorage } from 'wagmi';
import { sepolia } from 'viem/chains';
import { injected, metaMask } from 'wagmi/connectors';
import { QueryClient } from '@tanstack/react-query';

// Create a query client
export const queryClient = new QueryClient();

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

// Create wagmi config factory to avoid SSR issues
export function createWagmiConfig() {
  // Only create config in browser environment
  if (!isBrowser) {
    throw new Error('Wagmi config can only be created in browser environment');
  }

  return createConfig({
    chains: [sepolia],
    transports: {
      [sepolia.id]: http(),
    },
    connectors: [
      injected(),
      metaMask(),
    ],
    storage: createStorage({
      storage: window.localStorage,
    }),
  });
}

// Default config for SSR compatibility
export const config = isBrowser ? createWagmiConfig() : createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
  connectors: [],
  storage: createStorage({
    storage: undefined,
  }),
});

// Helper to get chain ID as string
export function getChainIdString(chainId: number): string {
  return chainId.toString();
}

// Helper to check if chain is supported
export function isChainSupported(chainId: number): boolean {
  return config.chains.some(chain => chain.id === chainId);
}
