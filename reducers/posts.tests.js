"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const Actions = require("../actions/posts");
const posts_1 = require("./posts");
const randomAction = {
    type: 'SOME_RANDOM_ACTION'
};
ava_1.default('reducer passes current state when it receives a action it does not care about', (t) => {
    const state = {};
    const newState = posts_1.reducer(state, randomAction);
    t.is(state, newState);
});
ava_1.default('reducer should return the initial state if given nothing', (t) => {
    const newState = posts_1.reducer(undefined, randomAction);
    t.deepEqual(null, newState);
});
ava_1.default('reducer should set the posts state to the given posts when given a set action', (t) => {
    const posts = [
        {
            id: 'new document',
            attributes: {}
        },
        {
            id: 'new document 1',
            attributes: {}
        }
    ];
    const newState = posts_1.reducer({
        data: [
            {
                id: 'bad document',
                attributes: {}
            }
        ]
    }, {
        type: Actions.MARSS_POSTS_SET,
        data: posts
    });
    t.deepEqual(posts, newState.data);
});
ava_1.default('reducer should set an error in the state', (t) => {
    const newError = {
        message: 'test',
        code: 200
    };
    const state = {};
    const newState = posts_1.reducer(state, {
        type: Actions.MARSS_POSTS_SET,
        error: newError
    });
    t.not(state, newState, 'did not create a new state object');
    t.is('object', typeof newState.error, 'state.error is not an object');
    t.is(newError.message, newState.error.message, 'error message not set');
    t.is(newError.code, newState.error.code, 'error code not set');
    t.true(newState.error.date instanceof Date, 'error date is not a Date');
});
ava_1.default('reducer should update the posts in the state when update action', (t) => {
    const state = {
        data: [
            {
                id: 'test',
                attributes: {
                    date: new Date(),
                    tags: ['test']
                },
                body: null
            }
        ]
    };
    Object.freeze(state);
    const newData = [
        {
            id: 'test',
            body: 'this is a test'
        }
    ];
    const newState = posts_1.reducer(state, {
        type: Actions.MARSS_POSTS_UPDATE,
        data: newData
    });
    t.not(state, newState, 'did not create a new state object');
    t.deepEqual({
        data: [
            Object.assign({}, state.data[0], { body: newData[0].body })
        ]
    }, newState);
});
ava_1.default('reducer should insert new post in correct position when given a new post in update action', (t) => {
    const state = {
        data: [
            {
                id: 'test',
                attributes: {
                    date: new Date('2018-01-01'),
                    tags: ['test']
                },
                body: null
            },
            {
                id: 'test3',
                attributes: {
                    date: new Date('2018-01-05'),
                    tags: ['test3']
                },
                body: null
            }
        ]
    };
    Object.freeze(state);
    const newData = [
        {
            id: 'test2',
            attributes: {
                date: new Date('2018-01-03')
            },
            body: 'this is a test'
        }
    ];
    const newState = posts_1.reducer(state, {
        type: Actions.MARSS_POSTS_UPDATE,
        data: newData
    });
    t.not(state, newState, 'did not create a new state object');
    t.deepEqual({
        data: [
            state.data[0],
            newData[0],
            state.data[1]
        ]
    }, newState);
});
ava_1.default('reducer should set the posts state to the given posts when given a update with no posts in state', (t) => {
    const posts = [
        {
            id: 'new document',
            attributes: {}
        },
        {
            id: 'new document 1',
            attributes: {}
        }
    ];
    const newState = posts_1.reducer(undefined, {
        type: Actions.MARSS_POSTS_UPDATE,
        data: posts
    });
    t.deepEqual(posts, newState.data);
});
