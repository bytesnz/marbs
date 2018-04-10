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
var yaml = require("js-yaml");
exports.testDocuments = [
    {
        id: 'index',
        attributes: {
            title: 'Test 1',
            date: new Date('2017-11-12 10:30'),
            type: 'page'
        },
        body: "\n# Test 1 Page\n\nThis is a test page\n  "
    },
    {
        id: 'test-1',
        attributes: {
            title: 'Test 1',
            date: new Date('2017-11-11 10:30'),
            tags: ['test'],
            categories: ['cool']
        },
        body: "\n# Test 1\n\nThis is a test\n  "
    },
    {
        id: 'test-1.draft',
        attributes: {
            title: 'Test 1',
            date: new Date('2017-11-10 10:30'),
            tags: ['draft'],
            categories: ['cool']
        },
        body: "\n# Draft Test 1\n\nThis is a test - it should list by default\n  "
    },
    {
        id: 'test-1.anotherdraft',
        attributes: {
            title: 'Test 1',
            date: new Date('2017-11-9 10:30'),
            tags: ['draft'],
            categories: [['cool'], ['folder']]
        },
        body: "\n# Another Draft Test 1\n\nThis is a test\n  "
    },
    {
        id: 'folder/test-1',
        attributes: {
            title: 'Folder Test 1',
            date: new Date('2017-11-8 10:30'),
            tags: ['folder', 'test'],
            categories: [['folder', 'test']]
        },
        body: "\n# Test 1\n\nThis is a test post in a folder\n  "
    },
    {
        id: 'folder/test-2',
        attributes: {
            title: 'Folder Test 21',
            date: new Date('2017-11-7 10:30'),
            tags: ['test'],
            categories: [['folder', 'test2']]
        },
        body: "\n# Test 2\n\nThis is a test post in a folder\n  "
    },
    {
        id: 'test-attribute-draft',
        attributes: {
            title: 'Test 1',
            date: new Date('2017-11-6 10:30'),
            tags: ['draft'],
            draft: true,
            categories: ['cool']
        },
        body: "\n# Attribute Draft Test 1\n\nThis is a test - it should list by default\n  "
    }
];
exports.newTestDocuments = [
    {
        id: 'new-document-1',
        attributes: {
            title: 'New Test 1',
            date: new Date('2017-12-1 10:30'),
            tags: ['cool', 'new'],
            categories: ['cool']
        },
        body: "\n# New Test Document 1\n\nThis is a test document\n  "
    }
];
/**
 * Create a copy of the given documents ensuring that any with ids that match
 * the draft regex have the  draft attribute set
 *
 * @param documents Documents to create a copy of
 * @param regex Draft regex to use instead of the default
 *
 * @returns The copy of the document set with the drafts flagged
 */
exports.flagDraftDocuments = function (documents, regex) {
    if (regex === void 0) { regex = /\.draft$/; }
    return documents.map(function (doc) {
        if (doc.id.match(regex) && !doc.attributes.draft) {
            doc = __assign({}, doc, { attributes: __assign({}, doc.attributes, { draft: true }) });
        }
        return doc;
    });
};
/**
 * Create a new set of documents from the given documents with a nulled body
 *
 * @param documents Documents to created a nulled body version of
 *
 * @returns Set of documents with bodies nulled
 */
exports.nullDocumentBodies = function (documents) { return documents.map(function (doc) { return (__assign({}, doc, { body: null })); }); };
/**
 * Extract attributes from the given documents
 *
 * @param documents Documents to map
 * @param fields Fields to extract
 *
 * @returns Array of extracted document attributes
 */
exports.mapOutData = function (documents, fields) {
    if (!fields) {
        return documents.map(function (doc) { return ({
            id: doc.id,
            attributes: {
                title: doc.attributes.title,
                date: doc.attributes.date,
                tags: doc.attributes.tags,
                categories: doc.attributes.categories,
                excerpt: doc.attributes.excerpt
            }
        }); });
    }
};
/**
 * Create file string for the given document
 *
 * @param doc Document to create the file string for
 *
 * @returns The file string
 */
exports.createDocument = function (doc) { return "---\n" + yaml.dump(doc.attributes) + "\n---\n" + doc.body; };
/// The test documents with the draft documents flagged
exports.flaggedTestDocuments = exports.flagDraftDocuments(exports.testDocuments);
/// The flagged test documents with their bodies nulled
exports.nulledTestDocuments = exports.nullDocumentBodies(exports.flaggedTestDocuments);
exports.nulledNewTestDocuments = exports.nullDocumentBodies(exports.newTestDocuments);
/// The default attributes extracted from the flagged and nulled documents
exports.mappedDocuments = exports.mapOutData(exports.nulledTestDocuments);
/// Test document file strings
exports.testSource = exports.testDocuments.reduce(function (acc, doc) {
    acc[doc.id + ".md"] = exports.createDocument(doc);
    return acc;
}, {});
//# sourceMappingURL=source.js.map