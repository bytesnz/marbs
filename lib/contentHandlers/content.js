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
const glob = require("glob-promise");
const frontMatter = require("front-matter");
const path = require("path");
const util = require("util");
const fs = require("fs");
const clone = require("lodash.clonedeep");
const tag_you_are_1 = require("tag-you-are");
const readFile = util.promisify(fs.readFile);
const stat = util.promisify(fs.stat);
/**
 * Copy out properties of a given object and create an object with the
 * extracted values in it
 *
 * @param object Object to copy the properties from
 * @param keys Array of keys to copy
 *
 * @returns New object containing the copied properties
 */
const copyObjectValues = (object, keys) => {
    let newObject = {};
    keys.forEach((key) => {
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
const copyRecurse = (newObject, object, keys) => {
    const key = keys.shift();
    if (typeof object === 'object') {
        if (object[key] !== 'undefined') {
            const value = copyRecurse(typeof newObject === 'object' ? newObject[key]
                : false, object[key], keys);
            if (typeof value !== 'undefined') {
                newObject[key] = value;
            }
        }
    }
};
exports.contentHandlerCreator = (config) => __awaiter(this, void 0, void 0, function* () {
    let docs = {};
    let docsArray = [];
    let tags;
    let categories;
    let draftRegex = RegExp(config.draftRegex);
    if (config.functionality.tags) {
        tags = new tag_you_are_1.StringTags();
    }
    if (config.functionality.categories) {
        categories = new tag_you_are_1.Tags('/');
    }
    /**
     * Gets the filename of a document with a given id
     *
     * @param id ID of the document to get the filename for
     *
     * @returns The filename for the document
     */
    const getFilename = (id) => path.join(config.source, id + '.md');
    /**
     * Parses a source file and adds/updates it in the database
     *
     * @param filename Filename of file to add/update
     *
     * @returns Whether or not the file has been added, or null if the file has
     *   been removed
     */
    const parseFile = (filename) => __awaiter(this, void 0, void 0, function* () {
        const id = filename.replace(/\.md$/, '');
        filename = getFilename(id);
        // Remove the current document if it already exists
        let creation = true;
        if (typeof docs[id] !== 'undefined') {
            creation = false;
            // Remove counts if enabled
            if (config.functionality.tags && docs[id].attributes.tags) {
                docs[id].attributes.tags.forEach((tag) => tags.remove(tag));
            }
            if (config.functionality.categories && docs[id].attributes.categories) {
                docs[id].attributes.categories.forEach((category) => categories.remove(category));
            }
            delete docs[id];
        }
        const mtime = yield stat(filename).then((stats) => stats.mtime, (error) => error.code === 'ENOENT' ? null : Promise.reject(error));
        if (mtime === null) {
            return null;
        }
        const contents = (yield readFile(filename)).toString();
        let frontmatter = frontMatter(contents);
        let markdown = {
            id,
            attributes: frontmatter.attributes,
            body: null
        };
        if (config.cacheMarkdown) {
            markdown.body = frontmatter.body;
        }
        frontmatter = null;
        const data = markdown.attributes;
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
        // Add counts if enabled and not a draft
        if (config.functionality.tags && data.tags) {
            data.tags = data.tags.map((tag) => tag.toLowerCase());
            if (!data.draft) {
                data.tags.forEach((tag) => tags.add(tag));
            }
        }
        if (config.functionality.categories && data.categories) {
            data.categories = data.categories.map((category) => {
                if (typeof category === 'string') {
                    return category.toLowerCase();
                }
                else {
                    return category.map((subCategory) => subCategory.toLowerCase());
                }
            });
            if (!data.draft) {
                data.categories.forEach((category) => categories.add(category));
            }
        }
        return creation;
    });
    // Parse all the markdown files in the source folder
    yield glob('**/*.md', {
        cwd: config.source
    }).then((files) => {
        return Promise.all(files.map((file) => parseFile(file)));
    });
    // Create and sort the docs array dates descending
    docsArray = Object.values(docs).sort((a, b) => {
        const aDate = a.attributes.date.getTime();
        const bDate = b.attributes.date.getTime();
        if (aDate < bDate) {
            return 1;
        }
        else if (aDate > bDate) {
            return -1;
        }
        return 0;
    });
    // Add watch to source folder
    /**
     * Gets the contents of a document
     *
     * @param id ID of the document to get
     *
     * @returns The document
     */
    const getContent = (id) => __awaiter(this, void 0, void 0, function* () {
        if (typeof docs[id] === 'undefined') {
            id = id + (id ? '/' : '') + 'index';
            if (typeof docs[id] === 'undefined') {
                return;
            }
        }
        const filename = getFilename(id);
        if (config.cacheMarkdown) {
            return Object.assign({}, docs[id], { id });
        }
        else {
            const contents = (yield readFile(filename)).toString();
            let data = frontMatter(contents);
            return {
                id,
                attributes: docs[id].attributes,
                body: data.body
            };
        }
    });
    const filterDocuments = (options = {}) => {
        let results = options.includeDrafts ?
            docsArray : docsArray.filter((doc) => !doc.attributes.draft);
        results = options.fields ?
            results.filter((doc) => !doc.attributes.draft).map((doc) => copyObjectValues(doc, options.fields)) :
            results;
        if (options.tags) {
            if (options.allTags) {
                results = results.filter((doc) => {
                    if (!doc.attributes.tags) {
                        return false;
                    }
                    // Find a tag that is in tags but not it the document
                    if (options.tags.find((tag) => doc.attributes.tags.indexOf(tag) === -1)) {
                        return false;
                    }
                    return true;
                });
            }
            else {
                results = results.filter((doc) => {
                    if (!doc.attributes.tags) {
                        return false;
                    }
                    // Find a tag that is in the document
                    if (options.tags.find((tag) => doc.attributes.tags.indexOf(tag) !== -1)) {
                        return true;
                    }
                    return false;
                });
            }
        }
        if (options.categories) {
            if (options.allCategories) {
                results = results.filter((doc) => {
                    if (!doc.attributes.categories) {
                        return false;
                    }
                    // Find a category that is in options, but not in the document
                    const missingCategory = options.categories.find((category) => {
                        if (Array.isArray(category)) {
                            const matchingCategory = doc.attributes.categories.find((docCategory) => {
                                if (!Array.isArray(docCategory)
                                    || docCategory.length < category.length) {
                                    return;
                                }
                                for (let i = 0; i < category.length; i++) {
                                    if (category[i] !== docCategory[i]) {
                                        return;
                                    }
                                }
                                return true;
                            });
                            return typeof matchingCategory === 'undefined';
                        }
                        else {
                            const matchingCategory = doc.attributes.categories.find((docCategory) => Array.isArray(docCategory) ? docCategory[0] === category
                                : docCategory === category);
                            return typeof matchingCategory === 'undefined';
                        }
                    });
                    if (typeof missingCategory !== 'undefined') {
                        return false;
                    }
                    return true;
                });
            }
            else {
                results = results.filter((doc) => {
                    if (!doc.attributes.categories) {
                        return false;
                    }
                    // Find a category that is in the document
                    const matchingCategory = options.categories.find((category) => {
                        if (Array.isArray(category)) {
                            const matchingCategory = doc.attributes.categories.find((docCategory) => {
                                if (!Array.isArray(docCategory)) {
                                    if (category.length === 1 && docCategory === category[0]) {
                                        return true;
                                    }
                                    return;
                                }
                                if (docCategory.length < category.length) {
                                    return;
                                }
                                for (let i = 0; i < category.length; i++) {
                                    if (category[i] !== docCategory[i]) {
                                        return;
                                    }
                                }
                                return true;
                            });
                            return typeof matchingCategory !== 'undefined';
                        }
                        else {
                            const matchingCategory = doc.attributes.categories.find((docCategory) => Array.isArray(docCategory) ? docCategory[0] === category
                                : docCategory === category);
                            return typeof matchingCategory !== 'undefined';
                        }
                    });
                    if (typeof matchingCategory !== 'undefined') {
                        return true;
                    }
                    return false;
                });
            }
        }
        return results;
    };
    // Create object
    return {
        get: getContent,
        documents: (options = {}) => {
            const results = filterDocuments(options);
            return clone(results);
        },
        tags: () => Promise.resolve(config.functionality.tags ?
            tags.tags() : undefined),
        categories: () => Promise.resolve(config.functionality.categories ?
            categories.tags() : undefined),
        events: {
            content: (socket, uri) => __awaiter(this, void 0, void 0, function* () {
                const content = yield getContent(uri);
                socket.emit('content', {
                    results: content,
                    uri
                });
            }),
            documents: (socket, data = {}) => {
                // Validate fields
                if (typeof data.fields !== 'undefined') {
                    if (!Array.isArray(data.fields) ||
                        data.fields.find((field) => typeof field !== 'string')) {
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
                const documentType = 'post';
                let documents = docsArray.filter((doc) => !doc.attributes.draft
                    && (documentType === 'post' ?
                        (!doc.attributes.type || doc.attributes.type === 'post') :
                        doc.attributes.type === documentType));
                /**TODO if (data.fields) {
                  documents = documents.map((doc) => copyObjectValues(doc, data.fields));
                } else {*/
                documents = documents.map((doc) => ({
                    id: doc.id,
                    attributes: {
                        title: doc.attributes.title,
                        date: doc.attributes.date,
                        tags: doc.attributes.tags,
                        categories: doc.attributes.categories,
                        excerpt: doc.attributes.excerpt
                    }
                }));
                //TODO }
                let start = 0;
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
                let results;
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
                    start,
                    results
                });
            },
            tags: (socket) => {
                socket.emit('tags', {
                    results: tags && tags.tags()
                });
            },
            categories: (socket) => {
                socket.emit('categories', {
                    results: categories && categories.tags()
                });
            }
        }
    };
});
