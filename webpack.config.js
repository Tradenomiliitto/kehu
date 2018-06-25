const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "production",
  entry: {
    main: path.resolve(__dirname, "assets", "js", "index.js"),
    bootstrap: path.resolve(__dirname, "assets", "js", "bootstrap.js")
  },
  devtool: "source-map",
  output: {
    libraryTarget: "umd",
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "public"),
    globalObject: "this"
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};
