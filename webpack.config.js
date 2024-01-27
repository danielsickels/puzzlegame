const path = require("path");

module.exports = {
  entry: "./scenes/game.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "development",
  devtool: "source-map", // Add this line to enable source maps
  // Add any necessary loaders and plugins here
};
