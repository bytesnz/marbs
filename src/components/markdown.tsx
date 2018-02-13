import * as React from 'react';
import * as Remarkable from 'remarkable';

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
    source: string
  };

  mounted: boolean = false;

  constructor(props) {
    super(props);

    this.state = {
      hijs: null,
      md: new Remarkable({ //TODO Move to config
        linkify: true,
        langPrefix: 'hljs ',
        highlight: this.highlight.bind(this)
      })
    };

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
    return (
      <div dangerouslySetInnerHTML={{ __html: this.state.md.render(this.props.source) }} />
    );
  }

  setHijs(language) {
    let hijs;
    if (languages[language] === false) {
      hijs = false;
    } else {
      hijs = highlightJs;
    }

    if (this.mounted) {
      this.setState({
        hijs
      });
    } else {
      this.state.hijs = hijs;
    }

    return hijs;
  }

  highlight(content: string, language: string) {
    if (this.state.hijs) {
      return this.state.hijs.highlight(language, content).value;
    } else if (this.state.hijs === false) {
      return '';
    } else {
      // Load the language pack and base if needed
      let promises = [];

      if (highlightJs instanceof Promise) {
        promises.push(highlightJs);
      } else if (typeof highlightJs === 'undefined') {
        highlightJs = System.import('highlight.js/lib/highlight').then((highlight) => {
          highlight.configure({ //TODO Move to config
            tabReplace: '  '
          });

          highlightJs = highlight;
        });
        promises.push(highlightJs);
      }

      if (languages[language] instanceof Promise) {
        promises.push(languages[language]);
      } else if (typeof languages[language] === 'undefined') {
        languages[language] = System.import(`highlight.js/lib/languages/${language}`).then((languagePack) => {
          if (!languagePack) {
            console.error('Could not import language', language);
            languages[language] = false;
            return;
          }
          languages[language] = languagePack;

          if (highlightJs instanceof Promise) {
            return highlightJs.then(() => {
              highlightJs.registerLanguage(language, languages[language]);
            });
          } else {
            highlightJs.registerLanguage(language, languages[language]);
          }
        }, (error) => {
          languages[language] = false;
        });
        promises.push(languages[language]);
      }

      if (!promises.length) {
        const hijs = this.setHijs(language);

        if (hijs === false) {
          return '';
        } else {
          return hijs.highlight(language, content).value;
        }
      } else {
        Promise.all(promises).then(() => {
          this.setHijs(language);
        });
        return '';
      }
    }
  }
}
