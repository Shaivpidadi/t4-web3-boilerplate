import { createClient } from "@dynamic-labs/client";
import { ReactNativeExtension } from "@dynamic-labs/react-native-extension";
import { ViemExtension } from "@dynamic-labs/viem-extension";

// Get Dynamic configuration from environment variables
const dynamicEnvironmentId = process.env.EXPO_PUBLIC_DYNAMIC_ENVIRONMENT_ID;

if (!dynamicEnvironmentId) {
    console.error("Missing Dynamic Environment ID configuration");
}

export const dynamicClient = createClient({
    environmentId: dynamicEnvironmentId || "58c057e7-910e-472f-8244-1285e6111c4f", // Fallback for development
    // Optional:
    appLogoUrl: "https://demo.dynamic.xyz/favicon-32x32.png",
    appName: "POAPStays",
})
    .extend(ReactNativeExtension())
    .extend(ViemExtension());
