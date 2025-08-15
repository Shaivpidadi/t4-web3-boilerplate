import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { usePrivy } from "@privy-io/expo";

export default function ProfileScreen() {
  const { logout, user } = usePrivy();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) {
    router.replace("/login");
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

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
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
  signOutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 40,
  },
  signOutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
