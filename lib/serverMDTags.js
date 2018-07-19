"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (config) {
    return {
        serverMDTags: function (markdown) {
            var tagerizer = /(^|.)({%\s*([^\s]+)((?:\s+(?:"(?:\\"|[^"])*"|[^"\s}]*))*)%})(.|$)/g;
            var token, replaced = '', prev, chunk, last = 0;
            while ((token = tagerizer.exec(markdown))) {
                replaced += markdown.substring(last, token.index);
                last = token.index + token[0].length;
                if (token[1] === '{' && token[5] === '}') {
                    chunk = token[2];
                }
                else {
                    if (!config || !config.serverTags || !config.serverTags[token[3]]) {
                        chunk = token[1] + token[5];
                    }
                    else {
                        var attributeTokenizer = /\s+(?:"((?:\\"|[^"])*)"|([^"\s}]+))/g, parameters = [];
                        var parameter = void 0;
                        while ((parameter = attributeTokenizer.exec(token[4]))) {
                            parameters.push((parameter[1] && parameter[1].replace(/\\"/g, '"')) || parameter[2]);
                        }
                        if (parameters.length) {
                            chunk = token[1] + config.serverTags[token[3]](parameters) + token[5];
                        }
                        else {
                            chunk = token[1] + config.serverTags[token[3]]() + token[5];
                        }
                    }
                }
                replaced += chunk;
            }
            replaced += markdown.substring(last);
            return replaced;
        }
    };
});
//# sourceMappingURL=serverMDTags.js.map