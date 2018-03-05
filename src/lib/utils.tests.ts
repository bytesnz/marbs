import test from 'ava';

import {
  testDocuments as posts
} from '../tests/data/source';

import * as utils from './utils';

test('filterPostsByTags() should filter posts with the given tag', (t) => {
  const results = utils.filterPostsByTags(posts, ['test']);

  t.deepEqual([
    posts[1],
    posts[4],
    posts[5]
  ], results);
});

test('filterPostsByTags() should filter posts with either of the given tags', (t) => {
  const results = utils.filterPostsByTags(posts, ['test', 'draft']);

  t.deepEqual([
    posts[1],
    posts[2],
    posts[3],
    posts[4],
    posts[5],
    posts[6]
  ], results);
});

test('filterPostsByTags() should filter posts with all of the given tags with allTags set', (t) => {
  const results = utils.filterPostsByTags(posts, ['test', 'folder'], true);

  t.deepEqual([
    posts[4]
  ], results);
});

