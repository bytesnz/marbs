"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var PostsActions = require("./posts");
var config_global_1 = require("../lib/defaults/config.global");
var actions_1 = require("../tests/lib/actions");
ava_1.default.beforeEach(actions_1.createSetUpTestFunction(PostsActions.createPostsActions, config_global_1.default, {
    posts: null
}));
ava_1.default('setPosts() should replace the current documents list', function (t) {
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
    t.context.state = {
        posts: [
            {
                id: 'bad document',
                attributes: {}
            }
        ]
    };
    t.context.actions.setPosts(posts);
    t.is(1, t.context.dispatchedActions.length, 'It did not dispatch 1 action');
    t.deepEqual({
        type: PostsActions.MARSS_POSTS_SET,
        data: posts
    }, t.context.dispatchedActions[0]);
});
ava_1.default('updatePosts() should dispatch a update action', function (t) {
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
    t.context.actions.updatePosts(posts);
    t.is(1, t.context.dispatchedActions.length, 'Should have emitted one event');
    t.deepEqual({
        type: PostsActions.MARSS_POSTS_UPDATE,
        data: posts
    }, t.context.dispatchedActions[0]);
});
ava_1.default('fetchPosts() does not dispatch an action or an event if posts are already being fetched', function (t) {
    t.context.state = {
        posts: null
    };
    t.context.actions.fetchPosts();
    t.context.actions.fetchPosts();
    t.is(1, t.context.events.length, 'Should have emitted one event');
});
ava_1.default('fetchPosts() should emit a documents event', function (t) {
    t.context.actions.fetchPosts();
    t.is(1, t.context.events.length, 'It did not emit 1 event');
    t.deepEqual({
        event: 'documents',
        data: []
    }, t.context.events[0]);
});
//# sourceMappingURL=posts.tests.js.map