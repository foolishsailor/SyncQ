const path = require("path");

module.exports = ["source-map"].map((devtool) => ({
  entry: "./src/index",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "syncQ.js",
    library: "syncQ",
    libraryTarget: "umd",
  },
  devtool: "source-map",
}));
