import test from 'ava';

import MockNconf from './mockNconf';

test('MockNconf can be called as a function', (t) => {
  const mock = MockNconf({ test: 'ok' });

  t.is(typeof mock.set, 'function');
  t.is(typeof mock.get, 'function');
  t.is(typeof mock.clone, 'function');
});

test('MockNconf can be called with new', (t) => {
  const mock = new MockNconf({ test: 'ok' });

  t.is(typeof mock.set, 'function');
  t.is(typeof mock.get, 'function');
  t.is(typeof mock.clone, 'function');
});

test('get() gets a value from the conf', (t) => {
  const mock = new MockNconf({ test: 'ok' });

  t.is(mock.get('test'), 'ok', 'mock instance did not return correct value');
});

test('set() sets a value in the conf', (t) => {
  const mock = new MockNconf({ test: 'ok' });

  mock.set('new', 'value');

  t.is(mock.get('test'), 'ok', 'mock set() overwrote an existing value');
  t.is(mock.get('new'), 'value', 'mock instance did not set the new value');
});

test('clone() creates a clone of a conf', (t) => {
  const mock = new MockNconf({ test: 'ok' });
  const clonedMock = mock.clone();

  clonedMock.set('new', 'great');

  t.is('great', clonedMock.get('new'));
  t.is(undefined, mock.get('new'));
});

