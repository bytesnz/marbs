"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    title: 'MARSS Web App',
    baseUri: '/',
    functionality: {
        tags: true,
        categories: true,
        search: ['title', 'tags', 'categories']
    },
    windowTitle: function (config, contentTitle) { return contentTitle + " - " + config.title; },
    tagsUri: 'tags',
    categoriesUri: 'categories',
    staticUri: 'static',
    listLastOnIndex: 10
};
//# sourceMappingURL=config.global.js.map