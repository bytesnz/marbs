import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import * as io from 'socket.io-client';

import { createMarss, Provider as MarssContext } from '../lib/client/marss';
import { loader } from '../components/loader';
import config from './lib/config';

import './style.scss';

import App from './app';

const history = createHistory();

// disable react-dev-tools for this project
if (process.env.NODE_ENV === 'production') {
  if (typeof window['__REACT_DEVTOOLS_GLOBAL_HOOK__'] === "object") {
    for (let [key, value] of Object.entries(window['__REACT_DEVTOOLS_GLOBAL_HOOK__'])) {
      window['__REACT_DEVTOOLS_GLOBAL_HOOK__'][key] = typeof value == "function" ? ()=>{} : null;
    }
  }
}

(async () => {
  const socket = io({
  });

  const baseUriLength = (config.baseUri || '/').length;
  const uri = history.location.pathname;

  let middleware;
  if (process.env.NODE_ENV !== 'production') {
    middleware = require('redux-devtools-extension').composeWithDevTools();
  }

  const marss = await createMarss(config, socket, middleware);

  const elements = (
    <MarssContext marss={marss}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </MarssContext>
  );

  await new Promise((resolve, reject) => {
    const div = document.createElement('div');
    const waitRender = () => {
      ReactDom.render(elements, div)

      if (loader.loading) {
        loader.loading.then((errors) => {
          if (errors && errors.length) {
            console.error('got errors', errors);
            reject(errors);
            return;
          }

          setTimeout(waitRender, 0);
        })
      } else {
        resolve();
      }
    };
    waitRender();
  });

  ReactDom.hydrate(elements, document.getElementById('app'));
})();
