"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var contentHandlers_1 = require("../../tests/lib/contentHandlers");
var content_1 = require("./content");
var source_1 = require("../../tests/data/source");
var unionfs_1 = require("../../tests/lib/unionfs");
var testConf = {
    title: 'Test Site',
    baseUri: '/',
    address: '127.0.0.1',
    port: 4321,
    source: '/source',
    functionality: {},
    draftRegex: '\\.draft$'
};
ava_1.default.beforeEach(function (t) {
    var mockBase = "/" + process.pid;
    var mockBaseSource = mockBase + "/source";
    //const vol = new Volume();
    var testConfig = Object.assign({}, testConf, {
        source: mockBaseSource
    });
    unionfs_1.vol.fromJSON(source_1.testSource, testConfig.source);
    t.context.config = testConfig;
});
contentHandlers_1.contentHandlerCreatorTests(ava_1.default, content_1.contentHandlerCreator);
//# sourceMappingURL=content.tests.js.map