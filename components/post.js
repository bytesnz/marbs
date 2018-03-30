"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var config_1 = require("../app/lib/config");
var react_router_dom_1 = require("react-router-dom");
var urlJoin = require("join-path");
exports.ListPost = function (_a) {
    var post = _a.post;
    var attributes = post.attributes;
    return (React.createElement(react_router_dom_1.Link, { to: urlJoin(config_1.default.baseUri, post.id), className: "listPost" },
        React.createElement("h1", null, attributes.title)));
};
//# sourceMappingURL=post.js.map