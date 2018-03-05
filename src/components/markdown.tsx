import * as React from 'react';
import * as Remarkable from 'remarkable';

import { Plugin as RST } from 'remarkably-simple-tags'
import * as tags from '../lib/client/mdTags';

import config from '../app/lib/config';

import 'highlight.js/styles/default.css';

/// Highlight.js base
let highlightJs;
/// Highlight.js language packs
let languages = {};

declare var System: {
  import(file: string): Promise<any>;
}

export class Markdown extends React.Component {
  state: {
    hijs: any,
    md: any
  };

  props: {
    source: string,
    className: string
  };

  mounted: boolean = false;

  constructor(props) {
    super(props);

    const remarkableOptions = { //TODO Move to config
        linkify: true,
        langPrefix: 'hljs ',
        langDefault: 'unknown',
        highlight: this.highlight.bind(this),
      }

    this.state = {
      hijs: null,
      md: new Remarkable(remarkableOptions)
    };

    // Plugin for unknown language
    this.state.md.use(function unknownLanguagePlugin(md) {
      const rule = md.renderer.rules.fence;
      md.renderer.rules.fence = function unknownLanguageRule(tokens, idx, options, env, instance) {
        if (!tokens[idx].params && md.options.langDefault) {
          tokens[idx].params = md.options.langDefault;
        }

        return rule.call(this, tokens, idx, options, env, instance);
      }
    });

    // Create RST for in remarkable tag replacement
    const rst = new RST();

    rst.register('post', tags.postTag);
    rst.register('tags', tags.tagsTag);
    rst.register('categories', tags.categoriesTag);
    rst.register('static', tags.staticTag);

    if (config.rstTags) {
      Object.keys(config.rstTags).forEach((tag) => {
        if (config.rstTags[tag].multiple) {
          rst.register(tag, config.rstTags[tag].handler, true);
        } else {
          rst.register(tag, config.rstTags[tag].handler);
        }
      });
    }

    this.state.md.use(rst.hook);

    if (config.remarkablePlugins) {
      config.remarkablePlugins.forEach((plugin) => {
        this.state.md.use(plugin);
      });
    }

    // Try render to start process of getting highlight libraries
    this.state.md.render(this.props.source);

  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    let markdown = this.state.md.render(this.props.source);

    return (
      <div className={this.props.className} dangerouslySetInnerHTML={{ __html: markdown }} />
    );
  }

  tryHighlight(content: string, language: string):string {
    if (language === 'unknown' || languages[language] === false || this.state.hijs === false) {
      return '';
    }

    if (this.state.hijs && languages[language]
        && !(languages[language] instanceof Promise)) {
      return this.state.hijs.highlight(language, content).value;
    }

    return null;
  }

  highlight(content: string, language: string) {
    const attempt = this.tryHighlight(content, language);
    if (attempt !== null) {
      return attempt;
    } else {
      // Load the language pack and base if needed
      let promises = [];

      if (highlightJs instanceof Promise) {
        promises.push(highlightJs);
      } else if (typeof highlightJs === 'undefined') {
        highlightJs = System.import('highlight.js/lib/highlight').then((hijs) => {
          hijs.configure({ //TODO Move to config
            tabReplace: '  '
          });

          highlightJs = hijs;

          if (this.mounted) {
            this.setState({
              hijs: hijs
            });
          } else {
            this.state.hijs = hijs;
          }
        }, (error) => {
          console.error('could not load Highlight.js', error);

          if (this.mounted) {
            this.setState({
              hijs: false
            });
          } else {
            this.state.hijs = false;
          }
        });
        promises.push(highlightJs);
      }

      if (language !== 'unknown') {
        if (languages[language] instanceof Promise) {
          promises.push(languages[language]);
        } else if (typeof languages[language] === 'undefined') {
          languages[language] = System.import(`highlight.js/lib/languages/${language}`).then((languagePack) => {
            if (!languagePack) {
              console.error('Could not import language', language);
              languages[language] = false;
              return;
            }

            if (highlightJs instanceof Promise) {
              return highlightJs.then(() => {
                languages[language] = languagePack;
                highlightJs.registerLanguage(language, languages[language]);
                this.forceUpdate();
              });
            } else {
              languages[language] = languagePack;
              highlightJs.registerLanguage(language, languages[language]);
              this.forceUpdate();
            }
          }, (error) => {
            console.error('Could not load Highlight.js language for ' + language, error);
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
