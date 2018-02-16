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
const process = require("process");
const unionfs_1 = require("../unionfs");
const source_1 = require("../../data/source");
const asyncValue_1 = require("../asyncValue");
const documents_1 = require("./documents");
const get_1 = require("./get");
const tags_1 = require("./tags");
const categories_1 = require("./categories");
const documentsEvent_1 = require("./documentsEvent");
const contentEvent_1 = require("./contentEvent");
const tagsEvent_1 = require("./tagsEvent");
const categoriesEvent_1 = require("./categoriesEvent");
const testConf = {
    title: 'Test Site',
    baseUri: '/',
    address: '127.0.0.1',
    port: 4321,
    source: '/source',
    functionality: {},
    draftRegex: '\\.draft$'
};
/**
 * Validates that the given object is a ContentHandler
 *
 * @param t Test
 * @param contentHandler Content handler to test
 */
const validateContentHandler = (t, contentHandler) => {
    if (typeof contentHandler !== 'object') {
        t.fail('Content handler is not an Object');
        return;
    }
    t.is(typeof contentHandler.documents, 'function', 'Content handler does not have a documents function');
    t.is(typeof contentHandler.get, 'function', 'Content handler does not have a get function');
    t.is(typeof contentHandler.tags, 'function', 'Content handler does not have a tags function');
    t.is(typeof contentHandler.categories, 'function', 'Content handler does not have a categories function');
    if (typeof contentHandler.events !== 'object') {
        t.fail('Content handler does not attach to any events');
    }
    else {
        t.is(typeof contentHandler.events.content, 'function', 'Content handler does not have a function to listen for `content` events');
        t.is(typeof contentHandler.events.tags, 'function', 'Content handler does not have a function to listen for `tags` events');
        t.is(typeof contentHandler.events.categories, 'function', 'Content handler does not have a function to listen for `categories` events');
        //TODOt.is(typeof contentHandler.events.search, 'function', 'Content handler does not have a function to listen for `` events');
    }
};
/**
 * Test runner for a ContentHandlerCreator
 */
exports.contentHandlerCreatorTests = (test, contentHandlerCreator) => {
    test.beforeEach((t) => {
        const mockBase = `/${process.pid}`;
        const mockBaseSource = `${mockBase}/source`;
        //const vol = new Volume();
        const testConfig = Object.assign({}, testConf, {
            source: mockBaseSource
        });
        unionfs_1.vol.fromJSON(source_1.testSource, testConfig.source);
        t.context.config = testConfig;
    });
    test('the creator returns either a handler or a promise that resolves to a handler', (t) => __awaiter(this, void 0, void 0, function* () {
        const value = yield asyncValue_1.getReturn(contentHandlerCreator(t.context.config));
        validateContentHandler(t, value);
    }));
    documents_1.documentsTests(test, contentHandlerCreator);
    get_1.getTests(test, contentHandlerCreator);
    tags_1.tagsTests(test, contentHandlerCreator);
    categories_1.categoriesTests(test, contentHandlerCreator);
    documentsEvent_1.documentsEventTests(test, contentHandlerCreator);
    contentEvent_1.contentEventTests(test, contentHandlerCreator);
    tagsEvent_1.tagsEventTests(test, contentHandlerCreator);
    categoriesEvent_1.categoriesEventTests(test, contentHandlerCreator);
};
