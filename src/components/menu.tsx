import * as React from 'react';
import { Link } from 'react-router-dom';
import * as urlJoin from 'join-path';

import config from '../app/lib/config';

const menuItem = (item, index) => {
  if (item.children) {
    return (<li key={index}>
      <span>{item.label}</span>
      <ul>
        { item.map(menuItem) }
      </ul>
    </li>);
  } else if (item.link) {
    return (
      <li key={index}>
        <Link to={urlJoin('/', config.baseUri, item.link)} accesskey={ item.accesskey || null }>
        {item.label}
        </Link>
      </li>
    );
  }

  return null;
};

export const Menu = () => {
    if (config.menu) {
      return (
        <nav>
          <ul>
            { config.menu.map(menuItem) }
          </ul>
        </nav>
      );
    }

    return null;
};
