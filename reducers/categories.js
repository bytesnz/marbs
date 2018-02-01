"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const categories_1 = require("../actions/categories");
const initial = {};
exports.initialState = (options) => {
    return initial;
};
exports.reducer = (state = initial, action) => {
    switch (action.type) {
        case categories_1.MARSS_CATEGORIES_SET:
            state = Object.assign({}, action.data);
            break;
    }
    return state;
};
