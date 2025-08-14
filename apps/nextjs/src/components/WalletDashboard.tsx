'use client';

import React, { useState } from 'react';
import { useWallet, formatAddress, formatBalance, SUPPORTED_CHAINS, getWalletType, getWalletProvider } from '../utils/wallet';
import { Button } from '@acme/ui/button';

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
    linkExternalWallet,
    unlinkExternalWallet,
    setPrimaryWalletAddress,
    supportedChains,
    currentChain
  } = useWallet();

  const [signature, setSignature] = useState<string>('');
  const [showWalletList, setShowWalletList] = useState(false);

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

  const handleLinkExternalWallet = async () => {
    const success = await linkExternalWallet();
    if (success) {
      alert('External wallet linking initiated. Please follow the prompts.');
    } else {
      alert('Failed to initiate wallet linking');
    }
  };

  const handleUnlinkWallet = async (walletAddress: string) => {
    const success = await unlinkExternalWallet(walletAddress);
    if (success) {
      alert('Wallet unlinked successfully');
    } else {
      alert('Failed to unlink wallet');
    }
  };

  const handleSetPrimaryWallet = (walletAddress: string) => {
    const success = setPrimaryWalletAddress(walletAddress);
    if (success) {
      alert('Primary wallet updated');
      getBalance(); // Refresh balance for new primary wallet
    } else {
      alert('Failed to set primary wallet');
    }
  };

  return (
    <div className="space-y-6">
      {/* Wallet Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Wallet Dashboard</h3>
          <Button
            onClick={() => setShowWalletList(!showWalletList)}
            variant="outline"
            size="sm"
          >
            {showWalletList ? 'Hide Wallets' : 'Manage Wallets'}
          </Button>
        </div>

        {/* Primary Wallet Info */}
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900">Primary Wallet</h4>
              <p className="text-sm text-blue-700 font-mono">
                {formatAddress(account.address)}
              </p>
              <p className="text-xs text-blue-600">
                {getWalletType(account)} • {getWalletProvider(account)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-blue-900">
                {formatBalance(balance)} {currentChain?.nativeCurrency?.symbol}
              </p>
              <p className="text-xs text-blue-600">
                {currentChain?.name}
              </p>
            </div>
          </div>
        </div>

        {/* Wallet List */}
        {showWalletList && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="font-medium text-gray-900">Connected Wallets</h5>
              <Button
                onClick={handleLinkExternalWallet}
                size="sm"
                disabled={isLoading}
              >
                Link External Wallet
              </Button>
            </div>
            
            {wallets.map((wallet, index) => (
              <div
                key={wallet.address}
                className={`border rounded-lg p-3 ${
                  wallet.address === account.address ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm">
                        {formatAddress(wallet.address)}
                      </span>
                      {wallet.address === account.address && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {getWalletType(wallet)} • {getWalletProvider(wallet)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {wallet.address !== account.address && (
                      <Button
                        onClick={() => handleSetPrimaryWallet(wallet.address)}
                        size="sm"
                        variant="outline"
                      >
                        Set Primary
                      </Button>
                    )}
                    {getWalletType(wallet) === 'external' && (
                      <Button
                        onClick={() => handleUnlinkWallet(wallet.address)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        Unlink
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chain Selection */}
        <div className="mt-4">
          <h5 className="font-medium text-gray-900 mb-2">Switch Chain</h5>
          <div className="flex space-x-2">
            {Object.entries(supportedChains).map(([chainId, chain]) => (
              <Button
                key={chainId}
                onClick={() => handleSwitchChain(chainId)}
                variant={currentChainId === chainId ? "default" : "outline"}
                size="sm"
                disabled={isLoading}
              >
                {chain.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 space-y-2">
          <Button
            onClick={handleSignMessage}
            disabled={isLoading}
            className="w-full"
          >
            Sign Test Message
          </Button>
          
          <Button
            onClick={getBalance}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            Refresh Balance
          </Button>
        </div>

        {/* Signature Display */}
        {signature && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <h5 className="font-medium text-green-900 mb-1">Last Signature</h5>
            <p className="text-xs font-mono text-green-700 break-all">
              {signature}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
