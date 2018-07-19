"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var serverMDTags_1 = require("./serverMDTags");
var config_server_1 = require("./defaults/config.server");
var config = __assign({}, config_server_1.default, { serverTags: {
        test: function (attributes) { return "TAG(" + attributes + ")"; },
        test2: function (attributes) { return "TAG2(" + attributes + ")"; }
    } });
ava_1.default('serverMDTags() removes tags that are unknown', function (t) {
    var serverTags = serverMDTags_1.default(config);
    t.is('before  after', serverTags.serverMDTags('before {%unknown%} after'));
});
ava_1.default('serverMDTags() unescapes escaped tags', function (t) {
    var serverTags = serverMDTags_1.default(config);
    t.is('before {%test%} after', serverTags.serverMDTags('before {{%test%}} after'));
});
ava_1.default('serverMDTags() replaces tags with output from tag handler functions', function (t) {
    var serverTags = serverMDTags_1.default(config);
    t.is('before TAG(attr) after', serverTags.serverMDTags('before {%test attr%} after'), 'tag');
    t.is('TAG(attr) after', serverTags.serverMDTags('{% test attr%} after'), 'tag at start with space before tag');
    t.is('TAG(undefined) after', serverTags.serverMDTags('{%test%} after'), 'tag at end with no attributes');
    t.is('before TAG(attr)', serverTags.serverMDTags('before {%test attr%}'), 'tag at end');
    t.is('before TAG2(attr,again again) after', serverTags.serverMDTags('before {%test2 attr "again again"%} after'), 'second tag with quoted attributes');
});
//# sourceMappingURL=serverMDTags.tests.js.map