"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var deepFreeze = require("deep-freeze");
var Actions = require("../actions/content");
var content_1 = require("./content");
var randomAction = {
    type: 'SOME_RANDOM_ACTION'
};
var newContent = {
    id: 'test',
    attribute: {
        type: 'page',
        tags: ['test']
    },
    body: 'test'
};
ava_1.default('reducer passes current state when it receives a action it does not care about', function (t) {
    var state = {};
    var newState = content_1.reducer(state, randomAction);
    t.is(state, newState);
});
ava_1.default('reducer should return the initial state if given nothing', function (t) {
    var newState = content_1.reducer(undefined, randomAction);
    t.deepEqual(null, newState);
});
ava_1.default('reducer should set the content to thte given content if no current content', function (t) {
    var state = {};
    var newState = content_1.reducer(state, {
        type: Actions.MARSS_CONTENT_SET,
        data: newContent
    });
    t.not(state, newState);
    t.deepEqual({
        data: newContent
    }, newState);
});
ava_1.default('reducer should replace the content to thte given content if current content has different id', function (t) {
    var state = {
        data: {
            id: 'test2'
        }
    };
    var newState = content_1.reducer(state, {
        type: Actions.MARSS_CONTENT_SET,
        data: newContent
    });
    t.not(state, newState);
    t.deepEqual({
        data: newContent
    }, newState);
});
ava_1.default('reducer should store new content as update if current content has the same id', function (t) {
    var state = {
        data: {
            id: 'test',
            attributes: {
                tags: ['test', 'this']
            },
            body: 'ok'
        }
    };
    var newState = content_1.reducer(state, {
        type: Actions.MARSS_CONTENT_SET,
        data: newContent
    });
    t.not(state, newState);
    t.is(state.data, newState.data);
    t.deepEqual({
        data: state.data,
        update: newContent
    }, newState);
});
ava_1.default('reducer should not create an update if the content is the same', function (t) {
    var state = {
        data: newContent
    };
    var newState = content_1.reducer(state, {
        type: Actions.MARSS_CONTENT_SET,
        data: newContent
    });
    t.is(state, newState);
});
ava_1.default('reducer should store error and clear content and update when given an error', function (t) {
    var state = {
        data: {
            id: 'test',
            attributes: {
                tags: ['test', 'this']
            },
            body: 'ok'
        },
        update: {
            some: 'update'
        }
    };
    var error = {
        message: 'test',
        code: 999,
        date: new Date()
    };
    var newState = content_1.reducer(state, {
        type: Actions.MARSS_CONTENT_SET,
        error: error
    });
    t.not(state, newState);
    t.deepEqual({
        error: error
    }, newState);
});
ava_1.default('reducer should clear state when given a clear action', function (t) {
    var state = {
        data: {
            id: 'test',
            attributes: {
                tags: ['test', 'this']
            },
            body: 'ok'
        },
        update: {
            some: 'update'
        }
    };
    var newState = content_1.reducer(state, {
        type: Actions.MARSS_CONTENT_CLEAR
    });
    t.not(state, newState);
    t.is(null, newState);
});
ava_1.default('reducer should apply diff when given an update action', function (t) {
    var oldContent = {
        id: 'test',
        attributes: {
            tags: ['test', 'this']
        },
        body: 'ok'
    };
    var state = {
        data: oldContent,
        update: newContent
    };
    deepFreeze(state);
    var newState = content_1.reducer(state, {
        type: Actions.MARSS_CONTENT_UPDATE
    });
    t.not(state, newState);
    t.deepEqual({
        data: newContent
    }, newState);
});
//# sourceMappingURL=content.tests.js.map