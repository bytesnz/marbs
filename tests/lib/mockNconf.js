"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deepclone = require("lodash.clonedeep");
const MockNconf = function MockNconf(conf) {
    if (!(this instanceof MockNconf)) {
        return new MockNconf(conf);
    }
    this.conf = conf;
};
Object.assign(MockNconf.prototype, {
    set: function set(key, data) {
        if (typeof data === 'undefined') {
            if (typeof this.conf[key] !== 'undefined') {
                delete this.conf[key];
            }
        }
        else {
            this.conf[key] = data;
        }
    },
    get: function get(key) {
        return this.conf[key];
    },
    clone: function clone() {
        const newConf = deepclone(this.conf);
        return new MockNconf(newConf);
    }
});
exports.default = MockNconf;
