"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var just_diff_1 = require("just-diff");
var content_1 = require("../actions/content");
;
exports.initialState = function (options) { return null; };
exports.reducer = function (state, action) {
    if (state === void 0) { state = null; }
    switch (action.type) {
        case content_1.MARSS_CONTENT_SET:
            if (action.error) {
                state = {
                    error: action.error
                };
                break;
            }
            if (state && state.data && state.data.id === action.data.id) {
                var contentDiff = just_diff_1.diff(state.data, action.data);
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
//# sourceMappingURL=content.js.map