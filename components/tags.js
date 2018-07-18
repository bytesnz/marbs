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
var react_redux_1 = require("react-redux");
var React = require("react");
var react_router_dom_1 = require("react-router-dom");
var urlJoin = require("join-path");
var utils_1 = require("../lib/utils");
var config_1 = require("../app/lib/config");
var posts_1 = require("./posts");
var filterList_1 = require("./lib/filterList");
var TagListComponent = /** @class */ (function (_super) {
    __extends(TagListComponent, _super);
    function TagListComponent(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            expanded: null
        };
        var actions = props.actions;
        if (props.tags === null) {
            actions.tags.fetchTags();
        }
        if (props.posts === null) {
            actions.posts.fetchPosts();
        }
        if (props.location && props.location.hash) {
            var tag = props.location.hash.slice(1);
            _this.state.expanded = [tag];
        }
        else {
            _this.state.expanded = [];
        }
        return _this;
    }
    TagListComponent.prototype.shouldScroll = function () {
        return Boolean(this.props.tags && this.props.tags.data);
    };
    TagListComponent.prototype.error = function (errorSource, error) {
        return (React.createElement("p", { className: "error", key: errorSource },
            "There is was an error getting the ",
            errorSource,
            ":",
            error.message));
    };
    TagListComponent.prototype.render = function () {
        var _this = this;
        var _a = this.props, content = _a.content, tags = _a.tags, posts = _a.posts, ListPost = _a.ListPost;
        return [
            content ? null : (React.createElement("header", { key: "header" },
                React.createElement("h1", null, "Tags"))),
            (function () {
                if (!tags) {
                    return 'Loading tags list';
                }
                else if (tags.error) {
                    return _this.error('tags', tags.error);
                }
                else if (posts && posts.error) {
                    return _this.error('posts', posts.error);
                }
                else {
                    return [(React.createElement(exports.TagCloud, { key: "cloud" }))].concat(Object.keys(tags.data).sort().map(function (id) { return (React.createElement("section", { className: "postList", key: id },
                        React.createElement("h1", { className: config_1.default.expandableLists
                                && _this.isExpanded(id) ? 'expanded' : '', onClick: config_1.default.expandableLists ? function () { return _this.toggle(id); } : null },
                            React.createElement("a", { id: id }),
                            utils_1.tagLabel(id),
                            " (",
                            tags.data[id],
                            ")"),
                        !config_1.default.expandableLists || _this.isExpanded(id)
                            ? (posts ? (posts.data ? (React.createElement(posts_1.Posts, { posts: utils_1.filterPostsByTags(posts.data, [id]), full: true, actions: _this.props.actions }))
                                : null) : 'Loading posts') : null)); }));
                }
            })()
        ];
    };
    return TagListComponent;
}(filterList_1.FilterListComponent));
exports.TagList = react_redux_1.connect(function (state) { return ({
    content: state.content,
    tags: state.tags,
    posts: state.posts
}); })(TagListComponent);
var TagCloudComponent = function (props) {
    var actions = props.actions, minSize = props.minSize, maxSize = props.maxSize, tags = props.tags, Label = props.Label;
    if (!minSize) {
        minSize = 0.7;
    }
    if (!maxSize) {
        maxSize = 1.5;
    }
    if (typeof Label !== 'function') {
        Label = function (_a) {
            var tag = _a.tag, count = _a.count;
            return tag + " (" + count + ")";
        };
    }
    if (tags === null) {
        actions.tags.fetchTags();
        return 'Loading';
    }
    if (tags.error) {
        return "Error getting tags: " + tags.error.message;
    }
    tags = tags.data;
    var _a = Object.keys(tags).reduce(function (count, id) { return [
        Math.min(count[0], tags[id]),
        Math.max(count[1], tags[id])
    ]; }, [0, 0]), minCount = _a[0], maxCount = _a[1];
    var countDelta = maxCount - minCount;
    var sizeDelta = maxSize - minSize;
    var size = function (count) { return 100 * (((count - minCount) / countDelta * sizeDelta) + minSize); };
    return (React.createElement("ul", { className: "tagCloud" }, Object.keys(tags).sort().map(function (id) { return (React.createElement("li", { key: id, style: { fontSize: size(tags[id]) + "%" } },
        React.createElement(react_router_dom_1.Link, { to: urlJoin(config_1.default.baseUri, config_1.default.tagsUri + '#' + id) },
            utils_1.tagLabel(id),
            " (",
            tags[id],
            ")"))); })));
};
exports.TagCloud = react_redux_1.connect(function (state) { return ({
    tags: state.tags
}); })(TagCloudComponent);
//# sourceMappingURL=tags.js.map