import { ServerConfig } from '../typings/configs';
import {
  HandlerCreators,
  HandlerCreator,
  HandlerObject,
  InitialisedHandlers
} from '../typings/handlers';

import * as process from 'process';
import * as express from 'express';
import * as http from 'http';
import * as socketio from 'socket.io';
import * as path from 'path';
import * as util from 'util';
import * as fs from 'fs';
import * as url from 'url';
import * as promisify from 'es6-promisify';
import * as commandLineArguments from 'command-line-args';
import * as urlJoin from 'join-path';

import * as webpackConfig from './webpack.common';

require('node-require-alias').setAlias({
  Config: webpackConfig.resolve.alias.Config$,
  ServerConfig: webpackConfig.resolve.alias.ServerConfig$,
  '~': '..'
});

import baseContentHandlers from './lib/contentHandlers';

import defaultGlobalConfig from './lib/defaults/config.global';
import defaultServerConfig from './lib/defaults/config.server';

const access = (util.promisify || promisify)(fs.access);

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const availableArguments = [
  { name: 'address', alias: 'a', env: 'ADDRESS', type: String },
  { name: 'port', alias: 'p', env: 'PORT', type: String },
  { name: 'source', env: 'SOURCE', type: String },
  { name: 'staticAssests', env: 'STATIC_ASSESTS', type: String },
  { name: 'draftRegex', env: 'DRAFT_REGEX', type: String }
];

const defaultConfig: ServerConfig = {
  ...defaultGlobalConfig,
  ...defaultServerConfig
};

let config: ServerConfig = {
  ...defaultConfig
};

const globalConfig = './config.global.js';
const serverConfig = './config.server.js';

// Pull in config from environment variables
availableArguments.forEach((argument) => {
  if (argument.env && typeof process.env[argument.env] !== 'undefined') {
    try {
      const value: any = argument.type(process.env[argument.env]);

      if (typeof value === 'number') {
        if (isNaN(value)) {
          throw new TypeError(`Value for ${argument.env} is not a number`);
        }
      }

      config[argument.name] = value;
    } catch (error) {
      console.log(`Value for ${argument.env} ignored: ${error.message}`);
    }
  }
});

// Pull in config from command line arguments
config = Object.assign(config, commandLineArguments(availableArguments));

Promise.all([globalConfig, serverConfig].map((file) => file && access(file, 'r').then(
    () => {
      let content = require(file);
      if (typeof content === 'object') {
        if (typeof content.default !== 'undefined') {
          content = content.default;

          if (typeof content !== 'object') {
            console.error(`Default value in ${file} not an Object`);
            return;
          }
        }

        config = Object.assign(config, content);
        return;
      }

      console.error(`Value in ${file} not an Object`);
    },
    (err) => (err.code === 'ENOENT' ? undefined : err))))
.then(() => {
  // TODO Check validaty of config?
  if (!config.draftRegex) {
    config.draftRegex = defaultConfig.draftRegex;
  }

  // Create complete content handlers
  const contentHandlers: HandlerCreators = Object.assign({}, baseContentHandlers, config.handlers);

  let handlers: InitialisedHandlers = {
    content: null
  }

  let promises = [];

  // Run content handler inits if defined
  Object.keys(contentHandlers).forEach((id) => {
    const value = contentHandlers[id](config);

    if (value instanceof Promise) {
      promises.push(value.then((handler) => {
        handlers[id] = handler;
      }));
    } else {
      handlers[id] = value;
    }
  });

  return Promise.all(promises).then(() => handlers);
}).then((handlers) => {
  // Ensure there is a content contentHandler
  if (typeof handlers.content !== 'object') {
    return Promise.reject(new Error('No content handler for main content'));
  }

  const content = handlers.content;

  // Change the socket path
  if (config.socketPath) {
    console.log('changing socket path to', config.socketPath);
    io.path(config.socketPath);
  }

  // Set up app file serving
  let devMiddleware,
      webpackDevMiddleware;

  if (process.env.NODE_ENV === 'production') {
    app.use(config.baseUri, express.static(webpackConfig.output.path));
  } else {
    console.log('Using Webpack dev middleware for realtime development');
    // Dev imports
    const webpack = require('webpack');
    webpackDevMiddleware = require( 'webpack-dev-middleware');
    const webpackDevConfig = require('./webpack.dev');
    const compiler = webpack(webpackDevConfig);

    devMiddleware = webpackDevMiddleware(compiler, {
    });

    // Attach webpack middlewares
    app.use(config.baseUri, devMiddleware);
  }

  // Set up static asset server
  if (config.staticAssets) {
    // Check folder exists
    app.use(urlJoin(`${config.baseUri}/`, config.staticUri),
        express.static(config.staticAssets));
  }

  // Set up catch all for content
  if (process.env.NODE_ENV === 'production') {
    app.get(path.join(config.baseUri, '*'), (req, res, next) => {
      res.sendFile(path.join(webpackConfig.output.path, 'index.html'));
    });
  } else {
    // Attach to * for HistoryAPI
    app.get(path.join(config.baseUri, '*'), (req, res) => {
      const index = devMiddleware.fileSystem.readFileSync(path.join(webpackConfig.output.path, 'index.html'));

      res.end(index);
    });
  }

  // Attach the web socket
  io.on('connection', (socket) => {
    // Attach the content handlers
    Object.keys(handlers).forEach((id) => {
      const handler = handlers[id];
      if (handler.events) {
        Object.keys(handler.events).forEach((event) => {
          socket.on(event, (...data) => handler.events[event](socket, ...data));
        });
      }
    });
  });

  // Listen
  server.listen(config.port);
  console.log(`Marss listening on port ${config.port}`);
}).catch((error) => {
  console.error('caught error', error.message);
  if (process.env.NODE_ENV !== 'production') {
    console.error(error);
  }

  process.exit(1);
});
