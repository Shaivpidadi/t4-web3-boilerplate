"use client";

import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { mainnet, polygon, sepolia } from "viem/chains";
import { createConfig, WagmiProvider } from "wagmi";

import { WagmiWrapper } from "../components/WagmiWrapper";

// Create wagmi config
const config = createConfig({
  chains: [mainnet, sepolia, polygon],
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
  },
});

// Create query client
const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  // Get Dynamic configuration from environment variables
  const dynamicEnvironmentId = process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID;

  if (!dynamicEnvironmentId) {
    console.error("Missing Dynamic Environment ID configuration");
    // Return children without DynamicProvider if configuration is missing
    return <>{children}</>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <DynamicContextProvider
          settings={{
            environmentId: dynamicEnvironmentId,
            walletConnectors: [EthereumWalletConnectors],
            walletConnectorExtension: [DynamicWagmiConnector],
            eventsCallbacks: {
              onAuthSuccess: (args) => {
                console.log("Auth success:", args);
              },
              onAuthError: (args) => {
                console.error("Auth error:", args);
              },
              onConnect: (args) => {
                console.log("Wallet connected:", args);
              },
              onDisconnect: (args) => {
                console.log("Wallet disconnected:", args);
              },
            },
          }}
        >
          <WagmiWrapper>{children}</WagmiWrapper>
          <DynamicWidget />
        </DynamicContextProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
