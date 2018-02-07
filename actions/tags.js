"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MARSS_TAGS_SET = 'MARSS_TAGS_SET';
exports.createTagsActions = ({ getState, dispatch, socket }, options) => {
    /// Timeout to timeout waiting for tags
    let fetchTimeout = null;
    /**
     * Creates and dispatches a set tags action object
     *
     * @param newTags Tags count to set as new tags count
     *
     * @returns Set tags action
     */
    const setTags = (newTags) => {
        dispatch({
            type: exports.MARSS_TAGS_SET,
            data: newTags
        });
    };
    /**
     * Creates and dispatches a tags error
     *
     * @param message Error message
     * @param code Error code
     */
    const tagsError = (message, code) => {
        dispatch({
            type: exports.MARSS_TAGS_SET,
            error: {
                message,
                code,
                date: new Date()
            }
        });
    };
    const fetchTags = () => {
        if (getState().tags === null && fetchTimeout === null) {
            fetchTimeout = setTimeout(() => {
                tagsError('Nobody responded when trying to fetch the tags count', 408);
                fetchTimeout = null;
            }, 4000);
            socket.emit('tags');
        }
    };
    // Register for the tags event
    socket.on('tags', (data) => {
        clearTimeout(fetchTimeout);
        fetchTimeout = null;
        if (data.error) {
            tagsError(data.error, data.code);
            return;
        }
        setTags(data.results);
    });
    return {
        setTags,
        fetchTags,
        tagsError
    };
};
