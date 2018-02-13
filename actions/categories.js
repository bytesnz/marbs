"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MARSS_CATEGORIES_SET = 'MARSS_CATEGORIES_SET';
exports.createCategoriesActions = ({ dispatch, socket }, options) => {
    /// Timeout to timeout waiting for tags
    let fetchTimeout = null;
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
                code,
                date: new Date()
            }
        });
    };
    /**
     * Fetch the categories for the given id. If categories is already being fetched
     * for the given id, the request will be ignored
     */
    const fetchCategories = () => {
        if (fetchTimeout === null) {
            fetchTimeout = setTimeout(() => {
                categoriesError('Nobody responded when trying to fetch the categories', 408);
                fetchTimeout = null;
            }, 4000);
            socket.emit('categories');
        }
    };
    // Register for the tags event
    socket.on('categories', (data) => {
        clearTimeout(fetchTimeout);
        fetchTimeout = null;
        if (data.error) {
            categoriesError(data.error, data.code);
            return;
        }
        setCategories(data.results);
    });
    return {
        setCategories,
        categoriesError,
        fetchCategories
    };
};
