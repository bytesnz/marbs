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
const tag_you_are_1 = require("tag-you-are");
const asyncValue_1 = require("../asyncValue");
exports.categoriesTests = (test, contentHandlerCreator) => {
    test('categories() returns undefined if categories no enabled', (t) => __awaiter(this, void 0, void 0, function* () {
        const contentHandler = yield asyncValue_1.getReturn(contentHandlerCreator(t.context.config));
        const categories = yield contentHandler.categories();
        t.is(undefined, categories);
    }));
    test('categories() returns the categories and counts', (t) => __awaiter(this, void 0, void 0, function* () {
        const conf = Object.assign({}, t.context.config, { functionality: Object.assign({}, t.context.config.functionality, { categories: true }) });
        const contentHandler = yield asyncValue_1.getReturn(contentHandlerCreator(conf));
        const categories = yield contentHandler.categories();
        const testCategoriesCount = new tag_you_are_1.Tags('/');
        testData.nulledTestDocuments.filter((doc) => !doc.attributes.draft).forEach((doc) => {
            if (doc.attributes.categories) {
                doc.attributes.categories.forEach((category) => testCategoriesCount.add(category));
            }
        });
        t.deepEqual(testCategoriesCount.tags(), categories);
    }));
};
