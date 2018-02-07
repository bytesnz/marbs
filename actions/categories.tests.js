"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const CategoriesActions = require("./categories");
const config_global_1 = require("../lib/defaults/config.global");
ava_1.default.beforeEach((t) => {
    t.context.dispatchedActions = [];
    t.context.actions = CategoriesActions.createCategoriesActions({
        dispatch: (action) => {
            t.context.dispatchedActions.push(action);
        }
    }, config_global_1.default);
});
ava_1.default('setCategories() should create a set categories action', (t) => {
    const count = {
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
ava_1.default('categoriessError() should dispatch a set tags action with an error', (t) => {
    const error = {
        message: 'Error',
        code: 500
    };
    t.context.actions.categoriesError(error.message, error.code);
    t.is(1, t.context.dispatchedActions.length, 'It did not dispatch 1 action');
    t.deepEqual({
        type: CategoriesActions.MARSS_CATEGORIES_SET,
        error
    }, t.context.dispatchedActions[0]);
});
