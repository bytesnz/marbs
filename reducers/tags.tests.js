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
ava_1.default('reducer should return the initial state if given nothing', (t) => {
    const newState = tags_1.reducer(undefined, randomAction);
    t.deepEqual(null, newState);
});
ava_1.default('reducer should set the tags state to the given tags when given a set action', (t) => {
    const newTags = {
        test: 1,
        second: 5
    };
    const state = {};
    const newState = tags_1.reducer(state, {
        type: Actions.MARSS_TAGS_SET,
        data: newTags
    });
    t.not(state, newState, 'did not create a new state object');
    t.deepEqual({
        data: newTags
    }, newState);
});
ava_1.default('reducer should set an error in the state', (t) => {
    const newError = {
        message: 'test',
        code: 200
    };
    const state = {};
    const newState = tags_1.reducer(state, {
        type: Actions.MARSS_TAGS_SET,
        error: newError
    });
    t.not(state, newState, 'did not create a new state object');
    t.is('object', typeof newState.error, 'state.error is not an object');
    t.is(newError.message, newState.error.message, 'error message not set');
    t.is(newError.code, newState.error.code, 'error code not set');
    t.true(newState.error.date instanceof Date, 'error date is not a Date');
});
