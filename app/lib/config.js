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
var Config_1 = require("Config");
var config_global_1 = require("../../lib/defaults/config.global");
exports.config = __assign({}, config_global_1.default, Config_1.default);
exports.default = exports.config;
//# sourceMappingURL=config.js.map