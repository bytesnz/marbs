"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
//TODO Add test type def import * as AVA from 'ava';
const testData = require("../../data/source");
const asyncValue_1 = require("../asyncValue");
exports.documentsTests = (test, contentHandlerCreator) => {
    test('documents() returns documents without drafts by default', (t) => __awaiter(this, void 0, void 0, function* () {
        const contentHandler = yield asyncValue_1.getReturn(contentHandlerCreator(t.context.config));
        const docs = yield contentHandler.documents();
        t.deepEqual([
            testData.nulledTestDocuments[0],
            testData.nulledTestDocuments[1],
            testData.nulledTestDocuments[3],
            testData.nulledTestDocuments[4],
            testData.nulledTestDocuments[5]
        ], docs);
    }));
    test('documents() returns documents without drafts by default, with a different draft regex', (t) => __awaiter(this, void 0, void 0, function* () {
        const regex = '\\.anotherdraft$';
        const conf = Object.assign({}, t.context.config, { draftRegex: regex });
        const contentHandler = yield asyncValue_1.getReturn(contentHandlerCreator(conf));
        const docs = yield contentHandler.documents();
        const testDocuments = testData.nullDocumentBodies(testData.flagDraftDocuments(testData.testDocuments, new RegExp(regex)));
        t.deepEqual([
            testDocuments[0],
            testDocuments[1],
            testDocuments[2],
            testDocuments[4],
            testDocuments[5]
        ], docs);
    }));
    test('documents() returns documents with drafts if includeDrafts true', (t) => __awaiter(this, void 0, void 0, function* () {
        const contentHandler = yield asyncValue_1.getReturn(contentHandlerCreator(t.context.config));
        const docs = yield contentHandler.documents({
            includeDrafts: true
        });
        t.deepEqual(testData.nulledTestDocuments, docs);
    }));
    test('documents() returns only documents with the given tag', (t) => __awaiter(this, void 0, void 0, function* () {
        const tag = 'test';
        const contentHandler = yield asyncValue_1.getReturn(contentHandlerCreator(t.context.config));
        const docs = yield contentHandler.documents({
            tags: [tag]
        });
        t.deepEqual([
            testData.nulledTestDocuments[1],
            testData.nulledTestDocuments[4],
            testData.nulledTestDocuments[5]
        ], docs);
    }));
    test('documents() returns only documents with any of the given tags', (t) => __awaiter(this, void 0, void 0, function* () {
        const tags = ['folder', 'test'];
        const contentHandler = yield asyncValue_1.getReturn(contentHandlerCreator(t.context.config));
        const docs = yield contentHandler.documents({
            tags: tags
        });
        t.deepEqual([
            testData.nulledTestDocuments[1],
            testData.nulledTestDocuments[4],
            testData.nulledTestDocuments[5]
        ], docs);
    }));
    test('documents() returns only documents with all of the given tags', (t) => __awaiter(this, void 0, void 0, function* () {
        const tags = ['folder', 'test'];
        const contentHandler = yield asyncValue_1.getReturn(contentHandlerCreator(t.context.config));
        const docs = yield contentHandler.documents({
            tags: tags,
            allTags: true
        });
        t.deepEqual([
            testData.nulledTestDocuments[4]
        ], docs);
    }));
    test('documents() returns only documents with the given category', (t) => __awaiter(this, void 0, void 0, function* () {
        const contentHandler = yield asyncValue_1.getReturn(contentHandlerCreator(t.context.config));
        const docs = yield contentHandler.documents({
            categories: ['cool']
        });
        t.deepEqual([
            testData.nulledTestDocuments[1],
            testData.nulledTestDocuments[3]
        ], docs);
    }));
    test('documents() returns only documents with the given category in an array', (t) => __awaiter(this, void 0, void 0, function* () {
        const contentHandler = yield asyncValue_1.getReturn(contentHandlerCreator(t.context.config));
        const docs = yield contentHandler.documents({
            categories: [['cool']]
        });
        t.deepEqual([
            testData.nulledTestDocuments[1],
            testData.nulledTestDocuments[3]
        ], docs);
    }));
    test('documents() returns only documents with any of the given categories', (t) => __awaiter(this, void 0, void 0, function* () {
        const contentHandler = yield asyncValue_1.getReturn(contentHandlerCreator(t.context.config));
        const docs = yield contentHandler.documents({
            categories: ['cool', ['folder', 'test']]
        });
        t.deepEqual([
            testData.nulledTestDocuments[1],
            testData.nulledTestDocuments[3],
            testData.nulledTestDocuments[4]
        ], docs);
    }));
    test('documents() returns only documents with all of the given categories', (t) => __awaiter(this, void 0, void 0, function* () {
        const contentHandler = yield asyncValue_1.getReturn(contentHandlerCreator(t.context.config));
        const docs = yield contentHandler.documents({
            categories: [['cool'], 'folder'],
            includeDrafts: true,
            allCategories: true
        });
        t.deepEqual([
            testData.nulledTestDocuments[3]
        ], docs);
    }));
    test('documents() returns only documents with the given category array', (t) => __awaiter(this, void 0, void 0, function* () {
        const category = ['folder', 'test'];
        const contentHandler = yield asyncValue_1.getReturn(contentHandlerCreator(t.context.config));
        const docs = yield contentHandler.documents({
            categories: [category]
        });
        t.deepEqual([
            testData.nulledTestDocuments[4]
        ], docs);
    }));
    test.todo('documents() returns only documents with the given date');
    test.todo('documents() returns only documents within the given date range');
    test.todo('documents() only returns the given fields');
};
