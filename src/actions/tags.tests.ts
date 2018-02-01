import test from 'ava';

import * as Actions from './tags';

test('setTags() should create a set tags action', (t) => {
  const count = {
    test: 1,
    second: 5
  };

  t.deepEqual({
    type: Actions.MARSS_TAGS_SET,
    data: count
  }, Actions.setTags(count));
});

