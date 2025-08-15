import Constants from "expo-constants";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PrivyProvider } from "@privy-io/expo";
import { useColorScheme } from "nativewind";
import { PrivyElements } from "@privy-io/expo/ui";

import { queryClient } from "~/utils/api";

import "../styles.css";

import { QueryClientProvider } from "@tanstack/react-query";

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  // Get Privy configuration from app config
  const privyAppId = Constants.expoConfig?.extra?.privyAppId;
  const privyClientId = Constants.expoConfig?.extra?.privyClientId;

  if (!privyAppId || !privyClientId) {
    console.error("Missing Privy configuration:", {
      privyAppId,
      privyClientId,
    });
  }

  return (
    <PrivyProvider appId={privyAppId} clientId={privyClientId}>
      <QueryClientProvider client={queryClient}>
        {/*
            The Stack component displays the current page.
            It also allows you to configure your screens 
          */}
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#f472b6",
            },
            contentStyle: {
              backgroundColor: colorScheme == "dark" ? "#09090B" : "#FFFFFF",
            },
          }}
        />
        <StatusBar />
              <PrivyElements />
      </QueryClientProvider>
    </PrivyProvider>
  );
}
