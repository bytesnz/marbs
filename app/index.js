"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDom = require("react-dom");
var react_redux_1 = require("react-redux");
var redux_1 = require("redux");
var react_router_1 = require("react-router");
var react_router_redux_1 = require("react-router-redux");
var createBrowserHistory_1 = require("history/createBrowserHistory");
var urlJoin = require("join-path");
var react_helmet_1 = require("react-helmet");
var io = require("socket.io-client");
var marss_1 = require("../lib/client/marss");
var config_1 = require("./lib/config");
require("./style.scss");
var tags_1 = require("../components/tags");
var categories_1 = require("../components/categories");
var content_1 = require("../components/content");
var header_1 = require("../components/header");
var footer_1 = require("../components/footer");
var sidebar_1 = require("../components/sidebar");
var history = createBrowserHistory_1.default();
var renderMergedProps = function (component) {
    var rest = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
    }
    var finalProps = Object.assign.apply(Object, [{}].concat(rest));
    return (React.createElement(component, finalProps));
};
var PropsRoute = function (_a) {
    var component = _a.component, rest = __rest(_a, ["component"]);
    return (React.createElement(react_router_1.Route, __assign({}, rest, { render: function (routeProps) {
            return renderMergedProps(component, routeProps, rest);
        } })));
};
// disable react-dev-tools for this project
if (process.env.NODE_ENV === 'production') {
    if (typeof window['__REACT_DEVTOOLS_GLOBAL_HOOK__'] === "object") {
        for (var _i = 0, _a = Object.entries(window['__REACT_DEVTOOLS_GLOBAL_HOOK__']); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            window['__REACT_DEVTOOLS_GLOBAL_HOOK__'][key] = typeof value == "function" ? function () { } : null;
        }
    }
}
(function () { return __awaiter(_this, void 0, void 0, function () {
    var socket, marss, store, composeWithDevTools, actions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                socket = io({});
                return [4 /*yield*/, marss_1.createMarss(config_1.default)];
            case 1:
                marss = _a.sent();
                if (process.env.NODE_ENV !== 'production') {
                    composeWithDevTools = require('redux-devtools-extension').composeWithDevTools;
                    store = redux_1.createStore(marss.reducers, marss.initialState, composeWithDevTools());
                }
                else {
                    store = redux_1.createStore(marss.reducers, marss.initialState);
                }
                actions = marss_1.livenActions(marss.actions, store, config_1.default, socket);
                ReactDom.render((React.createElement(react_redux_1.Provider, { store: store },
                    React.createElement(react_router_redux_1.ConnectedRouter, { history: history },
                        React.createElement("div", null,
                            React.createElement(react_helmet_1.Helmet, null,
                                React.createElement("title", null, config_1.default.title),
                                config_1.default.description ? (React.createElement("meta", { name: "description", content: config_1.default.description })) : null,
                                config_1.default.description ? (React.createElement("meta", { property: "og:description", content: config_1.default.description })) : null,
                                config_1.default.description ? (React.createElement("meta", { name: "twitter:description", content: config_1.default.description })) : null,
                                React.createElement("meta", { property: "og:type", content: "website" }),
                                React.createElement("meta", { property: "og:title", content: config_1.default.title }),
                                React.createElement("meta", { property: "og:url", content: "" }),
                                React.createElement("meta", { property: "og:site_name", content: config_1.default.title }),
                                React.createElement("meta", { name: "twitter:card", content: "summary" }),
                                React.createElement("meta", { name: "twitter:title", content: config_1.default.title })),
                            React.createElement(header_1.Header, null),
                            React.createElement(sidebar_1.Sidebar, { actions: actions, toggle: true, toggleUsingClass: true }),
                            React.createElement("main", null,
                                React.createElement(PropsRoute, { actions: actions, component: content_1.Content }),
                                React.createElement(PropsRoute, { path: "" + urlJoin('/', config_1.default.baseUri, config_1.default.tagsUri), actions: actions, component: tags_1.TagList }),
                                React.createElement(PropsRoute, { path: "" + urlJoin('/', config_1.default.baseUri, config_1.default.categoriesUri), actions: actions, component: categories_1.CategoryList })),
                            React.createElement(footer_1.Footer, null))))), document.getElementById('app'));
                return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=index.js.map