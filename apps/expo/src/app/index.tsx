import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useDynamicContext } from "@dynamic-labs/react-hooks";

import SmartContractPanel from "../components/SmartContractPanel";
import WalletDashboard from "../components/WalletDashboard";

export default function IndexScreen() {
  const { user, isLoggedIn } = useDynamicContext();
  const router = useRouter();

  // If user is not logged in, redirect to login
  React.useEffect(() => {
    if (!isLoggedIn || !user) {
      router.replace("/login");
    }
  }, [isLoggedIn, user, router]);

  if (!isLoggedIn || !user) {
    return null; // Will redirect to login
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>POAPStays</Text>
          <Text style={styles.subtitle}>Welcome to your Web3 dashboard</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wallet Dashboard</Text>
          <WalletDashboard />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Smart Contract Panel</Text>
          <SmartContractPanel />
        </View>

        <View style={styles.navigationSection}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.push("/profile")}
          >
            <Text style={styles.navButtonText}>View Profile</Text>
          </TouchableOpacity>
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
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16,
    textAlign: "center",
  },
  navigationSection: {
    alignItems: "center",
    marginTop: 20,
  },
  navButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 200,
    alignItems: "center",
  },
  navButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
