"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_router_dom_1 = require("react-router-dom");
const urlJoin = require("join-path");
const config_1 = require("../app/lib/config");
const menuItem = (item, index) => {
    if (item.children) {
        return (React.createElement("li", { key: index },
            React.createElement("span", null, item.label),
            React.createElement("ul", null, item.map(menuItem))));
    }
    else if (item.link) {
        return (React.createElement(react_router_dom_1.Link, { key: index, to: urlJoin('/', config_1.default.baseUri, item.link) }, item.label));
    }
    return null;
};
exports.Header = () => (React.createElement("header", { role: "banner" },
    React.createElement("h1", null, config_1.default.title),
    config_1.default.menu ? (React.createElement("nav", null,
        React.createElement("ul", null, console.log(config_1.default.menu, config_1.default.menu.map(menuItem)) || config_1.default.menu.map(menuItem)))) : null));
