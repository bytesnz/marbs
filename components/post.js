"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const config_1 = require("../app/lib/config");
const react_router_dom_1 = require("react-router-dom");
const urlJoin = require("join-path");
exports.ListPost = ({ post }) => {
    const attributes = post.attributes;
    return (React.createElement(react_router_dom_1.Link, { to: urlJoin(config_1.default.baseUri, post.id), className: "listPost" },
        React.createElement("h1", null, attributes.title)));
};
