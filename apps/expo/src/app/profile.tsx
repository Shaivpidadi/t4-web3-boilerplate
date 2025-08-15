import React, { useEffect } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { usePrivy } from "@privy-io/expo";

export default function ProfileScreen() {
  const { logout, user } = usePrivy();
  const router = useRouter();

  // Move navigation logic to useEffect to prevent state updates during render
  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  const handleSignOut = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Don't render anything if user is not available (navigation will happen in useEffect)
  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.infoSection}>
          <Text style={styles.label}>User ID</Text>
          <Text style={styles.value}>{user.id || "Not available"}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Linked Accounts</Text>
          <Text style={styles.value}>
            {user.linked_accounts?.length
              ? `${user.linked_accounts.length} accounts`
              : "No linked accounts"}
          </Text>
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => router.push("/")}
          >
            <Text style={styles.buttonText}>Smart Contract Panel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  infoSection: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  buttonSection: {
    marginTop: 40,
    gap: 16,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#3b82f6",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  signOutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 15,
    borderRadius: 8,
  },
  signOutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
