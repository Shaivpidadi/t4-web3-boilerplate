'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export default function Providers({ children }: { children: React.ReactNode }) {
  // Get Privy configuration from environment variables
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  
  if (!privyAppId) {
    console.error("Missing Privy App ID configuration");
    // Return children without PrivyProvider if configuration is missing
    return <>{children}</>;
  }
  
  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets'
          }
        },
        // Web-specific configuration
        appearance: {
          theme: 'light',
          accentColor: '#3b82f6',
        }
      }}
    >
      {children}
    </PrivyProvider>
  );
}
