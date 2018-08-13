import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as urlJoin from 'join-path';
import {
  categoryLabel,
  categoryUrl,
  flattenCategories,
  tagLabel,
  tagUrl,
} from '../lib/utils';
import {
  filterPostsByTags,
  filterPostsByCategories
} from '../lib/utils';
import { parseAttributes } from '../lib/client/attributes';

import config from '../app/lib/config';

const PostsComponent = ({ posts, _posts, limit, filter, actions, full }) => {
  if (typeof posts === 'undefined') {
    if (_posts === null) {
      actions.posts.fetchPosts();
      return null;
    }

    if (typeof _posts.data === 'undefined') {
      return null;
    }

    posts = _posts.data;
  }

  if (filter) {
    posts = filter(posts);
  }

  if (limit) {
    posts = posts.slice(0, limit);
  }

  if (full) {
    return (
      <ul className="posts full">
        { posts.map((post) => (
          <li key={post.id} className={
              post.attributes.categories ?
              flattenCategories(post.attributes.categories).join(' ') : ''
          }>
            { post.attributes.date ? (
              <time dateTime={post.attributes.date}>
                {(new Date(post.attributes.date)).toLocaleDateString()}
              </time>
            ) : null }
            <h1>
              <Link to={urlJoin(config.baseUri, post.id)}>
                {post.attributes.title}
              </Link>
            </h1>
            { post.attributes.tags ? (
              <div className="tags">
                {post.attributes.tags.map((tag) => (
                  <Link key={tag} to={tagUrl(tag)}>
                    {tagLabel(tag)}
                  </Link>
                ))}
              </div>
            ) : null }
            { post.attributes.categories ? (
              <div className="categories">
                {flattenCategories(post.attributes.categories).map((category) => (
                  <Link key={category} to={categoryUrl(category)}>
                    {categoryLabel(category)}
                  </Link>
                ))}
              </div>
            ) : null }
          </li>
        )) }
      </ul>
    );
  } else {
    return (
      <ul className="posts">
        { posts.map((post) => (
          <li key={post.id}>
            <Link to={urlJoin(config.baseUri, post.id)}>
              {post.attributes.title}
            </Link>
          </li>
        )) }
      </ul>
    );
  }
};

export const Posts = connect((state) => ({
  _posts: state.posts
}))(PostsComponent);

/**
 * {@posts } tag handler
 */
export const PostsTagComponent = ({ posts, attributes, actions }) => {
  if (posts === null) {
    actions.posts.fetchPosts();
    return null;
  }

  if (typeof posts.data === 'undefined') {
    return null;
  }

  posts = posts.data;

  if (attributes.tags) {
    attributes.tags = attributes.tags.split(/ *, */g)
    posts = filterPostsByTags(posts, attributes.tags, attributes.allTags);
  }

  if (attributes.categories) {
    attributes.categories = attributes.categories.split(/ *, */g);
    posts = filterPostsByCategories(posts, attributes.categories, attributes.allCategories);
  }

  if (attributes.from) {
    const from = (new Date(attributes.from)).getTime();
    if (!isNaN(from)) {
      posts.filter((post) => post.attributes.date >= from);
    } else if (process.env.NODE_ENV !== 'production') {
      console.error(`Ignoring from attribute (${attributes.from}) in posta tag as not valid`);
    }
  }

  if (attributes.to) {
    const to = (new Date(attributes.to)).getTime();
    if (!isNaN(to)) {
      posts.filter((post) => post.attributes.date >= to);
    } else if (process.env.NODE_ENV !== 'production') {
      console.error(`Ignoring to attribute (${attributes.to}) in posta tag as not valid`);
    }
  }

  return (<Posts posts={posts} full={attributes.full} />);
};

export const PostsTag = connect((state) => ({
  posts: state.posts
}))(PostsTagComponent);
