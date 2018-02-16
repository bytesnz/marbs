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
exports.getTests = (test, contentHandlerCreator) => {
    test('get() returns undefined when a document does not exist for the given id', (t) => __awaiter(this, void 0, void 0, function* () {
        const contentHandler = yield asyncValue_1.getReturn(contentHandlerCreator(t.context.config));
        const content = yield contentHandler.get('fdgsgsfd');
        t.is(undefined, content);
    }));
    test('get() returns the entire document when a good is given', (t) => __awaiter(this, void 0, void 0, function* () {
        const contentHandler = yield asyncValue_1.getReturn(contentHandlerCreator(t.context.config));
        const content = yield contentHandler.get(testData.testDocuments[0].id);
        t.deepEqual(testData.testDocuments[0], content);
    }));
    test('get() returns draft content if requested', (t) => __awaiter(this, void 0, void 0, function* () {
        const contentHandler = yield asyncValue_1.getReturn(contentHandlerCreator(t.context.config));
        const content = yield contentHandler.get(testData.flaggedTestDocuments[2].id);
        t.deepEqual(testData.flaggedTestDocuments[2], content);
    }));
    test('get() returns the index page when available', (t) => __awaiter(this, void 0, void 0, function* () {
        const contentHandler = yield asyncValue_1.getReturn(contentHandlerCreator(t.context.config));
        const content = yield contentHandler.get('');
        t.deepEqual(testData.flaggedTestDocuments[0], content);
    }));
};
