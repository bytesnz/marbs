"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Remarkable = require("remarkable");
require("highlight.js/styles/default.css");
/// Highlight.js base
let highlightJs;
/// Highlight.js language packs
let languages = {};
class Markdown extends React.Component {
    constructor(props) {
        super(props);
        this.mounted = false;
        this.state = {
            hijs: null,
            md: new Remarkable({
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
        return (React.createElement("div", { dangerouslySetInnerHTML: { __html: this.state.md.render(this.props.source) } }));
    }
    setHijs(language) {
        let hijs;
        if (languages[language] === false) {
            hijs = false;
        }
        else {
            hijs = highlightJs;
        }
        if (this.mounted) {
            this.setState({
                hijs
            });
        }
        else {
            this.state.hijs = hijs;
        }
        return hijs;
    }
    highlight(content, language) {
        if (this.state.hijs) {
            return this.state.hijs.highlight(language, content).value;
        }
        else if (this.state.hijs === false) {
            return '';
        }
        else {
            // Load the language pack and base if needed
            let promises = [];
            if (highlightJs instanceof Promise) {
                promises.push(highlightJs);
            }
            else if (typeof highlightJs === 'undefined') {
                highlightJs = Promise.resolve().then(() => require('highlight.js/lib/highlight')).then((highlight) => {
                    highlight.configure({
                        tabReplace: '  '
                    });
                    highlightJs = highlight;
                });
                promises.push(highlightJs);
            }
            if (languages[language] instanceof Promise) {
                promises.push(languages[language]);
            }
            else if (typeof languages[language] === 'undefined') {
                languages[language] = Promise.resolve().then(() => require(`highlight.js/lib/languages/${language}`)).then((languagePack) => {
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
                    }
                    else {
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
                }
                else {
                    return hijs.highlight(language, content).value;
                }
            }
            else {
                Promise.all(promises).then(() => {
                    this.setHijs(language);
                });
                return '';
            }
        }
    }
}
exports.Markdown = Markdown;