import * as config from '../../../typings/configs';
import * as State from '../../../typings/state';

import test from 'ava';

import {
  createMarss,
  livenActions,
  Actions
} from './marss';

const options: config.SetGlobalConfig = {
  title: 'test',
  baseUri: '/',
  functionality: {},
  tagsUri: 'tags',
  categoriesUri: 'categories',
  staticUri: 'static'
};

test('should return a Promise', (t) => {
  t.is((createMarss(options, {})) instanceof Promise, true, 'createMarss() did not return a Promise');
});

test('should return a reducer and initial state with site and content with no functionality selected', async (t) => {
  const marss = await createMarss(options, {});

  const initialState = <State.State>{
    content: null,
    posts: null
  };

  t.is(typeof marss.reducers, 'function');
  t.deepEqual(initialState, marss.initialState);
});

test('initialState should include tags when enabled', async (t) => {
  const testOptions = {
    ...options,
    functionality: {
      tags: true
    }
  };

  const marss = await createMarss(testOptions, {});

  t.not(typeof marss.initialState.tags, 'undefined');
});

test('initialState should include categories when enabled', async (t) => {
  const testOptions = {
    ...options,
    functionality: {
      categories: true
    }
  };

  const marss = await createMarss(testOptions, {});

  t.not(typeof marss.initialState.categories, 'undefined');
});

test('livenAction() calls liven functions given to it', (t) => {
  let callCount = 0;

  livenActions({
    test: () => callCount++ && {}
  }, {}, options, {});

  t.is(1, callCount, 'livenActions did not call the liven function for test once');
});

test('liveAction() wraps functions in a actions group to pass state and options', (t) => {
  let receivedLife, receivedOptions, receivedOther;
  const state = {
    dispatch: {},
    getState: {}
  }, other = {}, socket = {};

  const actions = {
    test: {
      test: (life, options, other) => {
        receivedLife = life;
        receivedOptions = options;
        receivedOther = other;
      }
    }
  };

  const liveActions = livenActions(actions, state, options, socket);

  liveActions.test.test(other);

  t.not(actions, liveActions, 'liveActions() did not map actions into new Object');
  t.is(state.dispatch, receivedLife.dispatch, 'liveActions() wrapper did not pass state as first argument');
  t.is(state.getState, receivedLife.getState, 'liveActions() wrapper did not pass state as first argument');
  t.is(socket, receivedLife.socket, 'liveActions() wrapper did not pass state as first argument');
  t.is(options, receivedOptions, 'liveActions() wrapper did not pass options as second argument');
  t.is(other, receivedOther, 'liveActions() wrapper did not pass arguments');
});
