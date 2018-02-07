import test from 'ava';

import * as TagsActions from './tags';
import * as State from '../../typings/state';

import options from '../lib/defaults/config.global';

import { createSetUpTestFunction } from '../tests/lib/actions';

test.beforeEach(createSetUpTestFunction(TagsActions.createTagsActions,
    options, {
  tags: null
}));

test('createTagsActions() should listen for tags events', (t) => {
  t.is(1, t.context.handlers['tags'].length, 'It did not add one handler for the tags event');
  t.true(typeof t.context.handlers['tags'][0] === 'function', 'The handler is not a function');
});

test('tags event listener should dispatch a set tags action when get results', (t) => {
  const count = {
    test: 1,
    second: 5
  };

  t.context.emit('tags', {
    results: count
  });

  t.is(1, t.context.dispatchedActions.length, 'did not dispatch 1 action');
  t.deepEqual({
    type: TagsActions.MARSS_TAGS_SET,
    data: count
  }, t.context.dispatchedActions[0]);
});

test('tags event listener should dispatch an set tags action with the error when gets an error', (t) => {
  const errorMessage = 'test';
  const errorCode = 999;

  t.context.emit('tags', {
    error: errorMessage,
    code: errorCode
  });

  t.is(1, t.context.dispatchedActions.length, 'did not dispatch 1 action');
  t.is(TagsActions.MARSS_TAGS_SET, t.context.dispatchedActions[0].type);
  t.is('object', typeof t.context.dispatchedActions[0].error, 'error is not an object');
  t.is(errorMessage, t.context.dispatchedActions[0].error.message);
  t.is(errorCode, t.context.dispatchedActions[0].error.code);
  t.true(t.context.dispatchedActions[0].error.date instanceof Date);
});

test('setTags() should dispatch a set tags action', (t) => {
  const count = {
    test: 1,
    second: 5
  };

  t.context.actions.setTags(count);

  t.is(1, t.context.dispatchedActions.length, 'It did not dispatch 1 action');

  t.deepEqual({
    type: TagsActions.MARSS_TAGS_SET,
    data: count
  }, t.context.dispatchedActions[0]);
});

test('tagsError() should dispatch a set tags action with an error', (t) => {
  const error = {
    message: 'Error',
    code: 500
  };

  t.context.actions.tagsError(error.message, error.code);

  t.is(1, t.context.dispatchedActions.length, 'It did not dispatch 1 action');
  t.is(TagsActions.MARSS_TAGS_SET, t.context.dispatchedActions[0].type);
  t.is('object', typeof t.context.dispatchedActions[0].error, 'error is not an object');
  t.is(error.message, t.context.dispatchedActions[0].error.message);
  t.is(error.code, t.context.dispatchedActions[0].error.code);
  t.true(t.context.dispatchedActions[0].error.date instanceof Date);
});

test('fetchTags() should emit a tags event to fetch tags', (t) => {
  t.context.actions.fetchTags();

  t.is(1, t.context.events.length, 'It did not emit 1 event');
  t.deepEqual({
    event: 'tags',
    data: []
  }, t.context.events[0]);
});

test('fetchTags() does not emit an event if tags are already being fetched', (t) => {
  t.context.state = {
    tags: null
  };

  t.context.actions.fetchTags();
  t.context.actions.fetchTags();

  t.is(1, t.context.events.length, 'Should have emitted one event');
});
