const webpack = require('webpack');
const common = require('./webpack.common');
const merge = require('webpack-merge');
const path = require('path');
const package = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

const config = require('./config.global') || {};

const nodeModulesDir = path.resolve(__dirname, './node_modules');

let cssPath = path.resolve('style.scss');
console.log('looking for style.css at', cssPath);
try {
  fs.accessSync(cssPath, fs.constants.R_OK);
} catch (error) {
  console.log('Could not find, so using inbuilt style');
  cssPath = path.join(__dirname, 'src/style.scss');
}

module.exports = merge(common, {
  mode: 'production',
  entry: {
    app: path.join(__dirname, 'src/app/index.tsx'),
  },
  resolve: {
    alias: {
      'style.scss': cssPath
    }
  },
  optimization: {
    minimize: true
  }
});
