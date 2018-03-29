import { connect } from 'react-redux';
import * as React from 'react';
import { Link } from 'react-router-dom';
import * as urlJoin from 'join-path';
import {
  filterPostsByTags,
  tagLabel
} from '../lib/utils';

import config from '../app/lib/config';

import {
  ListPost as DefaultListPost
} from './post';
import { Posts } from './posts';

import { TagsState } from '../reducers/tags';

import { FilterListComponent } from './lib/filterList';

class TagListComponent extends FilterListComponent {
  state: {
    expanded: Array<string>
  } = {
    expanded: null
  }

  props: {
    actions: any,
    content: any,
    location: any,
    tags: TagsState,
    posts: any,
    ListPost?: any
  }

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
      this.state.expanded = [tag];
    } else {
      this.state.expanded = [];
    }
  }

  shouldScroll() {
    return Boolean(this.props.tags && this.props.tags.data)
  }

  error(errorSource: string, error) {
    return (
      <p className="error" key={errorSource}>
        There is was an error getting the { errorSource }:
        { error.message }
      </p>
    );
  }

  render() {
    let { content, tags, posts, ListPost } = this.props;

    return [
      content ? null : (
        <header key="header">
          <h1>Tags</h1>
        </header>
      ),
      (() => {
        if (!tags) {
          return 'Loading tags list';
        } else if (tags.error) {
          return this.error('tags', tags.error);
        } else if (posts && posts.error) {
          return this.error('posts', posts.error);
        } else {
          return [(<TagCloud key="cloud" />)].concat(
            Object.keys(tags.data).sort().map((id) => (
              <section className="postList" key={id}>
                <h1 className={ config.expandableLists
                    && this.isExpanded(id) ? 'expanded' : '' }
                    onClick={config.expandableLists ? () => this.toggle(id) : null}>
                  <a id={id} />
                  {tagLabel(id)} ({tags.data[id]})
                </h1>
                { !config.expandableLists || this.isExpanded(id)
                    ? (posts ? (posts.data ? (<Posts
                    posts={filterPostsByTags(posts.data, [id])}
                    full={true} actions={this.props.actions} />)
                    : null) : 'Loading posts') : null }
              </section>
            ))
          );
        }
      })()
    ];
  }
}

export const TagList = connect((state) => ({
  content: state.content,
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

  return (
    <ul className="tagCloud">
      { Object.keys(tags).sort().map((id) => (
      <li key={id} style={{ fontSize: `${size(tags[id])}%` }}>
        <Link to={urlJoin(config.baseUri, config.tagsUri + '#' + id)}>
          {id} ({tags[id]})
        </Link>
      </li>
      )) }
    </ul>
  );
};

export const TagCloud = connect((state) => ({
  tags: state.tags
}))(TagCloudComponent);
