"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDom = require("react-dom");
const react_redux_1 = require("react-redux");
const redux_1 = require("redux");
const react_router_1 = require("react-router");
const react_router_redux_1 = require("react-router-redux");
const redux_devtools_extension_1 = require("redux-devtools-extension");
const createBrowserHistory_1 = require("history/createBrowserHistory");
const urlJoin = require("join-path");
const io = require("socket.io-client");
const marss_1 = require("../lib/client/marss");
const config_1 = require("./lib/config");
require("./style.scss");
const tags_1 = require("../components/tags");
const categories_1 = require("../components/categories");
const content_1 = require("../components/content");
const header_1 = require("../components/header");
const footer_1 = require("../components/footer");
const sidebar_1 = require("../components/sidebar");
const history = createBrowserHistory_1.default();
const renderMergedProps = (component, ...rest) => {
    const finalProps = Object.assign({}, ...rest);
    return (React.createElement(component, finalProps));
};
const PropsRoute = (_a) => {
    var { component } = _a, rest = __rest(_a, ["component"]);
    return (React.createElement(react_router_1.Route, Object.assign({}, rest, { render: routeProps => {
            return renderMergedProps(component, routeProps, rest);
        } })));
};
(() => __awaiter(this, void 0, void 0, function* () {
    const socket = io({});
    const marss = yield marss_1.createMarss(config_1.default);
    const store = redux_1.createStore(marss.reducers, marss.initialState, redux_devtools_extension_1.composeWithDevTools());
    const actions = marss_1.livenActions(marss.actions, store, config_1.default, socket);
    ReactDom.render((React.createElement(react_redux_1.Provider, { store: store },
        React.createElement(react_router_redux_1.ConnectedRouter, { history: history },
            React.createElement("div", null,
                React.createElement(header_1.Header, null),
                React.createElement(sidebar_1.Sidebar, { actions: actions, toggle: true, toggleUsingClass: true }),
                React.createElement(PropsRoute, { actions: actions, component: content_1.Content }),
                React.createElement(PropsRoute, { path: `${urlJoin('/', config_1.default.baseUri, config_1.default.tagsUri)}`, actions: actions, component: tags_1.TagList }),
                React.createElement(PropsRoute, { path: `${urlJoin('/', config_1.default.baseUri, config_1.default.categoriesUri)}`, actions: actions, component: categories_1.CategoryList }),
                React.createElement(footer_1.Footer, null))))), document.getElementById('app'));
    /*
                <Route path={config.tagsUri}>
                  <TagList actions={actions} />
                </Route>
                <Route path={config.categoriesUri}>
                  <CategoryList actions={actions} />
                </Route>
                <Route>
                  <Content actions={actions} />
                </Route>
     */
}))();
