"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MARSS_CONTENT_SET = 'MARSS_CONTENT_SET';
exports.MARSS_CONTENT_UPDATE = 'MARSS_CONTENT_UPDATE';
exports.MARSS_CONTENT_CLEAR = 'MARSS_CONTENT_CLEAR';
exports.createContentActions = function (_a, options) {
    var getState = _a.getState, dispatch = _a.dispatch, socket = _a.socket;
    /// Timeout to timeout waiting for tags
    var fetchTimeout = null;
    /// Content id currently being fetched
    var fetchingId = null;
    /**
     * If the new content has a different id to the current content, or if there
     * is no current content, store the new content as the current content.
     * If the new content has the same id as the current content, the new
     * content is stored as a content update (which can be applied using
     * updateContent().
     *
     * @param newContent New content
     */
    var setContent = function (newContent) {
        dispatch({
            type: exports.MARSS_CONTENT_SET,
            data: newContent
        });
    };
    var contentError = function (message, code) {
        dispatch({
            type: exports.MARSS_CONTENT_SET,
            error: {
                message: message,
                code: code,
                date: new Date()
            }
        });
    };
    /**
     * Clears the current content state including any error
     */
    var clearContent = function () {
        dispatch({
            type: exports.MARSS_CONTENT_CLEAR,
        });
    };
    /**
     * Updates the current content from the stored content update in the state
     */
    var updateContent = function () {
        dispatch({
            type: exports.MARSS_CONTENT_UPDATE
        });
    };
    /**
     * Fetch the content for the given id. If content is already being fetched
     * for the given id, the request will be ignored
     */
    var fetchContent = function (id) {
        if (fetchTimeout === null || fetchingId !== id) {
            if (fetchTimeout !== null) {
                clearTimeout(fetchTimeout);
            }
            fetchingId = id;
            fetchTimeout = setTimeout(function () {
                contentError('Nobody responded when trying to fetch the content for ' + id, 408);
                fetchTimeout = null;
                fetchingId = null;
            }, 4000);
            socket.emit('content', id);
        }
    };
    // Register for the tags event
    socket.on('content', function (data) {
        clearTimeout(fetchTimeout);
        fetchTimeout = null;
        if (data.error) {
            contentError(data.error, data.code);
            return;
        }
        if (!data.results) {
            contentError('"Not found', 404);
            return;
        }
        setContent(data.results);
    });
    return {
        setContent: setContent,
        contentError: contentError,
        clearContent: clearContent,
        updateContent: updateContent,
        fetchContent: fetchContent
    };
};
//# sourceMappingURL=content.js.map