const webpack = require('webpack');
const path = require('path');
const package = require('./package.json');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const config = require('./config.global') || {};
const appDist = path.resolve(__dirname, './public');
const urlJoin = require('join-path');
module.exports = {
  output: {
    path: appDist,
    publicPath: urlJoin('/', config.baseUri),
    libraryTarget: 'umd',
    filename: '[name].js'
  },
  target: "web",
  devtool: 'source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', '.scss', '.sass', '.css']
  },
  plugins: [
    new ExtractTextPlugin('style.css'),
    new BundleAnalyzerPlugin({
      openAnalyzer: false
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'ify-loader'
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'source-map-loader'
      },
      {
        test: /\.(css|scss|sass)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'sass-loader']
        }) /*,
        options: {
          plugins: function() {
          return [autoprefixer, precss];
          }
        }*/
      },
      {
        test: /\.(png|svg|woff|woff2)$/,
        use: { loader: 'url-loader', options: { limit: 100000 } },
      } /*,
      {
        svg-loader
      }*/
    ]
  }
};
