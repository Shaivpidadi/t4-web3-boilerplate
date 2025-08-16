import Constants from "expo-constants";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useColorScheme } from "nativewind";

import { queryClient } from "~/utils/api";
import { dynamicClient } from "~/utils/dynamic";

import "../styles.css";

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  // Get Dynamic configuration from app config
  const dynamicEnvironmentId =
    Constants.expoConfig?.extra?.dynamicEnvironmentId;

  if (!dynamicEnvironmentId) {
    console.error("Missing Dynamic configuration:", {
      dynamicEnvironmentId,
    });
  }

  return (
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

      {/* Dynamic WebView for wallet connection */}
      <dynamicClient.reactNative.WebView />
    </QueryClientProvider>
  );
}
