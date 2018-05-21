"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var process = require("process");
var express = require("express");
var http = require("http");
var socketio = require("socket.io");
var path = require("path");
var util = require("util");
var fs = require("fs");
var promisify = require("es6-promisify");
var commandLineArguments = require("command-line-args");
var urlJoin = require("join-path");
var webpackConfig = require("./webpack.common");
require('node-require-alias').setAlias({
    Config: webpackConfig.resolve.alias.Config$,
    ServerConfig: webpackConfig.resolve.alias.ServerConfig$,
    '~': '..'
});
var contentHandlers_1 = require("./lib/contentHandlers");
var config_global_1 = require("./lib/defaults/config.global");
var config_server_1 = require("./lib/defaults/config.server");
var access = (util.promisify || promisify)(fs.access);
var app = express();
var server = http.createServer(app);
var io = socketio(server);
var availableArguments = [
    { name: 'address', alias: 'a', env: 'ADDRESS', type: String },
    { name: 'port', alias: 'p', env: 'PORT', type: String },
    { name: 'source', env: 'SOURCE', type: String },
    { name: 'staticAssests', env: 'STATIC_ASSESTS', type: String },
    { name: 'draftRegex', env: 'DRAFT_REGEX', type: String }
];
var defaultConfig = __assign({}, config_global_1.default, config_server_1.default);
var config = __assign({}, defaultConfig);
var globalConfig = './config.global.js';
var serverConfig = './config.server.js';
// Pull in config from environment variables
availableArguments.forEach(function (argument) {
    if (argument.env && typeof process.env[argument.env] !== 'undefined') {
        try {
            var value = argument.type(process.env[argument.env]);
            if (typeof value === 'number') {
                if (isNaN(value)) {
                    throw new TypeError("Value for " + argument.env + " is not a number");
                }
            }
            config[argument.name] = value;
        }
        catch (error) {
            console.log("Value for " + argument.env + " ignored: " + error.message);
        }
    }
});
// Pull in config from command line arguments
config = Object.assign(config, commandLineArguments(availableArguments));
Promise.all([globalConfig, serverConfig].map(function (file) { return file && access(file, 'r').then(function () {
    var content = require(file);
    if (typeof content === 'object') {
        if (typeof content.default !== 'undefined') {
            content = content.default;
            if (typeof content !== 'object') {
                console.error("Default value in " + file + " not an Object");
                return;
            }
        }
        config = Object.assign(config, content);
        return;
    }
    console.error("Value in " + file + " not an Object");
}, function (err) { return (err.code === 'ENOENT' ? undefined : err); }); }))
    .then(function () {
    // TODO Check validaty of config?
    if (!config.draftRegex) {
        config.draftRegex = defaultConfig.draftRegex;
    }
    // Create complete content handlers
    var contentHandlers = Object.assign({}, contentHandlers_1.default, config.handlers);
    var handlers = {
        content: null
    };
    var promises = [];
    // Run content handler inits if defined
    Object.keys(contentHandlers).forEach(function (id) {
        var value = contentHandlers[id](config);
        if (value instanceof Promise) {
            promises.push(value.then(function (handler) {
                handlers[id] = handler;
            }));
        }
        else {
            handlers[id] = value;
        }
    });
    return Promise.all(promises).then(function () { return handlers; });
}).then(function (handlers) {
    // Ensure there is a content contentHandler
    if (typeof handlers.content !== 'object') {
        return Promise.reject(new Error('No content handler for main content'));
    }
    var content = handlers.content;
    // Change the socket path
    if (config.socketPath) {
        console.log('changing socket path to', config.socketPath);
        io.path(config.socketPath);
    }
    // Set up app file serving
    var devMiddleware, webpackDevMiddleware;
    if (process.env.NODE_ENV === 'production') {
        app.use(config.baseUri, express.static(webpackConfig.output.path));
    }
    else {
        console.log('Using Webpack dev middleware for realtime development');
        // Dev imports
        var webpack = require('webpack');
        webpackDevMiddleware = require('webpack-dev-middleware');
        var webpackDevConfig = require('./webpack.dev');
        var compiler = webpack(webpackDevConfig);
        devMiddleware = webpackDevMiddleware(compiler, {});
        // Attach webpack middlewares
        app.use(config.baseUri, devMiddleware);
    }
    // Set up static asset server
    if (config.staticAssets) {
        // Check folder exists
        app.use(urlJoin(config.baseUri + "/", config.staticUri), express.static(config.staticAssets));
    }
    // Set up catch all for content
    if (process.env.NODE_ENV === 'production') {
        app.get(path.join(config.baseUri, '*'), function (req, res, next) {
            res.sendFile(path.join(webpackConfig.output.path, 'index.html'));
        });
    }
    else {
        // Attach to * for HistoryAPI
        app.get(path.join(config.baseUri, '*'), function (req, res) {
            var index = devMiddleware.fileSystem.readFileSync(path.join(webpackConfig.output.path, 'index.html'));
            res.end(index);
        });
    }
    // Attach the web socket
    io.on('connection', function (socket) {
        // Attach the content handlers
        Object.keys(handlers).forEach(function (id) {
            var handler = handlers[id];
            if (handler.events) {
                Object.keys(handler.events).forEach(function (event) {
                    socket.on(event, function () {
                        var data = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            data[_i] = arguments[_i];
                        }
                        return (_a = handler.events)[event].apply(_a, [socket].concat(data));
                        var _a;
                    });
                });
            }
        });
    });
    // Listen
    server.listen(config.port);
    console.log("Marss listening on port " + config.port);
}).catch(function (error) {
    console.error('caught error', error.message);
    if (process.env.NODE_ENV !== 'production') {
        console.error(error);
    }
    process.exit(1);
});
//# sourceMappingURL=index.js.map