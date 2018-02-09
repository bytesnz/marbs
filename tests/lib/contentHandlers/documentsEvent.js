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
exports.documentsEventTests = (test, contentHandlerCreator) => {
    test('documents event handler returns the only posts without drafts', (t) => __awaiter(this, void 0, void 0, function* () {
        t.plan(2);
        const contentHandler = yield asyncValue_1.getReturn(contentHandlerCreator(t.context.conf));
        return new Promise((resolve, reject) => {
            contentHandler.events.documents({
                emit: (event, data) => {
                    t.is('documents', event);
                    t.deepEqual({
                        results: [
                            testData.mappedDocuments[1],
                            testData.mappedDocuments[3],
                            testData.mappedDocuments[4],
                            testData.mappedDocuments[5]
                        ],
                        start: 0,
                        total: 4
                    }, data);
                    resolve();
                }
            }, {
                includeDrafts: true
            });
        });
    }));
    test('documents event handler returns the posts with no options', (t) => __awaiter(this, void 0, void 0, function* () {
        t.plan(2);
        const contentHandler = yield asyncValue_1.getReturn(contentHandlerCreator(t.context.conf));
        return new Promise((resolve, reject) => {
            contentHandler.events.documents({
                emit: (event, data) => {
                    t.is('documents', event);
                    t.deepEqual({
                        results: [
                            testData.mappedDocuments[1],
                            testData.mappedDocuments[3],
                            testData.mappedDocuments[4],
                            testData.mappedDocuments[5]
                        ],
                        start: 0,
                        total: 4
                    }, data);
                    resolve();
                }
            });
        });
    }));
    test.todo('documents event handler returns documents with the given fields');
};
