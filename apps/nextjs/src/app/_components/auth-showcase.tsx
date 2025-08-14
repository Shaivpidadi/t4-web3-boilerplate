"use client";

import { useState } from "react";
import { Button } from "@acme/ui/button";

export function AuthShowcase() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: "user@example.com",
    walletAddress: "0x1234...5678",
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <Button
          size="lg"
          onClick={handleLogin}
        >
          Continue with Google (Mock)
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        <span>Logged in as {userInfo.email}</span>
      </p>

      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-muted-foreground">
          Email: {userInfo.email}
        </p>
        <p className="text-sm text-muted-foreground">
          Wallet: {userInfo.walletAddress}
        </p>
      </div>

      <Button
        size="lg"
        onClick={handleLogout}
      >
        Sign out
      </Button>
    </div>
  );
}
