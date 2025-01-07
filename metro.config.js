// const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
// const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');
// const { withNativeWind } = require("nativewind/metro");
// /**
//  * Metro configuration
//  * https://reactnative.dev/docs/metro
//  *
//  * @type {import('metro-config').MetroConfig}
//  */
// const config = {
//   resetCache: true,
// };

// module.exports = wrapWithReanimatedMetroConfig(
//   mergeConfig(getDefaultConfig(__dirname), config)
// );
// module.exports = withNativeWind(config, { input: "./global.css" });

const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = mergeConfig(getDefaultConfig(__dirname), {
  resetCache:true,
});

module.exports = withNativeWind(config, { input: "./global.css" });
