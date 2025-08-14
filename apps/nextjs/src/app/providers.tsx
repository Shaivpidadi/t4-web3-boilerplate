'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export default function Providers({ children }: { children: React.ReactNode }) {
  // Get Privy configuration from environment variables
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const privyClientId = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID;
  
  if (!privyAppId || !privyClientId) {
    console.error("Missing Privy configuration:", { privyAppId, privyClientId });
    // Return children without PrivyProvider if configuration is missing
    return <>{children}</>;
  }
  
  return (
    <PrivyProvider
      appId={privyAppId}
      clientId={privyClientId}
      config={{
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets'
          }
        }
      }}
    >
      {children}
    </PrivyProvider>
  );
}
