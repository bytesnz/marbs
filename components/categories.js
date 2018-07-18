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
var config_1 = require("../app/lib/config");
var utils_1 = require("../lib/utils");
var posts_1 = require("./posts");
var filterList_1 = require("./lib/filterList");
/**
 * Unconnected Component for generating lists of posts under each category
 */
var CategoryListComponent = /** @class */ (function (_super) {
    __extends(CategoryListComponent, _super);
    function CategoryListComponent(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            expanded: null
        };
        _this.newHash = false;
        if (props.categories === null) {
            props.actions.categories.fetchCategories();
        }
        if (props.posts === null) {
            props.actions.posts.fetchPosts();
        }
        if (config_1.default.categoriesPerPage) {
            //TODO
        }
        else {
            if (props.location && props.location.hash) {
                var category = props.location.hash.slice(1);
                _this.newHash = true;
                _this.state.expanded = [category];
            }
            else {
                _this.state.expanded = [];
            }
        }
        return _this;
    }
    CategoryListComponent.prototype.shouldScroll = function () {
        return this.props.categories && this.props.categories.data;
    };
    CategoryListComponent.prototype.error = function (errorSource, error) {
        return (React.createElement("p", { className: "error", key: errorSource },
            "There is was an error getting the ",
            errorSource,
            ":",
            error.message));
    };
    CategoryListComponent.prototype.render = function () {
        var _this = this;
        var _a = this.props, categories = _a.categories, content = _a.content, posts = _a.posts, actions = _a.actions;
        return [
            content ? null : (React.createElement("header", { key: "header" },
                React.createElement("h1", null, "Categories"))),
            (function () {
                if (!categories) {
                    return 'Loading categories list';
                }
                else if (categories.error) {
                    return _this.error('categories', categories.error);
                }
                else if (posts && posts.error) {
                    return _this.error('posts', posts.error);
                }
                else if (config_1.default.categoriesPerPage) {
                    return null;
                }
                else {
                    return Object.keys(categories.data).map(function (id) {
                        var category = id.split('/').pop();
                        return (React.createElement("section", { className: "postList", key: "category-" + category },
                            React.createElement("h1", null,
                                React.createElement("a", { id: id }),
                                utils_1.categoryLabel(id),
                                " (",
                                categories.data[id],
                                ")"),
                            !config_1.default.expandableLists || _this.isExpanded(id)
                                ? (posts && posts.data ? (React.createElement(posts_1.Posts, { posts: utils_1.filterPostsByCategories(posts.data, [category]), full: true, actions: actions })) : 'Loading posts') : null));
                    });
                }
            })()
        ];
    };
    return CategoryListComponent;
}(filterList_1.FilterListComponent));
exports.CategoryList = react_redux_1.connect(function (state) { return ({
    categories: state.categories,
    content: state.content,
    posts: state.posts
}); })(CategoryListComponent);
/**
 * Unconnected component for generating a list of categories and the number
 * of posts that has that category
 */
var CategoryCountsComponent = function (_a) {
    var categories = _a.categories, actions = _a.actions;
    if (categories === null) {
        actions.categories.fetchCategories();
        return null;
    }
    if (categories.data) {
        categories = categories.data;
    }
    else {
        return null;
    }
    return (React.createElement("ul", { className: "categories" }, Object.keys(categories).sort().map(function (id) {
        var parts = id.split('/');
        var level = parts.length - 1;
        id = parts[parts.length - 1];
        return (React.createElement("li", { key: id, style: { marginLeft: level * 15 } },
            React.createElement(react_router_dom_1.Link, { to: urlJoin(config_1.default.baseUri, config_1.default.categoriesUri +
                    (config_1.default.categoriesPerPage ? '' : '#') + id) },
                utils_1.categoryLabel(id),
                " (",
                categories[id],
                ")")));
    })));
};
exports.Categories = react_redux_1.connect(function (state) { return ({
    categories: state.categories
}); })(CategoryCountsComponent);
//# sourceMappingURL=categories.js.map