"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const deepFreeze = require("deep-freeze");
const Actions = require("../actions/content");
const content_1 = require("./content");
const randomAction = {
    type: 'SOME_RANDOM_ACTION'
};
const newContent = {
    id: 'test',
    attribute: {
        type: 'page',
        tags: ['test']
    },
    body: 'test'
};
ava_1.default('reducer passes current state when it receives a action it does not care about', (t) => {
    const state = {};
    const newState = content_1.reducer(state, randomAction);
    t.is(state, newState);
});
ava_1.default('reducer should return the initial state if given nothing', (t) => {
    const newState = content_1.reducer(undefined, randomAction);
    t.deepEqual(null, newState);
});
ava_1.default('reducer should set the content to thte given content if no current content', (t) => {
    const state = {};
    const newState = content_1.reducer(state, {
        type: Actions.MARSS_CONTENT_SET,
        data: newContent
    });
    t.not(state, newState);
    t.deepEqual({
        data: newContent
    }, newState);
});
ava_1.default('reducer should replace the content to thte given content if current content has different id', (t) => {
    const state = {
        data: {
            id: 'test2'
        }
    };
    const newState = content_1.reducer(state, {
        type: Actions.MARSS_CONTENT_SET,
        data: newContent
    });
    t.not(state, newState);
    t.deepEqual({
        data: newContent
    }, newState);
});
ava_1.default('reducer should store new content as update if current content has the same id', (t) => {
    const state = {
        data: {
            id: 'test',
            attributes: {
                tags: ['test', 'this']
            },
            body: 'ok'
        }
    };
    const newState = content_1.reducer(state, {
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
ava_1.default('reducer should not create an update if the content is the same', (t) => {
    const state = {
        data: newContent
    };
    const newState = content_1.reducer(state, {
        type: Actions.MARSS_CONTENT_SET,
        data: newContent
    });
    t.is(state, newState);
});
ava_1.default('reducer should store error and clear content and update when given an error', (t) => {
    const state = {
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
    const error = {
        message: 'test',
        code: 999,
        date: new Date()
    };
    const newState = content_1.reducer(state, {
        type: Actions.MARSS_CONTENT_SET,
        error
    });
    t.not(state, newState);
    t.deepEqual({
        error
    }, newState);
});
ava_1.default('reducer should clear state when given a clear action', (t) => {
    const state = {
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
    const newState = content_1.reducer(state, {
        type: Actions.MARSS_CONTENT_CLEAR
    });
    t.not(state, newState);
    t.is(null, newState);
});
ava_1.default('reducer should apply diff when given an update action', (t) => {
    const oldContent = {
        id: 'test',
        attributes: {
            tags: ['test', 'this']
        },
        body: 'ok'
    };
    const state = {
        data: oldContent,
        update: newContent
    };
    deepFreeze(state);
    const newState = content_1.reducer(state, {
        type: Actions.MARSS_CONTENT_UPDATE
    });
    t.not(state, newState);
    t.deepEqual({
        data: newContent
    }, newState);
});
