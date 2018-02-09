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
    return (<Link key={index} to={urlJoin('/', config.baseUri, item.link)}>
      {item.label}
    </Link>);
  }

  return null;
};

export const Header = () => (
  <header role="banner">
    <h1>{config.title}</h1>
    { config.menu ? (
      <nav>
        <ul>
          { console.log(config.menu, config.menu.map(menuItem)) || config.menu.map(menuItem) }
        </ul>
      </nav>
    ) : null }
  </header>
);
