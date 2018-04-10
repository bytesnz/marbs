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
var glob = require("glob-promise");
var frontMatter = require("front-matter");
var path = require("path");
var util = require("util");
var fs = require("fs");
var clone = require("lodash.clonedeep");
var chokidar_1 = require("chokidar");
var tag_you_are_1 = require("tag-you-are");
var utils_1 = require("../utils");
var readFile = util.promisify(fs.readFile);
var stat = util.promisify(fs.stat);
/**
 * Copy out properties of a given object and create an object with the
 * extracted values in it
 *
 * @param object Object to copy the properties from
 * @param keys Array of keys to copy
 *
 * @returns New object containing the copied properties
 */
var copyObjectValues = function (object, keys) {
    var newObject = {};
    keys.forEach(function (key) {
        if (typeof key === 'string' && key.indexOf('.') !== -1) {
            key = key.split('.');
        }
        if (typeof key === 'string') {
            if (typeof object[key] !== 'undefined') {
                newObject[key] = object[key];
            }
        }
        else {
            copyRecurse(newObject, object, key);
        }
    });
    return newObject;
};
var copyRecurse = function (newObject, object, keys) {
    var key = keys.shift();
    if (typeof object === 'object') {
        if (object[key] !== 'undefined') {
            var value = copyRecurse(typeof newObject === 'object' ? newObject[key]
                : false, object[key], keys);
            if (typeof value !== 'undefined') {
                newObject[key] = value;
            }
        }
    }
};
exports.contentHandlerCreator = function (config) { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    var docs, docsArray, tags, categories, draftRegex, getFilename, getIdFromFilename, parseFile, removeDocument, mdFilesGlob, getContent, filterDocuments;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                docs = {};
                docsArray = [];
                draftRegex = RegExp(config.draftRegex);
                if (config.functionality.tags) {
                    tags = new tag_you_are_1.StringTags();
                }
                if (config.functionality.categories) {
                    categories = new tag_you_are_1.Tags('/');
                }
                getFilename = function (id) {
                    return path.join(config.source, id + '.md');
                };
                getIdFromFilename = function (filename) { return filename.replace(/\.md$/, ''); };
                parseFile = function (documentPath) { return __awaiter(_this, void 0, void 0, function () {
                    var id, filename, creation, mtime, contents, frontmatter, markdown, data, index;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                id = getIdFromFilename(documentPath);
                                filename = getFilename(id);
                                creation = !removeDocument(documentPath);
                                return [4 /*yield*/, stat(filename).then(function (stats) { return stats.mtime; }, function (error) { return error.code === 'ENOENT' ? null : Promise.reject(error); })];
                            case 1:
                                mtime = _a.sent();
                                if (mtime === null) {
                                    return [2 /*return*/, null];
                                }
                                return [4 /*yield*/, readFile(filename)];
                            case 2:
                                contents = (_a.sent()).toString();
                                frontmatter = frontMatter(contents);
                                markdown = {
                                    id: id,
                                    attributes: frontmatter.attributes,
                                    body: null
                                };
                                if (config.cacheMarkdown) {
                                    markdown.body = frontmatter.body;
                                }
                                frontmatter = null;
                                data = markdown.attributes;
                                // Parse the date or create if there isn't one
                                //TODO Write date back to file
                                if (data.date) {
                                    data.date = new Date(data.date);
                                    if (isNaN(data.date.getTime())) {
                                        data.date = null;
                                    }
                                }
                                if (!data.date) {
                                    data.date = mtime;
                                }
                                if (draftRegex.exec(id)) {
                                    data.draft = true;
                                }
                                docs[id] = markdown;
                                index = docsArray.findIndex(function (doc) { return doc.attributes.date.getTime() < markdown.attributes.date.getTime(); });
                                if (index === -1) {
                                    docsArray.push(markdown);
                                }
                                else {
                                    docsArray.splice(index, 0, markdown);
                                }
                                // Add counts if enabled and not a draft
                                if (config.functionality.tags && data.tags) {
                                    data.tags = data.tags.map(function (tag) { return tag.toLowerCase(); });
                                    if (!data.draft) {
                                        data.tags.forEach(function (tag) { return tags.add(tag); });
                                    }
                                }
                                if (config.functionality.categories && data.categories) {
                                    data.categories = data.categories.map(function (category) {
                                        if (typeof category === 'string') {
                                            return category.toLowerCase();
                                        }
                                        else {
                                            return category.map(function (subCategory) { return subCategory.toLowerCase(); });
                                        }
                                    });
                                    if (!data.draft) {
                                        data.categories.forEach(function (category) { return categories.add(category); });
                                    }
                                }
                                return [2 /*return*/, creation];
                        }
                    });
                }); };
                removeDocument = function (documentPath, noLog) {
                    var id = getIdFromFilename(documentPath);
                    if (typeof docs[id] !== 'undefined') {
                        // Remove counts if enabled
                        if (config.functionality.tags && docs[id].attributes.tags) {
                            docs[id].attributes.tags.forEach(function (tag) { return tags.remove(tag); });
                        }
                        if (config.functionality.categories && docs[id].attributes.categories) {
                            docs[id].attributes.categories.forEach(function (category) {
                                return categories.remove(category);
                            });
                        }
                        // Remove from docsArray
                        var index = docsArray.findIndex(function (doc) { return doc === docs[id]; });
                        if (index !== -1) {
                            docsArray.splice(index, 1);
                        }
                        delete docs[id];
                        return true;
                    }
                    return false;
                };
                mdFilesGlob = '**/*.md';
                if (!!config.disableFileWatch) return [3 /*break*/, 1];
                console.log('watching for changes in documents');
                chokidar_1.watch(mdFilesGlob, {
                    cwd: config.source
                }).on('add', function (path) {
                    console.log('Adding document', path);
                    parseFile(path);
                }).on('change', function (path) {
                    console.log('Updating document', path);
                    parseFile(path);
                }).on('unlink', function (path) {
                    console.log('Removing document', path);
                    removeDocument(path);
                });
                return [3 /*break*/, 3];
            case 1: 
            // Parse all the markdown files in the source folder
            return [4 /*yield*/, glob(mdFilesGlob, {
                    cwd: config.source
                }).then(function (files) {
                    return Promise.all(files.map(function (file) { return parseFile(file); }));
                })];
            case 2:
                // Parse all the markdown files in the source folder
                _a.sent();
                _a.label = 3;
            case 3:
                getContent = function (id) { return __awaiter(_this, void 0, void 0, function () {
                    var filename, contents, data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (typeof docs[id] === 'undefined') {
                                    id = id + (id ? '/' : '') + 'index';
                                    if (typeof docs[id] === 'undefined') {
                                        return [2 /*return*/];
                                    }
                                }
                                filename = getFilename(id);
                                if (!config.cacheMarkdown) return [3 /*break*/, 1];
                                return [2 /*return*/, __assign({}, docs[id], { id: id })];
                            case 1: return [4 /*yield*/, readFile(filename)];
                            case 2:
                                contents = (_a.sent()).toString();
                                data = frontMatter(contents);
                                return [2 /*return*/, {
                                        id: id,
                                        attributes: docs[id].attributes,
                                        body: data.body
                                    }];
                        }
                    });
                }); };
                filterDocuments = function (options) {
                    if (options === void 0) { options = {}; }
                    var results = options.includeDrafts ?
                        docsArray : docsArray.filter(function (doc) { return !doc.attributes.draft; });
                    results = options.fields ?
                        results.filter(function (doc) { return !doc.attributes.draft; }).map(function (doc) {
                            return copyObjectValues(doc, options.fields);
                        }) :
                        results;
                    if (options.tags) {
                        results = utils_1.filterPostsByTags(results, options.tags, options.allTags);
                    }
                    if (options.categories) {
                        results = utils_1.filterPostsByCategories(results, options.categories, options.allCategories);
                    }
                    return results;
                };
                // Create object
                return [2 /*return*/, {
                        get: getContent,
                        documents: function (options) {
                            if (options === void 0) { options = {}; }
                            var results = filterDocuments(options);
                            return clone(results);
                        },
                        tags: function () { return Promise.resolve(config.functionality.tags ?
                            tags.tags() : undefined); },
                        categories: function () { return Promise.resolve(config.functionality.categories ?
                            categories.tags() : undefined); },
                        events: {
                            content: function (socket, uri) { return __awaiter(_this, void 0, void 0, function () {
                                var content;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, getContent(uri)];
                                        case 1:
                                            content = _a.sent();
                                            socket.emit('content', {
                                                results: content,
                                                uri: uri
                                            });
                                            return [2 /*return*/];
                                    }
                                });
                            }); },
                            documents: function (socket, data) {
                                if (data === void 0) { data = {}; }
                                // Validate fields
                                if (typeof data.fields !== 'undefined') {
                                    if (!Array.isArray(data.fields) ||
                                        data.fields.find(function (field) { return typeof field !== 'string'; })) {
                                        socket.emit('documents', {
                                            error: 'Invalid document fields given'
                                        });
                                    }
                                }
                                if (typeof data.start !== 'undefined') {
                                    if (typeof data.start !== 'number') {
                                        socket.emit('documents', {
                                            error: 'Invalid start item given'
                                        });
                                    }
                                }
                                if (typeof data.limit !== 'undefined') {
                                    if (typeof data.limit !== 'number') {
                                        socket.emit('documents', {
                                            error: 'Invalid length given'
                                        });
                                    }
                                }
                                var documentType = 'post';
                                var documents = docsArray.filter(function (doc) { return !doc.attributes.draft
                                    && (documentType === 'post' ?
                                        (!doc.attributes.type || doc.attributes.type === 'post') :
                                        doc.attributes.type === documentType); });
                                /**TODO if (data.fields) {
                                  documents = documents.map((doc) => copyObjectValues(doc, data.fields));
                                } else {*/
                                documents = documents.map(function (doc) { return ({
                                    id: doc.id,
                                    attributes: {
                                        title: doc.attributes.title,
                                        date: doc.attributes.date,
                                        tags: doc.attributes.tags,
                                        categories: doc.attributes.categories,
                                        excerpt: doc.attributes.excerpt
                                    }
                                }); });
                                //TODO }
                                var start = 0;
                                if (data.limit || typeof data.start === 'number') {
                                    if (typeof data.start === 'number') {
                                        if (data.start >= documents.length) {
                                            socket.emit('documents', {
                                                total: documents.length,
                                                start: data.start
                                            });
                                            return;
                                        }
                                        start = data.start;
                                    }
                                }
                                var results;
                                if (data.limit) {
                                    results = documents.slice(start, data.limit);
                                }
                                else if (data.start) {
                                    results = documents.slice(start);
                                }
                                else {
                                    results = documents;
                                }
                                socket.emit('documents', {
                                    total: documents.length,
                                    start: start,
                                    results: results
                                });
                            },
                            tags: function (socket) {
                                socket.emit('tags', {
                                    results: tags && tags.tags()
                                });
                            },
                            categories: function (socket) {
                                socket.emit('categories', {
                                    results: categories && categories.tags()
                                });
                            }
                        }
                    }];
        }
    });
}); };
//# sourceMappingURL=content.js.map