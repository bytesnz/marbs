"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var twitchdown = require("twitchdown");
var tags = require("../lib/client/mdTags");
var posts_1 = require("./posts");
var categories_1 = require("./categories");
var tags_1 = require("./tags");
/// Highlight.js base
var highlighter;
/// Highlight.js language packs
var languages = {};
var Markdown = /** @class */ (function (_super) {
    __extends(Markdown, _super);
    function Markdown(props) {
        var _this = _super.call(this, props) || this;
        _this.mounted = false;
        var highlighterOptions = {
            showLineNumbers: true,
            style: null
        };
        _this.state = {
            highlighter: null,
            highlighterOptions: highlighterOptions,
            rdOptions: {
                highlight: _this.highlight.bind(_this),
                createElement: React.createElement,
                paragraphs: true,
                headingIds: true,
                customTags: {
                    posts: function (attributes) { return React.createElement(posts_1.PostsTag, { attributes: attributes }); },
                    categories: function () { return React.createElement(categories_1.Categories); },
                    taglist: function () { return React.createElement(tags_1.TagList); },
                    tagcloud: function () { return React.createElement(tags_1.TagCloud); },
                    postUrl: function () { return tags.post; },
                    categoriesUrl: function () { return tags.categories; },
                    tagsUrl: function () { return tags.tags; },
                    assetUrl: function () { return tags.asset; }
                }
            }
        };
        // Try render to start process of getting highlight libraries
        twitchdown(_this.props.source);
        return _this;
    }
    Markdown.prototype.componentDidMount = function () {
        this.mounted = true;
    };
    Markdown.prototype.componentWillUnmount = function () {
        this.mounted = false;
    };
    Markdown.prototype.render = function () {
        var markdown = twitchdown(this.props.source, this.state.rdOptions);
        return (React.createElement("div", { className: this.props.className }, markdown));
    };
    Markdown.prototype.tryHighlight = function (content, language) {
        if (language === 'unknown' || languages[language] === false || this.state.highlighter === false) {
            return '';
        }
        if (this.state.highlighter && languages[language]
            && !(languages[language] instanceof Promise)) {
            return React.createElement(highlighter.default, __assign({}, this.state.highlighterOptions, { language: language }), content);
        }
        return null;
    };
    Markdown.prototype.highlight = function (content, language) {
        var _this = this;
        if (language === void 0) { language = 'text'; }
        var attempt = this.tryHighlight(content, language);
        if (attempt !== null) {
            return attempt;
        }
        else {
            // Load the language pack and base if needed
            var promises = [];
            if (highlighter instanceof Promise) {
                promises.push(highlighter);
            }
            else if (typeof highlighter === 'undefined') {
                highlighter = Promise.all([
                    System.import('react-syntax-highlighter/light'),
                    System.import('react-syntax-highlighter/styles/hljs/default-style')
                ]).then(function (_a) {
                    var highlightModule = _a[0], style = _a[1];
                    highlighter = highlightModule;
                    if (_this.mounted) {
                        _this.setState({
                            highlighter: highlightModule,
                            highlighterOptions: __assign({}, _this.state.highlighterOptions, { style: style.default })
                        });
                    }
                    else {
                        _this.state.highlighter = highlightModule;
                    }
                }, function (error) {
                    console.error('could not load code highlighter', error);
                    if (_this.mounted) {
                        _this.setState({
                            highlighter: false
                        });
                    }
                    else {
                        _this.state.highlighter = false;
                    }
                });
                promises.push(highlighter);
            }
            if (language !== 'unknown') {
                if (languages[language] instanceof Promise) {
                    promises.push(languages[language]);
                }
                else if (typeof languages[language] === 'undefined') {
                    languages[language] = System.import("react-syntax-highlighter/languages/hljs/" + language).then(function (languagePack) {
                        if (!languagePack) {
                            console.error('Could not import language', language);
                            languages[language] = false;
                            return;
                        }
                        if (highlighter instanceof Promise) {
                            return highlighter.then(function () {
                                languages[language] = languagePack.default;
                                highlighter.registerLanguage(language, languages[language]);
                                _this.forceUpdate();
                            });
                        }
                        else {
                            languages[language] = languagePack.default;
                            highlighter.registerLanguage(language, languages[language]);
                            _this.forceUpdate();
                        }
                    }, function (error) {
                        console.error('Could not load code highlighter language for ' + language, error);
                        languages[language] = false;
                    });
                    promises.push(languages[language]);
                }
            }
            if (!promises.length) {
                return this.tryHighlight(content, language);
            }
            else {
                return '';
            }
        }
    };
    return Markdown;
}(React.Component));
exports.Markdown = Markdown;
//# sourceMappingURL=markdown.js.map