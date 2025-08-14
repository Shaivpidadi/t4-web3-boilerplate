"use client";

import { usePrivy } from '@privy-io/react-auth';
import { Button } from "@acme/ui/button";

export function AuthShowcase() {
  const { login, logout, user, ready, authenticated } = usePrivy();

  if (!ready) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center text-2xl">Loading...</p>
      </div>
    );
  }

  if (!authenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <Button
          size="lg"
          onClick={login}
        >
          Continue with Google
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        <span>Logged in as {user.email?.address || user.wallet?.address || "User"}</span>
      </p>

      <div className="flex flex-col items-center gap-2">
        {user.email?.address && (
          <p className="text-sm text-muted-foreground">
            Email: {user.email.address}
          </p>
        )}
        {user.wallet?.address && (
          <p className="text-sm text-muted-foreground">
            Wallet: {user.wallet.address.slice(0, 6)}...{user.wallet.address.slice(-4)}
          </p>
        )}
      </div>

      <Button
        size="lg"
        onClick={logout}
      >
        Sign out
      </Button>
    </div>
  );
}
