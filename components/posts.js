"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
const react_router_dom_1 = require("react-router-dom");
const urlJoin = require("join-path");
const config_1 = require("../app/lib/config");
const PostsComponent = ({ posts, limit, actions }) => {
    if (posts === null) {
        actions.posts.fetchPosts();
        return null;
    }
    if (posts.data) {
        posts = posts.data;
    }
    else {
        return null;
    }
    if (limit) {
        posts = posts.slice(0, limit);
    }
    return (React.createElement("ul", { className: "posts" }, posts.map((post) => (React.createElement("li", { key: post.id },
        React.createElement(react_router_dom_1.Link, { to: urlJoin(config_1.default.baseUri, post.id) }, post.attributes.title))))));
};
exports.Posts = react_redux_1.connect((state) => ({
    posts: state.posts
}))(PostsComponent);
