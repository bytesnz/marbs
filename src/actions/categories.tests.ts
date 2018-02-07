import test from 'ava';

import * as CategoriesActions from './categories';
import * as State from '../../typings/state';

import options from '../lib/defaults/config.global';

test.beforeEach((t) => {
  t.context.dispatchedActions = <Array<State.Action>>[];

  t.context.actions = CategoriesActions.createCategoriesActions({
    dispatch: (action: State.Action) => {
      t.context.dispatchedActions.push(action);
    }
  }, options);
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

  t.deepEqual({
    type: CategoriesActions.MARSS_CATEGORIES_SET,
    error
  }, t.context.dispatchedActions[0]);
});
