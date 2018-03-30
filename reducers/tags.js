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
var tags_1 = require("../actions/tags");
;
var initial = null;
exports.initialState = function (options) {
    return initial;
};
exports.reducer = function (state, action) {
    if (state === void 0) { state = initial; }
    switch (action.type) {
        case tags_1.MARSS_TAGS_SET:
            if (action.error) {
                state = {
                    error: action.error
                };
            }
            else {
                state = {
                    data: __assign({}, action.data)
                };
            }
            break;
    }
    return state;
};
//# sourceMappingURL=tags.js.map