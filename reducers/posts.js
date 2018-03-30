"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var posts_1 = require("../actions/posts");
var initial = null;
exports.initialState = function (options) {
    return initial;
};
exports.reducer = function (state, action) {
    if (state === void 0) { state = initial; }
    switch (action.type) {
        case posts_1.MARSS_POSTS_SET:
            if (action.error) {
                state = {
                    error: __assign({}, action.error, { date: new Date() })
                };
            }
            else {
                state = {
                    data: action.data
                };
            }
            break;
        case posts_1.MARSS_POSTS_UPDATE:
            if (action.error) {
            }
            else {
                if (!state || !Array.isArray(state.data)) {
                    state = {
                        data: action.data
                    };
                }
                else {
                    state = {
                        data: state.data.slice()
                    };
                    action.data.forEach(function (newPost) {
                        var currentPostIndex = state.data.findIndex(function (post) { return post.id === newPost.id; });
                        if (currentPostIndex !== -1) {
                            state.data[currentPostIndex] = __assign({}, state.data[currentPostIndex], newPost, { attributes: __assign({}, state.data[currentPostIndex].attributes, newPost.attributes) });
                        }
                        else {
                            // Find where new post should be inserted
                            var i = void 0;
                            for (i = 0; i < state.data.length; i++) {
                                if (state.data[i].attributes.date.getTime() > newPost.attributes.date.getTime()) {
                                    break;
                                }
                            }
                            state.data.splice(i, 0, newPost);
                        }
                    });
                }
            }
            break;
    }
    return state;
};
//# sourceMappingURL=posts.js.map