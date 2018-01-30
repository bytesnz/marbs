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
exports.contentEventTests = (test, contentHandlerCreator) => {
    test('content event handler returns undefined if content with the given id does not exist', (t) => __awaiter(this, void 0, void 0, function* () {
        t.plan(2);
        const contentHandler = yield asyncValue_1.getReturn(contentHandlerCreator(t.context.conf));
        return new Promise((resolve, reject) => {
            contentHandler.events.content({
                emit: (event, data) => {
                    t.is('content', event);
                    t.deepEqual({
                        results: undefined,
                        uri: ''
                    }, data);
                    resolve();
                }
            }, '');
        });
    }));
    test('content event handler returns the full document of the given id', (t) => __awaiter(this, void 0, void 0, function* () {
        t.plan(2);
        const contentHandler = yield asyncValue_1.getReturn(contentHandlerCreator(t.context.conf));
        return new Promise((resolve, reject) => {
            contentHandler.events.content({
                emit: (event, data) => {
                    t.is('content', event);
                    t.deepEqual({
                        uri: testData.testDocuments[0].id,
                        results: testData.testDocuments[0]
                    }, data);
                    resolve();
                }
            }, testData.testDocuments[0].id);
        });
    }));
    test('content event handler returns the full document for draft document with the given id', (t) => __awaiter(this, void 0, void 0, function* () {
        t.plan(2);
        const contentHandler = yield asyncValue_1.getReturn(contentHandlerCreator(t.context.conf));
        return new Promise((resolve, reject) => {
            contentHandler.events.content({
                emit: (event, data) => {
                    t.is('content', event);
                    t.deepEqual({
                        uri: testData.flaggedTestDocuments[2].id,
                        results: testData.flaggedTestDocuments[2]
                    }, data);
                    resolve();
                }
            }, testData.flaggedTestDocuments[2].id);
        });
    }));
};
