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
var FilterListComponent = /** @class */ (function (_super) {
    __extends(FilterListComponent, _super);
    function FilterListComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** Whether or not the hash prop value is new and should be scrolled to */
        _this.newHash = false;
        return _this;
    }
    /** Returns whether should scroll to a new hash */
    FilterListComponent.prototype.shouldScroll = function () {
        return true;
    };
    /**
     * Checks to see if the hash has change in the location and flags it as
     * a new hash if it has
     */
    FilterListComponent.prototype.componentWillReceiveProps = function (props) {
        var oldHash = this.props.location && this.props.location.hash && this.props.location.hash.slice(1);
        var hash = props.location && props.location.hash && props.location.hash.slice(1);
        if (hash !== oldHash) {
            var expanded = this.state.expanded.slice();
            if (hash && expanded.indexOf(hash) === -1) {
                expanded.push(hash);
            }
            if (oldHash) {
                var index = expanded.indexOf(oldHash);
                if (index !== -1) {
                    expanded.splice(index, 1);
                }
            }
            this.setState({
                expanded: expanded
            });
            this.newHash = true;
        }
    };
    /** Calls scrollToHash on component mount */
    FilterListComponent.prototype.componentDidMount = function () {
        this.scrollToHash();
    };
    /** Calls scrollToHash on component update */
    FilterListComponent.prototype.componentDidUpdate = function () {
        this.scrollToHash();
    };
    /** Scrolls to the hash in the location if newHash is set */
    FilterListComponent.prototype.scrollToHash = function () {
        var hash = this.props.location && this.props.location.hash && this.props.location.hash.slice(1);
        if (this.shouldScroll() && hash && this.newHash) {
            document.getElementById(hash).scrollIntoView();
            this.newHash = false;
        }
    };
    /** Returns whether a tag is expanded */
    FilterListComponent.prototype.isExpanded = function (tag) {
        return this.state.expanded.indexOf(tag) !== -1;
    };
    /** Toggles the expansion of a tag */
    FilterListComponent.prototype.toggle = function (tag) {
        var expanded = this.state.expanded.slice();
        var index = this.state.expanded.indexOf(tag);
        if (index !== -1) {
            expanded.splice(index, 1);
        }
        else {
            expanded.push(tag);
        }
        this.setState({
            expanded: expanded
        });
    };
    return FilterListComponent;
}(React.Component));
exports.FilterListComponent = FilterListComponent;
//# sourceMappingURL=filterList.js.map