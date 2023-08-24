const path = require("path");

module.exports = {
  // Other Webpack configuration options...

  resolve: {
    fallback: {
      buffer: require.resolve("buffer/"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      util: require.resolve("util/"),
      // Add other fallbacks as needed
    },
  },

  // Other Webpack configuration options...
};
