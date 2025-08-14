import * as SecureStore from "expo-secure-store";

import { getBaseUrl } from "./base-url";

console.log("getBaseUrl", getBaseUrl());

// Simple auth client that can be extended with React Native compatible auth
export const authClient = {
  getCookie: () => {
    // Implement cookie handling for your chosen auth solution
    // For now, return null to avoid errors
    return null;
  },
  
  // Add other auth methods as needed
  isAuthenticated: () => {
    // Check authentication status
    return false;
  },
  
  getUser: () => {
    // Get current user
    return null;
  }
};
