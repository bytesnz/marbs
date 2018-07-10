"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../../app/lib/config");
var urlJoin = require("join-path");
// TODO Can these be hooked up to the state?
exports.post = function (id) {
    if (!id) {
        return;
    }
    return urlJoin(config_1.default.baseUri, id);
};
exports.tags = function (tag) {
    if (!tag) {
        return urlJoin(config_1.default.baseUri, config_1.default.tagsUri);
    }
    return urlJoin(config_1.default.baseUri, config_1.default.tagsUri + '#' + tag);
};
exports.categories = function (category) {
    if (!category) {
        return urlJoin(config_1.default.baseUri, config_1.default.tagsUri);
    }
    if (config_1.default.categoriesPerPage) {
        return urlJoin(config_1.default.baseUri, config_1.default.tagsUri, category);
    }
    else {
        return urlJoin(config_1.default.baseUri, config_1.default.tagsUri + '#' + category);
    }
};
exports.asset = function (assetUri) {
    return urlJoin(config_1.default.baseUri, config_1.default.staticUri, assetUri);
};
//# sourceMappingURL=mdTags.js.map