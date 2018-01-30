"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yaml = require("js-yaml");
exports.testDocuments = [
    {
        id: 'page-test-1',
        attributes: {
            title: 'Test 1',
            date: new Date('2017-11-12 10:30'),
            type: 'page'
        },
        body: `
# Test 1 Page

This is a test page
  `
    },
    {
        id: 'test-1',
        attributes: {
            title: 'Test 1',
            date: new Date('2017-11-11 10:30'),
            tags: ['test'],
            categories: ['cool']
        },
        body: `
# Test 1

This is a test
  `
    },
    {
        id: 'test-1.draft',
        attributes: {
            title: 'Test 1',
            date: new Date('2017-11-10 10:30'),
            tags: ['draft'],
            categories: ['cool']
        },
        body: `
# Draft Test 1

This is a test - it should list by default
  `
    },
    {
        id: 'test-1.anotherdraft',
        attributes: {
            title: 'Test 1',
            date: new Date('2017-11-9 10:30'),
            tags: ['draft'],
            categories: [['cool'], ['folder']]
        },
        body: `
# Another Draft Test 1

This is a test
  `
    },
    {
        id: 'folder/test-1',
        attributes: {
            title: 'Folder Test 1',
            date: new Date('2017-11-8 10:30'),
            tags: ['folder', 'test'],
            categories: [['folder', 'test']]
        },
        body: `
# Test 1

This is a test post in a folder
  `
    },
    {
        id: 'folder/test-2',
        attributes: {
            title: 'Folder Test 21',
            date: new Date('2017-11-7 10:30'),
            tags: ['test'],
            categories: [['folder', 'test2']]
        },
        body: `
# Test 2

This is a test post in a folder
  `
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
        body: `
# Attribute Draft Test 1

This is a test - it should list by default
  `
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
exports.flagDraftDocuments = (documents, regex = /\.draft$/) => documents.map((doc) => {
    if (doc.id.match(regex) && !doc.attributes.draft) {
        doc = Object.assign({}, doc, { attributes: Object.assign({}, doc.attributes, { draft: true }) });
    }
    return doc;
});
/**
 * Create a new set of documents from the given documents with a nulled body
 *
 * @param documents Documents to created a nulled body version of
 *
 * @returns Set of documents with bodies nulled
 */
exports.nullDocumentBodies = (documents) => documents.map((doc) => (Object.assign({}, doc, { body: null })));
/**
 * Extract attributes from the given documents
 *
 * @param documents Documents to map
 * @param fields Fields to extract
 *
 * @returns Array of extracted document attributes
 */
exports.mapOutData = (documents, fields) => {
    if (!fields) {
        return documents.map((doc) => ({
            id: doc.id,
            attributes: {
                title: doc.attributes.title,
                date: doc.attributes.date,
                tags: doc.attributes.tags,
                categories: doc.attributes.categories,
                excerpt: doc.attributes.excerpt
            }
        }));
    }
};
/**
 * Create file string for the given document
 *
 * @param doc Document to create the file string for
 *
 * @returns The file string
 */
exports.createDocument = (doc) => `---
${yaml.dump(doc.attributes)}
---
${doc.body}`;
/// The test documents with the draft documents flagged
exports.flaggedTestDocuments = exports.flagDraftDocuments(exports.testDocuments);
/// The flagged test documents with their bodies nulled
exports.nulledTestDocuments = exports.nullDocumentBodies(exports.flaggedTestDocuments);
/// The default attributes extracted from the flagged and nulled documents
exports.mappedDocuments = exports.mapOutData(exports.nulledTestDocuments);
/// Test document file strings
exports.testSource = exports.testDocuments.reduce((acc, doc) => {
    acc[`${doc.id}.md`] = exports.createDocument(doc);
    return acc;
}, {});
