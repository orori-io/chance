const webpack = require("webpack");
const path = require("path");
const env = require("yargs").argv.env; // use --env with webpack 2
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const pkg = require("./package.json");

let packageName = pkg.name;
let libraryName = pkg.lib;
let mainFile = pkg.main;
let plugins = [],
  outputFile;

if (env === "build") {
  plugins.push(
    new UglifyJsPlugin({
      sourceMap: true,
      uglifyOptions: {
        ecma: 8,
        compress: {
          warnings: false
        }
      }
    })
  );
  outputFile = packageName + ".min.js";
} else {
  outputFile = packageName + ".js";
}

const config = {
  entry: __dirname + mainFile,
  devtool: "source-map",
  output: {
    path: __dirname + "/dist",
    filename: outputFile,
    libraryTarget: "umd",
    libraryExport: "default",
    library: libraryName
  },
  externals: {},
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: [path.resolve("./node_modules"), path.resolve("./src")],
    extensions: [".json", ".js"]
  },
  plugins: plugins
};

module.exports = config;
