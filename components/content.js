"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_redux_1 = require("react-redux");
var react_helmet_1 = require("react-helmet");
var react_router_dom_1 = require("react-router-dom");
var utils_1 = require("../lib/utils");
var config_1 = require("../app/lib/config");
//const oldRequire = require
var markdown_1 = require("./markdown");
var posts_1 = require("./posts");
// TODO Show previous content until new content is loaded
// TODO Add loading status while loading
var ContentComponent = /** @class */ (function (_super) {
    __extends(ContentComponent, _super);
    function ContentComponent(props) {
        var _this = _super.call(this, props) || this;
        if (props.posts === null) {
            props.actions.posts.fetchPosts();
        }
        _this.checkContent(props);
        return _this;
    }
    ContentComponent.prototype.componentWillReceiveProps = function (newProps) {
        this.checkContent(newProps);
    };
    ContentComponent.prototype.correctId = function (contentId, id) {
        if (contentId === id) {
            return true;
        }
        else if (contentId === (id ? id + '/index' : 'index')) {
            return true;
        }
        return false;
    };
    ContentComponent.prototype.checkContent = function (props) {
        var actions = props.actions;
        var route = props.location;
        var content = props.content;
        var id = route.pathname.slice(config_1.default.baseUri.length);
        if (content && content.data && !this.correctId(content.data.id, id)) {
            //actions.content.clearContent();
            content = null;
        }
        if (content === null) {
            actions.content.fetchContent(id);
        }
    };
    ContentComponent.prototype.render = function () {
        var content = this.props.content;
        var route = this.props.location;
        var id = route.pathname.slice(config_1.default.baseUri.length);
        // Don't show content if it is not for the routed id
        if (content && content.data && !this.correctId(content.data.id, id)) {
            content = null;
        }
        if (!content) {
            return null;
        }
        if (content.error) {
            if (id.startsWith(config_1.default.tagsUri)) {
                return null;
            }
            if (content.error.code === 404) {
                return (React.createElement("section", null,
                    React.createElement(react_helmet_1.Helmet, null,
                        React.createElement("title", null, "Four Oh Four")),
                    React.createElement("h1", null, "Four Oh Four!"),
                    React.createElement("p", null, "You've gone into the unknown. Please try navigating back to the light.")));
            }
            return (React.createElement("section", null,
                React.createElement(react_helmet_1.Helmet, null,
                    React.createElement("title", null, "Error")),
                React.createElement("h1", null,
                    content.error.code,
                    " Error"),
                React.createElement("p", null, "There has been an error accessing the page you wanted. Please try again.")));
        }
        if (!content.data) {
            return null;
        }
        var attributes = content.data.attributes || {};
        var nextPost, previousPost;
        if (!attributes.type || attributes.type === 'post') {
            if (this.props.posts && this.props.posts.data) {
                var index = this.props.posts.data.findIndex(function (post) { return post.id === content.data.id; });
                if (index !== -1) {
                    if (index !== 0) {
                        nextPost = this.props.posts.data[index - 1];
                    }
                    if (index !== this.props.posts.data.length - 1) {
                        previousPost = this.props.posts.data[index + 1];
                    }
                }
            }
        }
        return [
            id !== '' ? (React.createElement(react_helmet_1.Helmet, { key: "helmet" },
                React.createElement("title", null, config_1.default.windowTitle(config_1.default, attributes.title)))) : null,
            (React.createElement("article", { key: "article", className: !attributes.type ? 'post' : attributes.type },
                (!attributes.type || attributes.type === 'post') ? (React.createElement("header", null,
                    (attributes.date) ?
                        (React.createElement("time", { dateTime: attributes.date }, (new Date(attributes.date)).toLocaleDateString()))
                        : null,
                    React.createElement("h1", null, attributes.title))) : null,
                React.createElement(markdown_1.Markdown, { className: "documentBody", source: content.data.body }),
                (!attributes.type || attributes.type === 'post') ? (React.createElement("footer", null,
                    attributes.tags ? (React.createElement("div", { className: "tags" }, attributes.tags.map(function (tag) { return (React.createElement(react_router_dom_1.Link, { key: tag, to: utils_1.tagUrl(tag) }, utils_1.tagLabel(tag))); }))) : null,
                    attributes.categories ? (React.createElement("div", { className: "categories" }, utils_1.flattenCategories(attributes.categories).map(function (category) { return (React.createElement(react_router_dom_1.Link, { key: category, to: utils_1.categoryUrl(category) }, utils_1.categoryLabel(category))); }))) : null,
                    React.createElement("nav", null,
                        previousPost ? (React.createElement(react_router_dom_1.Link, { className: "previousPost", to: utils_1.documentUrl(previousPost.id) }, previousPost.attributes.title)) : null,
                        nextPost ? (React.createElement(react_router_dom_1.Link, { className: "nextPost", to: utils_1.documentUrl(nextPost.id) }, nextPost.attributes.title)) : null))) : null)),
            (id === '' && typeof config_1.default.listLastOnIndex === 'number' && config_1.default.listLastOnIndex >= 0) ? (React.createElement(posts_1.Posts, { key: "posts", actions: this.props.actions, limit: config_1.default.listLastOnIndex, full: true })) : null
        ];
    };
    return ContentComponent;
}(React.Component));
exports.Content = react_redux_1.connect(function (state) { return ({
    content: state ? state.content : null,
    posts: state.posts
}); })(ContentComponent);
//# sourceMappingURL=content.js.map