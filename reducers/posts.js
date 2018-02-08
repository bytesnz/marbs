"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const posts_1 = require("../actions/posts");
const initial = null;
exports.initialState = (options) => {
    return initial;
};
exports.reducer = (state = initial, action) => {
    switch (action.type) {
        case posts_1.MARSS_POSTS_SET:
            if (action.error) {
                state = {
                    error: Object.assign({}, action.error, { date: new Date() })
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
                    action.data.forEach((newPost) => {
                        const currentPostIndex = state.data.findIndex((post) => post.id === newPost.id);
                        if (currentPostIndex !== -1) {
                            state.data[currentPostIndex] = Object.assign({}, state.data[currentPostIndex], newPost, { attributes: Object.assign({}, state.data[currentPostIndex].attributes, newPost.attributes) });
                        }
                        else {
                            // Find where new post should be inserted
                            let i;
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
