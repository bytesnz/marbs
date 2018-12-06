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
import { renderToString } from 'react-dom/server';
import * as React from 'react';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import * as webpackConfig from './webpack.common';

require('node-require-alias').setAlias({
  Config: webpackConfig.resolve.alias.Config$,
  ServerConfig: webpackConfig.resolve.alias.ServerConfig$,
  '~': '..'
});

import { createMarss, Provider as MarssContext } from './lib/client/marss';
import { Manager, Provider as LoaderProvider } from './components/loader';

import App from './app/app';

import baseContentHandlers from './lib/handlers';

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

const globalConfig = path.resolve('./config.global.js');
const serverConfig = path.resolve('./config.server.js');

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

  console.log('config is', config);
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
}).then(async (handlers) => {
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

  // Set up handler paths
  Object.values(handlers).forEach((handler) => {
    if (handler.paths) {
      Object.entries(handler.paths).forEach(([method, paths]) => {
        Object.entries(paths).forEach(([path, handlerFunction]) => {
          const uri = (config.handlerUris && config.handlerUris[path]) || path;

          app[method](urlJoin(config.baseUri || '/', uri), handlerFunction);
        });
      });
    }
  });

  // Set up catch all for content
  if (process.env.NODE_ENV === 'production') {
    app.get(path.join(config.baseUri, '*'), (req, res, next) => {
      res.sendFile(path.join(webpackConfig.output.path, 'index.html'));
    });
  } else {
    // Attach to * for HistoryAPI
    const baseUriLength = (config.baseUri || '/').length;
    app.get(path.join(config.baseUri, '*'), async (req, res) => {

      // Create mock socket
      const serverHandlers = {};
      const clientHandlers = {};

      const serverSocket = {
        emit: (event, ...data) => {
          if (clientHandlers[event]) {
            clientHandlers[event].forEach((handler) => {
              handler(...data);
            });
          }
        }
      };

      Object.keys(handlers).forEach((id) => {
        const handler = handlers[id];
        if (handler.events) {
          Object.keys(handler.events).forEach((event) => {
            if (serverHandlers[event]) {
              serverHandlers[event].push(handler.events[event]);
            } else {
              serverHandlers[event] = [ handler.events[event] ];
            }
          });
        }
      });

      const clientSocket = {
        emit: (event, ...data) => {
          if (serverHandlers[event]) {
            serverHandlers[event].forEach((handler) => {
              handler(serverSocket, ...data);
            });
          }
        },
        on: (event, handler) => {
          if (clientHandlers[event]) {
            clientHandlers[event].push(handler);
          } else {
            clientHandlers[event] = [ handler ];
          }
        }
      };

      // Create marss instance
      try {
        const uri = req.path.slice(baseUriLength)
        const marss = await createMarss(config, clientSocket);
        const loader = new Manager();
        const index = devMiddleware.fileSystem.readFileSync(path.join(webpackConfig.output.path, 'index.html'));

        let element = React.createElement(StaticRouter, {
          location: req.url,
          context: {}
        }, React.createElement(LoaderProvider, {
          value: loader
        }, React.createElement(MarssContext, {
          marss: marss
        }, React.createElement(App, {}) ) ) );

        const waitRender = () => {
          const appString = renderToString(element);

          if (loader.loading) {
            loader.loading.then((errors) => {
              if (errors && errors.length) {
              }

              waitRender();
            });
          } else {
            // Return string
            let response;
            try {
              response = index.toString().replace(/(<div id="app">)(<\/div>)/, '$1' + appString + '$2');
            } catch (error) {
              console.error(error);
              res.end(index);
            }

            res.end(response);
          }
        };

        waitRender();
      } catch (error) {
        console.error(error);
      }
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
