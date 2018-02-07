"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MARSS_CATEGORIES_SET = 'MARSS_CATEGORIES_SET';
exports.createCategoriesActions = ({ dispatch }, options) => {
    /**
     * Creates and dispatches a set categories action object
     *
     * @param newCategories Categories count to set as new categories count
     *
     * @returns Set Categories action
     */
    const setCategories = (newCategories) => {
        dispatch({
            type: exports.MARSS_CATEGORIES_SET,
            data: newCategories
        });
    };
    /**
     * Creates and dispatches a tags error
     *
     * @param message Error message
     * @param code Error code
     */
    const categoriesError = (message, code) => {
        dispatch({
            type: exports.MARSS_CATEGORIES_SET,
            error: {
                message,
                code
            }
        });
    };
    return {
        setCategories,
        categoriesError
    };
};
