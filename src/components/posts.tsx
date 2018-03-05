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
