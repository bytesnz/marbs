"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_global_1 = require("../../config.global");
const config_global_2 = require("../../lib/defaults/config.global");
exports.config = Object.assign({}, config_global_2.default, config_global_1.default);
exports.default = exports.config;
