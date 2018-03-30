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
var react_router_dom_1 = require("react-router-dom");
var react_router_1 = require("react-router");
var tags_1 = require("./tags");
var posts_1 = require("./posts");
var categories_1 = require("./categories");
var menu_1 = require("./menu");
var utils_1 = require("../lib/utils");
var SidebarComponent = /** @class */ (function (_super) {
    __extends(SidebarComponent, _super);
    function SidebarComponent(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            expanded: null
        };
        _this.toggle = _this.toggle.bind(_this);
        return _this;
    }
    SidebarComponent.prototype.componentWillReceiveProps = function (newProps) {
        if (this.state.expanded && newProps.location.pathname !== this.state.expanded) {
            this.setState({
                expanded: null
            });
        }
    };
    SidebarComponent.prototype.toggle = function () {
        this.setState({
            expanded: !this.state.expanded ? this.props.location.pathname : null
        });
    };
    SidebarComponent.prototype.render = function () {
        var toggle = this.props.toggle ? (React.createElement("button", { className: "toggle", onClick: this.toggle })) : null;
        var show = !this.props.toggle || this.state.expanded;
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
                        show ? (React.createElement(tags_1.TagCloud, { actions: this.props.actions, Label: function (_a) {
                                var tag = _a.tag, count = _a.count;
                                return (React.createElement(react_router_dom_1.Link, { to: "" },
                                    tag,
                                    " (",
                                    count,
                                    ")"));
                            } })) : null,
                        React.createElement("h1", null,
                            React.createElement(react_router_dom_1.Link, { to: utils_1.categoryUrl() }, "Categories")),
                        show ? (React.createElement(categories_1.Categories, { actions: this.props.actions })) : null))));
        }
        else {
            return toggle;
        }
    };
    return SidebarComponent;
}(React.Component));
;
exports.Sidebar = react_router_1.withRouter(SidebarComponent);
//# sourceMappingURL=sidebar.js.map