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
var path = require("path");
var glob = require("glob-promise");
var chokidar_1 = require("chokidar");
var md5 = require("md5");
var aSizeOf = require("image-size");
var util = require("util");
var urlJoin = require("join-path");
var sizeOf = util.promisify(aSizeOf);
;
;
;
exports.handlerCreator = function (config) { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    var media, galleries, galleriesMap, addGallery, handleMedia, removeMedia, imageFilesGlob, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                media = {};
                galleries = {
                    id: md5(''),
                    path: '',
                    subGalleries: {},
                    media: {}
                };
                galleriesMap = (_a = {},
                    _a[md5('')] = galleries,
                    _a);
                addGallery = function (folderpath) { return __awaiter(_this, void 0, void 0, function () {
                    var pathParts, gallery, i, galleryPath, galleryHash;
                    return __generator(this, function (_a) {
                        pathParts = folderpath.split('/');
                        gallery = galleries.subGalleries;
                        i = 1;
                        while (i <= pathParts.length) {
                            galleryPath = pathParts.slice(0, i).join('/');
                            galleryHash = md5(galleryPath);
                            if (gallery[galleryHash]) {
                                gallery = gallery[galleryHash].subGalleries;
                            }
                            else {
                                galleriesMap[galleryHash] = {
                                    id: galleryHash,
                                    path: galleryPath,
                                    subGalleries: {},
                                    media: {}
                                };
                                gallery[galleryHash] = galleriesMap[galleryHash];
                                gallery = galleriesMap[galleryHash].subGalleries;
                            }
                            i++;
                        }
                        return [2 /*return*/];
                    });
                }); };
                handleMedia = function (filepath) { return __awaiter(_this, void 0, void 0, function () {
                    var hash, pathParts, galleryHash, dimensions;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                hash = md5(filepath);
                                pathParts = path.parse(filepath);
                                galleryHash = md5(pathParts.dir);
                                return [4 /*yield*/, sizeOf(path.join(config.staticAssets, filepath))];
                            case 1:
                                dimensions = _a.sent();
                                media[hash] = __assign({}, dimensions, { id: hash, path: filepath, gallery: galleryHash });
                                // Create the image gallery
                                if (pathParts.dir) {
                                    addGallery(pathParts.dir);
                                }
                                galleriesMap[galleryHash].media[hash] = media[hash];
                                return [2 /*return*/];
                        }
                    });
                }); };
                removeMedia = function (filepath) {
                    var hash = md5(filepath);
                    if (typeof media[hash] !== 'undefined') {
                        delete media[hash];
                    }
                };
                imageFilesGlob = '**/*.@(jpg|jpeg|gif|png|svg)';
                if (!!config.disableFileWatch) return [3 /*break*/, 1];
                console.log('watching for changes in media');
                chokidar_1.watch(imageFilesGlob, {
                    cwd: config.staticAssets
                }).on('add', function (filepath) {
                    console.log('Adding media', filepath);
                    handleMedia(filepath);
                }).on('change', function (filepath) {
                    console.log('Updating media', filepath);
                    handleMedia(filepath);
                }).on('unlink', function (filepath) {
                    console.log('Removing media', filepath);
                    removeMedia(filepath);
                });
                return [3 /*break*/, 3];
            case 1:
                console.log('searching for media in', config.staticAssets);
                return [4 /*yield*/, glob(imageFilesGlob, {
                        cwd: config.staticAssets
                    }).then(function (files) {
                        return Promise.all(files.map(function (file) { return handleMedia(file); }));
                    })];
            case 2:
                _c.sent();
                _c.label = 3;
            case 3: return [2 /*return*/, {
                    get media() {
                        return JSON.parse(JSON.stringify(media));
                    },
                    get galleries() {
                        return JSON.parse(JSON.stringify(galleries));
                    },
                    events: {
                        media: function (socket, data) {
                            if (!data || !data.ids) {
                                socket.emit('media', {
                                    error: 'Require a gallery ids'
                                });
                                return;
                            }
                            if (!Array.isArray(data.ids)) {
                                data.ids = [data.ids];
                            }
                            // Check for invalid errors
                            var badGalleries = [];
                            data.ids.forEach(function (id) {
                                if (!galleriesMap[id]) {
                                    badGalleries.push(id);
                                }
                            });
                            if (badGalleries.length) {
                                var message = void 0;
                                if (badGalleries.length === 1) {
                                    message = "Gallery " + badGalleries[0] + " does not exist";
                                }
                                else {
                                    message = badGalleries.push();
                                    message = "Galleries " + badGalleries.join(', ') + " and " + message + " do no exist";
                                }
                                socket.emit('media', {
                                    error: message
                                });
                                return;
                            }
                            // Add subdirectories to array
                            if (data.subdirectories) {
                                var allIds_1 = data.ids.slice();
                                var galleriesLength = allIds_1.length;
                                var addSubGalleries = function (id) {
                                    Object.keys(galleriesMap[id].subGalleries).forEach(function (subId) {
                                        if (data.ids.indexOf(subId) === -1) {
                                            allIds_1.push(subId);
                                        }
                                    });
                                };
                                allIds_1.forEach(addSubGalleries);
                                data.ids = allIds_1;
                            }
                            var returnedMedia = [];
                            // Make array of media
                            data.ids.forEach(function (id) {
                                returnedMedia = returnedMedia.concat(Object.values(galleriesMap[id].media));
                            });
                            socket.emit('media', __assign({}, data, { media: returnedMedia.map(function (media) { return ({
                                    id: media.id,
                                    type: media.type,
                                    width: media.width,
                                    height: media.height
                                }); }) }));
                        }
                    },
                    paths: {
                        get: (_b = {},
                            _b[urlJoin(config.baseUri, config.staticUri, ':id')] = function (req, res, next) {
                                if (!req.params.id || !media[req.params.id]) {
                                    res.status(404).end();
                                    return;
                                }
                                res.sendFile(path.resolve(path.join(config.staticAssets, media[req.params.id].path)));
                            },
                            _b)
                    }
                }];
        }
    });
}); };
//# sourceMappingURL=media.js.map