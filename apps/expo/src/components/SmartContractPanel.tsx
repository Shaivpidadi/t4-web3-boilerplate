import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { usePrivyViem } from "../hooks/usePrivyViem";

export default function SmartContractPanel() {
  const {
    authenticated,
    isReady,
    user,
    store,
    retrieve,
    addPerson,
    getNameToFavoriteNumber,
    getPerson,
    removeLastPerson,
  } = usePrivyViem();

  const [favoriteNumber, setFavoriteNumber] = useState("");
  const [personName, setPersonName] = useState("");
  const [personNumber, setPersonNumber] = useState("");
  const [searchName, setSearchName] = useState("");
  const [personIndex, setPersonIndex] = useState("");
  const [storedNumber, setStoredNumber] = useState<number | null>(null);
  const [searchResult, setSearchResult] = useState<number | null>(null);
  const [personResult, setPersonResult] = useState<{
    name: string;
    favoriteNumber: number;
  } | null>(null);
  const [lastTxHash, setLastTxHash] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!authenticated) {
    return (
      <View style={styles.noWalletContainer}>
        <Text style={styles.noWalletTitle}>No Wallet Connected</Text>
        <Text style={styles.noWalletText}>
          Connect your wallet through Privy to interact with smart contracts
        </Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingTitle}>Loading Contract</Text>
        <Text style={styles.loadingText}>
          Please wait while we connect to the smart contract...
        </Text>
      </View>
    );
  }

  const isContractAvailable = true; // Contract is always available on Sepolia
  const contractAddress = "0x2331fb827792879D21e11f7e13bA0d57391393D5";

  const handleStore = async () => {
    if (!favoriteNumber) {
      Alert.alert("Error", "Please enter a favorite number");
      return;
    }

    try {
      setIsLoading(true);
      const txHash = await store(parseInt(favoriteNumber));
      setLastTxHash(txHash);
      setFavoriteNumber("");
      Alert.alert("Success", "Number stored successfully!");
      // Refresh the stored number
      const retrieved = await retrieve();
      setStoredNumber(retrieved);
    } catch (error) {
      Alert.alert("Error", "Store failed: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetrieve = async () => {
    try {
      setIsLoading(true);
      const number = await retrieve();
      setStoredNumber(number);
      Alert.alert("Success", "Number retrieved successfully!");
    } catch (error) {
      Alert.alert("Error", "Retrieve failed: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPerson = async () => {
    if (!personName || !personNumber) {
      Alert.alert("Error", "Please enter both name and favorite number");
      return;
    }

    try {
      setIsLoading(true);
      const txHash = await addPerson(personName, parseInt(personNumber));
      setLastTxHash(txHash);
      setPersonName("");
      setPersonNumber("");
      Alert.alert("Success", "Person added successfully!");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Add person failed: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchByName = async () => {
    if (!searchName) {
      Alert.alert("Error", "Please enter a name to search");
      return;
    }

    try {
      setIsLoading(true);
      const number = await getNameToFavoriteNumber(searchName);
      setSearchResult(number);
    } catch (error) {
      Alert.alert("Error", "Search failed: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetPerson = async () => {
    if (!personIndex) {
      Alert.alert("Error", "Please enter a person index");
      return;
    }

    try {
      setIsLoading(true);
      const person = await getPerson(parseInt(personIndex));
      setPersonResult(person);
    } catch (error) {
      Alert.alert("Error", "Get person failed: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveLastPerson = async () => {
    try {
      setIsLoading(true);
      const txHash = await removeLastPerson();
      setLastTxHash(txHash);
      Alert.alert("Success", "Last person removed successfully!");
    } catch (error) {
      Alert.alert("Error", "Remove person failed: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>People Storage Contract Panel</Text>
          <Text style={styles.subtitle}>
            Connected: {user?.id || "Unknown"}
          </Text>
        </View>

        {/* Contract Status */}
        <View style={styles.section}>
          <View style={styles.statusContainer}>
            <Text style={styles.sectionTitle}>Contract Status</Text>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Contract Available:</Text>
              <Text
                style={[
                  styles.statusValue,
                  { color: isContractAvailable ? "#16a34a" : "#dc2626" },
                ]}
              >
                {isContractAvailable ? "Yes" : "No"}
              </Text>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Contract Address:</Text>
              <Text style={styles.contractAddress}>{contractAddress}</Text>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Your Address:</Text>
              <Text style={styles.contractAddress}>
                {user?.id || "Not available"}
              </Text>
            </View>
          </View>
        </View>

        {/* Store and Retrieve */}
        <View style={styles.section}>
          <View style={styles.functionContainer}>
            <View style={styles.functionHeader}>
              <Text style={styles.functionTitle}>
                Store & Retrieve Favorite Number
              </Text>
              <TouchableOpacity
                style={[styles.button, styles.outlineButton]}
                onPress={handleRetrieve}
                disabled={!isContractAvailable || isLoading}
              >
                <Text style={styles.outlineButtonText}>Retrieve</Text>
              </TouchableOpacity>
            </View>

            {storedNumber !== null && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultText}>
                  <Text style={styles.bold}>Stored Number:</Text> {storedNumber}
                </Text>
              </View>
            )}

            <TextInput
              style={styles.input}
              placeholder="42"
              value={favoriteNumber}
              onChangeText={setFavoriteNumber}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleStore}
              disabled={isLoading || !favoriteNumber}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Store Number</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Add Person */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Person</Text>
          <TextInput
            style={styles.input}
            placeholder="Alice"
            value={personName}
            onChangeText={setPersonName}
          />
          <TextInput
            style={styles.input}
            placeholder="7"
            value={personNumber}
            onChangeText={setPersonNumber}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleAddPerson}
            disabled={
              !isContractAvailable || isLoading || !personName || !personNumber
            }
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Add Person</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Search by Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Search by Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Bob"
            value={searchName}
            onChangeText={setSearchName}
          />
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleSearchByName}
            disabled={!isContractAvailable || isLoading || !searchName}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Search</Text>
            )}
          </TouchableOpacity>

          {searchResult !== null && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>
                <Text style={styles.bold}>Favorite Number:</Text> {searchResult}
              </Text>
            </View>
          )}
        </View>

        {/* Get Person by Index */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get Person by Index</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            value={personIndex}
            onChangeText={setPersonIndex}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleGetPerson}
            disabled={!isContractAvailable || isLoading || !personIndex}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Get Person</Text>
            )}
          </TouchableOpacity>

          {personResult && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>
                <Text style={styles.bold}>Name:</Text> {personResult.name}
              </Text>
              <Text style={styles.resultText}>
                <Text style={styles.bold}>Favorite Number:</Text>{" "}
                {personResult.favoriteNumber}
              </Text>
            </View>
          )}
        </View>

        {/* Remove Last Person */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Remove Last Person</Text>
          <TouchableOpacity
            style={[styles.button, styles.destructiveButton]}
            onPress={handleRemoveLastPerson}
            disabled={!isContractAvailable || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Remove Last Person</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Last Transaction */}
        {lastTxHash && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Last Transaction</Text>
            <Text style={styles.txHash}>{lastTxHash}</Text>
            <TouchableOpacity
              style={[styles.button, styles.outlineButton]}
              onPress={() => {
                // In React Native, you might want to open a web browser or copy to clipboard
                Alert.alert(
                  "Transaction Hash",
                  `Transaction Hash: ${lastTxHash}`,
                );
              }}
            >
              <Text style={styles.outlineButtonText}>Copy Hash</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Contract Not Deployed Warning */}
        {!isContractAvailable && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningTitle}>Contract Not Available</Text>
            <Text style={styles.warningText}>
              The smart contract is not available on this network. Switch to
              Sepolia testnet to test with the existing contract.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
  },
  statusContainer: {
    backgroundColor: "#dbeafe",
    padding: 16,
    borderRadius: 8,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: "#1e40af",
    fontWeight: "500",
  },
  statusValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  contractAddress: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#1e40af",
    maxWidth: "60%",
  },
  functionContainer: {
    backgroundColor: "#dcfce7",
    padding: 16,
    borderRadius: 8,
  },
  functionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  functionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#166534",
    flex: 1,
    marginRight: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  primaryButton: {
    backgroundColor: "#3b82f6",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#3b82f6",
  },
  destructiveButton: {
    backgroundColor: "#ef4444",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  outlineButtonText: {
    color: "#3b82f6",
    fontSize: 16,
    fontWeight: "600",
  },
  resultContainer: {
    backgroundColor: "#fef3c7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  resultText: {
    fontSize: 14,
    color: "#92400e",
  },
  bold: {
    fontWeight: "600",
  },
  txHash: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#6b7280",
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  warningContainer: {
    backgroundColor: "#fef3c7",
    borderWidth: 1,
    borderColor: "#fbbf24",
    padding: 16,
    borderRadius: 8,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#92400e",
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: "#92400e",
  },
  noWalletContainer: {
    backgroundColor: "#f3f4f6",
    padding: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  noWalletTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  noWalletText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  loadingContainer: {
    backgroundColor: "#f3f4f6",
    padding: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
});
