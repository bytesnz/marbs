"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MARSS_TAGS_SET = 'MARSS_TAGS_SET';
exports.createTagsActions = function (_a, options) {
    var getState = _a.getState, dispatch = _a.dispatch, socket = _a.socket;
    /// Timeout to timeout waiting for tags
    var fetchTimeout = null;
    /**
     * Creates and dispatches a set tags action object
     *
     * @param newTags Tags count to set as new tags count
     *
     * @returns Set tags action
     */
    var setTags = function (newTags) {
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
    var tagsError = function (message, code) {
        dispatch({
            type: exports.MARSS_TAGS_SET,
            error: {
                message: message,
                code: code,
                date: new Date()
            }
        });
    };
    var fetchTags = function () {
        if (getState().tags === null && fetchTimeout === null) {
            fetchTimeout = setTimeout(function () {
                tagsError('Nobody responded when trying to fetch the tags count', 408);
                fetchTimeout = null;
            }, 4000);
            socket.emit('tags');
        }
    };
    // Register for the tags event
    socket.on('tags', function (data) {
        clearTimeout(fetchTimeout);
        fetchTimeout = null;
        if (data.error) {
            tagsError(data.error, data.code);
            return;
        }
        setTags(data.results);
    });
    return {
        setTags: setTags,
        fetchTags: fetchTags,
        tagsError: tagsError
    };
};
//# sourceMappingURL=tags.js.map