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
import { useDynamicContext } from "@dynamic-labs/react-hooks";

export default function LoginScreen() {
  const { user, isLoggedIn } = useDynamicContext();
  const router = useRouter();

  // If user is already logged in, redirect to main app
  React.useEffect(() => {
    if (isLoggedIn && user) {
      router.replace("/(tabs)");
    }
  }, [isLoggedIn, user, router]);

  const handleDynamicLogin = async () => {
    try {
      // Dynamic will handle the login flow automatically
      // The user will see Dynamic's login modal
      console.log("Dynamic login initiated");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome to POAPStays</Text>
            <Text style={styles.subtitle}>
              Connect your wallet to get started
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleDynamicLogin}
            >
              <Text style={styles.loginButtonText}>Connect Wallet</Text>
            </TouchableOpacity>

            <Text style={styles.infoText}>
              Dynamic will handle wallet connection and authentication
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.versionText}>
              Version {Application.nativeApplicationVersion}
            </Text>
            <Text style={styles.buildText}>
              Build {Application.nativeBuildVersion}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
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
  header: {
    alignItems: "center",
    marginBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 60,
  },
  loginButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: "100%",
    maxWidth: 300,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  infoText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },
  footer: {
    alignItems: "center",
  },
  versionText: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 4,
  },
  buildText: {
    fontSize: 12,
    color: "#9ca3af",
  },
});
