import * as React from 'react';
import { Link } from 'react-router-dom';
import * as urlJoin from 'join-path';

import { Menu } from './menu';

import config from '../app/lib/config';

export const Header = () => (
  <header className="siteHeader" role="banner">
    <h1>{config.title}</h1>
    <Menu />
  </header>
);
