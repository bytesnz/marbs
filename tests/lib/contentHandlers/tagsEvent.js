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
const tags_1 = require("./tags");
exports.tagsEventTests = (test, contentHandlerCreator) => {
    test('tags event handler returns undefined if tags are not enabled', (t) => __awaiter(this, void 0, void 0, function* () {
        t.plan(2);
        const contentHandler = yield asyncValue_1.getReturn(contentHandlerCreator(t.context.conf));
        return new Promise((resolve, reject) => {
            contentHandler.events.tags({
                emit: (event, data) => {
                    t.is('tags', event);
                    t.deepEqual({
                        results: undefined
                    }, data);
                    resolve();
                }
            });
        });
    }));
    test('tags event handler returns the tags count if tags are enabled', (t) => __awaiter(this, void 0, void 0, function* () {
        t.plan(2);
        const conf = t.context.conf.clone();
        conf.set('functionality', Object.assign({}, conf.get('functionality'), { tags: true }));
        const contentHandler = yield asyncValue_1.getReturn(contentHandlerCreator(conf));
        return new Promise((resolve, reject) => {
            contentHandler.events.tags({
                emit: (event, data) => {
                    t.is('tags', event);
                    t.deepEqual({
                        results: tags_1.calculateTagsCount(testData.nulledTestDocuments.filter((doc) => !doc.attributes.draft))
                    }, data);
                    resolve();
                }
            });
        });
    }));
};
