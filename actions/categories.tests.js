"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const Actions = require("./categories");
ava_1.default('setCategories() should create a set categories action', (t) => {
    const count = {
        test: 1,
        second: 5
    };
    t.deepEqual({
        type: Actions.MARSS_CATEGORIES_SET,
        data: count
    }, Actions.setCategories(count));
});
