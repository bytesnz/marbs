"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_router_dom_1 = require("react-router-dom");
const react_router_1 = require("react-router");
const tags_1 = require("./tags");
const posts_1 = require("./posts");
const categories_1 = require("./categories");
const menu_1 = require("./menu");
const utils_1 = require("../lib/utils");
class SidebarComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: null
        };
        this.toggle = this.toggle.bind(this);
    }
    componentWillReceiveProps(newProps) {
        if (this.state.expanded && newProps.location.pathname !== this.state.expanded) {
            this.setState({
                expanded: null
            });
        }
    }
    toggle() {
        this.setState({
            expanded: !this.state.expanded ? this.props.location.pathname : null
        });
    }
    render() {
        const toggle = this.props.toggle ? (React.createElement("button", { className: "toggle", onClick: this.toggle })) : null;
        const show = !this.props.toggle || this.state.expanded;
        if (show || this.props.toggleUsingClass) {
            return (React.createElement("div", { className: 'sidebar' + (this.props.toggleUsingClass && show ? ' expanded' : '') },
                this.props.toggle ? (React.createElement("div", { className: "cover", onClick: this.toggle })) : null,
                React.createElement("div", { className: "bar" },
                    toggle,
                    React.createElement("div", { className: "contents" },
                        React.createElement("h1", null, "Navigation"),
                        React.createElement(menu_1.Menu, null),
                        React.createElement("h1", null, "Recent Posts"),
                        show ? (React.createElement(posts_1.Posts, { limit: 10, actions: this.props.actions })) : null,
                        React.createElement("h1", null,
                            React.createElement(react_router_dom_1.Link, { to: utils_1.tagUrl() }, "Tags")),
                        show ? (React.createElement(tags_1.TagCloud, { actions: this.props.actions, Label: ({ tag, count }) => (React.createElement(react_router_dom_1.Link, { to: "" },
                                tag,
                                " (",
                                count,
                                ")")) })) : null,
                        React.createElement("h1", null,
                            React.createElement(react_router_dom_1.Link, { to: utils_1.categoryUrl() }, "Categories")),
                        show ? (React.createElement(categories_1.Categories, { actions: this.props.actions })) : null))));
        }
        else {
            return toggle;
        }
    }
}
;
exports.Sidebar = react_router_1.withRouter(SidebarComponent);
