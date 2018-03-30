"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MARSS_POSTS_SET = 'MARSS_POSTS_SET';
exports.MARSS_POSTS_UPDATE = 'MARSS_POSTS_UPDATE';
exports.createPostsActions = function (_a, options) {
    var getState = _a.getState, dispatch = _a.dispatch, socket = _a.socket;
    /// Timeout to timeout waiting for tags
    var fetchTimeout = null;
    /// Search timeouts
    var searchTimeouts;
    var setPosts = function (newPosts) {
        dispatch({
            type: exports.MARSS_POSTS_SET,
            data: newPosts
        });
    };
    var postsError = function (message, code) {
        dispatch({
            type: exports.MARSS_POSTS_SET,
            error: {
                message: message,
                code: code,
                date: new Date()
            }
        });
    };
    var updatePosts = function (posts) {
        dispatch({
            type: exports.MARSS_POSTS_UPDATE,
            data: posts
        });
    };
    var fetchPosts = function () {
        if (getState().posts === null && fetchTimeout === null) {
            fetchTimeout = setTimeout(function () {
                postsError('Nobody responded when trying to fetch the posts count', 408);
                fetchTimeout = null;
            }, 4000);
            socket.emit('documents');
        }
    };
    // Register for the tags event
    socket.on('documents', function (data) {
        clearTimeout(fetchTimeout);
        fetchTimeout = null;
        if (data.error) {
            postsError(data.error, data.code);
            return;
        }
        setPosts(data.results);
    });
    return {
        setPosts: setPosts,
        updatePosts: updatePosts,
        fetchPosts: fetchPosts
    };
};
//# sourceMappingURL=posts.js.map