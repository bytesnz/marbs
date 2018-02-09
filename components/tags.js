"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const React = require("react");
const post_1 = require("./post");
const makeLabel = (id) => id;
class TagListComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expandedTags: []
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
            this.state.expandedTags = [tag];
        }
        else {
            this.state.expandedTags = [];
        }
    }
    label({ tag, count }) {
        return (React.createElement("a", { href: `#${tag}` },
            tag,
            " (",
            count,
            ")"));
    }
    render() {
        let { tags, posts, ListPost } = this.props;
        ListPost = ListPost || post_1.ListPost;
        if (tags === null) {
            return null;
        }
        tags = tags.data;
        posts = posts && posts.data || null;
        return (React.createElement("main", null,
            React.createElement("h1", null, "Tags"),
            posts && posts.error ? (React.createElement("div", { className: "error" },
                "There has been an error fetching the posts: ",
                posts.error.message)) : null,
            React.createElement(exports.TagCloud, { Label: this.label }),
            Object.keys(tags).sort().map((id) => (React.createElement("section", { key: id },
                React.createElement("h1", null,
                    React.createElement("a", { id: id }),
                    makeLabel(id),
                    " (",
                    tags[id],
                    ")"),
                posts ? posts.filter((post) => post.attributes
                    && post.attributes.tags
                    && post.attributes.tags.indexOf(id) !== -1).map((post) => (React.createElement(ListPost, { key: post.id, post: post }))) : null)))));
    }
}
exports.TagList = react_redux_1.connect((state) => ({
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
    return Object.keys(tags).map((id) => (React.createElement("span", { key: id, style: { fontSize: `${size(tags[id])}%` } },
        React.createElement(Label, { tag: id, count: tags[id] }))));
};
exports.TagCloud = react_redux_1.connect((state) => ({
    tags: state.tags
}))(TagCloudComponent);
