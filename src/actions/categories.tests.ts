import test from 'ava';

import * as CategoriesActions from './categories';
import * as State from '../../typings/state';
import { TagsCount } from '../reducers/categories';

import options from '../lib/defaults/config.global';

import { createSetUpTestFunction } from '../tests/lib/actions';

test.beforeEach(createSetUpTestFunction(CategoriesActions.createCategoriesActions,
    options, {
  categories: null
}));

test('createCategoriesActions() should listen for categories events', (t) => {
  t.is(1, t.context.handlers['categories'].length, 'It did not add one handler for the categories event');
  t.true(typeof t.context.handlers['categories'][0] === 'function', 'The handler is not a function');
});

test('categories event listener should dispatch a set categories action when get results', (t) => {
  const count = <TagsCount>{
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

test('categories event listener should dispatch an set categories action with the error when gets an error', (t) => {
  const errorMessage = 'test';
  const errorCode = 999;

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

test('setCategories() should create a set categories action', (t) => {
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

test('categoriessError() should dispatch a set tags action with an error', (t) => {
  const error = {
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

test('fetchCategories() emits a categories event', (t) => {
  t.context.actions.fetchCategories();

  t.is(1, t.context.events.length, 'Should have emitted one event');

  t.deepEqual({
    event: 'categories',
    data: [
    ]
  }, t.context.events[0]);
});

test('fetchCategories() does not dispatch an action or an event if categories for an id are already being fetched', (t) => {
  t.context.actions.fetchCategories();
  t.context.actions.fetchCategories();

  t.is(1, t.context.events.length, 'Should have emitted one event');
});
