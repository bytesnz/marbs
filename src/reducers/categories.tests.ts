import test from 'ava';

import * as Actions from '../actions/categories';

import { reducer as categoriesReducer } from './categories';

const randomAction = {
  type: 'SOME_RANDOM_ACTION'
};

test('reducer passes current state when it receives a action it does not care about', (t) => {
  const state = {};

  const newState = categoriesReducer(state, randomAction);

  t.is(state, newState);
});

test('reducer should return an empty state if given nothing', (t) => {
  const newState = categoriesReducer({}, randomAction);

  t.deepEqual({}, newState);
});

test('reducer should set the categories state to the given categories when given a set action', (t) => {
  const newCategories = {
    test: 1,
    second: 5
  };

  const newState = categoriesReducer({}, {
    type: Actions.MARSS_CATEGORIES_SET,
    data: newCategories
  });

  t.deepEqual(newCategories, newState);
});

