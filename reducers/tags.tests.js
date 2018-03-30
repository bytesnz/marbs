"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var Actions = require("../actions/tags");
var tags_1 = require("./tags");
var randomAction = {
    type: 'SOME_RANDOM_ACTION'
};
ava_1.default('reducer passes current state when it receives a action it does not care about', function (t) {
    var state = {};
    var newState = tags_1.reducer(state, randomAction);
    t.is(state, newState);
});
ava_1.default('reducer should return the initial state if given nothing', function (t) {
    var newState = tags_1.reducer(undefined, randomAction);
    t.deepEqual(null, newState);
});
ava_1.default('reducer should set the tags state to the given tags when given a set action', function (t) {
    var newTags = {
        test: 1,
        second: 5
    };
    var state = {};
    var newState = tags_1.reducer(state, {
        type: Actions.MARSS_TAGS_SET,
        data: newTags
    });
    t.not(state, newState, 'did not create a new state object');
    t.deepEqual({
        data: newTags
    }, newState);
});
ava_1.default('reducer should set an error in the state', function (t) {
    var newError = {
        message: 'test',
        code: 200,
        date: new Date()
    };
    var state = {};
    var newState = tags_1.reducer(state, {
        type: Actions.MARSS_TAGS_SET,
        error: newError
    });
    t.not(state, newState, 'did not create a new state object');
    t.is('object', typeof newState.error, 'state.error is not an object');
    t.is(newError.message, newState.error.message, 'error message not set');
    t.is(newError.code, newState.error.code, 'error code not set');
    t.true(newState.error.date instanceof Date, 'error date is not a Date');
});
//# sourceMappingURL=tags.tests.js.map