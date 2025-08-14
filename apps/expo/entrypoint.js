// entrypoint.js

// Crypto polyfill must be loaded before any other imports
if (typeof global.crypto === 'undefined') {
  global.crypto = {
    randomUUID: () => {
      return Math.random().toString(36).substring(2) + Date.now().toString(36);
    },
    getRandomValues: (array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    },
    subtle: {
      // Add minimal subtle crypto methods if needed
      digest: async (algorithm, data) => {
        // Simple hash implementation for compatibility
        return new ArrayBuffer(32);
      }
    }
  };
}

// Also ensure process is available for Node.js compatibility
if (typeof global.process === 'undefined') {
  global.process = {
    env: {},
    browser: false,
    version: '',
    versions: {}
  };
}

// Import required polyfills first
// IMPORTANT: These polyfills must be installed in this order
import "react-native-get-random-values";
import "@ethersproject/shims";
import { Buffer } from "buffer";
global.Buffer = Buffer;

// Then import the expo router
import "expo-router/entry";
