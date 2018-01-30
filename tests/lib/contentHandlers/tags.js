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
exports.calculateTagsCount = (documents) => documents.reduce((tagCounts, doc) => {
    if (doc.attributes.tags) {
        doc.attributes.tags.forEach((tag) => {
            if (typeof tagCounts[tag] === 'undefined') {
                tagCounts[tag] = 1;
            }
            else {
                tagCounts[tag]++;
            }
        });
    }
    return tagCounts;
}, {});
exports.tagsTests = (test, contentHandlerCreator) => {
    test('tags() returns undefined if tags not enabled', (t) => __awaiter(this, void 0, void 0, function* () {
        const contentHandler = yield asyncValue_1.getReturn(contentHandlerCreator(t.context.conf));
        const tags = yield contentHandler.tags();
        t.is(undefined, tags);
    }));
    test('tags() returns the tags and counts when tags enabled', (t) => __awaiter(this, void 0, void 0, function* () {
        const conf = t.context.conf.clone();
        conf.set('functionality', {
            tags: true
        });
        const contentHandler = yield asyncValue_1.getReturn(contentHandlerCreator(conf));
        const tags = yield contentHandler.tags();
        const testTagsCount = exports.calculateTagsCount(testData.nulledTestDocuments.filter((doc) => !doc.attributes.draft));
        t.deepEqual(testTagsCount, tags);
    }));
};
