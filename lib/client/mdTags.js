"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../app/lib/config");
const urlJoin = require("join-path");
// TODO Can these be hooked up to the state?
exports.postTag = (id) => {
    if (!id) {
        return;
    }
    return urlJoin(config_1.default.baseUri, id);
};
exports.tagsTag = (tag) => {
    if (!tag) {
        return urlJoin(config_1.default.baseUri, config_1.default.tagsUri);
    }
    return urlJoin(config_1.default.baseUri, config_1.default.tagsUri + '#' + tag);
};
exports.categoriesTag = (category) => {
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
exports.staticTag = (assetUri) => {
    return urlJoin(config_1.default.baseUri, config_1.default.staticUri, assetUri);
};
