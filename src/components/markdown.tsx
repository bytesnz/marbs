import * as React from 'react';
import * as twitchdown from 'twitchdown';

import { Plugin as RST } from 'remarkably-simple-tags'
import * as tags from '../lib/client/mdTags';
import { PostsTag } from './posts';
import { Categories } from './categories';
import { TagList, TagCloud } from './tags';

import config from '../app/lib/config';

/// Highlight.js base
let highlighter;
/// Highlight.js language packs
let languages = {};

declare var System: {
  import(file: string): Promise<any>;
}

export class Markdown extends React.Component {
  state: {
    highlighter: any,
    highlighterOptions: any,
    rdOptions: any,
  };

  props: {
    source: string,
    className: string
  };

  mounted: boolean = false;

  constructor(props) {
    super(props);

    const highlighterOptions = {
      showLineNumbers: true,
      style: null
    };

    this.state = {
      highlighter: null,
      highlighterOptions,
      rdOptions: {
        highlight: this.highlight.bind(this),
        createElement: React.createElement,
        paragraphs: true,
        headingIds: true,
        customTags: {
          posts: (attributes) =>  React.createElement(PostsTag, { attributes }),
          categories: () => React.createElement(Categories),
          taglist: () => React.createElement(TagList),
          tagcloud: () => React.createElement(TagCloud),
          postUrl: () => tags.post,
          categoriesUrl: () => tags.categories,
          tagsUrl: () => tags.tags,
          assetUrl: () => tags.asset
        }
      }
    };

    // Try render to start process of getting highlight libraries
    twitchdown(this.props.source);
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    let markdown = twitchdown(this.props.source, this.state.rdOptions);

    return (
      <div className={this.props.className}>
        { markdown }
      </div>
    );
  }

  tryHighlight(content: string, language: string) {
    if (language === 'unknown' || languages[language] === false || this.state.highlighter === false) {
      return '';
    }

    if (this.state.highlighter && languages[language]
        && !(languages[language] instanceof Promise)) {
      return React.createElement(highlighter.default, {
        ...this.state.highlighterOptions,
        language
      }, content);
    }

    return null;
  }

  highlight(content: string, language: string = 'text') {
    const attempt = this.tryHighlight(content, language);
    if (attempt !== null) {
      return attempt;
    } else {
      // Load the language pack and base if needed
      let promises = [];

      if (highlighter instanceof Promise) {
        promises.push(highlighter);
      } else if (typeof highlighter === 'undefined') {
        highlighter = Promise.all([
          System.import('react-syntax-highlighter/light'),
          System.import('react-syntax-highlighter/styles/hljs/default-style')
        ]).then(([highlightModule, style]) => {
          highlighter = highlightModule;

          if (this.mounted) {
            this.setState({
              highlighter: highlightModule,
              highlighterOptions: {
                ...this.state.highlighterOptions,
                style: style.default
              }
            });
          } else {
            this.state.highlighter = highlightModule;
          }
        }, (error) => {
          console.error('could not load code highlighter', error);

          if (this.mounted) {
            this.setState({
              highlighter: false
            });
          } else {
            this.state.highlighter = false;
          }
        });
        promises.push(highlighter);
      }

      if (language !== 'unknown') {
        if (languages[language] instanceof Promise) {
          promises.push(languages[language]);
        } else if (typeof languages[language] === 'undefined') {
          languages[language] = System.import(`react-syntax-highlighter/languages/hljs/${language}`).then((languagePack) => {
            if (!languagePack) {
              console.error('Could not import language', language);
              languages[language] = false;
              return;
            }

            if (highlighter instanceof Promise) {
              return highlighter.then(() => {
                languages[language] = languagePack.default;
                highlighter.registerLanguage(language, languages[language]);
                this.forceUpdate();
              });
            } else {
              languages[language] = languagePack.default;
              highlighter.registerLanguage(language, languages[language]);
              this.forceUpdate();
            }
          }, (error) => {
            console.error('Could not load code highlighter language for ' + language, error);
            languages[language] = false;
          });
          promises.push(languages[language]);
        }
      }

      if (!promises.length) {
        return this.tryHighlight(content, language);
      } else {
        return '';
      }
    }
  }
}
