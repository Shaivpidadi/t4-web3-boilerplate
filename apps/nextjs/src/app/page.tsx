'use client';

import { Suspense } from "react";

import { AuthShowcase } from "./_components/auth-showcase";
import WalletDashboard from "../components/WalletDashboard";
import SmartContractPanel from "../components/SmartContractPanel";
import { useWallet } from "../utils/wallet";

function ChainStatus() {
  const { currentChainId, currentChain, authenticated, wallets } = useWallet();

  if (!authenticated || !currentChain || !wallets?.length) return null;

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-6 text-center">
      <p className="text-sm font-semibold text-green-700">
        🌐 {currentChain.name}
      </p>
      <p className="text-xs text-green-600">
        Chain ID: {currentChainId}
      </p>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="container h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Create <span className="text-primary">T3</span> Turbo
        </h1>
        
        {/* Quick Chain Status - Always visible at top */}
        <ChainStatus />
        
        {/* Wallet Dashboard - Added prominently */}
        <div className="w-full max-w-4xl mb-8">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
            🚀 Wallet Dashboard
          </h2>
          <WalletDashboard />
        </div>

        {/* Smart Contract Panel - New addition */}
        <div className="w-full max-w-4xl mb-8">
          <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
            ⚡ Smart Contract Panel
          </h2>
          <p className="text-center text-gray-600 mb-4">
            Testing with existing contract on Sepolia testnet
          </p>
          <SmartContractPanel />
        </div>

        <AuthShowcase />
        
        <p className="text-center text-lg">
          Welcome to POAPStays with Privy authentication and smart contract integration!
        </p>
      </div>
    </main>
  );
}
