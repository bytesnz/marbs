import test from 'ava';

import * as Actions from '../actions/tags';

import { reducer as tagsReducer } from './tags';

const randomAction = {
  type: 'SOME_RANDOM_ACTION'
};

test('reducer passes current state when it receives a action it does not care about', (t) => {
  const state = {};

  const newState = tagsReducer(state, randomAction);

  t.is(state, newState);
});

test('reducer should return an empty state if given nothing', (t) => {
  const newState = tagsReducer({}, randomAction);

  t.deepEqual({}, newState);
});

test('reducer should set the tags state to the given tags when given a set action', (t) => {
  const newTags = {
    test: 1,
    second: 5
  };

  const newState = tagsReducer({}, {
    type: Actions.MARSS_TAGS_SET,
    data: newTags
  });

  t.deepEqual(newTags, newState);
});
