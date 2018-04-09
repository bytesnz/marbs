#!/usr/bin/env node

process.env.NODE_ENV = 'production';

const webpackConfig = require('../webpack.prod');
require('node-require-alias').setAlias({
  Config: webpackConfig.resolve.alias.Config$,
  ServerConfig: webpackConfig.resolve.alias.ServerConfig$,
  '~': '..'
});
const package = require('~/package.json');

console.log(`MARSS v${package.version}`);

switch (process.argv[2]) {
  case 'build':
    const webpack = require('webpack');
    webpack(webpackConfig, (err, stats) => {
      if (err || stats.hasErrors()) {
        if (err) {
          console.error('Build Error:', err);
        } else {
          console.error(stats.toString({
            color: true
          }));
        }
      } else {
        console.log('Build done');
      }
    });
    break;
  case 'start':
    process.argv.splice(2, 1);
    require('../index');
    break;
  default:
    console.error('Unknown command');
    console.log('Usage: marss (build|start)');
    console.log('  build - Builds the client app (required every time the global config');
    console.log('          is changed');
    console.log('  start - Runs the MARSS server');
    process.exit(1);
}
