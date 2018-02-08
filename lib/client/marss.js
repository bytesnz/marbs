"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
const contentReducer = require("../../reducers/content");
const optionsReducer = require("../../reducers/options");
/**
 * Livens the actions given to it by passing the state and the given options
 * to them
 *
 * @param actions Actions to liven.
 * @param state Redux state to use to liven actions
 * @param options Config options to pass to actions
 */
exports.livenActions = (actions, state, options, socket) => {
    const life = {
        dispatch: state.dispatch,
        getState: state.getState,
        socket
    };
    return Object.keys(actions).reduce((liveActions, group) => {
        const groupActions = actions[group];
        if (typeof groupActions === 'function') {
            liveActions[group] = groupActions(life, options);
        }
        else {
            liveActions[group] = Object.keys(groupActions).reduce((liveGroupActions, actionName) => {
                const action = groupActions[actionName];
                liveGroupActions[actionName] = (...params) => action(life, options, ...params);
                return liveGroupActions;
            }, {});
        }
        return liveActions;
    }, {});
};
exports.createMarss = (options) => __awaiter(this, void 0, void 0, function* () {
    let reducers = {
        contents: contentReducer.reducer,
        options: optionsReducer.reducer
    };
    let initialState = {
        contents: yield contentReducer.initialState(options),
        options: yield optionsReducer.initialState(options)
    };
    let actions = {};
    if (options.functionality.tags) {
        const tagsReducer = require('../../reducers/tags');
        actions.tags = require('../../actions/tags').createTagsActions;
        reducers.tags = tagsReducer.reducer;
        initialState.tags = yield tagsReducer.initialState(options);
    }
    if (options.functionality.categories) {
        const categoriesReducer = require('../../reducers/categories');
        reducers.categories = categoriesReducer.reducer;
        initialState.categories = yield categoriesReducer.initialState(options);
    }
    let combinedReducers = redux_1.combineReducers(reducers);
    if (process.env.NODE_ENV !== 'production') {
        const original = combinedReducers;
        combinedReducers = (state = {}, action) => {
            state = original(state, action);
            Object.freeze(state);
            return state;
        };
    }
    return {
        reducers: combinedReducers,
        initialState,
        actions
    };
});