const path = require("path");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

// Include env vars from system (required for Heroku deployment)
const dotenv = new Dotenv({ systemvars: true });

module.exports = {
  mode: "production",
  entry: {
    main: path.resolve(__dirname, "client", "index.js"),
    public: path.resolve(__dirname, "client", "public.js"),
  },
  devtool: "source-map",
  output: {
    libraryTarget: "umd",
    filename: "[name].js",
    chunkFilename: "chunk-[id].js",
    path: path.resolve(__dirname, "public"),
    globalObject: "this",
  },
  optimization: {
    minimizer: [new TerserPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "resolve-url-loader",
            options: { root: path.resolve(__dirname, "public") },
          },
          "sass-loader",
        ],
      },
      {
        // Images are not imported in React app but provided as strings so we
        // cannot include then in Webpack bundle
        test: /\.(ttf|eot|svg|otf|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        type: "asset/resource",
        generator: {
          filename: "images/[name][ext]",
          emit: false,
        },
      },
    ],
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /fi/),
    dotenv,
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
};
