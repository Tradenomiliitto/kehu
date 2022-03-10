const path = require("path");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

// Include env vars from system (required for Heroku deployment)
const dotenv = new Dotenv({ systemvars: true });

// Use hotreload plugin?
const HOTRELOAD = process.env.WEBPACK_HOT_RELOAD;
// eslint-disable-next-line no-console
if (HOTRELOAD) console.log("Using Webpack hot reload");

module.exports = {
  mode: "development",
  entry: {
    main: [
      ...(HOTRELOAD
        ? ["webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000"]
        : []),
      path.resolve(__dirname, "client", "index.js"),
    ],
    public: path.resolve(__dirname, "client", "public.js"),
  },
  devtool: "source-map",
  output: {
    libraryTarget: "umd",
    filename: "[name].js",
    chunkFilename: "chunk-[id].js",
    path: path.resolve(__dirname, "public"),
    globalObject: "this",
    ...(HOTRELOAD
      ? {
          hotUpdateChunkFilename: ".hot/[id].[fullhash].hot-update.js",
          hotUpdateMainFilename: ".hot/[runtime].[fullhash].hot-update.json",
        }
      : {}),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve("babel-loader"),
            options: {
              // Load react-refresh/babel plugin here instead of
              // babel.config.json to load it only when hotreload is enabled
              plugins: HOTRELOAD
                ? [require.resolve("react-refresh/babel")]
                : [],
            },
          },
        ],
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
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    dotenv,
    ...(HOTRELOAD
      ? [
          new webpack.HotModuleReplacementPlugin(),
          new ReactRefreshWebpackPlugin(),
        ]
      : []),
  ],
};
