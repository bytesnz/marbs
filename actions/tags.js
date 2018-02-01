"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MARSS_TAGS_SET = 'MARSS_TAGS_SET';
/**
 * Create a set tags action object
 *
 * @param newTags Tags count to set as new tags count
 *
 * @returns Set tags action
 */
exports.setTags = (newTags) => ({
    type: exports.MARSS_TAGS_SET,
    data: newTags
});
