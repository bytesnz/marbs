"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var Actions = require("../actions/posts");
var posts_1 = require("./posts");
var randomAction = {
    type: 'SOME_RANDOM_ACTION'
};
ava_1.default('reducer passes current state when it receives a action it does not care about', function (t) {
    var state = {};
    var newState = posts_1.reducer(state, randomAction);
    t.is(state, newState);
});
ava_1.default('reducer should return the initial state if given nothing', function (t) {
    var newState = posts_1.reducer(undefined, randomAction);
    t.deepEqual(null, newState);
});
ava_1.default('reducer should set the posts state to the given posts when given a set action', function (t) {
    var posts = [
        {
            id: 'new document',
            attributes: {}
        },
        {
            id: 'new document 1',
            attributes: {}
        }
    ];
    var newState = posts_1.reducer({
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
ava_1.default('reducer should set an error in the state', function (t) {
    var newError = {
        message: 'test',
        code: 200
    };
    var state = {};
    var newState = posts_1.reducer(state, {
        type: Actions.MARSS_POSTS_SET,
        error: newError
    });
    t.not(state, newState, 'did not create a new state object');
    t.is('object', typeof newState.error, 'state.error is not an object');
    t.is(newError.message, newState.error.message, 'error message not set');
    t.is(newError.code, newState.error.code, 'error code not set');
    t.true(newState.error.date instanceof Date, 'error date is not a Date');
});
ava_1.default('reducer should update the posts in the state when update action', function (t) {
    var state = {
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
    var newData = [
        {
            id: 'test',
            body: 'this is a test'
        }
    ];
    var newState = posts_1.reducer(state, {
        type: Actions.MARSS_POSTS_UPDATE,
        data: newData
    });
    t.not(state, newState, 'did not create a new state object');
    t.deepEqual({
        data: [
            __assign({}, state.data[0], { body: newData[0].body })
        ]
    }, newState);
});
ava_1.default('reducer should insert new post in correct position when given a new post in update action', function (t) {
    var state = {
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
    var newData = [
        {
            id: 'test2',
            attributes: {
                date: new Date('2018-01-03')
            },
            body: 'this is a test'
        }
    ];
    var newState = posts_1.reducer(state, {
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
ava_1.default('reducer should set the posts state to the given posts when given a update with no posts in state', function (t) {
    var posts = [
        {
            id: 'new document',
            attributes: {}
        },
        {
            id: 'new document 1',
            attributes: {}
        }
    ];
    var newState = posts_1.reducer(undefined, {
        type: Actions.MARSS_POSTS_UPDATE,
        data: posts
    });
    t.deepEqual(posts, newState.data);
});
//# sourceMappingURL=posts.tests.js.map