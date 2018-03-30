"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../../app/lib/config");
var urlJoin = require("join-path");
// TODO Can these be hooked up to the state?
exports.postTag = function (id) {
    if (!id) {
        return;
    }
    return urlJoin(config_1.default.baseUri, id);
};
exports.tagsTag = function (tag) {
    if (!tag) {
        return urlJoin(config_1.default.baseUri, config_1.default.tagsUri);
    }
    return urlJoin(config_1.default.baseUri, config_1.default.tagsUri + '#' + tag);
};
exports.categoriesTag = function (category) {
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
exports.staticTag = function (assetUri) {
    return urlJoin(config_1.default.baseUri, config_1.default.staticUri, assetUri);
};
//# sourceMappingURL=mdTags.js.map