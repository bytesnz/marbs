import test from 'ava';

import * as Actions from '../actions/posts';

import {
  reducer as postsReducer,
  PostsState
} from './posts';

const randomAction = {
  type: 'SOME_RANDOM_ACTION'
};

test('reducer passes current state when it receives a action it does not care about', (t) => {
  const state = <PostsState>{};

  const newState = postsReducer(state, randomAction);

  t.is(state, newState);
});

test('reducer should return the initial state if given nothing', (t) => {
  const newState = postsReducer(undefined, randomAction);

  t.deepEqual(null, newState);
});

test('reducer should set the posts state to the given posts when given a set action', (t) => {
  const posts = [
      {
        id: 'new document',
        attributes: {}
      },
      {
        id: 'new document 1',
        attributes: {}
      }
  ];

  const newState = postsReducer(<PostsState>{
    data: [
      {
        id: 'bad document',
        attributes: {}
      }
    ]
  }, {
    type: Actions.MARSS_POSTS_SET,
    data: posts
  });

  t.deepEqual(posts, newState.data);
});

test('reducer should set an error in the state', (t) => {
  const newError = {
    message: 'test',
    code: 200
  };
  const state = <PostsState>{};

  const newState = postsReducer(state, {
    type: Actions.MARSS_POSTS_SET,
    error: newError
  });

  t.not(state, newState, 'did not create a new state object');
  t.is('object', typeof newState.error, 'state.error is not an object');
  t.is(newError.message, newState.error.message, 'error message not set');
  t.is(newError.code, newState.error.code, 'error code not set');
  t.true(newState.error.date instanceof Date, 'error date is not a Date');
});

test('reducer should update the posts in the state when update action', (t) => {
  const state = <PostsState>{
    data: [
      {
        id: 'test',
        attributes: {
          date: new Date(),
          tags: ['test']
        },
        body: null
      }
    ]
  };
  Object.freeze(state);
  const newData = [
    {
      id: 'test',
      body: 'this is a test'
    }
  ];

  const newState = postsReducer(state, {
    type: Actions.MARSS_POSTS_UPDATE,
    data: newData
  });

  t.not(state, newState, 'did not create a new state object');
  t.deepEqual({
    data: [
      {
        ...state.data[0],
        body: newData[0].body
      }
    ]
  }, newState);
});

test('reducer should insert new post in correct position when given a new post in update action', (t) => {
  const state = {
    data: [
      {
        id: 'test',
        attributes: {
          date: new Date('2018-01-01'),
          tags: ['test']
        },
        body: null
      },
      {
        id: 'test3',
        attributes: {
          date: new Date('2018-01-05'),
          tags: ['test3']
        },
        body: null
      }
    ]
  };
  Object.freeze(state);
  const newData = [
    {
      id: 'test2',
      attributes: {
        date: new Date('2018-01-03')
      },
      body: 'this is a test'
    }
  ];

  const newState = postsReducer(state, {
    type: Actions.MARSS_POSTS_UPDATE,
    data: newData
  });

  t.not(state, newState, 'did not create a new state object');
  t.deepEqual({
    data: [
      state.data[0],
      newData[0],
      state.data[1]
    ]
  }, newState);
});

test('reducer should set the posts state to the given posts when given a update with no posts in state', (t) => {
  const posts = [
      {
        id: 'new document',
        attributes: {}
      },
      {
        id: 'new document 1',
        attributes: {}
      }
  ];

  const newState = postsReducer(undefined, {
    type: Actions.MARSS_POSTS_UPDATE,
    data: posts
  });

  t.deepEqual(posts, newState.data);
});
