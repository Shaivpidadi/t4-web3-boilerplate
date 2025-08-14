// Learn more: https://docs.expo.dev/guides/monorepos/
const { getDefaultConfig } = require("expo/metro-config");
const { FileStore } = require("metro-cache");
const { withNativeWind } = require("nativewind/metro");

const path = require("node:path");

const config = withTurborepoManagedCache(
  withNativeWind(getDefaultConfig(__dirname), {
    input: "./src/styles.css",
    configPath: "./tailwind.config.ts",
    resolver: {
      alias: {
        // Handle @noble/hashes crypto.js import issue
        '@noble/hashes/crypto': '@noble/hashes',
        '@noble/hashes/crypto.js': '@noble/hashes',
      },
      // Handle Node.js modules that don't have proper exports
      unstable_enableSymlinks: false,
    },
    server: {
      // Improve simulator connectivity
      port: 8081,
      enhanceMiddleware: (middleware, server) => {
        // Add CORS headers for simulator
        return (req, res, next) => {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
          return middleware(req, res, next);
        };
      },
    },
  }),
);

// Package exports in `jose` are incorrect, so we need to force the browser version
const resolveRequestWithPackageExports = (context, moduleName, platform) => {
  if (moduleName === "jose") {
    const ctx = {
      ...context,
      unstable_conditionNames: ["browser"],
    };
    return ctx.resolveRequest(ctx, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

config.resolver.resolveRequest = resolveRequestWithPackageExports;

module.exports = config;

/**
 * Move the Metro cache to the `.cache/metro` folder.
 * If you have any environment variables, you can configure Turborepo to invalidate it when needed.
 *
 * @see https://turborepo.com/docs/reference/configuration#env
 * @param {import('expo/metro-config').MetroConfig} config
 * @returns {import('expo/metro-config').MetroConfig}
 */
function withTurborepoManagedCache(config) {
  config.cacheStores = [
    new FileStore({ root: path.join(__dirname, ".cache/metro") }),
  ];
  return config;
}
