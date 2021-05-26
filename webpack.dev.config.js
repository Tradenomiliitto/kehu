const path = require("path");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// Include env vars from system (required for Heroku deployment)
const dotenv = new Dotenv({ systemvars: true });

module.exports = {
  mode: "development",
  entry: {
    main: [
      "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
      path.resolve(__dirname, "client", "index.js")
    ],
    public: path.resolve(__dirname, "client", "public.js")
  },
  devtool: "source-map",
  output: {
    libraryTarget: "umd",
    filename: "[name].js",
    chunkFilename: "chunk-[id].js",
    path: path.resolve(__dirname, "public"),
    globalObject: "this",
    hotUpdateChunkFilename: ".hot/[id].[fullhash].hot-update.js",
    hotUpdateMainFilename: ".hot/[runtime].[fullhash].hot-update.json"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "resolve-url-loader",
            options: { root: path.resolve(__dirname, "public") }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          mimetype: "application/font-woff"
        }
      },
      {
        // Images are not imported in React app but provided as strings so we
        // cannot include then in Webpack bundle
        test: /\.(ttf|eot|svg|otf|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader",
        options: {
          name: "/images/[name].[ext]",
          emitFile: false
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    dotenv,
    new webpack.HotModuleReplacementPlugin()
  ]
};
