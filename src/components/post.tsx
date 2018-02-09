import * as React from 'react';
import config from '../app/lib/config';
import { Link } from 'react-router-dom';

import * as urlJoin from 'join-path';

export const ListPost = ({ post }) => {
  const attributes = post.attributes;

  return (
    <Link to={urlJoin(config.baseUri, post.id)} className="listPost">
      <h1>{attributes.title}</h1>
    </Link>
  );
};
