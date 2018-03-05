"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
const react_router_dom_1 = require("react-router-dom");
const urlJoin = require("join-path");
const utils_1 = require("../lib/utils");
const config_1 = require("../app/lib/config");
const PostsComponent = ({ posts, _posts, limit, filter, actions, full }) => {
    if (typeof posts === 'undefined') {
        if (_posts === null) {
            actions.posts.fetchPosts();
            return null;
        }
        if (typeof _posts.data === 'undefined') {
            return null;
        }
        posts = _posts.data;
    }
    if (filter) {
        posts = filter(posts);
    }
    if (limit) {
        posts = posts.slice(0, limit);
    }
    if (full) {
        return (React.createElement("ul", { className: "posts full" }, posts.map((post) => (React.createElement("li", { key: post.id, className: post.attributes.categories ?
                utils_1.flattenCategories(post.attributes.categories).join(' ') : '' },
            post.attributes.date ? (React.createElement("time", { dateTime: post.attributes.date }, (new Date(post.attributes.date)).toLocaleDateString())) : null,
            React.createElement("h1", null,
                React.createElement(react_router_dom_1.Link, { to: urlJoin(config_1.default.baseUri, post.id) }, post.attributes.title)),
            post.attributes.tags ? (React.createElement("div", { className: "tags" }, post.attributes.tags.map((tag) => (React.createElement(react_router_dom_1.Link, { key: tag, to: utils_1.tagUrl(tag) }, utils_1.tagLabel(tag)))))) : null,
            post.attributes.categories ? (React.createElement("div", { className: "categories" }, utils_1.flattenCategories(post.attributes.categories).map((category) => (React.createElement(react_router_dom_1.Link, { key: category, to: utils_1.categoryUrl(category) }, utils_1.categoryLabel(category)))))) : null)))));
    }
    else {
        return (React.createElement("ul", { className: "posts" }, posts.map((post) => (React.createElement("li", { key: post.id },
            React.createElement(react_router_dom_1.Link, { to: urlJoin(config_1.default.baseUri, post.id) }, post.attributes.title))))));
    }
};
exports.Posts = react_redux_1.connect((state) => ({
    _posts: state.posts
}))(PostsComponent);
