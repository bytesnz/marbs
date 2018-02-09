import * as React from 'react';
import { connect } from 'react-redux';
import config from '../app/lib/config';

//const oldRequire = require
import { Markdown } from './markdown';

// TODO Show previous content until new content is loaded
// TODO Add loading status while loading
class ContentComponent extends React.Component {
  props: {
    content: any, //TODO Properly type
    location: any
  };

  constructor(props) {
    super(props);

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

    const route = props.location;
    let { content } = props;
    const id = route.pathname.slice(config.baseUri.length);

    if (content && content.data && !this.correctId(content.data.id, id)) {
      //actions.content.clearContent();
      content = null;
    }

    if (content === null) {
      actions.content.fetchContent(id);
    }
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
      return null;
    }

    if (!content.data) {
      return null;
    }


    const attributes = content.data.attributes || {};

    return (
      <article>
        <header>
          <h1>{attributes.title}</h1>
          { (attributes.date && attributes.date.toDateString) ?
                (
                  <time dateTime={attributes.date.toDateString()}>
                    {attributes.date.toDateString()}
                  </time>
                )
                : null
           }
        </header>
        <Markdown source={content.data.body} />
        <footer>
        </footer>
      </article>
    );
  }
}

export const Content = connect((state) => ({
  content: state ? state.content : null
}))(ContentComponent);
