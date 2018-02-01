"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MARSS_CATEGORIES_SET = 'MARSS_CATEGORIES_SET';
/**
 * Create a set categories action object
 *
 * @param newCategories Categories count to set as new categories count
 *
 * @returns Set Categories action
 */
exports.setCategories = (newCategories) => ({
    type: exports.MARSS_CATEGORIES_SET,
    data: newCategories
});
