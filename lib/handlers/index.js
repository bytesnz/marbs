"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var content_1 = require("./content");
exports.content = content_1.contentHandlerCreator;
var media_1 = require("./media");
exports.media = media_1.handlerCreator;
/**
 * Default content handlers loaded in MARSS
 */
exports.default = {
    content: content_1.contentHandlerCreator,
    media: media_1.handlerCreator
};
//# sourceMappingURL=index.js.map