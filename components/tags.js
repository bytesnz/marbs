"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const React = require("react");
const react_router_dom_1 = require("react-router-dom");
const urlJoin = require("join-path");
const utils_1 = require("../lib/utils");
const config_1 = require("../app/lib/config");
const posts_1 = require("./posts");
const filterList_1 = require("./lib/filterList");
class TagListComponent extends filterList_1.FilterListComponent {
    constructor(props) {
        super(props);
        this.state = {
            expanded: null
        };
        console.log('taglist constructor called');
        const { actions } = props;
        if (props.tags === null) {
            actions.tags.fetchTags();
        }
        if (props.posts === null) {
            actions.posts.fetchPosts();
        }
        if (props.location && props.location.hash) {
            const tag = props.location.hash.slice(1);
            this.state.expanded = [tag];
        }
        else {
            this.state.expanded = [];
        }
    }
    shouldScroll() {
        return Boolean(this.props.tags && this.props.tags.data);
    }
    error(errorSource, error) {
        return (React.createElement("p", { className: "error", key: errorSource },
            "There is was an error getting the ",
            errorSource,
            ":",
            error.message));
    }
    render() {
        let { content, tags, posts, ListPost } = this.props;
        return (React.createElement("div", null,
            content ? null : (React.createElement("header", null,
                React.createElement("h1", null, "Tags"))),
            (() => {
                if (!tags) {
                    return 'Loading tags list';
                }
                else if (tags.error) {
                    return this.error('tags', tags.error);
                }
                else if (posts && posts.error) {
                    return this.error('posts', posts.error);
                }
                else {
                    return [(React.createElement(exports.TagCloud, null))].concat(Object.keys(tags.data).sort().map((id) => (React.createElement("section", { key: id },
                        React.createElement("h1", { className: config_1.default.expandableLists
                                && this.isExpanded(id) ? 'expanded' : '', onClick: config_1.default.expandableLists ? () => this.toggle(id) : null },
                            React.createElement("a", { id: id }),
                            utils_1.tagLabel(id),
                            " (",
                            tags.data[id],
                            ")"),
                        !config_1.default.expandableLists || this.isExpanded(id)
                            ? (posts ? (posts.data ? (React.createElement(posts_1.Posts, { posts: utils_1.filterPostsByTags(posts.data, [id]), full: true, actions: this.props.actions }))
                                : null) : 'Loading posts') : null))));
                }
            })()));
    }
}
exports.TagList = react_redux_1.connect((state) => ({
    content: state.content,
    tags: state.tags,
    posts: state.posts
}))(TagListComponent);
const TagCloudComponent = (props) => {
    let { actions, minSize, maxSize, tags, Label } = props;
    if (!minSize) {
        minSize = 0.7;
    }
    if (!maxSize) {
        maxSize = 1.5;
    }
    if (typeof Label !== 'function') {
        Label = ({ tag, count }) => `${tag} (${count})`;
    }
    if (tags === null) {
        actions.tags.fetchTags();
        return 'Loading';
    }
    if (tags.error) {
        return `Error getting tags: ${tags.error.message}`;
    }
    tags = tags.data;
    const [minCount, maxCount] = Object.keys(tags).reduce((count, id) => [
        Math.min(count[0], tags[id]),
        Math.max(count[1], tags[id])
    ], [0, 0]);
    const countDelta = maxCount - minCount;
    const sizeDelta = maxSize - minSize;
    const size = (count) => 100 * (((count - minCount) / countDelta * sizeDelta) + minSize);
    return (React.createElement("ul", { className: "tagCloud" }, Object.keys(tags).sort().map((id) => (React.createElement("li", { key: id, style: { fontSize: `${size(tags[id])}%` } },
        React.createElement(react_router_dom_1.Link, { to: urlJoin(config_1.default.baseUri, config_1.default.tagsUri + '#' + id) },
            id,
            " (",
            tags[id],
            ")"))))));
};
exports.TagCloud = react_redux_1.connect((state) => ({
    tags: state.tags
}))(TagCloudComponent);
