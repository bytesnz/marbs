"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
//TODO Add test type def import * as AVA from 'ava';
var testData = require("../../data/source");
var asyncValue_1 = require("../asyncValue");
exports.documentsTests = function (test, contentHandlerCreator) {
    test('documents() returns documents without drafts by default', function (t) { return __awaiter(_this, void 0, void 0, function () {
        var contentHandler, docs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncValue_1.getReturn(contentHandlerCreator(t.context.config))];
                case 1:
                    contentHandler = _a.sent();
                    return [4 /*yield*/, contentHandler.documents()];
                case 2:
                    docs = _a.sent();
                    t.deepEqual([
                        testData.nulledTestDocuments[0],
                        testData.nulledTestDocuments[1],
                        testData.nulledTestDocuments[3],
                        testData.nulledTestDocuments[4],
                        testData.nulledTestDocuments[5]
                    ], docs);
                    return [2 /*return*/];
            }
        });
    }); });
    test('documents() returns documents without drafts by default, with a different draft regex', function (t) { return __awaiter(_this, void 0, void 0, function () {
        var regex, conf, contentHandler, docs, testDocuments;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    regex = '\\.anotherdraft$';
                    conf = __assign({}, t.context.config, { draftRegex: regex });
                    return [4 /*yield*/, asyncValue_1.getReturn(contentHandlerCreator(conf))];
                case 1:
                    contentHandler = _a.sent();
                    return [4 /*yield*/, contentHandler.documents()];
                case 2:
                    docs = _a.sent();
                    testDocuments = testData.nullDocumentBodies(testData.flagDraftDocuments(testData.testDocuments, new RegExp(regex)));
                    t.deepEqual([
                        testDocuments[0],
                        testDocuments[1],
                        testDocuments[2],
                        testDocuments[4],
                        testDocuments[5]
                    ], docs);
                    return [2 /*return*/];
            }
        });
    }); });
    test('documents() returns documents with drafts if includeDrafts true', function (t) { return __awaiter(_this, void 0, void 0, function () {
        var contentHandler, docs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncValue_1.getReturn(contentHandlerCreator(t.context.config))];
                case 1:
                    contentHandler = _a.sent();
                    return [4 /*yield*/, contentHandler.documents({
                            includeDrafts: true
                        })];
                case 2:
                    docs = _a.sent();
                    t.deepEqual(testData.nulledTestDocuments, docs);
                    return [2 /*return*/];
            }
        });
    }); });
    test('documents() returns only documents with the given tag', function (t) { return __awaiter(_this, void 0, void 0, function () {
        var tag, contentHandler, docs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = 'test';
                    return [4 /*yield*/, asyncValue_1.getReturn(contentHandlerCreator(t.context.config))];
                case 1:
                    contentHandler = _a.sent();
                    return [4 /*yield*/, contentHandler.documents({
                            tags: [tag]
                        })];
                case 2:
                    docs = _a.sent();
                    t.deepEqual([
                        testData.nulledTestDocuments[1],
                        testData.nulledTestDocuments[4],
                        testData.nulledTestDocuments[5]
                    ], docs);
                    return [2 /*return*/];
            }
        });
    }); });
    test('documents() returns only documents with any of the given tags', function (t) { return __awaiter(_this, void 0, void 0, function () {
        var tags, contentHandler, docs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tags = ['folder', 'test'];
                    return [4 /*yield*/, asyncValue_1.getReturn(contentHandlerCreator(t.context.config))];
                case 1:
                    contentHandler = _a.sent();
                    return [4 /*yield*/, contentHandler.documents({
                            tags: tags
                        })];
                case 2:
                    docs = _a.sent();
                    t.deepEqual([
                        testData.nulledTestDocuments[1],
                        testData.nulledTestDocuments[4],
                        testData.nulledTestDocuments[5]
                    ], docs);
                    return [2 /*return*/];
            }
        });
    }); });
    test('documents() returns only documents with all of the given tags', function (t) { return __awaiter(_this, void 0, void 0, function () {
        var tags, contentHandler, docs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tags = ['folder', 'test'];
                    return [4 /*yield*/, asyncValue_1.getReturn(contentHandlerCreator(t.context.config))];
                case 1:
                    contentHandler = _a.sent();
                    return [4 /*yield*/, contentHandler.documents({
                            tags: tags,
                            allTags: true
                        })];
                case 2:
                    docs = _a.sent();
                    t.deepEqual([
                        testData.nulledTestDocuments[4]
                    ], docs);
                    return [2 /*return*/];
            }
        });
    }); });
    test('documents() returns only documents with the given category', function (t) { return __awaiter(_this, void 0, void 0, function () {
        var contentHandler, docs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncValue_1.getReturn(contentHandlerCreator(t.context.config))];
                case 1:
                    contentHandler = _a.sent();
                    return [4 /*yield*/, contentHandler.documents({
                            categories: ['cool']
                        })];
                case 2:
                    docs = _a.sent();
                    t.deepEqual([
                        testData.nulledTestDocuments[1],
                        testData.nulledTestDocuments[3]
                    ], docs);
                    return [2 /*return*/];
            }
        });
    }); });
    test('documents() returns only documents with the given category in an array', function (t) { return __awaiter(_this, void 0, void 0, function () {
        var contentHandler, docs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncValue_1.getReturn(contentHandlerCreator(t.context.config))];
                case 1:
                    contentHandler = _a.sent();
                    return [4 /*yield*/, contentHandler.documents({
                            categories: [['cool']]
                        })];
                case 2:
                    docs = _a.sent();
                    t.deepEqual([
                        testData.nulledTestDocuments[1],
                        testData.nulledTestDocuments[3]
                    ], docs);
                    return [2 /*return*/];
            }
        });
    }); });
    test('documents() returns only documents with any of the given categories', function (t) { return __awaiter(_this, void 0, void 0, function () {
        var contentHandler, docs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncValue_1.getReturn(contentHandlerCreator(t.context.config))];
                case 1:
                    contentHandler = _a.sent();
                    return [4 /*yield*/, contentHandler.documents({
                            categories: ['cool', ['folder', 'test']]
                        })];
                case 2:
                    docs = _a.sent();
                    t.deepEqual([
                        testData.nulledTestDocuments[1],
                        testData.nulledTestDocuments[3],
                        testData.nulledTestDocuments[4]
                    ], docs);
                    return [2 /*return*/];
            }
        });
    }); });
    test('documents() returns only documents with all of the given categories', function (t) { return __awaiter(_this, void 0, void 0, function () {
        var contentHandler, docs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncValue_1.getReturn(contentHandlerCreator(t.context.config))];
                case 1:
                    contentHandler = _a.sent();
                    return [4 /*yield*/, contentHandler.documents({
                            categories: [['cool'], 'folder'],
                            includeDrafts: true,
                            allCategories: true
                        })];
                case 2:
                    docs = _a.sent();
                    t.deepEqual([
                        testData.nulledTestDocuments[3]
                    ], docs);
                    return [2 /*return*/];
            }
        });
    }); });
    test('documents() returns only documents with the given category array', function (t) { return __awaiter(_this, void 0, void 0, function () {
        var category, contentHandler, docs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    category = ['folder', 'test'];
                    return [4 /*yield*/, asyncValue_1.getReturn(contentHandlerCreator(t.context.config))];
                case 1:
                    contentHandler = _a.sent();
                    return [4 /*yield*/, contentHandler.documents({
                            categories: [category]
                        })];
                case 2:
                    docs = _a.sent();
                    t.deepEqual([
                        testData.nulledTestDocuments[4]
                    ], docs);
                    return [2 /*return*/];
            }
        });
    }); });
    test.todo('documents() returns only documents with the given date');
    test.todo('documents() returns only documents within the given date range');
    test.todo('documents() only returns the given fields');
};
//# sourceMappingURL=documents.js.map