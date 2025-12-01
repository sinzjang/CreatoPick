/**
 * Expo App Configuration
 * Handles environment variables and app settings
 */

import 'dotenv/config';

export default {
  name: "CreatoPick",
  slug: "creatopick",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "light",
  plugins: [
    "expo-font"
  ],
  splash: {
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    bundleIdentifier: "com.sinzjang.creatopick",
    supportsTablet: true
  },
  android: {
    package: "com.sinzjang.creatopick",
    softwareKeyboardLayoutMode: "pan",
    navigationBar: {
      visible: "immersive",
      barStyle: "light-content",
      backgroundColor: "#fbf5f0"
    }
  },
  web: {},
  // Environment variables for production
  extra: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    eas: {
      projectId: "96020900-189c-4a4b-8fa8-77c6a1914617"
    }
  }
};
