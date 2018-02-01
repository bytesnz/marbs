"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process = require("process");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const util = require("util");
const fs = require("fs");
const url = require("url");
const promisify = require("es6-promisify");
const conf = require("nconf");
const contentHandlers_1 = require("./lib/contentHandlers");
const webpackConfig = require("./webpack.common");
const config_global_1 = require("./lib/defaults/config.global");
const config_server_1 = require("./lib/defaults/config.server");
const access = (util.promisify || promisify)(fs.access);
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const defaultConfig = Object.assign({}, config_global_1.default, config_server_1.default);
const globalConfig = './config.global.js';
const serverConfig = './config.server.js';
// Load configurations
conf.use('memory').defaults(defaultConfig);
conf.argv().env();
Promise.all([globalConfig, serverConfig].map((file) => file && access(file, 'r').then(() => conf.overrides(require(file)), (err) => (err.code === 'ENOENT' ? undefined : err))))
    .then(() => {
    // TODO Check validaty of conf?
    // Create complete content handlers
    const contentHandlers = Object.assign({}, contentHandlers_1.default, conf.get('contentHandlers'));
    let promises = [];
    // Run content handler inits if defined
    Object.keys(contentHandlers).forEach((id) => {
        if (typeof contentHandlers[id] === 'function') {
            const value = contentHandlers[id](conf);
            if (value instanceof Promise) {
                promises.push(value.then((handler) => {
                    contentHandlers[id] = handler;
                }));
            }
            else {
                contentHandlers[id] = value;
            }
        }
        else if (typeof contentHandlers[id].init === 'function') {
            const value = contentHandlers[id].init(conf);
            if (value instanceof Promise) {
                promises.push(value);
            }
        }
    });
    return Promise.all(promises).then(() => contentHandlers);
}).then((contentHandlers) => {
    // Ensure there is a content contentHandler
    if (typeof contentHandlers.content !== 'object') {
        return Promise.reject(new Error('No content handler for main content'));
    }
    const content = contentHandlers.content;
    // Change the socket path
    if (conf.get('socketPath')) {
        console.log('changing socket path to', conf.get('socketPath'));
        io.path(conf.get('socketPath'));
    }
    // Set up app file serving
    let devMiddleware, webpackDevMiddleware;
    if (process.env.NODE_ENV === 'production') {
        app.use(conf.get('baseUri'), express.static(webpackConfig.output.path));
    }
    else {
        console.log('Using Webpack dev middleware for realtime development');
        // Dev imports
        const webpack = require('webpack');
        webpackDevMiddleware = require('webpack-dev-middleware');
        const webpackHotMiddleware = require('webpack-hot-middleware');
        const webpackDevConfig = require('./webpack.dev');
        const compiler = webpack(webpackDevConfig);
        devMiddleware = webpackDevMiddleware(compiler, {});
        // Attach webpack middlewares
        app.use(conf.get('baseUri'), devMiddleware);
        app.use(conf.get('baseUri'), webpackHotMiddleware(compiler));
    }
    // Set up static asset server
    const staticAssets = conf.get('staticAssets');
    if (staticAssets) {
        // Check folder exists
        app.use(url.resolve(`${conf.get('baseUri')}/`, conf.get('staticBasename')), express.static(staticAssets));
    }
    // Set up catch all for content
    if (process.env.NODE_ENV === 'production') {
        app.get(path.join(conf.get('baseUri'), '*'), (req, res, next) => {
            res.sendFile(path.join(webpackConfig.output.path, 'index.html'));
        });
    }
    else {
        // Attach to * for HistoryAPI
        app.get(path.join(conf.get('baseUri'), '*'), (req, res) => {
            const index = devMiddleware.fileSystem.readFileSync(path.join(webpackConfig.output.path, 'index.html'));
            res.end(index);
        });
    }
    // Attach the web socket
    io.on('connection', (socket) => {
        // Attach the content handlers
        Object.keys(contentHandlers).forEach((id) => {
            const handler = contentHandlers[id];
            if (handler.events) {
                Object.keys(handler.events).forEach((event) => {
                    socket.on(event, (...data) => handler.events[event](socket, ...data));
                });
            }
        });
    });
    // Listen
    server.listen(conf.get('port'));
    console.log(`Marss listening on port ${conf.get('port')}`);
}).catch((error) => {
    console.error('caught error', error.message);
    if (process.env.NODE_ENV !== 'production') {
        console.error(error);
    }
    process.exit(1);
});
