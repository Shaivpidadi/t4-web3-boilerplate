import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { usePrivyViem } from "../hooks/usePrivyViem";

export function ContractExample() {
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

  const [storedNumber, setStoredNumber] = useState<number | null>(null);
  const [personName, setPersonName] = useState("");
  const [personNumber, setPersonNumber] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchResult, setSearchResult] = useState<number | null>(null);
  const [personIndex, setPersonIndex] = useState("");
  const [personResult, setPersonResult] = useState<{
    name: string;
    favoriteNumber: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

  const handleStore = async () => {
    if (!personNumber) return;

    try {
      setLoading(true);
      const hash = await store(parseInt(personNumber));
      setTxHash(hash);
      setPersonNumber("");
      // Refresh the stored number
      const retrieved = await retrieve();
      setStoredNumber(retrieved);
    } catch (error) {
      console.error("Failed to store:", error);
      Alert.alert("Error", "Failed to store number");
    } finally {
      setLoading(false);
    }
  };

  const handleRetrieve = async () => {
    try {
      setLoading(true);
      const number = await retrieve();
      setStoredNumber(number);
    } catch (error) {
      console.error("Failed to retrieve:", error);
      Alert.alert("Error", "Failed to retrieve number");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPerson = async () => {
    if (!personName || !personNumber) return;

    try {
      setLoading(true);
      const hash = await addPerson(personName, parseInt(personNumber));
      setTxHash(hash);
      setPersonName("");
      setPersonNumber("");
      Alert.alert("Success", `Person added! Hash: ${hash}`);
    } catch (error) {
      console.error("Failed to add person:", error);
      Alert.alert("Error", "Failed to add person");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByName = async () => {
    if (!searchName) return;

    try {
      setLoading(true);
      const number = await getNameToFavoriteNumber(searchName);
      setSearchResult(number);
    } catch (error) {
      console.error("Failed to search by name:", error);
      Alert.alert("Error", "Failed to search by name");
    } finally {
      setLoading(false);
    }
  };

  const handleGetPerson = async () => {
    if (!personIndex) return;

    try {
      setLoading(true);
      const person = await getPerson(parseInt(personIndex));
      setPersonResult(person);
    } catch (error) {
      console.error("Failed to get person:", error);
      Alert.alert("Error", "Failed to get person");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLastPerson = async () => {
    try {
      setLoading(true);
      const hash = await removeLastPerson();
      setTxHash(hash);
      Alert.alert("Success", `Last person removed! Hash: ${hash}`);
    } catch (error) {
      console.error("Failed to remove last person:", error);
      Alert.alert("Error", "Failed to remove last person");
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <View className="rounded-lg bg-gray-50 p-6">
        <Text className="mb-4 text-xl font-semibold">
          People Storage Contract
        </Text>
        <Text className="text-gray-600">
          Please connect your wallet to interact with the contract.
        </Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View className="rounded-lg bg-gray-50 p-6">
        <Text className="mb-4 text-xl font-semibold">
          People Storage Contract
        </Text>
        <Text className="text-gray-600">Loading contract...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-4">
      <View className="rounded-lg bg-white p-6 shadow-md">
        <Text className="mb-4 text-xl font-semibold">
          People Storage Contract
        </Text>

        {/* User Info */}
        <View className="mb-6 rounded-lg bg-blue-50 p-4">
          <Text className="text-sm text-gray-600">Connected User:</Text>
          <Text className="break-all font-mono text-sm">
            {user?.id || "Not available"}
          </Text>
        </View>

        {/* Store and Retrieve */}
        <View className="mb-6">
          <Text className="mb-3 text-lg font-medium">
            Store & Retrieve Favorite Number
          </Text>
          <View className="mb-3 flex-row gap-4">
            <TouchableOpacity
              onPress={handleRetrieve}
              disabled={loading}
              className={`rounded px-4 py-2 ${loading ? "bg-gray-400" : "bg-blue-500"}`}
            >
              <Text className="text-center text-white">
                {loading ? "Loading..." : "Retrieve Number"}
              </Text>
            </TouchableOpacity>
          </View>

          {storedNumber !== null && (
            <View className="rounded bg-green-50 p-3">
              <Text className="text-sm">
                <Text className="font-bold">Stored Number:</Text> {storedNumber}
              </Text>
            </View>
          )}

          <View className="mt-3 space-y-3">
            <TextInput
              placeholder="Favorite Number"
              value={personNumber}
              onChangeText={setPersonNumber}
              keyboardType="numeric"
              className="w-full rounded border border-gray-300 p-2"
            />
            <TouchableOpacity
              onPress={handleStore}
              disabled={!personNumber || loading}
              className={`w-full rounded px-4 py-2 ${!personNumber || loading ? "bg-gray-400" : "bg-green-500"}`}
            >
              <Text className="text-center text-white">
                {loading ? "Processing..." : "Store Number"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Add Person */}
        <View className="mb-6">
          <Text className="mb-3 text-lg font-medium">Add Person</Text>
          <View className="space-y-3">
            <TextInput
              placeholder="Person Name"
              value={personName}
              onChangeText={setPersonName}
              className="w-full rounded border border-gray-300 p-2"
            />
            <TextInput
              placeholder="Favorite Number"
              value={personNumber}
              onChangeText={setPersonNumber}
              keyboardType="numeric"
              className="w-full rounded border border-gray-300 p-2"
            />
            <TouchableOpacity
              onPress={handleAddPerson}
              disabled={!personName || !personNumber || loading}
              className={`w-full rounded px-4 py-2 ${!personName || !personNumber || loading ? "bg-gray-400" : "bg-purple-500"}`}
            >
              <Text className="text-center text-white">
                {loading ? "Processing..." : "Add Person"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search by Name */}
        <View className="mb-6">
          <Text className="mb-3 text-lg font-medium">Search by Name</Text>
          <View className="space-y-3">
            <TextInput
              placeholder="Person Name"
              value={searchName}
              onChangeText={setSearchName}
              className="w-full rounded border border-gray-300 p-2"
            />
            <TouchableOpacity
              onPress={handleSearchByName}
              disabled={!searchName || loading}
              className={`w-full rounded px-4 py-2 ${!searchName || loading ? "bg-gray-400" : "bg-yellow-500"}`}
            >
              <Text className="text-center text-white">
                {loading ? "Searching..." : "Search"}
              </Text>
            </TouchableOpacity>

            {searchResult !== null && (
              <View className="rounded bg-yellow-50 p-3">
                <Text className="text-sm">
                  <Text className="font-bold">Favorite Number:</Text>{" "}
                  {searchResult}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Get Person by Index */}
        <View className="mb-6">
          <Text className="mb-3 text-lg font-medium">Get Person by Index</Text>
          <View className="space-y-3">
            <TextInput
              placeholder="Person Index"
              value={personIndex}
              onChangeText={setPersonIndex}
              keyboardType="numeric"
              className="w-full rounded border border-gray-300 p-2"
            />
            <TouchableOpacity
              onPress={handleGetPerson}
              disabled={!personIndex || loading}
              className={`w-full rounded px-4 py-2 ${!personIndex || loading ? "bg-gray-400" : "bg-indigo-500"}`}
            >
              <Text className="text-center text-white">
                {loading ? "Loading..." : "Get Person"}
              </Text>
            </TouchableOpacity>

            {personResult && (
              <View className="rounded bg-indigo-50 p-3">
                <Text className="text-sm">
                  <Text className="font-bold">Name:</Text> {personResult.name}
                </Text>
                <Text className="text-sm">
                  <Text className="font-bold">Favorite Number:</Text>{" "}
                  {personResult.favoriteNumber}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Remove Last Person */}
        <View className="mb-6">
          <Text className="mb-3 text-lg font-medium">Remove Last Person</Text>
          <TouchableOpacity
            onPress={handleRemoveLastPerson}
            disabled={loading}
            className={`w-full rounded px-4 py-2 ${loading ? "bg-gray-400" : "bg-red-500"}`}
          >
            <Text className="text-center text-white">
              {loading ? "Processing..." : "Remove Last Person"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Transaction Hash */}
        {txHash && (
          <View className="mt-3 rounded bg-green-50 p-3">
            <Text className="text-sm font-bold">Transaction Hash:</Text>
            <Text className="break-all font-mono text-xs">{txHash}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
