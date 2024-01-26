const path = require("path");

module.exports = {
  entry: "./game.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  // Add any necessary loaders and plugins here
};
