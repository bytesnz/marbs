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
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: config.title || package.name,
      template: 'src/app/index.ejs',
      chunksSortMode: 'dependency'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
});
