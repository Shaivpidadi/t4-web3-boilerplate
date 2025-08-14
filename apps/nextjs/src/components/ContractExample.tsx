'use client';

import { useState } from 'react';
import { usePrivyViem } from '../hooks/usePrivyViem';

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
    removeLastPerson
  } = usePrivyViem();
  
  const [storedNumber, setStoredNumber] = useState<number | null>(null);
  const [personName, setPersonName] = useState('');
  const [personNumber, setPersonNumber] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchResult, setSearchResult] = useState<number | null>(null);
  const [personIndex, setPersonIndex] = useState('');
  const [personResult, setPersonResult] = useState<{ name: string; favoriteNumber: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handleStore = async () => {
    if (!personNumber) return;
    
    try {
      setLoading(true);
      const hash = await store(parseInt(personNumber));
      setTxHash(hash);
      setPersonNumber('');
      // Refresh the stored number
      const retrieved = await retrieve();
      setStoredNumber(retrieved);
    } catch (error) {
      console.error('Failed to store:', error);
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
      console.error('Failed to retrieve:', error);
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
      setPersonName('');
      setPersonNumber('');
    } catch (error) {
      console.error('Failed to add person:', error);
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
      console.error('Failed to search by name:', error);
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
      console.error('Failed to get person:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLastPerson = async () => {
    try {
      setLoading(true);
      const hash = await removeLastPerson();
      setTxHash(hash);
    } catch (error) {
      console.error('Failed to remove last person:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">People Storage Contract</h2>
        <p className="text-gray-600">Please connect your wallet to interact with the contract.</p>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">People Storage Contract</h2>
        <p className="text-gray-600">Loading contract...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">People Storage Contract</h2>
      
      {/* User Info */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-600">Connected Wallet:</p>
        <p className="font-mono text-sm break-all">{user?.wallet?.address}</p>
      </div>

      {/* Store and Retrieve */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Store & Retrieve Favorite Number</h3>
        <div className="flex gap-4 mb-3">
          <button
            onClick={handleRetrieve}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Retrieve Number'}
          </button>
        </div>
        
        {storedNumber !== null && (
          <div className="p-3 bg-green-50 rounded text-sm">
            <p><strong>Stored Number:</strong> {storedNumber}</p>
          </div>
        )}
        
        <div className="mt-3 space-y-3">
          <input
            type="number"
            placeholder="Favorite Number"
            value={personNumber}
            onChange={(e) => setPersonNumber(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleStore}
            disabled={!personNumber || loading}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Store Number'}
          </button>
        </div>
      </div>

      {/* Add Person */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Add Person</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Person Name"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            placeholder="Favorite Number"
            value={personNumber}
            onChange={(e) => setPersonNumber(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleAddPerson}
            disabled={!personName || !personNumber || loading}
            className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Add Person'}
          </button>
        </div>
      </div>

      {/* Search by Name */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Search by Name</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Person Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleSearchByName}
            disabled={!searchName || loading}
            className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          
          {searchResult !== null && (
            <div className="p-3 bg-yellow-50 rounded text-sm">
              <p><strong>Favorite Number:</strong> {searchResult}</p>
            </div>
          )}
        </div>
      </div>

      {/* Get Person by Index */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Get Person by Index</h3>
        <div className="space-y-3">
          <input
            type="number"
            placeholder="Person Index"
            value={personIndex}
            onChange={(e) => setPersonIndex(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleGetPerson}
            disabled={!personIndex || loading}
            className="w-full px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Get Person'}
          </button>
          
          {personResult && (
            <div className="p-3 bg-indigo-50 rounded text-sm">
              <p><strong>Name:</strong> {personResult.name}</p>
              <p><strong>Favorite Number:</strong> {personResult.favoriteNumber}</p>
            </div>
          )}
        </div>
      </div>

      {/* Remove Last Person */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Remove Last Person</h3>
        <button
          onClick={handleRemoveLastPerson}
          disabled={loading}
          className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Remove Last Person'}
        </button>
      </div>

      {/* Transaction Hash */}
      {txHash && (
        <div className="mt-3 p-3 bg-green-50 rounded">
          <p className="text-sm font-bold">Transaction Hash:</p>
          <p className="font-mono text-xs break-all">{txHash}</p>
        </div>
      )}
    </div>
  );
}
