const { getDefaultConfig } = require('metro-config');
const path = require('path');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts }
  } = await getDefaultConfig();

  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
    resolver: {
      assetExts: [...assetExts, 'png', 'jpg', 'jpeg'], // Add any other asset extensions you need here
      sourceExts: [...sourceExts, 'js', 'jsx', 'ts', 'tsx'], // Include TypeScript extensions if you're using TypeScript
      extraNodeModules: {
        // Manually add the paths to your assets
        'assets/images/signIn-signUp': path.resolve(__dirname, 'assets/images/signIn-signUp'),
      },
        resolveRequest: (context, realModuleName, platform, moduleName) => {
            return null; 
            },
    },
  };
})();