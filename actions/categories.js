"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MARSS_CATEGORIES_SET = 'MARSS_CATEGORIES_SET';
exports.createCategoriesActions = function (_a, options) {
    var dispatch = _a.dispatch, socket = _a.socket;
    /// Timeout to timeout waiting for tags
    var fetchTimeout = null;
    /**
     * Creates and dispatches a set categories action object
     *
     * @param newCategories Categories count to set as new categories count
     *
     * @returns Set Categories action
     */
    var setCategories = function (newCategories) {
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
    var categoriesError = function (message, code) {
        dispatch({
            type: exports.MARSS_CATEGORIES_SET,
            error: {
                message: message,
                code: code,
                date: new Date()
            }
        });
    };
    /**
     * Fetch the categories for the given id. If categories is already being fetched
     * for the given id, the request will be ignored
     */
    var fetchCategories = function () {
        if (fetchTimeout === null) {
            fetchTimeout = setTimeout(function () {
                categoriesError('Nobody responded when trying to fetch the categories', 408);
                fetchTimeout = null;
            }, 4000);
            socket.emit('categories');
        }
    };
    // Register for the tags event
    socket.on('categories', function (data) {
        clearTimeout(fetchTimeout);
        fetchTimeout = null;
        if (data.error) {
            categoriesError(data.error, data.code);
            return;
        }
        setCategories(data.results);
    });
    return {
        setCategories: setCategories,
        categoriesError: categoriesError,
        fetchCategories: fetchCategories
    };
};
//# sourceMappingURL=categories.js.map