"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const React = require("react");
const react_router_dom_1 = require("react-router-dom");
const urlJoin = require("join-path");
const config_1 = require("../app/lib/config");
const utils_1 = require("../lib/utils");
const posts_1 = require("./posts");
const filterList_1 = require("./lib/filterList");
/**
 * Unconnected Component for generating lists of posts under each category
 */
class CategoryListComponent extends filterList_1.FilterListComponent {
    constructor(props) {
        super(props);
        this.state = {
            expanded: null
        };
        this.newHash = false;
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
                const category = props.location.hash.slice(1);
                this.newHash = true;
                this.state.expanded = [category];
            }
            else {
                this.state.expanded = [];
            }
        }
    }
    shouldScroll() {
        return this.props.categories && this.props.categories.data;
    }
    error(errorSource, error) {
        return (React.createElement("p", { className: "error", key: errorSource },
            "There is was an error getting the ",
            errorSource,
            ":",
            error.message));
    }
    render() {
        let { categories, content, posts, actions } = this.props;
        return (React.createElement("div", null,
            content ? null : (React.createElement("header", null,
                React.createElement("h1", null, "Categories"))),
            (() => {
                if (!categories) {
                    return 'Loading categories list';
                }
                else if (categories.error) {
                    return this.error('categories', categories.error);
                }
                else if (posts && posts.error) {
                    return this.error('posts', posts.error);
                }
                else if (config_1.default.categoriesPerPage) {
                    return null;
                }
                else {
                    return Object.keys(categories.data).map((id) => {
                        const category = id.split('/').pop();
                        return (React.createElement("section", { key: `category-${category}` },
                            React.createElement("h1", null,
                                React.createElement("a", { id: id }),
                                utils_1.categoryLabel(id),
                                " (",
                                categories.data[id],
                                ")"),
                            !config_1.default.expandableLists || this.isExpanded(id)
                                ? (posts && posts.data ? (React.createElement(posts_1.Posts, { posts: utils_1.filterPostsByCategories(posts.data, [category]), full: true, actions: actions })) : 'Loading posts') : null));
                    });
                }
            })()));
    }
}
exports.CategoryList = react_redux_1.connect((state) => ({
    categories: state.categories,
    content: state.content,
    posts: state.posts
}))(CategoryListComponent);
/**
 * Unconnected component for generating a list of categories and the number
 * of posts that has that category
 */
const CategoryCountsComponent = ({ categories, actions }) => {
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
    return (React.createElement("ul", { className: "categories" }, Object.keys(categories).sort().map((id) => {
        let parts = id.split('/');
        const level = parts.length - 1;
        id = parts[parts.length - 1];
        return (React.createElement("li", { key: id, style: { marginLeft: level * 15 } },
            React.createElement(react_router_dom_1.Link, { to: urlJoin(config_1.default.baseUri, config_1.default.categoriesUri +
                    (config_1.default.categoriesPerPage ? '' : '#') + id) },
                id,
                " (",
                categories[id],
                ")")));
    })));
};
exports.Categories = react_redux_1.connect((state) => ({
    categories: state.categories
}))(CategoryCountsComponent);
