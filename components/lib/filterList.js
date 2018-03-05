"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class FilterListComponent extends React.Component {
    constructor() {
        super(...arguments);
        /** Whether or not the hash prop value is new and should be scrolled to */
        this.newHash = false;
    }
    /** Returns whether should scroll to a new hash */
    shouldScroll() {
        return true;
    }
    /**
     * Checks to see if the hash has change in the location and flags it as
     * a new hash if it has
     */
    componentWillReceiveProps(props) {
        const oldHash = this.props.location && this.props.location.hash && this.props.location.hash.slice(1);
        const hash = props.location && props.location.hash && props.location.hash.slice(1);
        if (hash !== oldHash) {
            const expanded = this.state.expanded.slice();
            if (hash && expanded.indexOf(hash) === -1) {
                expanded.push(hash);
            }
            if (oldHash) {
                const index = expanded.indexOf(oldHash);
                if (index !== -1) {
                    expanded.splice(index, 1);
                }
            }
            this.setState({
                expanded
            });
            this.newHash = true;
        }
    }
    /** Calls scrollToHash on component mount */
    componentDidMount() {
        this.scrollToHash();
    }
    /** Calls scrollToHash on component update */
    componentDidUpdate() {
        this.scrollToHash();
    }
    /** Scrolls to the hash in the location if newHash is set */
    scrollToHash() {
        const hash = this.props.location && this.props.location.hash && this.props.location.hash.slice(1);
        if (this.shouldScroll() && hash && this.newHash) {
            document.getElementById(hash).scrollIntoView();
            this.newHash = false;
        }
    }
    /** Returns whether a tag is expanded */
    isExpanded(tag) {
        return this.state.expanded.indexOf(tag) !== -1;
    }
    /** Toggles the expansion of a tag */
    toggle(tag) {
        const expanded = this.state.expanded.slice();
        const index = this.state.expanded.indexOf(tag);
        if (index !== -1) {
            expanded.splice(index, 1);
        }
        else {
            expanded.push(tag);
        }
        this.setState({
            expanded
        });
    }
}
exports.FilterListComponent = FilterListComponent;
