import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useWallet, formatAddress, formatBalance, SUPPORTED_CHAINS } from '../utils/wallet';

export default function WalletDashboard() {
  const {
    account,
    currentChainId,
    isLoading,
    getCurrentChain,
    switchChain,
    signMessage,
    getBalance,
    supportedChains,
    currentChain
  } = useWallet();

  const [balance, setBalance] = useState<string>('0');

  // Load current chain and balance on mount
  useEffect(() => {
    if (account?.address) {
      getCurrentChain();
      loadBalance();
    }
  }, [account?.address]);

  const loadBalance = async () => {
    if (account?.address) {
      const walletBalance = await getBalance();
      if (walletBalance) {
        setBalance(walletBalance);
      }
    }
  };

  const handleSwitchChain = async (targetChainId: string) => {
    const success = await switchChain(targetChainId);
    if (success) {
      Alert.alert('Success', `Switched to ${SUPPORTED_CHAINS[targetChainId as keyof typeof SUPPORTED_CHAINS]?.name}`);
      loadBalance(); // Refresh balance for new chain
    } else {
      Alert.alert('Error', 'Failed to switch chain');
    }
  };

  const handleSignMessage = async () => {
    const message = `Hello from POAPStays! Timestamp: ${Date.now()}`;
    const signature = await signMessage(message);
    if (signature) {
      Alert.alert('Message Signed!', `Signature: ${signature.slice(0, 20)}...`);
    } else {
      Alert.alert('Error', 'Failed to sign message');
    }
  };

  if (!account?.address) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No Wallet Connected</Text>
        <Text style={styles.subtitle}>Connect your wallet to view dashboard</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Wallet Dashboard</Text>
      
      {/* Wallet Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wallet Information</Text>
        <Text style={styles.infoText}>Address: {formatAddress(account.address)}</Text>
        <Text style={styles.infoText}>Type: Embedded Wallet</Text>
      </View>

      {/* Current Chain */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Chain</Text>
        <Text style={styles.chainName}>{currentChain?.name || 'Unknown'}</Text>
        <Text style={styles.infoText}>Chain ID: {currentChainId}</Text>
        <Text style={styles.infoText}>Balance: {formatBalance(balance)} {currentChain?.nativeCurrency?.symbol}</Text>
        
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={loadBalance}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Refresh Balance</Text>
        </TouchableOpacity>
      </View>

      {/* Chain Switching */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Switch Chain</Text>
        {Object.entries(SUPPORTED_CHAINS).map(([chainId, chain]) => (
          <TouchableOpacity
            key={chainId}
            style={[
              styles.chainButton,
              currentChainId === chainId && styles.activeChainButton
            ]}
            onPress={() => handleSwitchChain(chainId)}
            disabled={isLoading || currentChainId === chainId}
          >
            <Text style={[
              styles.chainButtonText,
              currentChainId === chainId && styles.activeChainButtonText
            ]}>
              {chain.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wallet Actions</Text>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleSignMessage}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Sign Message</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  chainName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
    marginBottom: 10,
  },
  refreshButton: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  chainButton: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  activeChainButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  chainButtonText: {
    textAlign: 'center',
    color: '#374151',
    fontWeight: '500',
  },
  activeChainButtonText: {
    color: '#fff',
  },
  actionButton: {
    backgroundColor: '#8b5cf6',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
