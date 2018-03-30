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
var categories_1 = require("../actions/categories");
var initial = null;
exports.initialState = function (options) {
    return initial;
};
exports.reducer = function (state, action) {
    if (state === void 0) { state = initial; }
    switch (action.type) {
        case categories_1.MARSS_CATEGORIES_SET:
            if (action.error) {
                state = {
                    error: action.error
                };
            }
            else if (action.data) {
                state = {
                    data: __assign({}, action.data)
                };
            }
            break;
    }
    return state;
};
//# sourceMappingURL=categories.js.map