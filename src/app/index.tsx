import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createHistory from 'history/createBrowserHistory';
import * as urlJoin from 'join-path';

import * as io from 'socket.io-client';

import { createMarss, livenActions } from '../lib/client/marss';
import config from './lib/config';

import '../style.scss';

import { TagList } from '../components/tags';
import { CategoryList } from '../components/categories';
import { Content } from '../components/content';
import { Header } from '../components/header';
import { Footer } from '../components/footer';

const history = createHistory();

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
}

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return renderMergedProps(component, routeProps, rest);
    }}/>
  );
}

(async () => {
  const socket = io({
  });

  const marss = await createMarss(config);

  const store = createStore(marss.reducers, marss.initialState,
  composeWithDevTools());

  const actions = livenActions(marss.actions, store, config, socket);

  ReactDom.render((
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <div>
          <Header/>
            <PropsRoute actions={actions} component={Content} />
            <PropsRoute path={`${urlJoin('/', config.baseUri, config.tagsUri)}`} actions={actions} component={TagList} />
            <PropsRoute path={`${urlJoin('/', config.baseUri, config.categoriesUri)}`} actions={actions} component={CategoryList} />
          <Footer/>
        </div>
      </ConnectedRouter>
    </Provider>
  ), document.getElementById('app'));
  /*
              <Route path={config.tagsUri}>
                <TagList actions={actions} />
              </Route>
              <Route path={config.categoriesUri}>
                <CategoryList actions={actions} />
              </Route>
              <Route>
                <Content actions={actions} />
              </Route>
   */
})();
