"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const just_diff_1 = require("just-diff");
const content_1 = require("../actions/content");
;
exports.initialState = (options) => null;
exports.reducer = (state = null, action) => {
    switch (action.type) {
        case content_1.MARSS_CONTENT_SET:
            if (action.error) {
                state = {
                    error: action.error
                };
                break;
            }
            if (state && state.data && state.data.id === action.data.id) {
                const contentDiff = just_diff_1.diff(state.data, action.data);
                if (contentDiff.length) {
                    state = {
                        data: state.data,
                        update: action.data
                    };
                }
            }
            else {
                state = {
                    data: action.data
                };
            }
            break;
        case content_1.MARSS_CONTENT_CLEAR:
            state = null;
            break;
        case content_1.MARSS_CONTENT_UPDATE:
            if (state.data && state.update) {
                state = {
                    data: state.update
                };
            }
            break;
    }
    return state;
};
