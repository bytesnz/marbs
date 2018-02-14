import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as urlJoin from 'join-path';

import config from '../app/lib/config';

const PostsComponent = ({ posts, limit, actions }) => {
  if (posts === null) {
    actions.posts.fetchPosts();
    return null;
  }

  if (posts.data) {
    posts = posts.data;
  } else {
    return null;
  }

  if (limit) {
    posts = posts.slice(0, limit);
  }

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
};

export const Posts = connect((state) => ({
  posts: state.posts
}))(PostsComponent);
