import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Application from "expo-application";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useLoginWithOAuth, usePrivy } from "@privy-io/expo";
import { useLogin } from "@privy-io/expo/ui";

export default function LoginScreen() {
  const { user } = usePrivy();
  const router = useRouter();

  const { login } = useLogin();
  const oauth = useLoginWithOAuth({
    onError: (err) => {
      console.error("OAuth error:", err);
    },
  });

  const handlePrivyLogin = async () => {
    try {
      // This will show Privy's login modal with wallet options
      await login({ loginMethods: ["email"] });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    oauth.login({ provider: provider as any });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Welcome to POAPStays</Text>
        <Text style={styles.subtitle}>Connect your wallet to continue</Text>

        {/* Configuration Info */}
        <View style={styles.configSection}>
          <Text style={styles.configTitle}>Configuration Required:</Text>
          <Text style={styles.configText}>
            App ID: {Constants.expoConfig?.extra?.privyAppId || "Not set"}
          </Text>
          <Text style={styles.configText}>
            Client ID: {Constants.expoConfig?.extra?.privyClientId || "Not set"}
          </Text>
          <Text style={styles.configText}>
            Bundle ID: {Application.applicationId}
          </Text>
        </View>

        <Text style={styles.instructionText}>
          Add the Bundle ID above to your Privy dashboard as an "Allowed app
          identifier"
        </Text>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={handlePrivyLogin}
        >
          <Text style={styles.buttonText}>Connect Wallet with Privy</Text>
        </TouchableOpacity>

        {/* OAuth Login Options */}
        <View style={styles.oauthContainer}>
          {["google", "github", "discord", "apple"].map((provider) => (
            <TouchableOpacity
              key={provider}
              style={[styles.oauthButton, styles[`${provider}Button`]]}
              onPress={() => handleOAuthLogin(provider)}
              disabled={oauth.state.status === "loading"}
            >
              <Text style={styles.oauthButtonText}>
                Login with{" "}
                {provider.charAt(0).toUpperCase() + provider.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
  },
  googleButton: {
    backgroundColor: "#4285F4",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    minWidth: 200,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  configSection: {
    backgroundColor: "#f0f0f0",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: "100%",
  },
  configTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  configText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
  },
  instructionText: {
    fontSize: 14,
    color: "#555",
    marginTop: 20,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  oauthContainer: {
    marginTop: 20,
    width: "100%",
    gap: 10,
  },
  oauthButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  oauthButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  githubButton: {
    backgroundColor: "#333",
  },
  discordButton: {
    backgroundColor: "#5865F2",
  },
  appleButton: {
    backgroundColor: "#000",
  },
});
