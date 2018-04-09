const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const package = require('./package.json');
const process = require('process');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pkgDir  = require('pkg-dir');
const urlJoin = require('join-path');

const baseDir = pkgDir.sync();

const appDist = path.resolve(baseDir, './public');

// Check if the config file exists in the current project directory, if not
// use the one in the marss directory
let configFile;

try {
  configFile = path.resolve(baseDir, './config.global.js');
  fs.accessSync(configFile, fs.constants.R_OK);
} catch(err) {
  configFile = path.resolve(__dirname, 'config.global.js');
}

const config = require(configFile);

module.exports = {
  output: {
    path: appDist,
    publicPath: urlJoin('/', config.baseUri),
    libraryTarget: 'umd',
    filename: '[name].js'
  },
  target: "web",
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', '.scss', '.sass', '.css'],
    alias: {
      'font-awesome': 'node_modules/font-awesome',
      'Config$': process.env.CONFIG || configFile,
      'ServerConfig$': process.env.SERVER_CONFIG || path.resolve(baseDir, './config.server.js'),
    }
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new HtmlWebpackPlugin({
      title: config.title || package.name,
      template: path.join(__dirname, 'src/app/index.ejs'),
      chunksSortMode: 'dependency'
    }),
    new ExtractTextPlugin('style.css')
  ],
  module: {
    rules: [
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

if (process.env.NODE_ENV !== 'production') {
  module.exports.plugins.push(
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerPort: 7766
    })
  );
}
