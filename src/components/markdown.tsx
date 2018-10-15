import * as React from 'react';
import * as twitchdown from 'twitchdown';

import { Plugin as RST } from 'remarkably-simple-tags'
import * as tags from '../lib/client/mdTags';
import { PostsTag } from './posts';
import { Categories } from './categories';
import { TagList, TagCloud } from './tags';
import LinesGallery from 'lines-gallery/LinesGallery';
import { connect } from '../lib/client/marss';
import { connectLoader } from './loader';

import config from '../app/lib/config';

/// Highlight.js base
let highlighter = null;
/// Highlight.js language packs
let languages = {};
// Highlight.js styles
let highlighterStyles = {};

declare var System: {
  import(file: string): Promise<any>;
}

interface Media {
  [ images: string ]: Array<Media> | Error
};

export class MarkdownComponent extends React.Component {
  state: {
    highlighterLoaded: any,
    highlighterOptions: any,
    rdOptions: any,
    media: {
      [ attributes: string ]: Media
    }
  };

  props: {
    loader: any,
    source: string,
    className: string,
    media: any
  };

  mounted: boolean = false;

  constructor(props) {
    super(props);

    const highlighterOptions = {
      showLineNumbers: true
    };

    this.state = {
      highlighterLoaded: highlighter !== null,
      highlighterOptions,
      rdOptions: {
        highlight: this.highlight.bind(this),
        createElement: React.createElement,
        paragraphs: true,
        headingIds: true,
        parseArguments: true,
        customTags: {
          posts: (attributes) =>  React.createElement(PostsTag, { attributes }),
          categories: () => React.createElement(Categories),
          taglist: () => React.createElement(TagList),
          tagcloud: () => React.createElement(TagCloud),
          postUrl: (attributes) => attributes.arguments && tags.post(attributes.arguments[0]),
          categoriesUrl: (attributes) => attributes.arguments && tags.categories(attributes.arguments[0]),
          tagsUrl: (attributes) => attributes.arguments && tags.tags(attributes.arguments[0]),
          assetUrl: (attributes) => attributes.arguments && tags.asset(attributes.arguments[0])
        }
      },
      media: {}
    };

    if (config.functionality.media) {
      this.state.rdOptions.customTags.linesGallery = (attributes) => {
        const images  = this.getMedia(attributes);
        if (images) {
          return (
            <LinesGallery images={images} imageMargin={10} />
          );
        } else {
          return null;
        }
      };

      this.state.rdOptions.customTags.image = {
        inParagraph: true,
        handler: (attributes) => {
          if (attributes.arguments) {
            if (attributes.arguments.length) {
              attributes.src = tags.asset(attributes.arguments[0]);

              if (attributes.arguments.length >= 2) {
                attributes.title = attributes.arguments[1];

                if (attributes.arguments.length === 3) {
                  attributes.width = attributes.arguments[2];
                }
              }
            }

            delete attributes.arguments;
          }

          return (<img { ...attributes } />);
        }
      };
    }

    // Try render to start process of getting highlight libraries
    twitchdown(this.props.source);
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  static getDerivedStateFromProps(newProps, oldState) {
    if (newProps.content === null && Object.keys(oldState.media).length) {
      return {
        media: {}
      }
    }

    return null;
  }

  render() {
    let markdown = twitchdown(this.props.source, this.state.rdOptions);

    return (
      <div className={this.props.className}>
        { markdown }
      </div>
    );
  }

  getMedia(attributes) {
    const attributeString = JSON.stringify(attributes);

    if (typeof this.state.media[attributeString] === 'undefined') {
      this.setState({
        media: {
          ...this.state.media,
          [ attributeString ]: null
        }
      });
      attributes.ids = attributes.arguments;
      delete attributes.arguments;
      this.props.media.getMedia(attributes).then((media) => {
        this.setState({
          media: {
            ...this.state.media,
            [ attributeString ]: media
          }
        });
      }, (error) => {
        console.error('got error response', error);
      });
      return null;
    }

    return this.state.media[attributeString];
  }

  tryHighlight(content: string, language: string) {
    if (language === 'unknown' || languages[language] === false || highlighter === false) {
      return '';
    }

    if (highlighter && languages[language]
        && !(languages[language] instanceof Promise)) {
      return React.createElement(highlighter.default, {
        ...this.state.highlighterOptions,
        language,
        style: highlighterStyles['default']
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
      } else if (highlighter === null) {
        highlighter = Promise.all([
          import('react-syntax-highlighter/light').then(
            (highlighterModule) => { highlighter = highlighterModule; },
            (error) => { highlighter = false; }
          ),
          import('react-syntax-highlighter/styles/hljs/default-style').then(
            (style) => { highlighterStyles['default'] = style.default; },
            (error) => { highlighterStyles['default'] = false; }
          )
        ]);
        promises.push(highlighter);
      }

      if (language !== 'unknown') {
        if (languages[language] instanceof Promise) {
          promises.push(languages[language]);
        } else if (typeof languages[language] === 'undefined') {
          languages[language] = import(`react-syntax-highlighter/languages/hljs/${language}`).then((languagePack) => {
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
        const promise = Promise.all(promises)
        this.props.loader.add(promise);
        promise.then(() => {
          if (this.mounted) {
            this.setState({
              highlighterLoaded: true
            });
          } else {
            this.state.highlighterLoaded = true;
          }
        });
        return '';
      }
    }
  }
}

const LoadedMarkdownComponent = connectLoader(MarkdownComponent);

export const Markdown =  connect(LoadedMarkdownComponent);
