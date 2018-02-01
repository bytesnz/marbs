"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const Actions = require("./tags");
ava_1.default('setTags() should create a set tags action', (t) => {
    const count = {
        test: 1,
        second: 5
    };
    t.deepEqual({
        type: Actions.MARSS_TAGS_SET,
        data: count
    }, Actions.setTags(count));
});
