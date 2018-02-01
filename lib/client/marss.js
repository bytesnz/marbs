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
exports.createMarss = (options) => __awaiter(this, void 0, void 0, function* () {
    let reducers = {
        contents: contentReducer.reducer,
        options: optionsReducer.reducer
    };
    let initialState = {
        contents: yield contentReducer.initialState(options),
        options: yield optionsReducer.initialState(options)
    };
    if (options.functionality.tags) {
        const tagsReducer = require('../../reducers/tags');
        reducers.tags = tagsReducer.reducer;
        initialState.tags = yield tagsReducer.initialState(options);
    }
    if (options.functionality.categories) {
        const categoriesReducer = require('../../reducers/categories');
        reducers.categories = categoriesReducer.reducer;
        initialState.categories = yield categoriesReducer.initialState(options);
    }
    let combinedReducers = redux_1.combineReducers(reducers);
    /*if (process.env.NODE_ENV !== 'production') {
      const original = combineReducers;
      combinedReducers = (state, action) => {
        state = original(state, action);
  
        Object.freeze(state);
  
        return state;
      };
    }*/
    return {
        reducers: combinedReducers,
        initialState
    };
});
