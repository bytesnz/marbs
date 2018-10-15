import * as config from '../../../typings/configs';
import * as State from '../../../typings/state';

import test from 'ava';

import {
  createMarss,
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

  t.deepEqual(initialState, marss.store.getState());
});

