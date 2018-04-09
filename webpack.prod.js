const webpack = require('webpack');
const common = require('./webpack.common');
const merge = require('webpack-merge');
const path = require('path');
const package = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('./config.global') || {};

module.exports = merge(common, {
  entry: {
    app: path.join(__dirname, './app/index.js'),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
});
