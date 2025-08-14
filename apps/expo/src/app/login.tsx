import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useLoginWithOAuth } from "@privy-io/expo";
import Constants from "expo-constants";
import * as Application from "expo-application";

export default function LoginScreen() {
  const oauth = useLoginWithOAuth({
    onError: (err) => {
      console.error("OAuth error:", err);
    },
  });
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      await oauth.login({ provider: "google" });
      // Navigate to home after successful login
      router.replace("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
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
          Add the Bundle ID above to your Privy dashboard as an "Allowed app identifier"
        </Text>
        
        <TouchableOpacity 
          style={styles.googleButton} 
          onPress={handleGoogleLogin}
          disabled={oauth.state.status === "loading"}
        >
          <Text style={styles.buttonText}>
            {oauth.state.status === "loading" ? "Loading..." : "Continue with Google"}
          </Text>
        </TouchableOpacity>
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
});
