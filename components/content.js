"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
const react_helmet_1 = require("react-helmet");
const react_router_dom_1 = require("react-router-dom");
const utils_1 = require("../lib/utils");
const config_1 = require("../app/lib/config");
//const oldRequire = require
const markdown_1 = require("./markdown");
const posts_1 = require("./posts");
// TODO Show previous content until new content is loaded
// TODO Add loading status while loading
class ContentComponent extends React.Component {
    constructor(props) {
        super(props);
        if (props.posts === null) {
            props.actions.posts.fetchPosts();
        }
        this.checkContent(props);
    }
    componentWillReceiveProps(newProps) {
        this.checkContent(newProps);
    }
    correctId(contentId, id) {
        if (contentId === id) {
            return true;
        }
        else if (contentId === (id ? id + '/index' : 'index')) {
            return true;
        }
        return false;
    }
    checkContent(props) {
        const { actions } = props;
        const route = props.location;
        let { content } = props;
        const id = route.pathname.slice(config_1.default.baseUri.length);
        if (content && content.data && !this.correctId(content.data.id, id)) {
            //actions.content.clearContent();
            content = null;
        }
        if (content === null) {
            actions.content.fetchContent(id);
        }
    }
    render() {
        let { content } = this.props;
        const route = this.props.location;
        const id = route.pathname.slice(config_1.default.baseUri.length);
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
        const attributes = content.data.attributes || {};
        let nextPost, previousPost;
        if (!attributes.type || attributes.type === 'post') {
            if (this.props.posts && this.props.posts.data) {
                const index = this.props.posts.data.findIndex((post) => post.id === content.data.id);
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
        return (React.createElement("main", null,
            React.createElement("article", { className: !attributes.type ? 'post' : attributes.type },
                (!attributes.type || attributes.type === 'post') ? (React.createElement("header", null,
                    (attributes.date) ?
                        (React.createElement("time", { dateTime: attributes.date }, (new Date(attributes.date)).toLocaleDateString()))
                        : null,
                    React.createElement("h1", null, attributes.title))) : null,
                React.createElement(markdown_1.Markdown, { className: "documentBody", source: content.data.body }),
                (!attributes.type || attributes.type === 'post') ? (React.createElement("footer", null,
                    attributes.tags ? (React.createElement("div", { className: "tags" }, attributes.tags.map((tag) => (React.createElement(react_router_dom_1.Link, { key: tag, to: utils_1.tagUrl(tag) }, utils_1.tagLabel(tag)))))) : null,
                    attributes.categories ? (React.createElement("div", { className: "categories" }, utils_1.flattenCategories(attributes.categories).map((category) => (React.createElement(react_router_dom_1.Link, { key: category, to: utils_1.categoryUrl(category) }, utils_1.categoryLabel(category)))))) : null,
                    React.createElement("nav", null,
                        previousPost ? (React.createElement(react_router_dom_1.Link, { className: "previousPost", to: utils_1.documentUrl(previousPost.id) }, previousPost.attributes.title)) : null,
                        nextPost ? (React.createElement(react_router_dom_1.Link, { className: "nextPost", to: utils_1.documentUrl(nextPost.id) }, nextPost.attributes.title)) : null))) : null),
            (id === '' && typeof config_1.default.listLastOnIndex === 'number' && config_1.default.listLastOnIndex >= 0) ? (React.createElement(posts_1.Posts, { actions: this.props.actions, limit: config_1.default.listLastOnIndex, full: true })) : null));
    }
}
exports.Content = react_redux_1.connect((state) => ({
    content: state ? state.content : null,
    posts: state.posts
}))(ContentComponent);
