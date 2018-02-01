"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tags_1 = require("../actions/tags");
const initial = {};
exports.initialState = (options) => {
    return initial;
};
exports.reducer = (state = initial, action) => {
    switch (action.type) {
        case tags_1.MARSS_TAGS_SET:
    }
    return state;
};
