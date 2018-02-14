"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const menu_1 = require("./menu");
const config_1 = require("../app/lib/config");
exports.Header = () => (React.createElement("header", { role: "banner" },
    React.createElement("h1", null, config_1.default.title),
    React.createElement(menu_1.Menu, null)));
