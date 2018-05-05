const path = require("path");
const merge = require("webpack-merge");

const common = {
  mode: "development",
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    path: path.resolve(__dirname, "lib")
  }
};

const serverConfig = merge(common, {
  target: "node",
  node: {
    __filename: true,
    __dirname: true
  },
  output: {
    filename: "index.js",
    libraryTarget: "commonjs2"
  }
});

const clientConfig = merge(common, {
  output: {
    filename: "client.js"
  }
});

module.exports = [serverConfig, clientConfig];
