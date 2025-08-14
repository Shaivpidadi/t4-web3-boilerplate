'use client';

import { useEffect, useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWagmiConfig } from '../utils/wagmi';

interface WagmiWrapperProps {
  children: React.ReactNode;
}

export function WagmiWrapper({ children }: WagmiWrapperProps) {
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    setConfig(createWagmiConfig());
  }, []);

  if (!mounted || !config) {
    return <>{children}</>;
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={new QueryClient()}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
