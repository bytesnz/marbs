"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tags_1 = require("../actions/tags");
const initial = null;
exports.initialState = (options) => {
    return initial;
};
exports.reducer = (state = initial, action) => {
    switch (action.type) {
        case tags_1.MARSS_TAGS_SET:
            if (action.error) {
                state = {
                    error: Object.assign({}, action.error, { date: new Date() })
                };
            }
            else {
                state = {
                    data: Object.assign({}, action.data)
                };
            }
            break;
    }
    return state;
};
