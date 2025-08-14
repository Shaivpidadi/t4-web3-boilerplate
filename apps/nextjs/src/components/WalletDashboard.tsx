'use client';

import React, { useState } from 'react';
import { useWallet, formatAddress, formatBalance, SUPPORTED_CHAINS } from '../utils/wallet';

export default function WalletDashboard() {
  const {
    account,
    currentChainId,
    isLoading,
    balance,
    authenticated,
    wallets,
    switchChain,
    signMessage,
    getBalance,
    supportedChains,
    currentChain
  } = useWallet();

  const [signature, setSignature] = useState<string>('');

  if (!authenticated) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Not Authenticated</h3>
        <p className="text-gray-500">Please sign in to view your wallet</p>
      </div>
    );
  }

  if (!account?.address || !wallets?.length) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Wallet Available</h3>
        <p className="text-gray-500">Your embedded wallet is being created...</p>
      </div>
    );
  }

  const handleSwitchChain = async (targetChainId: string) => {
    const success = await switchChain(targetChainId);
    if (success) {
      alert(`Successfully switched to ${supportedChains[targetChainId as keyof typeof supportedChains]?.name}`);
      getBalance(); // Refresh balance for new chain
    } else {
      alert('Failed to switch chain');
    }
  };

  const handleSignMessage = async () => {
    const message = `Hello from POAPStays! Timestamp: ${Date.now()}`;
    const sig = await signMessage(message);
    if (sig) {
      setSignature(sig);
      alert('Message signed successfully!');
    } else {
      alert('Failed to sign message');
    }
  };

  return (
    <div className="space-y-6">
      {/* Wallet Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Wallet Information</h3>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Address:</span> {formatAddress(account.address)}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Type:</span> Embedded Wallet
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Wallet Count:</span> {wallets.length}
          </p>
        </div>
      </div>

      {/* Current Chain */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Chain</h3>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-blue-600">
            {currentChain?.name || 'Unknown'}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Chain ID:</span> {currentChainId}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Balance:</span> {formatBalance(balance)} {currentChain?.nativeCurrency?.symbol}
          </p>
          
          <button 
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            onClick={getBalance}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Refresh Balance'}
          </button>
        </div>
      </div>

      {/* Chain Switching */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Switch Chain</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(supportedChains).map(([chainId, chain]) => (
            <button
              key={chainId}
              className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                currentChainId === chainId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              onClick={() => handleSwitchChain(chainId)}
              disabled={isLoading || currentChainId === chainId}
            >
              {chain.name}
            </button>
          ))}
        </div>
      </div>

      {/* Wallet Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Wallet Actions</h3>
        
        <button 
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-md font-medium transition-colors mr-4"
          onClick={handleSignMessage}
          disabled={isLoading}
        >
          Sign Message
        </button>

        {signature && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Last Signature:</span>
            </p>
            <p className="text-xs font-mono text-gray-500 break-all">
              {signature.slice(0, 50)}...
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{currentChainId}</p>
          <p className="text-sm text-blue-500">Current Chain</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {formatBalance(balance)}
          </p>
          <p className="text-sm text-green-500">Balance</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">
            {wallets?.length || 0}
          </p>
          <p className="text-sm text-purple-500">Wallets</p>
        </div>
      </div>
    </div>
  );
}
