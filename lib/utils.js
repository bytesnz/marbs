"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const urlJoin = require("join-path");
const config_1 = require("../app/lib/config");
/**
 * Create the url for the given asset
 *
 * @param asset URI to asset
 *
 * @returns URL to asset
 */
exports.assetUrl = (asset) => urlJoin(config_1.config.baseUri, config_1.config.staticUri, asset);
exports.tagToId = (tag) => tag.replace(' ', '-');
/**
 * Creates a label for the given category
 *
 * @param category Category to create label for
 *
 * @returns Category label
 */
exports.categoryLabel = (category) => Array.isArray(category) ? category.pop() : category;
/**
 * Create the url for the categories list, or a given category
 *
 * @param category Category to create url to
 *
 * @returns URL to categories list / category
 */
exports.categoryUrl = (category) => {
    if (category) {
        if (Array.isArray(category)) {
            category = category.pop();
        }
        category = exports.tagToId(category);
        return (config_1.config.categoriesPerPage ?
            urlJoin(config_1.config.baseUri, config_1.config.categoriesUri, category) :
            urlJoin(config_1.config.baseUri, config_1.config.categoriesUri + '#' + category));
    }
    return urlJoin(config_1.config.baseUri, config_1.config.categoriesUri);
};
/**
 * Flatten an array of categories into an array of singular categories
 *
 * @param categories Categories array to flatten
 *
 * @returns Flattened categories array
 */
exports.flattenCategories = (categories) => {
    let flatCategories = [];
    categories.forEach((category) => {
        if (Array.isArray(category)) {
            category.forEach((subCategory) => {
                if (flatCategories.indexOf(subCategory) === -1) {
                    flatCategories.push(subCategory);
                }
            });
        }
        else {
            if (flatCategories.indexOf(category) === -1) {
                flatCategories.push(category);
            }
        }
    });
    return flatCategories;
};
/**
 * Create a label for the given tag
 *
 * @param tag Tag to create the label for
 *
 * @returns Label
 */
exports.tagLabel = (tag) => tag;
/**
 * Create the url for the tags list, or a given tag
 *
 * @param tag Tag to create url to
 *
 * @returns URL to tags list / tag
 */
exports.tagUrl = (tag) => tag ?
    urlJoin(config_1.config.baseUri, config_1.config.tagsUri + '#' + tag) :
    urlJoin(config_1.config.baseUri, config_1.config.tagsUri);
/**
 * Filters the given posts to only those that have one/all of the given tags
 *
 * @param posts Lists of posts to filter
 * @param tags List of tags to filter on
 * @param allTags Whether or not to require post has all given tags
 *
 * @returns Filtered list of posts
 */
exports.filterPostsByTags = (posts, tags, allTags) => {
    if (posts === null)
        return null;
    if (allTags) {
        return posts.filter((doc) => {
            if (!doc.attributes.tags) {
                return false;
            }
            // Find a tag that is in tags but not it the document
            if (tags.find((tag) => doc.attributes.tags.indexOf(tag) === -1)) {
                return false;
            }
            return true;
        });
    }
    else {
        return posts.filter((doc) => {
            if (!doc.attributes.tags) {
                return false;
            }
            // Find a tag that is in the document
            if (tags.find((tag) => doc.attributes.tags.indexOf(tag) !== -1)) {
                return true;
            }
            return false;
        });
    }
};
/**
 * Filters the given posts to only those that have one/all of the given categories
 *
 * @param posts Lists of posts to filter
 * @param categories List of categories to filter on
 * @param allCategories Whether or not to require post has all given categories
 *
 * @returns Filtered list of posts
 */
exports.filterPostsByCategories = (posts, categories, allCategories) => {
    if (posts === null)
        return null;
    if (allCategories) {
        return posts.filter((doc) => {
            if (!doc.attributes.categories) {
                return false;
            }
            // Find a category that is in options, but not in the document
            const missingCategory = categories.find((category) => {
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
        return posts.filter((doc) => {
            if (!doc.attributes.categories) {
                return false;
            }
            // Find a category that is in the document
            const matchingCategory = categories.find((category) => {
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
};
