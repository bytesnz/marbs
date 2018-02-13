"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const Actions = require("../actions/categories");
const categories_1 = require("./categories");
const randomAction = {
    type: 'SOME_RANDOM_ACTION'
};
ava_1.default('reducer passes current state when it receives a action it does not care about', (t) => {
    const state = {};
    const newState = categories_1.reducer(state, randomAction);
    t.is(state, newState);
});
ava_1.default('reducer should return an empty state if given nothing', (t) => {
    const newState = categories_1.reducer({}, randomAction);
    t.deepEqual({}, newState);
});
ava_1.default('reducer should set the categories state to the given categories when given a set action', (t) => {
    const newCategories = {
        test: 1,
        second: 5
    };
    const newState = categories_1.reducer({}, {
        type: Actions.MARSS_CATEGORIES_SET,
        data: newCategories
    });
    t.deepEqual({
        data: newCategories
    }, newState);
});
