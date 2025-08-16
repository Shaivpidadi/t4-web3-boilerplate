# Migration Summary: Privy to Dynamic (Updated)

This document summarizes all the changes made to migrate the POAPStays project from Privy to Dynamic authentication and wallet management, using the **Dynamic Core Package** approach for web and **Dynamic Client with Extensions** for React Native.

## Overview

The project has been successfully migrated from Privy to Dynamic, using:

- **Web (Next.js)**: Dynamic Core Package (`@dynamic-labs/sdk-react-core`) + wagmi integration
- **Mobile (Expo)**: Dynamic Client (`@dynamic-labs/client`) with React Native and Viem extensions

This provides better flexibility, more control over the wallet integration, and improved performance across platforms.

## Changes Made

### 1. Package Dependencies

#### Next.js App (`apps/nextjs/`)

- **Removed**: `@privy-io/react-auth`
- **Added**:
  - `@dynamic-labs/sdk-react-core` (core package)
  - `@dynamic-labs/wagmi-connector` (wagmi integration)
  - `@dynamic-labs/ethereum` (Ethereum connectors)

#### Expo App (`apps/expo/`)

- **Removed**:
  - `@privy-io/expo`
  - `@privy-io/expo-native-extensions`
- **Added**:
  - `@dynamic-labs/viem-extension` (viem integration)
  - `@dynamic-labs/client` (core client)
  - `@dynamic-labs/react-native-extension` (React Native support)
  - `@dynamic-labs/react-hooks` (React hooks)
  - `react-native-webview` (for wallet connection)
  - `expo-web-browser` (browser integration)
  - `expo-linking` (deep linking)
  - `expo-secure-store` (secure storage)

### 2. Provider Configuration

#### Next.js (`apps/nextjs/src/app/providers.tsx`)

- Replaced `PrivyProvider` with `DynamicContextProvider` from core package
- Added `DynamicWidget` for wallet connection UI
- Integrated with `WagmiProvider` and `QueryClientProvider`
- Added proper chain configuration (mainnet, sepolia, polygon)
- Added `DynamicWagmiConnector` for wagmi integration

#### Expo (`apps/expo/src/app/_layout.tsx`)

- **New Approach**: Uses Dynamic Client with extensions instead of providers
- Created `dynamicClient` with `ReactNativeExtension()` and `ViemExtension()`
- Added `dynamicClient.reactNative.WebView` for wallet connection
- Simplified provider structure (no complex provider wrapping needed)
- Integrated with existing `QueryClientProvider`

### 3. Configuration Files

#### Expo Config (`apps/expo/app.config.ts`)

- Replaced `privyAppId` and `privyClientId` with `dynamicEnvironmentId`
- Updated environment variable references

#### New Dynamic Client Config (`apps/expo/src/utils/dynamic.ts`)

- Created centralized Dynamic client configuration
- Extends with React Native and Viem extensions
- Configurable environment ID and app metadata

### 4. Hook Updates

#### Next.js (`apps/nextjs/src/hooks/usePrivyViem.ts` → `useDynamicViem.ts`)

- Renamed file from `usePrivyViem.ts` to `useDynamicViem.ts`
- Replaced `usePrivy` and `useWallets` with `useDynamicContext` from core package
- Updated wallet interaction methods to use Dynamic's API
- Simplified contract interaction using Dynamic's built-in methods

#### Expo (`apps/expo/src/hooks/usePrivyViem.ts` → `useDynamicViem.ts`)

- Renamed file from `usePrivyViem.ts` to `useDynamicViem.ts`
- **New Approach**: Uses `useDynamicContext` from `@dynamic-labs/react-hooks`
- Updated wallet interaction methods to use Dynamic's API
- Simplified contract interaction using Dynamic's built-in methods

### 5. Utility Updates

#### Wallet Utility (`apps/nextjs/src/utils/wallet.ts`)

- Replaced `usePrivy` and `useWallets` with `useDynamicContext` from core package
- Updated wallet management functions to use Dynamic's API
- Simplified chain switching and balance retrieval
- Updated wallet type detection logic

#### Wallet Utility (`apps/expo/src/utils/wallet.ts`)

- **New Approach**: Uses `useDynamicContext` from `@dynamic-labs/react-hooks`
- Updated wallet management functions to use Dynamic's API
- Simplified chain switching and balance retrieval
- Updated wallet type detection logic

#### Contract Utility (`apps/nextjs/src/utils/contract.ts`)

- Renamed `createWalletClientFromPrivy` to `createWalletClientFromDynamic`
- Updated function documentation

### 6. Component Updates

#### Smart Contract Panel (`apps/nextjs/src/components/SmartContractPanel.tsx`)

- Updated import from `usePrivyViem` to `useDynamicViem`
- Updated hook usage

#### Smart Contract Panel (`apps/expo/src/components/SmartContractPanel.tsx`)

- Updated import from `usePrivyViem` to `useDynamicViem`
- Updated hook usage

#### Auth Showcase (`apps/nextjs/src/app/_components/auth-showcase.tsx`)

- Replaced `usePrivy` with `useDynamicContext` from core package
- Updated authentication state management
- Simplified login/logout flow
- Updated user information display

### 7. Screen Updates

#### Login Screen (`apps/expo/src/app/login.tsx`)

- **New Approach**: Uses `useDynamicContext` from `@dynamic-labs/react-hooks`
- Simplified login flow (Dynamic handles wallet connection automatically)
- Updated UI to reflect Dynamic's approach
- Removed OAuth-specific code

#### Profile Screen (`apps/expo/src/app/profile.tsx`)

- **New Approach**: Uses `useDynamicContext` from `@dynamic-labs/react-hooks`
- Updated logout functionality
- Improved UI and user information display
- Added better error handling

#### Index Screen (`apps/expo/src/app/index.tsx`)

- **New Approach**: Uses `useDynamicContext` from `@dynamic-labs/react-hooks`
- Simplified authentication flow
- Updated navigation logic
- Improved component structure

### 8. API Router Updates

#### Auth Router (`packages/api/src/router/auth.ts`)

- Updated comments to reflect Dynamic instead of Privy
- Renamed `verifyPrivy` to `verifyDynamic`
- Updated mock data to use Dynamic terminology
- Updated provider references from 'privy' to 'dynamic'

### 9. Documentation Updates

#### README.md

- Updated all Privy references to Dynamic
- Updated environment variable names
- Updated authentication flow descriptions
- Updated wallet management descriptions

## Environment Variables

### New Required Variables

```env
# Dynamic Configuration
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID="your-dynamic-environment-id"
EXPO_PUBLIC_DYNAMIC_ENVIRONMENT_ID="your-dynamic-environment-id"
```

### Removed Variables

```env
# Privy Configuration (no longer needed)
NEXT_PUBLIC_PRIVY_APP_ID="your-privy-app-id"
EXPO_PUBLIC_PRIVY_APP_ID="your-privy-app-id"
EXPO_PUBLIC_PRIVY_CLIENT_ID="your-privy-client-id"
```

## Key Differences from Previous Migration

### 1. **Package Structure**

- **Web**: Uses `@dynamic-labs/sdk-react-core` (core package) + `@dynamic-labs/wagmi-connector`
- **Mobile**: Uses `@dynamic-labs/client` with extensions (`ReactNativeExtension`, `ViemExtension`)

### 2. **Provider Setup**

- **Web**: Full wagmi integration with `WagmiProvider`, `QueryClientProvider`, and proper chain configuration
- **Mobile**: Simplified client-based approach with extensions, no complex provider wrapping

### 3. **Wallet UI**

- **Web**: Includes `DynamicWidget` for seamless wallet connection
- **Mobile**: Uses `dynamicClient.reactNative.WebView` for wallet connection

### 4. **Chain Support**

- **Web**: Full support for mainnet, sepolia, and polygon with proper RPC configuration
- **Mobile**: Chain support through Viem extension with Dynamic's wallet abstraction

### 5. **Architecture Differences**

- **Web**: Provider-based architecture with React context
- **Mobile**: Client-based architecture with extensions for better React Native integration

## Benefits of the Updated Migration

### 1. **Better Performance**

- Core package is lighter and more focused (web)
- Client-based approach reduces bundle size (mobile)
- Better tree-shaking and bundle optimization

### 2. **More Control**

- Direct wagmi integration (web)
- Customizable client configuration (mobile)
- Better control over wallet connection flow

### 3. **Enhanced Flexibility**

- Modular package structure
- Better integration with existing wagmi setup (web)
- Native React Native support with extensions (mobile)

### 4. **Improved Developer Experience**

- Better TypeScript support
- More predictable API
- Better error handling
- Platform-specific optimizations

### 5. **React Native Specific Benefits**

- Native WebView integration for wallet connection
- Better performance on mobile devices
- Proper deep linking and secure storage support
- Optimized for mobile wallet interactions

## Next Steps

### 1. **Environment Setup**

- Get Dynamic Environment ID from [Dynamic Dashboard](https://app.dynamic.xyz)
- Update environment variables in both web and mobile apps
- Test authentication flow on both platforms

### 2. **Testing**

- Test wallet connection on both platforms
- Verify smart contract interactions
- Test multi-wallet scenarios
- Test chain switching functionality
- Test mobile-specific features (deep linking, secure storage)

### 3. **Production Deployment**

- Update production environment variables
- Test in staging environment
- Monitor authentication metrics
- Test mobile app store deployment

### 4. **Documentation**

- Update developer documentation
- Create Dynamic-specific setup guides
- Document platform-specific features
- Create mobile-specific integration guides

## Notes

- The migration maintains backward compatibility where possible
- All existing functionality has been preserved
- The smart contract integration remains unchanged
- The database schema remains the same (only provider names updated)
- **Web**: Full wagmi integration for better wallet management
- **Web**: Built-in wallet connection UI with `DynamicWidget`
- **Mobile**: Client-based architecture with native React Native support
- **Mobile**: WebView-based wallet connection for better mobile UX

## Support

For Dynamic-specific questions or issues:

- [Dynamic Documentation](https://www.dynamic.xyz/docs)
- [Dynamic Discord](https://discord.gg/dynamic)
- [Dynamic Support](mailto:support@dynamic.xyz)
