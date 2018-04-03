const common = require('./webpack.common');
const merge = require('webpack-merge');
const webpack = require('webpack');
const package = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('./config.global') || {};

module.exports = merge(common, {
  entry: {
    app: ['./src/app/index.tsx']
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.tsx', '.ts']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      },
    ]
  }
});
