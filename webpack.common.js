const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const package = require('./package.json');
const process = require('process');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pkgDir  = require('pkg-dir');
const urlJoin = require('join-path');

const baseDir = pkgDir.sync();
console.log('Base directory is', baseDir);

const appDist = path.resolve(baseDir, './public');
const nodeModulesDir = path.resolve(__dirname, './node_modules');
const PROD = process.env.NODE_ENV === 'production';

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
      'style.scss': path.join(__dirname, 'src/style.scss'),
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
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: path.join(nodeModulesDir, 'awesome-typescript-loader'),
        options: {
          configFileName: path.join(__dirname, 'atl-tsconfig.json')
        }
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: path.join(nodeModulesDir, 'source-map-loader')
      },
      {
        test: /\.(c|sc|sa)ss$/,
        use: [
          PROD ? MiniCssExtractPlugin.loader : path.join(nodeModulesDir, 'style-loader'),
          path.join(nodeModulesDir, 'css-loader'),
          {
            loader: path.join(nodeModulesDir, 'postcss-loader'),
            options: {
              path: __dirname
            }
          },
          path.join(nodeModulesDir, 'sass-loader')
        ]
      },
      {
        test: /\.(png|svg|woff|woff2)$/,
        use: {
          loader:
           path.join(nodeModulesDir, 'url-loader'),
          options: { limit: 100000 } },
      } /* ,
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
      generateStatsFile: true,
      analyzerMode: 'static',
      analyzerPort: 7766
    })
  );
}
