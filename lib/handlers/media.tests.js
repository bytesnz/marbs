"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var _a, _b, _c, _d, _e;
var _this = this;
var ava_1 = require("ava");
require('node-require-alias').setAlias({
    Config: '../config.global.js'
});
var unionfs_1 = require("../../tests/lib/unionfs");
var media_1 = require("./media");
var path = require("path");
// Import unioned fs
var fs = require("fs");
var md5 = require("md5");
var sinon = require("sinon");
var testFileHashes = {
    'image.png': md5('image.png'),
    'image2.png': md5('image2.png'),
    'dir/image.png': md5('dir/image.png'),
    'dir/subdir/image.png': md5('dir/subdir/image.png'),
    '': md5(''),
    'dir': md5('dir'),
    'dir/subdir': md5('dir/subdir')
};
var mediaCollection = {
    id: testFileHashes[''],
    path: '',
    subGalleries: (_a = {},
        _a[testFileHashes['dir']] = {
            id: testFileHashes['dir'],
            path: 'dir',
            subGalleries: (_b = {},
                _b[testFileHashes['dir/subdir']] = {
                    id: testFileHashes['dir/subdir'],
                    path: 'dir/subdir',
                    subGalleries: {},
                    media: (_c = {},
                        _c[testFileHashes['dir/subdir/image.png']] = {
                            width: 9,
                            height: 9,
                            type: 'png',
                            id: testFileHashes['dir/subdir/image.png'],
                            path: 'dir/subdir/image.png',
                            gallery: testFileHashes['dir/subdir']
                        },
                        _c)
                },
                _b),
            media: (_d = {},
                _d[testFileHashes['dir/image.png']] = {
                    width: 9,
                    height: 9,
                    type: 'png',
                    id: testFileHashes['dir/image.png'],
                    path: 'dir/image.png',
                    gallery: testFileHashes['dir']
                },
                _d)
        },
        _a),
    media: (_e = {},
        _e[testFileHashes['image.png']] = {
            width: 9,
            height: 9,
            type: 'png',
            id: testFileHashes['image.png'],
            path: 'image.png',
            gallery: testFileHashes['']
        },
        _e[testFileHashes['image2.png']] = {
            width: 9,
            height: 9,
            type: 'png',
            id: testFileHashes['image2.png'],
            path: 'image2.png',
            gallery: testFileHashes['']
        },
        _e)
};
var media = __assign({}, mediaCollection.media, mediaCollection.subGalleries[testFileHashes['dir']].media, mediaCollection.subGalleries[testFileHashes['dir']].subGalleries[testFileHashes['dir/subdir']].media);
var testConf = {
    title: 'Test Site',
    baseUri: '/',
    address: '127.0.0.1',
    port: 4321,
    source: '/source',
    functionality: {},
    draftRegex: '\\.draft$',
    disableFileWatch: true
};
var count = 0;
ava_1.default.beforeEach(function (t) {
    var mockBase = "/" + process.pid + "-" + count++;
    var mockBaseAssets = mockBase + "/static";
    var testConfig = Object.assign({}, testConf, {
        staticAssets: mockBaseAssets
    });
    // Copy test image into test filesystem
    var image = fs.readFileSync(path.resolve(__dirname, '../../tests/data/image.png'));
    unionfs_1.vol.mkdirSync(mockBase);
    unionfs_1.vol.mkdirSync(mockBaseAssets);
    unionfs_1.vol.mkdirSync(path.join(mockBaseAssets, 'dir'));
    unionfs_1.vol.mkdirSync(path.join(mockBaseAssets, 'dir/subdir'));
    unionfs_1.vol.writeFileSync(path.join(mockBaseAssets, 'image.png'), image);
    unionfs_1.vol.writeFileSync(path.join(mockBaseAssets, 'image2.png'), image);
    unionfs_1.vol.writeFileSync(path.join(mockBaseAssets, 'dir/image.png'), image);
    unionfs_1.vol.writeFileSync(path.join(mockBaseAssets, 'dir/subdir/image.png'), image);
    t.context.config = testConfig;
});
ava_1.default('that the creator populates the media database', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var handler;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, media_1.handlerCreator(t.context.config)];
            case 1:
                handler = _a.sent();
                t.deepEqual(media, handler.media);
                t.deepEqual(mediaCollection, handler.galleries);
                return [2 /*return*/];
        }
    });
}); });
ava_1.default('that the media event handler returns only media that is in the given directory', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var handler, id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, media_1.handlerCreator(t.context.config)];
            case 1:
                handler = _a.sent();
                id = 1;
                handler.events.media({
                    emit: function (type, data) {
                        t.deepEqual(Object.values(mediaCollection.media).map(function (media) { return ({
                            id: media.id,
                            type: media.type,
                            width: media.width,
                            height: media.height
                        }); }), data.media);
                        t.deepEqual(id, data.id);
                    }
                }, {
                    id: id,
                    filter: {
                        ids: [mediaCollection.id]
                    }
                });
                return [2 /*return*/];
        }
    });
}); });
ava_1.default('media event handler returns media from galleries and sub galleries when subdirectories set', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var handler, id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, media_1.handlerCreator(t.context.config)];
            case 1:
                handler = _a.sent();
                id = 1;
                handler.events.media({
                    emit: function (type, data) {
                        t.deepEqual(Object.values(mediaCollection.subGalleries[testFileHashes['dir']].media).concat(Object.values(mediaCollection.subGalleries[testFileHashes['dir']].subGalleries[testFileHashes['dir/subdir']].media)).map(function (media) { return ({
                            id: media.id,
                            type: media.type,
                            width: media.width,
                            height: media.height
                        }); }), data.media);
                        t.deepEqual(id, data.id);
                    }
                }, {
                    id: id,
                    filter: {
                        subGalleries: true,
                        ids: [testFileHashes['dir']]
                    }
                });
                return [2 /*return*/];
        }
    });
}); });
ava_1.default('media path handler returns the requested image from image uri', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var handler, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, media_1.handlerCreator(t.context.config)];
            case 1:
                handler = _a.sent();
                res = {};
                res.sendFile = sinon.stub().returns(res);
                res.status = sinon.stub().returns(res);
                res.end = sinon.stub().returns(res);
                handler.paths.get['/:id']({
                    params: {
                        id: 'dir/image.png'
                    }
                }, res);
                t.is(1, res.sendFile.callCount, 'sendFile not called');
                t.is(path.join(t.context.config.staticAssets, 'dir/image.png'), res.sendFile.getCall(0).args[0], 'sent file not image');
                return [2 /*return*/];
        }
    });
}); });
ava_1.default('media path handler returns the requested image from md5 hash', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var handler, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, media_1.handlerCreator(t.context.config)];
            case 1:
                handler = _a.sent();
                res = {};
                res.sendFile = sinon.stub().returns(res);
                res.status = sinon.stub().returns(res);
                res.end = sinon.stub().returns(res);
                handler.paths.get['/:id']({
                    params: {
                        id: testFileHashes['image.png']
                    }
                }, res);
                t.is(1, res.sendFile.callCount, 'sendFile not called');
                t.is(path.join(t.context.config.staticAssets, 'image.png'), res.sendFile.getCall(0).args[0], 'sent file not image');
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=media.tests.js.map