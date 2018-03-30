"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var menu_1 = require("./menu");
var config_1 = require("../app/lib/config");
exports.Header = function () { return (React.createElement("header", { className: "siteHeader", role: "banner" },
    React.createElement("h1", null, config_1.default.title),
    React.createElement(menu_1.Menu, null))); };
//# sourceMappingURL=header.js.map