"use strict";
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
var process = require("process");
var unionfs_1 = require("../unionfs");
var source_1 = require("../../data/source");
var asyncValue_1 = require("../asyncValue");
var documents_1 = require("./documents");
var get_1 = require("./get");
var tags_1 = require("./tags");
var categories_1 = require("./categories");
var documentsEvent_1 = require("./documentsEvent");
var contentEvent_1 = require("./contentEvent");
var tagsEvent_1 = require("./tagsEvent");
var categoriesEvent_1 = require("./categoriesEvent");
var testConf = {
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
var validateContentHandler = function (t, contentHandler) {
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
exports.contentHandlerCreatorTests = function (test, contentHandlerCreator) {
    test.beforeEach(function (t) {
        var mockBase = "/" + process.pid;
        var mockBaseSource = mockBase + "/source";
        //const vol = new Volume();
        var testConfig = Object.assign({}, testConf, {
            source: mockBaseSource
        });
        unionfs_1.vol.fromJSON(source_1.testSource, testConfig.source);
        t.context.config = testConfig;
    });
    test('the creator returns either a handler or a promise that resolves to a handler', function (t) { return __awaiter(_this, void 0, void 0, function () {
        var value;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncValue_1.getReturn(contentHandlerCreator(t.context.config))];
                case 1:
                    value = _a.sent();
                    validateContentHandler(t, value);
                    return [2 /*return*/];
            }
        });
    }); });
    documents_1.documentsTests(test, contentHandlerCreator);
    get_1.getTests(test, contentHandlerCreator);
    tags_1.tagsTests(test, contentHandlerCreator);
    categories_1.categoriesTests(test, contentHandlerCreator);
    documentsEvent_1.documentsEventTests(test, contentHandlerCreator);
    contentEvent_1.contentEventTests(test, contentHandlerCreator);
    tagsEvent_1.tagsEventTests(test, contentHandlerCreator);
    categoriesEvent_1.categoriesEventTests(test, contentHandlerCreator);
};
//# sourceMappingURL=index.js.map