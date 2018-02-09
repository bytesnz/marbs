import { connect } from 'react-redux';
import * as React from 'react';

import {
  ListPost as DefaultListPost
} from './post';

import { TagsState } from '../reducers/tags';

const makeLabel = (id: string): string => id;

class TagListComponent extends React.Component {
  state: {
    expandedTags: Array<string>
  } = {
    expandedTags: []
  };

  props: {
    tags: TagsState,
    posts: any,
    ListPost?: any
  };

  constructor(props) {
    super(props);

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
    } else {
      this.state.expandedTags = [];
    }
  }

  label({tag, count}) {
    return (
      <a href={`#${tag}`}>
        {tag} ({count})
      </a>
    );
  }

  render() {
    let { tags, posts, ListPost } = this.props;
    ListPost = ListPost || DefaultListPost;

    if (tags === null) {
      return null;
    }

    tags = tags.data;
    posts = posts && posts.data || null;

    return (
      <main>
        <h1>Tags</h1>
        { posts && posts.error ? (
          <div className="error">
            There has been an error fetching the posts: {posts.error.message}
          </div>
        ) : null }
        <TagCloud Label={this.label} />
        { Object.keys(tags).sort().map((id) => (
          <section key={id}>
            <h1>
              <a id={id} />
              {makeLabel(id)} ({tags[id]})
            </h1>
            { posts ? posts.filter((post) => post.attributes 
                && post.attributes.tags
                && post.attributes.tags.indexOf(id) !== -1).map((post) => (
              <ListPost key={post.id} post={post}/>
            )) : null }
          </section>
        ))}
      </main>
    );
  }
}

export const TagList = connect((state) => ({
  tags: state.tags,
  posts: state.posts
}))(TagListComponent);

const TagCloudComponent  = (props) => {
  let { actions, minSize, maxSize, tags, Label } = props;

  if (!minSize) {
    minSize = 0.7;
  }

  if (!maxSize) {
    maxSize = 1.5;
  }

  if (typeof Label !== 'function') {
    Label = ({ tag, count}) => `${tag} (${count})`;
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

  return Object.keys(tags).map((id) => (
    <span key={id} style={{ fontSize: `${size(tags[id])}%` }}>
      <Label tag={id} count={tags[id]} />
    </span>
  ));
};

export const TagCloud = connect((state) => ({
  tags: state.tags
}))(TagCloudComponent);
