"use client";

import React, { useState } from "react";

import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";

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
      <div className="rounded-lg bg-gray-50 p-6 text-center">
        <h3 className="mb-2 text-lg font-semibold text-gray-700">
          No Wallet Connected
        </h3>
        <p className="text-gray-500">
          Connect your wallet through Privy to interact with smart contracts
        </p>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="rounded-lg bg-gray-50 p-6 text-center">
        <h3 className="mb-2 text-lg font-semibold text-gray-700">
          Loading Contract
        </h3>
        <p className="text-gray-500">
          Please wait while we connect to the smart contract...
        </p>
      </div>
    );
  }

  const isContractAvailable = true; // Contract is always available on Sepolia
  const contractAddress = "0x2331fb827792879D21e11f7e13bA0d57391393D5";

  const handleStore = async () => {
    if (!favoriteNumber) {
      alert("Please enter a favorite number");
      return;
    }

    try {
      setIsLoading(true);
      const txHash = await store(parseInt(favoriteNumber));
      setLastTxHash(txHash);
      setFavoriteNumber("");
      alert("Number stored successfully!");
      // Refresh the stored number
      const retrieved = await retrieve();
      setStoredNumber(retrieved);
    } catch (error) {
      alert("Store failed: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetrieve = async () => {
    try {
      setIsLoading(true);
      const number = await retrieve();
      setStoredNumber(number);
      alert("Number retrieved successfully!");
    } catch (error) {
      alert("Retrieve failed: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPerson = async () => {
    if (!personName || !personNumber) {
      alert("Please enter both name and favorite number");
      return;
    }

    try {
      setIsLoading(true);
      const txHash = await addPerson(personName, parseInt(personNumber));
      setLastTxHash(txHash);
      setPersonName("");
      setPersonNumber("");
      alert("Person added successfully!");
    } catch (error) {
      console.log(error);
      alert("Add person failed: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchByName = async () => {
    if (!searchName) {
      alert("Please enter a name to search");
      return;
    }

    try {
      setIsLoading(true);
      const number = await getNameToFavoriteNumber(searchName);
      setSearchResult(number);
    } catch (error) {
      alert("Search failed: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetPerson = async () => {
    if (!personIndex) {
      alert("Please enter a person index");
      return;
    }

    try {
      setIsLoading(true);
      const person = await getPerson(parseInt(personIndex));
      setPersonResult(person);
    } catch (error) {
      alert("Get person failed: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveLastPerson = async () => {
    try {
      setIsLoading(true);
      const txHash = await removeLastPerson();
      setLastTxHash(txHash);
      alert("Last person removed successfully!");
    } catch (error) {
      alert("Remove person failed: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          People Storage Contract Panel
        </h3>
        <div className="text-sm text-gray-500">
          Connected:{" "}
          {user?.wallet?.address
            ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
            : "Unknown"}
        </div>
      </div>

      {/* Contract Status */}
      <div className="mb-6">
        <div className="rounded-lg bg-blue-50 p-4">
          <h4 className="mb-2 font-medium text-blue-900">Contract Status</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Contract Available:</span>
              <span
                className={`font-medium ${isContractAvailable ? "text-green-600" : "text-red-600"}`}
              >
                {isContractAvailable ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Contract Address:</span>
              <span className="font-mono text-xs text-blue-600">
                {contractAddress ===
                "0x0000000000000000000000000000000000000000"
                  ? "Not Deployed"
                  : contractAddress}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Your Address:</span>
              <span className="font-mono text-xs text-blue-600">
                {user?.wallet?.address}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Store and Retrieve */}
      <div className="mb-6">
        <div className="rounded-lg bg-green-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-medium text-green-900">
              Store & Retrieve Favorite Number
            </h4>
            <Button
              onClick={handleRetrieve}
              disabled={!isContractAvailable || isLoading}
              variant="outline"
              size="sm"
            >
              Retrieve
            </Button>
          </div>

          {storedNumber !== null && (
            <div className="mb-3 rounded bg-green-100 p-3">
              <p className="text-sm font-medium text-green-800">
                <strong>Stored Number:</strong> {storedNumber}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <Label htmlFor="favorite-number">Favorite Number</Label>
              <Input
                id="favorite-number"
                type="number"
                placeholder="42"
                value={favoriteNumber}
                onChange={(e) => setFavoriteNumber(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button
              onClick={handleStore}
              disabled={isLoading || !favoriteNumber}
              className="w-full"
            >
              {isLoading ? "Processing..." : "Store Number"}
            </Button>
          </div>
        </div>
      </div>

      {/* Add Person */}
      <div className="mb-6">
        <h4 className="mb-3 font-medium text-gray-900">Add Person</h4>
        <div className="space-y-3">
          <div>
            <Label htmlFor="person-name">Person Name</Label>
            <Input
              id="person-name"
              type="text"
              placeholder="Alice"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="person-number">Favorite Number</Label>
            <Input
              id="person-number"
              type="number"
              placeholder="7"
              value={personNumber}
              onChange={(e) => setPersonNumber(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button
            onClick={handleAddPerson}
            disabled={
              !isContractAvailable || isLoading || !personName || !personNumber
            }
            className="w-full"
          >
            {isLoading ? "Processing..." : "Add Person"}
          </Button>
        </div>
      </div>

      {/* Search by Name */}
      <div className="mb-6">
        <h4 className="mb-3 font-medium text-gray-900">Search by Name</h4>
        <div className="space-y-3">
          <div>
            <Label htmlFor="search-name">Person Name</Label>
            <Input
              id="search-name"
              type="text"
              placeholder="Bob"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button
            onClick={handleSearchByName}
            disabled={!isContractAvailable || isLoading || !searchName}
            className="w-full"
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>

          {searchResult !== null && (
            <div className="rounded bg-yellow-50 p-3">
              <p className="text-sm font-medium text-yellow-800">
                <strong>Favorite Number:</strong> {searchResult}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Get Person by Index */}
      <div className="mb-6">
        <h4 className="mb-3 font-medium text-gray-900">Get Person by Index</h4>
        <div className="space-y-3">
          <div>
            <Label htmlFor="person-index">Person Index</Label>
            <Input
              id="person-index"
              type="number"
              placeholder="0"
              value={personIndex}
              onChange={(e) => setPersonIndex(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button
            onClick={handleGetPerson}
            disabled={!isContractAvailable || isLoading || !personIndex}
            className="w-full"
          >
            {isLoading ? "Loading..." : "Get Person"}
          </Button>

          {personResult && (
            <div className="rounded bg-indigo-50 p-3">
              <p className="text-sm font-medium text-indigo-800">
                <strong>Name:</strong> {personResult.name}
              </p>
              <p className="text-sm font-medium text-indigo-800">
                <strong>Favorite Number:</strong> {personResult.favoriteNumber}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Remove Last Person */}
      <div className="mb-6">
        <h4 className="mb-3 font-medium text-gray-900">Remove Last Person</h4>
        <Button
          onClick={handleRemoveLastPerson}
          disabled={!isContractAvailable || isLoading}
          variant="destructive"
          className="w-full"
        >
          {isLoading ? "Processing..." : "Remove Last Person"}
        </Button>
      </div>

      {/* Last Transaction */}
      {lastTxHash && (
        <div className="rounded-lg bg-gray-50 p-4">
          <h4 className="mb-2 font-medium text-gray-900">Last Transaction</h4>
          <p className="break-all font-mono text-xs text-gray-600">
            {lastTxHash}
          </p>
          <div className="mt-2">
            <a
              href={`https://sepolia.etherscan.io/tx/${lastTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 underline hover:text-blue-800"
            >
              View on Etherscan →
            </a>
          </div>
        </div>
      )}

      {/* Contract Not Deployed Warning */}
      {!isContractAvailable && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <h4 className="mb-2 font-medium text-yellow-900">
            Contract Not Available
          </h4>
          <p className="text-sm text-yellow-700">
            The smart contract is not available on this network. Switch to
            Sepolia testnet to test with the existing contract.
          </p>
          <div className="mt-3">
            <Button
              onClick={() =>
                window.open(
                  "https://sepolia.etherscan.io/address/0x2331fb827792879D21e11f7e13bA0d57391393D5",
                  "_blank",
                )
              }
              variant="outline"
              size="sm"
            >
              View Contract on Etherscan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
