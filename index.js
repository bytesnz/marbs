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
const commandLineArguments = require("command-line-args");
const contentHandlers_1 = require("./lib/contentHandlers");
const webpackConfig = require("./webpack.common");
const config_global_1 = require("./lib/defaults/config.global");
const config_server_1 = require("./lib/defaults/config.server");
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
const defaultConfig = Object.assign({}, config_global_1.default, config_server_1.default);
let config = Object.assign({}, defaultConfig);
const globalConfig = './config.global.js';
const serverConfig = './config.server.js';
// Pull in config from environment variables
availableArguments.forEach((argument) => {
    if (argument.env && typeof process.env[argument.env] !== 'undefined') {
        try {
            const value = argument.type(process.env[argument.env]);
            if (typeof value === 'number') {
                if (isNaN(value)) {
                    throw new TypeError(`Value for ${argument.env} is not a number`);
                }
            }
            config[argument.name] = value;
        }
        catch (error) {
            console.log(`Value for ${argument.env} ignored: ${error.message}`);
        }
    }
});
// Pull in config from command line arguments
config = Object.assign(config, commandLineArguments(availableArguments));
Promise.all([globalConfig, serverConfig].map((file) => file && access(file, 'r').then(() => {
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
}, (err) => (err.code === 'ENOENT' ? undefined : err))))
    .then(() => {
    // TODO Check validaty of config?
    console.log('got draftregex', config.draftRegex);
    if (!config.draftRegex) {
        config.draftRegex = defaultConfig.draftRegex;
    }
    // Create complete content handlers
    const contentHandlers = Object.assign({}, contentHandlers_1.default, config.handlers);
    let handlers = {
        content: null
    };
    let promises = [];
    // Run content handler inits if defined
    Object.keys(contentHandlers).forEach((id) => {
        if (typeof contentHandlers[id] === 'function') {
            const value = contentHandlers[id](config);
            if (value instanceof Promise) {
                promises.push(value.then((handler) => {
                    handlers[id] = handler;
                }));
            }
            else {
                handlers[id] = value;
            }
        }
        else if (typeof contentHandlers[id].init === 'function') {
            const value = contentHandlers[id].init(config);
            if (value instanceof Promise) {
                promises.push(value);
            }
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
    let devMiddleware, webpackDevMiddleware;
    if (process.env.NODE_ENV === 'production') {
        app.use(config.baseUri, express.static(webpackConfig.output.path));
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
        app.use(config.baseUri, devMiddleware);
        app.use(config.baseUri, webpackHotMiddleware(compiler));
    }
    // Set up static asset server
    const staticAssets = config.staticAssets;
    if (staticAssets) {
        // Check folder exists
        app.use(url.resolve(`${config.baseUri}/`, config.staticUri), express.static(staticAssets));
    }
    // Set up catch all for content
    if (process.env.NODE_ENV === 'production') {
        app.get(path.join(config.baseUri, '*'), (req, res, next) => {
            res.sendFile(path.join(webpackConfig.output.path, 'index.html'));
        });
    }
    else {
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
