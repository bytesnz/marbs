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
const ava_1 = require("ava");
const marss_1 = require("./marss");
const options = {
    title: 'test',
    baseUri: '/',
    functionality: {},
    tagsUri: 'tags',
    categoriesUri: 'categories'
};
ava_1.default('should return a Promise', (t) => {
    t.is((marss_1.createMarss(options)) instanceof Promise, true, 'createMarss() did not return a Promise');
});
ava_1.default('should return a reducer and initial state with site and content with no functionality selected', (t) => __awaiter(this, void 0, void 0, function* () {
    const marss = yield marss_1.createMarss(options);
    const initialState = {
        options: options,
        contents: null
    };
    t.is(typeof marss.reducers, 'function');
    t.deepEqual(marss.initialState, initialState);
}));
ava_1.default('initialState should include tags when enabled', (t) => __awaiter(this, void 0, void 0, function* () {
    const testOptions = Object.assign({}, options, { functionality: {
            tags: true
        } });
    const marss = yield marss_1.createMarss(testOptions);
    t.not(typeof marss.initialState.tags, 'undefined');
}));
ava_1.default('initialState should include categories when enabled', (t) => __awaiter(this, void 0, void 0, function* () {
    const testOptions = Object.assign({}, options, { functionality: {
            categories: true
        } });
    const marss = yield marss_1.createMarss(testOptions);
    t.not(typeof marss.initialState.categories, 'undefined');
}));
