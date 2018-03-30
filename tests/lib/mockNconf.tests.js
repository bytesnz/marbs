"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var mockNconf_1 = require("./mockNconf");
ava_1.default('MockNconf can be called as a function', function (t) {
    var mock = mockNconf_1.default({ test: 'ok' });
    t.is(typeof mock.set, 'function');
    t.is(typeof mock.get, 'function');
    t.is(typeof mock.clone, 'function');
});
ava_1.default('MockNconf can be called with new', function (t) {
    var mock = new mockNconf_1.default({ test: 'ok' });
    t.is(typeof mock.set, 'function');
    t.is(typeof mock.get, 'function');
    t.is(typeof mock.clone, 'function');
});
ava_1.default('get() gets a value from the conf', function (t) {
    var mock = new mockNconf_1.default({ test: 'ok' });
    t.is(mock.get('test'), 'ok', 'mock instance did not return correct value');
});
ava_1.default('set() sets a value in the conf', function (t) {
    var mock = new mockNconf_1.default({ test: 'ok' });
    mock.set('new', 'value');
    t.is(mock.get('test'), 'ok', 'mock set() overwrote an existing value');
    t.is(mock.get('new'), 'value', 'mock instance did not set the new value');
});
ava_1.default('clone() creates a clone of a conf', function (t) {
    var mock = new mockNconf_1.default({ test: 'ok' });
    var clonedMock = mock.clone();
    clonedMock.set('new', 'great');
    t.is('great', clonedMock.get('new'));
    t.is(undefined, mock.get('new'));
});
//# sourceMappingURL=mockNconf.tests.js.map