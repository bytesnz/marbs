import test from 'ava';

import { Document } from '../../typings/data';
import * as PostsActions from './posts';
import * as State from '../../typings/state';

import options from '../lib/defaults/config.global';

import { createSetUpTestFunction } from '../tests/lib/actions';

test.beforeEach(createSetUpTestFunction(PostsActions.createPostsActions,
    options, {
  posts: null
}));

test('setPosts() should replace the current documents list', (t) => {
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

  t.context.state = {
    posts: [
      {
        id: 'bad document',
        attributes: {}
      }
    ]
  };

  t.context.actions.setPosts(posts);

  t.is(1, t.context.dispatchedActions.length, 'It did not dispatch 1 action');

  t.deepEqual({
    type: PostsActions.MARSS_POSTS_SET,
    data: posts
  }, t.context.dispatchedActions[0]);
});

test('updatePosts() should dispatch a update action', (t) => {
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

  t.context.actions.updatePosts(posts);

  t.is(1, t.context.dispatchedActions.length, 'Should have emitted one event');
  t.deepEqual({
    type: PostsActions.MARSS_POSTS_UPDATE,
    data: posts
  }, t.context.dispatchedActions[0]);
});

test('fetchPosts() does not dispatch an action or an event if posts are already being fetched', (t) => {
  t.context.state = {
    posts: null
  };

  t.context.actions.fetchPosts();
  t.context.actions.fetchPosts();

  t.is(1, t.context.events.length, 'Should have emitted one event');
});

test('fetchPosts() should emit a documents event', (t) => {
  t.context.actions.fetchPosts();

  t.is(1, t.context.events.length, 'It did not emit 1 event');
  t.deepEqual({
    event: 'documents',
    data: []
  }, t.context.events[0]);
});

