"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const mockNconf_1 = require("./mockNconf");
ava_1.default('MockNconf can be called as a function', (t) => {
    const mock = mockNconf_1.MockNconf({ test: 'ok' });
    t.is(typeof mock.set, 'function');
    t.is(typeof mock.get, 'function');
    t.is(typeof mock.clone, 'function');
});
ava_1.default('MockNconf can be called with new', (t) => {
    const mock = new mockNconf_1.MockNconf({ test: 'ok' });
    t.is(typeof mock.set, 'function');
    t.is(typeof mock.get, 'function');
    t.is(typeof mock.clone, 'function');
});
ava_1.default('get() gets a value from the conf', (t) => {
    const mock = new mockNconf_1.MockNconf({ test: 'ok' });
    t.is(mock.get('test'), 'ok', 'mock instance did not return correct value');
});
ava_1.default('set() sets a value in the conf', (t) => {
    const mock = new mockNconf_1.MockNconf({ test: 'ok' });
    mock.set('new', 'value');
    t.is(mock.get('test'), 'ok', 'mock set() overwrote an existing value');
    t.is(mock.get('new'), 'value', 'mock instance did not set the new value');
});
ava_1.default('clone() creates a clone of a conf', (t) => {
    const mock = new mockNconf_1.MockNconf({ test: 'ok' });
    const clonedMock = mock.clone();
    clonedMock.set('new', 'great');
    t.is('great', clonedMock.get('new'));
    t.is(undefined, mock.get('new'));
});
