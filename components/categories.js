"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const React = require("react");
const react_router_dom_1 = require("react-router-dom");
const urlJoin = require("join-path");
const config_1 = require("../app/lib/config");
const post_1 = require("./post");
class CategoryListComponent extends React.Component {
    constructor(props) {
        super(props);
        if (props.params.category) {
            this.state.expandedCategories = [props.params.category];
        }
        else {
            this.state.expandedCategories = [];
        }
    }
    render() {
        let { categories, posts, ListPost } = this.props;
        ListPost = ListPost || post_1.ListPost;
        return (React.createElement("main", null,
            React.createElement("h1", null, "Categories"),
            categories.filter((category) => category.forEach((id) => (React.createElement("section", { "key-id": `tag-${id}` },
                React.createElement("h1", null,
                    categories[id].label,
                    " (",
                    categories[id].count,
                    ")"),
                posts.filter((post) => post.categories.indexOf(id) !== -1).forEach((post) => (React.createElement(ListPost, { post: post })))))))));
    }
}
exports.CategoryList = react_redux_1.connect((state) => ({
    categories: state.categories,
    posts: state.posts
}))(CategoryListComponent);
const CategoriesComponent = ({ categories, actions }) => {
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
    return (React.createElement("ul", { className: "categories" }, Object.keys(categories).sort().map((id) => (React.createElement("li", { key: id },
        React.createElement(react_router_dom_1.Link, { to: urlJoin(config_1.default.baseUri, config_1.default.categoriesUri +
                (config_1.default.categoriesPerPage ? '' : '#') + id) },
            id,
            " (",
            categories[id],
            ")"))))));
};
exports.Categories = react_redux_1.connect((state) => ({
    categories: state.categories
}))(CategoriesComponent);
