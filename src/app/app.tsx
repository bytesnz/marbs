import * as React from 'react';
import * as urlJoin from 'join-path';

import config from './lib/config';

import { Helmet } from 'react-helmet';
import { Route, Switch } from 'react-router';

import { TagList } from '../components/tags';
import { CategoryList } from '../components/categories';
import { Content } from '../components/content';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { Sidebar } from '../components/sidebar';

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

export default () => {
  return (
    <div>
      <Helmet>
        <title>{config.title}</title>
        { config.description ? (
            <meta name="description" content={config.description} />
        ) : null }
        { config.description ? (
        <meta property="og:description" content={config.description} />
        ) : null }
        { config.description ? (
        <meta name="twitter:description" content={config.description} />
        ) : null }
        <meta property="og:type" content="website" />
        <meta property="og:title" content={config.title} />
        <meta property="og:url" content="" />
        <meta property="og:site_name" content={config.title} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={config.title} />
      </Helmet>
      <Header/>
      <Sidebar toggle={true} toggleUsingClass={true} />
      <main>
        <Route component={Content} />
        <Route path={`${urlJoin('/', config.baseUri, config.tagsUri)}`} component={TagList} />
        <Route path={`${urlJoin('/', config.baseUri, config.categoriesUri)}`} component={CategoryList} />
      </main>
      <Footer/>
    </div>
  );
};
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
