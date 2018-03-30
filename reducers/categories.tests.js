"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var Actions = require("../actions/categories");
var categories_1 = require("./categories");
var randomAction = {
    type: 'SOME_RANDOM_ACTION'
};
ava_1.default('reducer passes current state when it receives a action it does not care about', function (t) {
    var state = {};
    var newState = categories_1.reducer(state, randomAction);
    t.is(state, newState);
});
ava_1.default('reducer should return an empty state if given nothing', function (t) {
    var newState = categories_1.reducer({}, randomAction);
    t.deepEqual({}, newState);
});
ava_1.default('reducer should set the categories state to the given categories when given a set action', function (t) {
    var newCategories = {
        test: 1,
        second: 5
    };
    var newState = categories_1.reducer({}, {
        type: Actions.MARSS_CATEGORIES_SET,
        data: newCategories
    });
    t.deepEqual({
        data: newCategories
    }, newState);
});
//# sourceMappingURL=categories.tests.js.map