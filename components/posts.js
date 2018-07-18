"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_redux_1 = require("react-redux");
var react_router_dom_1 = require("react-router-dom");
var urlJoin = require("join-path");
var utils_1 = require("../lib/utils");
var utils_2 = require("../lib/utils");
var attributes_1 = require("../lib/client/attributes");
var config_1 = require("../app/lib/config");
var PostsComponent = function (_a) {
    var posts = _a.posts, _posts = _a._posts, limit = _a.limit, filter = _a.filter, actions = _a.actions, full = _a.full;
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
        return (React.createElement("ul", { className: "posts full" }, posts.map(function (post) { return (React.createElement("li", { key: post.id, className: post.attributes.categories ?
                utils_1.flattenCategories(post.attributes.categories).join(' ') : '' },
            post.attributes.date ? (React.createElement("time", { dateTime: post.attributes.date }, (new Date(post.attributes.date)).toLocaleDateString())) : null,
            React.createElement("h1", null,
                React.createElement(react_router_dom_1.Link, { to: urlJoin(config_1.default.baseUri, post.id) }, post.attributes.title)),
            post.attributes.tags ? (React.createElement("div", { className: "tags" }, post.attributes.tags.map(function (tag) { return (React.createElement(react_router_dom_1.Link, { key: tag, to: utils_1.tagUrl(tag) }, utils_1.tagLabel(tag))); }))) : null,
            post.attributes.categories ? (React.createElement("div", { className: "categories" }, utils_1.flattenCategories(post.attributes.categories).map(function (category) { return (React.createElement(react_router_dom_1.Link, { key: category, to: utils_1.categoryUrl(category) }, utils_1.categoryLabel(category))); }))) : null)); })));
    }
    else {
        return (React.createElement("ul", { className: "posts" }, posts.map(function (post) { return (React.createElement("li", { key: post.id },
            React.createElement(react_router_dom_1.Link, { to: urlJoin(config_1.default.baseUri, post.id) }, post.attributes.title))); })));
    }
};
exports.Posts = react_redux_1.connect(function (state) { return ({
    _posts: state.posts
}); })(PostsComponent);
/**
 * {@posts } tag handler
 */
exports.PostsTagComponent = function (_a) {
    var posts = _a.posts, attributes = _a.attributes, actions = _a.actions;
    if (posts === null) {
        actions.posts.fetchPosts();
        return null;
    }
    if (typeof posts.data === 'undefined') {
        return null;
    }
    posts = posts.data;
    console.log('PostsTagComponent called', posts, attributes);
    if (attributes.length) {
        // Build attributes
        attributes = attributes_1.parseAttributes(attributes);
        console.log('parsed attributes', attributes);
        if (attributes.tags) {
            attributes.tags = attributes.tags.split(/ *, */g);
            posts = utils_2.filterPostsByTags(posts, attributes.tags, attributes.allTags);
        }
        if (attributes.categories) {
            attributes.categories = attributes.categories.split(/ *, */g);
            posts = utils_2.filterPostsByCategories(posts, attributes.categories, attributes.allCategories);
        }
        if (attributes.from) {
            var from_1 = (new Date(attributes.from)).getTime();
            if (!isNaN(from_1)) {
                posts.filter(function (post) { return post.attributes.date >= from_1; });
            }
            else if (process.env.NODE_ENV !== 'production') {
                console.error("Ignoring from attribute (" + attributes.from + ") in posta tag as not valid");
            }
        }
        if (attributes.to) {
            var to_1 = (new Date(attributes.to)).getTime();
            if (!isNaN(to_1)) {
                posts.filter(function (post) { return post.attributes.date >= to_1; });
            }
            else if (process.env.NODE_ENV !== 'production') {
                console.error("Ignoring to attribute (" + attributes.to + ") in posta tag as not valid");
            }
        }
        return (React.createElement(exports.Posts, { posts: posts, full: attributes && attributes.full }));
    }
    else {
        return (React.createElement(exports.Posts, null));
    }
};
exports.PostsTag = react_redux_1.connect(function (state) { return ({
    posts: state.posts
}); })(exports.PostsTagComponent);
//# sourceMappingURL=posts.js.map