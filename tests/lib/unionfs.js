"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_monkey_1 = require("fs-monkey");
var memfs_1 = require("memfs");
var unionfs_1 = require("unionfs");
var fs = require("fs");
exports.vol = new memfs_1.Volume();
var fs2 = Object.assign({}, fs);
unionfs_1.ufs.use(fs2).use(exports.vol);
fs_monkey_1.patchFs(unionfs_1.ufs);
//# sourceMappingURL=unionfs.js.map