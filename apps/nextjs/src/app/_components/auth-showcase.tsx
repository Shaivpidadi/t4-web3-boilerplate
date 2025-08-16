"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

import { Button } from "@acme/ui/button";

export function AuthShowcase() {
  const { handleLogOut, user, isLoggedIn } = useDynamicContext();

  if (!isLoggedIn || !user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center text-2xl">
          Please connect your wallet to continue
        </p>
        <p className="text-center text-sm text-muted-foreground">
          Dynamic will handle the wallet connection flow
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        <span>Logged in as {user.email || user.address || "User"}</span>
      </p>

      <div className="flex flex-col items-center gap-2">
        {user.email && (
          <p className="text-sm text-muted-foreground">Email: {user.email}</p>
        )}
        {user.address && (
          <p className="text-sm text-muted-foreground">
            Wallet: {user.address.slice(0, 6)}...
            {user.address.slice(-4)}
          </p>
        )}
      </div>

      <Button size="lg" onClick={handleLogOut}>
        Sign out
      </Button>
    </div>
  );
}
