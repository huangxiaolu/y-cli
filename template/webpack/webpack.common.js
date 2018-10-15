const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// output setup
const { dist } = require("../build/path");
// css setup
const { use: cssLoader, test } = require("./loader/cssloader.json");
// js setup
const {
  use: jsLoader,
  test: scriptTest,
  exclude,
  ext
} = require("./loader/jsloader.json");
// init webpack test field
const cssTest = new RegExp(test);
const jsTest = new RegExp(scriptTest);
const excludeReg = new RegExp(exclude);

module.exports = {
  entry: {
    app: path.resolve(__dirname, `../src/index.${ext}`)
  },
  output: {
    path: dist,
    filename: "[name].[hash:7].js"
  },
  resolve: {
    extensions: [
      ".ts",
      ".tsx",
      ".wasm",
      ".mjs",
      ".js",
      ".jsx",
      ".json",
      ".less",
      ".css",
      ".scss",
      ".styl"
    ]
  },
  module: {
    rules: [
      {
        test: jsTest,
        exclude: excludeReg,
        use: jsLoader
      },
      {
        test: cssTest,
        use: [
          process.env.NODE_ENV === "development"
            ? "style-loader"
            : MiniCssExtractPlugin.loader,
          "css-loader",
          cssLoader
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              name: "/img/[name].[hash:7].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "/media/[name].[hash:7].[ext]"
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "/fonts/[name].[hash:7].[ext]"
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(["dist"], {
      root: path.resolve(__dirname, "..")
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../index.html"),
      filename: path.join(dist, "index.html")
    })
  ]
};
