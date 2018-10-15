import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { connect } from '../lib/client/marss';
import * as urlJoin from 'join-path';
import {
  categoryLabel,
  categoryUrl,
  flattenCategories,
  documentUrl,
  tagLabel,
  tagUrl,
} from '../lib/utils';
import { Manager as LoaderManager, connectLoader } from './loader';

import config from '../app/lib/config';

//const oldRequire = require
import { Markdown } from './markdown';
import { Posts } from './posts';

// TODO Show previous content until new content is loaded
// TODO Add loading status while loading
class ContentComponent extends React.Component {
  props: {
    actions: any,
    loader: LoaderManager,
    content: any, //TODO Properly type
    location: any,
    posts: any
  };

  constructor(props) {
    super(props);

    if (props.posts === null) {
      props.actions.posts.fetchPosts();
    }

    this.checkContent(props);
  }

  componentWillReceiveProps(newProps) {
    this.checkContent(newProps);
  }

  correctId(contentId, id) {
    if (contentId === id) {
      return true;
    } else if (contentId === (id ? id + '/index' : 'index')) {
      return true;
    }

    return false;
  }

  checkContent(props) {
    const { actions } = props;
    let update = null;

    const route = props.location;
    let { content } = props;
    const id = route.pathname.slice(config.baseUri.length);

    if (content && content.data && !this.correctId(content.data.id, id)) {
      //actions.content.clearContent();
      content = null;
      update = {
        loading: true
      }
    }

    if (content === null || (update && update.loading === true)) {
      const promise = actions.content.fetchContent(id);
      if (this.props.loader) {
        this.props.loader.add(promise);
      }
    }

    return update;
  }

  render() {
    let { content } = this.props;
    const route = this.props.location;
    const id = route.pathname.slice(config.baseUri.length);

    // Don't show content if it is not for the routed id
    if (content && content.data && !this.correctId(content.data.id, id)) {
      content = null;
    }

    if (!content) {
      return null;
    }

    if (content.error) {
      if (id.startsWith(config.tagsUri)) {
        return null;
      }

      if (content.error.code === 404) {
        return (
          <section>
            <Helmet>
              <title>Four Oh Four</title>
            </Helmet>
            <h1>Four Oh Four!</h1>
            <p>
              You've gone into the unknown. Please try navigating back to the
              light.
            </p>
          </section>
        );
      }

      return (
        <section>
          <Helmet>
            <title>Error</title>
          </Helmet>
          <h1>{content.error.code} Error</h1>
          <p>
            There has been an error accessing the page you wanted. Please try
            again.
          </p>
        </section>
      );
    }

    if (!content.data) {
      return null;
    }


    const attributes = content.data.attributes || {};

    let nextPost, previousPost;
    if (!attributes.type || attributes.type === 'post') {
      if (this.props.posts && this.props.posts.data) {
        const index = this.props.posts.data.findIndex((post) => post.id === content.data.id);

        if (index !== -1) {
          if (index !== 0) {
            nextPost = this.props.posts.data[index-1];
          }
          if (index !== this.props.posts.data.length-1) {
            previousPost = this.props.posts.data[index+1];
          }
        }
      }
    }

    return [
      id !== '' ? (
        <Helmet key="helmet">
          <title>{config.windowTitle(config, attributes.title)}</title>
        </Helmet>
      ) : null,
      (
        <article key="article" className={!attributes.type ? 'post' : attributes.type}>
          { (!attributes.type || attributes.type === 'post') ? (
            <header>
              { (attributes.date) ?
                  (
                    <time dateTime={attributes.date}>
                      {(new Date(attributes.date)).toLocaleDateString()}
                    </time>
                  )
                  : null
              }
              <h1>{attributes.title}</h1>
            </header>
          ) : null }
          <Markdown className="documentBody" source={content.data.body} />
          { (!attributes.type || attributes.type === 'post') ? (
            <footer>
              { attributes.tags ? (
                <div className="tags">
                  {attributes.tags.map((tag) => (
                    <Link key={tag} to={tagUrl(tag)}>
                      {tagLabel(tag)}
                    </Link>
                  ))}
                </div>
              ) : null }
              { attributes.categories ? (
                <div className="categories">
                  {flattenCategories(attributes.categories).map((category) => (
                    <Link key={category} to={categoryUrl(category)}>
                      {categoryLabel(category)}
                    </Link>
                  ))}
                </div>
              ) : null }
              <nav>
                { previousPost ? (
                  <Link className="previousPost" to={documentUrl(previousPost.id)}>{previousPost.attributes.title}</Link>
                ) : null }
                { nextPost ? (
                  <Link className="nextPost" to={documentUrl(nextPost.id)}>{nextPost.attributes.title}</Link>
                ) : null }
              </nav>
            </footer>
          ) : null }
        </article>
      ),
      (id === '' && typeof config.listLastOnIndex === 'number' && config.listLastOnIndex >= 0) ? (
          <Posts key="posts" actions={this.props.actions} limit={config.listLastOnIndex} full={true} />
        ) : null
    ];
  }
}

const LoadedContentComponent = connectLoader(ContentComponent);

export const Content = connect(LoadedContentComponent, (state) => ({
  content: state ? state.content : null,
  posts: state.posts
}));
