"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var contentReducer = require("../../reducers/content");
var postsReducer = require("../../reducers/posts");
var posts_1 = require("../../actions/posts");
var content_1 = require("../../actions/content");
var categories_1 = require("../../actions/categories");
/**
 * Livens the actions given to it by passing the state and the given options
 * to them
 *
 * @param actions Actions to liven.
 * @param state Redux state to use to liven actions
 * @param options Config options to pass to actions
 */
exports.livenActions = function (actions, state, options, socket) {
    var life = {
        dispatch: state.dispatch,
        getState: state.getState,
        socket: socket
    };
    return Object.keys(actions).reduce(function (liveActions, group) {
        var groupActions = actions[group];
        if (typeof groupActions === 'function') {
            liveActions[group] = groupActions(life, options);
        }
        else {
            liveActions[group] = Object.keys(groupActions).reduce(function (liveGroupActions, actionName) {
                var action = groupActions[actionName];
                liveGroupActions[actionName] = function () {
                    var params = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        params[_i] = arguments[_i];
                    }
                    return action.apply(void 0, [life, options].concat(params));
                };
                return liveGroupActions;
            }, {});
        }
        return liveActions;
    }, {});
};
exports.createMarss = function (options) { return __awaiter(_this, void 0, void 0, function () {
    var reducers, initialState, _a, actions, tagsReducer, _b, categoriesReducer, _c, combinedReducers, deepFreeze_1, original_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                reducers = {
                    content: contentReducer.reducer,
                    posts: postsReducer.reducer
                };
                _a = {};
                return [4 /*yield*/, contentReducer.initialState(options)];
            case 1:
                _a.content = _d.sent();
                return [4 /*yield*/, postsReducer.initialState(options)];
            case 2:
                initialState = (_a.posts = _d.sent(),
                    _a);
                actions = {
                    content: content_1.createContentActions,
                    categories: categories_1.createCategoriesActions,
                    posts: posts_1.createPostsActions
                };
                if (!options.functionality.tags) return [3 /*break*/, 4];
                tagsReducer = require('../../reducers/tags');
                actions.tags = require('../../actions/tags').createTagsActions;
                reducers.tags = tagsReducer.reducer;
                _b = initialState;
                return [4 /*yield*/, tagsReducer.initialState(options)];
            case 3:
                _b.tags = _d.sent();
                _d.label = 4;
            case 4:
                if (!options.functionality.categories) return [3 /*break*/, 6];
                categoriesReducer = require('../../reducers/categories');
                reducers.categories = categoriesReducer.reducer;
                _c = initialState;
                return [4 /*yield*/, categoriesReducer.initialState(options)];
            case 5:
                _c.categories = _d.sent();
                _d.label = 6;
            case 6:
                combinedReducers = redux_1.combineReducers(reducers);
                if (process.env.NODE_ENV !== 'production') {
                    deepFreeze_1 = require('deep-freeze');
                    original_1 = combinedReducers;
                    combinedReducers = function (state, action) {
                        if (state === void 0) { state = {}; }
                        state = original_1(state, action);
                        deepFreeze_1(state);
                        return state;
                    };
                }
                return [2 /*return*/, {
                        reducers: combinedReducers,
                        initialState: initialState,
                        actions: actions
                    }];
        }
    });
}); };
//# sourceMappingURL=marss.js.map