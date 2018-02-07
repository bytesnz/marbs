"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const Actions = require("../actions/tags");
const tags_1 = require("./tags");
const randomAction = {
    type: 'SOME_RANDOM_ACTION'
};
ava_1.default('reducer passes current state when it receives a action it does not care about', (t) => {
    const state = {};
    const newState = tags_1.reducer(state, randomAction);
    t.is(state, newState);
});
ava_1.default('reducer should return an empty state if given nothing', (t) => {
    const newState = tags_1.reducer({}, randomAction);
    t.deepEqual({}, newState);
});
ava_1.default('reducer should set the tags state to the given tags when given a set action', (t) => {
    const newTags = {
        test: 1,
        second: 5
    };
    const newState = tags_1.reducer({}, {
        type: Actions.MARSS_TAGS_SET,
        data: newTags
    });
    t.deepEqual({
        data: newTags
    }, newState);
});
ava_1.default('reducer should set an error in the state', (t) => {
    const newError = {
        message: 'test',
        code: 200
    };
    const newState = tags_1.reducer({}, {
        type: Actions.MARSS_TAGS_SET,
        error: newError
    });
    t.deepEqual({
        error: Object.assign({}, newError, { date: new Date() })
    }, newState);
});
