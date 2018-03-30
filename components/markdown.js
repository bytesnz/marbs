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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Remarkable = require("remarkable");
var remarkably_simple_tags_1 = require("remarkably-simple-tags");
var tags = require("../lib/client/mdTags");
var config_1 = require("../app/lib/config");
require("highlight.js/styles/default.css");
/// Highlight.js base
var highlightJs;
/// Highlight.js language packs
var languages = {};
var Markdown = /** @class */ (function (_super) {
    __extends(Markdown, _super);
    function Markdown(props) {
        var _this = _super.call(this, props) || this;
        _this.mounted = false;
        var remarkableOptions = {
            linkify: true,
            langPrefix: 'hljs ',
            langDefault: 'unknown',
            highlight: _this.highlight.bind(_this),
        };
        _this.state = {
            hijs: null,
            md: new Remarkable(remarkableOptions)
        };
        // Plugin for unknown language
        _this.state.md.use(function unknownLanguagePlugin(md) {
            var rule = md.renderer.rules.fence;
            md.renderer.rules.fence = function unknownLanguageRule(tokens, idx, options, env, instance) {
                if (!tokens[idx].params && md.options.langDefault) {
                    tokens[idx].params = md.options.langDefault;
                }
                return rule.call(this, tokens, idx, options, env, instance);
            };
        });
        // Create RST for in remarkable tag replacement
        var rst = new remarkably_simple_tags_1.Plugin();
        rst.register('post', tags.postTag);
        rst.register('tags', tags.tagsTag);
        rst.register('categories', tags.categoriesTag);
        rst.register('static', tags.staticTag);
        if (config_1.default.rstTags) {
            Object.keys(config_1.default.rstTags).forEach(function (tag) {
                if (config_1.default.rstTags[tag].multiple) {
                    rst.register(tag, config_1.default.rstTags[tag].handler, true);
                }
                else {
                    rst.register(tag, config_1.default.rstTags[tag].handler);
                }
            });
        }
        _this.state.md.use(rst.hook);
        if (config_1.default.remarkablePlugins) {
            config_1.default.remarkablePlugins.forEach(function (plugin) {
                _this.state.md.use(plugin);
            });
        }
        // Try render to start process of getting highlight libraries
        _this.state.md.render(_this.props.source);
        return _this;
    }
    Markdown.prototype.componentDidMount = function () {
        this.mounted = true;
    };
    Markdown.prototype.componentWillUnmount = function () {
        this.mounted = false;
    };
    Markdown.prototype.render = function () {
        var markdown = this.state.md.render(this.props.source);
        return (React.createElement("div", { className: this.props.className, dangerouslySetInnerHTML: { __html: markdown } }));
    };
    Markdown.prototype.tryHighlight = function (content, language) {
        if (language === 'unknown' || languages[language] === false || this.state.hijs === false) {
            return '';
        }
        if (this.state.hijs && languages[language]
            && !(languages[language] instanceof Promise)) {
            return this.state.hijs.highlight(language, content).value;
        }
        return null;
    };
    Markdown.prototype.highlight = function (content, language) {
        var _this = this;
        var attempt = this.tryHighlight(content, language);
        if (attempt !== null) {
            return attempt;
        }
        else {
            // Load the language pack and base if needed
            var promises = [];
            if (highlightJs instanceof Promise) {
                promises.push(highlightJs);
            }
            else if (typeof highlightJs === 'undefined') {
                highlightJs = System.import('highlight.js/lib/highlight').then(function (hijs) {
                    hijs.configure({
                        tabReplace: '  '
                    });
                    highlightJs = hijs;
                    if (_this.mounted) {
                        _this.setState({
                            hijs: hijs
                        });
                    }
                    else {
                        _this.state.hijs = hijs;
                    }
                }, function (error) {
                    console.error('could not load Highlight.js', error);
                    if (_this.mounted) {
                        _this.setState({
                            hijs: false
                        });
                    }
                    else {
                        _this.state.hijs = false;
                    }
                });
                promises.push(highlightJs);
            }
            if (language !== 'unknown') {
                if (languages[language] instanceof Promise) {
                    promises.push(languages[language]);
                }
                else if (typeof languages[language] === 'undefined') {
                    languages[language] = System.import("highlight.js/lib/languages/" + language).then(function (languagePack) {
                        if (!languagePack) {
                            console.error('Could not import language', language);
                            languages[language] = false;
                            return;
                        }
                        if (highlightJs instanceof Promise) {
                            return highlightJs.then(function () {
                                languages[language] = languagePack;
                                highlightJs.registerLanguage(language, languages[language]);
                                _this.forceUpdate();
                            });
                        }
                        else {
                            languages[language] = languagePack;
                            highlightJs.registerLanguage(language, languages[language]);
                            _this.forceUpdate();
                        }
                    }, function (error) {
                        console.error('Could not load Highlight.js language for ' + language, error);
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