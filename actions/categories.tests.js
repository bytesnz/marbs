"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var CategoriesActions = require("./categories");
var config_global_1 = require("../lib/defaults/config.global");
var actions_1 = require("../tests/lib/actions");
ava_1.default.beforeEach(actions_1.createSetUpTestFunction(CategoriesActions.createCategoriesActions, config_global_1.default, {
    categories: null
}));
ava_1.default('createCategoriesActions() should listen for categories events', function (t) {
    t.is(1, t.context.handlers['categories'].length, 'It did not add one handler for the categories event');
    t.true(typeof t.context.handlers['categories'][0] === 'function', 'The handler is not a function');
});
ava_1.default('categories event listener should dispatch a set categories action when get results', function (t) {
    var count = {
        test: 2,
        another: 5
    };
    t.context.emit('categories', {
        results: count
    });
    t.is(1, t.context.dispatchedActions.length, 'did not dispatch 1 action');
    t.deepEqual({
        type: CategoriesActions.MARSS_CATEGORIES_SET,
        data: count
    }, t.context.dispatchedActions[0]);
});
ava_1.default('categories event listener should dispatch an set categories action with the error when gets an error', function (t) {
    var errorMessage = 'test';
    var errorCode = 999;
    t.context.emit('categories', {
        error: errorMessage,
        code: errorCode
    });
    t.is(1, t.context.dispatchedActions.length, 'did not dispatch 1 action');
    t.is(CategoriesActions.MARSS_CATEGORIES_SET, t.context.dispatchedActions[0].type);
    t.is('object', typeof t.context.dispatchedActions[0].error, 'error is not an object');
    t.is(errorMessage, t.context.dispatchedActions[0].error.message);
    t.is(errorCode, t.context.dispatchedActions[0].error.code);
    t.true(t.context.dispatchedActions[0].error.date instanceof Date);
});
ava_1.default('setCategories() should create a set categories action', function (t) {
    var count = {
        test: 1,
        second: 5
    };
    t.context.actions.setCategories(count);
    t.is(1, t.context.dispatchedActions.length, 'It did not dispatch 1 action');
    t.deepEqual({
        type: CategoriesActions.MARSS_CATEGORIES_SET,
        data: count
    }, t.context.dispatchedActions[0]);
});
ava_1.default('categoriessError() should dispatch a set tags action with an error', function (t) {
    var error = {
        message: 'Error',
        code: 500
    };
    t.context.actions.categoriesError(error.message, error.code);
    t.is(1, t.context.dispatchedActions.length, 'It did not dispatch 1 action');
    t.is(1, t.context.dispatchedActions.length, 'did not dispatch 1 action');
    t.is(CategoriesActions.MARSS_CATEGORIES_SET, t.context.dispatchedActions[0].type);
    t.is('object', typeof t.context.dispatchedActions[0].error, 'error is not an object');
    t.is(error.message, t.context.dispatchedActions[0].error.message);
    t.is(error.code, t.context.dispatchedActions[0].error.code);
    t.true(t.context.dispatchedActions[0].error.date instanceof Date);
});
ava_1.default('fetchCategories() emits a categories event', function (t) {
    t.context.actions.fetchCategories();
    t.is(1, t.context.events.length, 'Should have emitted one event');
    t.deepEqual({
        event: 'categories',
        data: []
    }, t.context.events[0]);
});
ava_1.default('fetchCategories() does not dispatch an action or an event if categories for an id are already being fetched', function (t) {
    t.context.actions.fetchCategories();
    t.context.actions.fetchCategories();
    t.is(1, t.context.events.length, 'Should have emitted one event');
});
//# sourceMappingURL=categories.tests.js.map