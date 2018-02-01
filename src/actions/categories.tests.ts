import test from 'ava';

import * as Actions from './categories';

test('setCategories() should create a set categories action', (t) => {
  const count = {
    test: 1,
    second: 5
  };

  t.deepEqual({
    type: Actions.MARSS_CATEGORIES_SET,
    data: count
  }, Actions.setCategories(count));
});
