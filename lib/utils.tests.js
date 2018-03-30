"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var source_1 = require("../tests/data/source");
var utils = require("./utils");
ava_1.default('filterPostsByTags() should filter posts with the given tag', function (t) {
    var results = utils.filterPostsByTags(source_1.testDocuments, ['test']);
    t.deepEqual([
        source_1.testDocuments[1],
        source_1.testDocuments[4],
        source_1.testDocuments[5]
    ], results);
});
ava_1.default('filterPostsByTags() should filter posts with either of the given tags', function (t) {
    var results = utils.filterPostsByTags(source_1.testDocuments, ['test', 'draft']);
    t.deepEqual([
        source_1.testDocuments[1],
        source_1.testDocuments[2],
        source_1.testDocuments[3],
        source_1.testDocuments[4],
        source_1.testDocuments[5],
        source_1.testDocuments[6]
    ], results);
});
ava_1.default('filterPostsByTags() should filter posts with all of the given tags with allTags set', function (t) {
    var results = utils.filterPostsByTags(source_1.testDocuments, ['test', 'folder'], true);
    t.deepEqual([
        source_1.testDocuments[4]
    ], results);
});
//# sourceMappingURL=utils.tests.js.map