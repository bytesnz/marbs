const webpack = require('webpack');
const common = require('./webpack.common');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const package = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('./config.global') || {};

module.exports = merge(common, {
  entry: {
    app: './app/index.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: config.title || package.name,
      template: 'app/index.ejs',
      chunksSortMode: 'dependency'
    }),
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
});
