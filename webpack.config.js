const path = require("path");

const serverConfig = {
  target: "node",
  entry: "./src/index.ts",
  devtool: "inline-source-map",
  mode: "development",
  node: {
    __filename: true,
    __dirname: true
  },
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
    filename: "index.js",
    path: path.resolve(__dirname, "lib"),
    libraryTarget: "commonjs2"
  }
};

const clientConfig = {
  target: "web",
  entry: "./src/index.ts",
  devtool: "inline-source-map",
  mode: "development",
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
    filename: "client.js",
    path: path.resolve(__dirname, "lib")
  }
};

module.exports = [serverConfig, clientConfig];
