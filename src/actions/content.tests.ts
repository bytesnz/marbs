import test from 'ava';

import { Document } from '../../typings/data';
import * as ContentActions from './content';
import * as State from '../../typings/state';

import options from '../lib/defaults/config.global';

import { createSetUpTestFunction } from '../tests/lib/actions';

test.beforeEach(createSetUpTestFunction(ContentActions.createContentActions,
    options, {
  content: null
}));

test('createContentActions() should listen for content events', (t) => {
  t.is(1, t.context.handlers['content'].length, 'It did not add one handler for the content event');
  t.true(typeof t.context.handlers['content'][0] === 'function', 'The handler is not a function');
});

test('content event listener should dispatch a set content action when get results', (t) => {
  const content = <Document>{
    id: 'test',
    attributes: {},
    body: 'something'
  };

  t.context.emit('content', {
    results: content
  });

  t.is(1, t.context.dispatchedActions.length, 'did not dispatch 1 action');
  t.deepEqual({
    type: ContentActions.MARSS_CONTENT_SET,
    data: content
  }, t.context.dispatchedActions[0]);
});

test('content event listener should dispatch an set content action with the error when gets an error', (t) => {
  const errorMessage = 'test';
  const errorCode = 999;

  t.context.emit('content', {
    error: errorMessage,
    code: errorCode
  });

  t.is(1, t.context.dispatchedActions.length, 'did not dispatch 1 action');
  t.is(ContentActions.MARSS_CONTENT_SET, t.context.dispatchedActions[0].type);
  t.is('object', typeof t.context.dispatchedActions[0].error, 'error is not an object');
  t.is(errorMessage, t.context.dispatchedActions[0].error.message);
  t.is(errorCode, t.context.dispatchedActions[0].error.code);
  t.true(t.context.dispatchedActions[0].error.date instanceof Date);
});

test('setContent() should dispatch a set content action', (t) => {
  const newContent = {
    id: 'bad document',
    attributes: {}
  };

  t.context.actions.setContent(newContent);

  t.is(1, t.context.dispatchedActions.length, 'It did not dispatch 1 action');

  t.deepEqual({
    type: ContentActions.MARSS_CONTENT_SET,
    data: newContent
  }, t.context.dispatchedActions[0]);
});

test('contentError() should dispatch a set content action', (t) => {
  const errorMessage = 'test';
  const errorCode = 999;

  t.context.actions.contentError(errorMessage, errorCode);

  t.is(1, t.context.dispatchedActions.length, 'It did not dispatch 1 action');

  t.is(1, t.context.dispatchedActions.length, 'did not dispatch 1 action');
  t.is(ContentActions.MARSS_CONTENT_SET, t.context.dispatchedActions[0].type);
  t.is('object', typeof t.context.dispatchedActions[0].error, 'error is not an object');
  t.is(errorMessage, t.context.dispatchedActions[0].error.message);
  t.is(errorCode, t.context.dispatchedActions[0].error.code);
  t.true(t.context.dispatchedActions[0].error.date instanceof Date);
});

test('clearContent() should dispatch a clear content action', (t) => {
  t.context.actions.clearContent();

  t.is(1, t.context.dispatchedActions.length, 'It did not dispatch 1 action');

  t.deepEqual({
    type: ContentActions.MARSS_CONTENT_CLEAR
  }, t.context.dispatchedActions[0]);
});

test('updateContent() should dispatch an update content action', (t) => {
  t.context.actions.updateContent();

  t.is(1, t.context.dispatchedActions.length, 'It did not dispatch 1 action');

  t.deepEqual({
    type: ContentActions.MARSS_CONTENT_UPDATE
  }, t.context.dispatchedActions[0]);
});

test('fetchContents() does not dispatch an action or an event if content for an id are already being fetched', (t) => {
  t.context.actions.fetchContent('test');
  t.context.actions.fetchContent('test');
  t.context.actions.fetchContent('another');

  t.is(2, t.context.events.length, 'Should have emitted one event');

  t.deepEqual({
    event: 'content',
    data: [
      'test'
    ]
  }, t.context.events[0]);

  t.deepEqual({
    event: 'content',
    data: [
      'another'
    ]
  }, t.context.events[1]);
});


