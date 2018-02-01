import * as config from '../../../typings/configs';

import test from 'ava';

import { createMarss } from './marss';

const options: config.SetGlobalConfig = {
  title: 'test',
  baseUri: '/',
  functionality: {},
  tagsUri: 'tags',
  categoriesUri: 'categories'
};

test('should return a Promise', (t) => {
  t.is((createMarss(options)) instanceof Promise, true, 'createMarss() did not return a Promise');
});

test('should return a reducer and initial state with site and content with no functionality selected', async (t) => {
  const marss = await createMarss(options);

  const initialState = {
    options: options,
    contents: null
  };

  t.is(typeof marss.reducers, 'function');
  t.deepEqual(marss.initialState, initialState);
});

test('initialState should include tags when enabled', async (t) => {
  const testOptions = {
    ...options,
    functionality: {
      tags: true
    }
  };

  const marss = await createMarss(testOptions);

  t.not(typeof marss.initialState.tags, 'undefined');
});

test('initialState should include categories when enabled', async (t) => {
  const testOptions = {
    ...options,
    functionality: {
      categories: true
    }
  };

  const marss = await createMarss(testOptions);

  t.not(typeof marss.initialState.categories, 'undefined');
});

