import test from 'ava';
import * as deepFreeze from 'deep-freeze';

import * as Actions from '../actions/content';

import { reducer } from './content';

const randomAction = {
  type: 'SOME_RANDOM_ACTION'
};

const newContent = {
  id: 'test',
  attribute: {
    type: 'page',
    tags: ['test']
  },
  body: 'test'
};

test('reducer passes current state when it receives a action it does not care about', (t) => {
  const state = {};

  const newState = reducer(state, randomAction);

  t.is(state, newState);
});

test('reducer should return the initial state if given nothing', (t) => {
  const newState = reducer(undefined, randomAction);

  t.deepEqual(null, newState);
});

test('reducer should set the content to thte given content if no current content', (t) => {
  const state = {};

  const newState = reducer(state, {
    type: Actions.MARSS_CONTENT_SET,
    data: newContent
  });

  t.not(state, newState);
  t.deepEqual({
    data: newContent
  }, newState);
});

test('reducer should replace the content to thte given content if current content has different id', (t) => {
  const state = {
    data: {
      id: 'test2'
    }
  };

  const newState = reducer(state, {
    type: Actions.MARSS_CONTENT_SET,
    data: newContent
  });

  t.not(state, newState);
  t.deepEqual({
    data: newContent
  }, newState);
});

test('reducer should store new content as update if current content has the same id', (t) => {
  const state = {
    data: {
      id: 'test',
      attributes: {
        tags: ['test', 'this']
      },
      body: 'ok'
    }
  };

  const newState = reducer(state, {
    type: Actions.MARSS_CONTENT_SET,
    data: newContent
  });

  t.not(state, newState);
  t.is(state.data, newState.data);
  t.deepEqual({
    data: state.data,
    update: newContent
  }, newState);
});

test('reducer should not create an update if the content is the same', (t) => {
  const state = {
    data: newContent
  };

  const newState = reducer(state, {
    type: Actions.MARSS_CONTENT_SET,
    data: newContent
  });

  t.is(state, newState);
});

test('reducer should store error and clear content and update when given an error', (t) => {
  const state = {
    data: {
      id: 'test',
      attributes: {
        tags: ['test', 'this']
      },
      body: 'ok'
    },
    update: {
      some: 'update'
    }
  };

  const error = {
    message: 'test',
    code: 999,
    date: new Date()
  };

  const newState = reducer(state, {
    type: Actions.MARSS_CONTENT_SET,
    error
  });

  t.not(state, newState);
  t.deepEqual({
    error
  }, newState);
});

test('reducer should clear state when given a clear action', (t) => {
  const state = {
    data: {
      id: 'test',
      attributes: {
        tags: ['test', 'this']
      },
      body: 'ok'
    },
    update: {
      some: 'update'
    }
  };

  const newState = reducer(state, {
    type: Actions.MARSS_CONTENT_CLEAR
  });

  t.not(state, newState);
  t.is(null, newState);
});

test('reducer should apply diff when given an update action', (t) => {
  const oldContent = {
    id: 'test',
    attributes: {
      tags: ['test', 'this']
    },
    body: 'ok'
  };

  const state = {
    data: oldContent,
    update: newContent
  };
  deepFreeze(state);

  const newState = reducer(state, {
    type: Actions.MARSS_CONTENT_UPDATE
  });

  t.not(state, newState);

  t.deepEqual({
    data: newContent
  }, newState);
});
