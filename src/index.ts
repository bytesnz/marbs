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
import * as compression from 'compression';

import * as webpackConfig from './webpack.common';

require('node-require-alias').setAlias({
  Config: webpackConfig.resolve.alias.Config$,
  ServerConfig: webpackConfig.resolve.alias.ServerConfig$,
  '~': '..'
});

import { Marss } from './marss';

const readFile = (util.promisify || promisify)(fs.readFile);

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(compression());

const availableArguments = [
  { name: 'address', alias: 'a', env: 'ADDRESS', type: String },
  { name: 'port', alias: 'p', env: 'PORT', type: String },
  { name: 'source', env: 'SOURCE', type: String },
  { name: 'staticAssests', env: 'STATIC_ASSESTS', type: String },
  { name: 'draftRegex', env: 'DRAFT_REGEX', type: String }
];

let instanceConfig = {};

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

      instanceConfig[argument.name] = value;
    } catch (error) {
      console.log(`Value for ${argument.env} ignored: ${error.message}`);
    }
  }
});

// Pull in config from command line arguments
Object.assign(instanceConfig, commandLineArguments(availableArguments));

const marss = new Marss(instanceConfig);

Promise.all([marss.getConfig(), marss.getHandlers()]).then(([config, handlers]) => {
  // Change the socket path
  if (config.socketPath) {
    console.log('changing socket path to', config.socketPath);
    io.path(config.socketPath);
  }

  // Set up app file serving
  let devMiddleware,
      webpackDevMiddleware;

  if (process.env.NODE_ENV === 'production') {
    app.use(config.baseUri, express.static(webpackConfig.output.path, {
      index: false
    }));
  } else {
    console.log('Using Webpack dev middleware for realtime development');
    // Dev imports
    const webpack = require('webpack');
    webpackDevMiddleware = require( 'webpack-dev-middleware');
    const webpackDevConfig = require('./webpack.dev');
    const compiler = webpack(webpackDevConfig);

    devMiddleware = webpackDevMiddleware(compiler, {
      // TODO Check if need no index
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
  console.log('got handlers', handlers);
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

  const baseUriLength = (config.baseUri || '/').length;
  // Set up catch all for content
  if (process.env.NODE_ENV === 'production') {
    let indexFile = readFile(path.join(webpackConfig.output.path, 'index.html')).then((buffer) => {
      const content = buffer.toString();
      indexFile = content;
      return content;
    });
    app.get(path.join(config.baseUri, '*'), (req, res, next) => {
      const uri = req.path.slice(baseUriLength)

      marss.generatePage(uri, indexFile).then(([status, content]) => {
        res.status(status).send(content).end();
      }, (error) => {
        console.error(error);
        if (indexFile instanceof Promise) {
          indexFile.then((content) => res.end);
        } else {
          res.send(indexFile).end();
        }
      });
    });
  } else {
    // Attach to * for HistoryAPI
    app.get(path.join(config.baseUri, '*'), async (req, res) => {
      try {
        const uri = req.path.slice(baseUriLength);
        const indexFile = devMiddleware.fileSystem.readFileSync(path.join(webpackConfig.output.path, 'index.html')).toString();

        marss.generatePage(uri, indexFile).then(([status, content]) => {
          console.log('got content', content);
          res.status(status).end(content);
        }, (error) => {
          console.error(error);
          res.end(indexFile);
        });
      } catch (error) {
        console.error(error);
        res.status(500).end();
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
