'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiWrapper } from '../components/WagmiWrapper';

export default function Providers({ children }: { children: React.ReactNode }) {
  // Get Privy configuration from environment variables
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  
  if (!privyAppId) {
    console.error("Missing Privy App ID configuration");
    // Return children without PrivyProvider if configuration is missing
    return <>{children}</>;
  }
  
  return (
    <WagmiWrapper>
      <PrivyProvider
        appId={privyAppId}
        config={{
          // Create embedded wallets for users who don't have a wallet
          embeddedWallets: {
            ethereum: {
              createOnLogin: 'users-without-wallets'
            }
          },
          // Enable external wallets with supported chains
          supportedChains: [
            {
              id: 1,
              name: 'Ethereum',
              nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
              rpcUrls: { default: { http: ['https://eth-mainnet.g.alchemy.com/v2/your-api-key'] } }
            },
            {
              id: 137,
              name: 'Polygon',
              nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
              rpcUrls: { default: { http: ['https://polygon-rpc.com'] } }
            },
            {
              id: 11155111,
              name: 'Sepolia',
              nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
              rpcUrls: { default: { http: ['https://sepolia.infura.io/v3/your-api-key'] } }
            }
          ],
          // Web-specific configuration
          appearance: {
            theme: 'light',
            accentColor: '#3b82f6',
          }
        }}
      >
        {children}
      </PrivyProvider>
    </WagmiWrapper>
  );
}
