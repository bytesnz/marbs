import * as configs from '../../../typings/configs';
import * as State from '../../../typings/state';

import { combineReducers } from 'redux';

import * as contentReducer from '../../reducers/content';
import * as postsReducer from '../../reducers/posts';
import * as optionsReducer from '../../reducers/options';

import { createPostsActions } from '../../actions/posts';

type ActionLivenFunction = (state, options: configs.SetGlobalConfig) => LiveActionsGroup

export interface Actions {
  [group: string]: LiveActionsGroup | ActionLivenFunction
}

interface LiveActions {
  [group: string]: LiveActionsGroup
}

interface LiveActionsGroup {
  [action: string]: Function
}

/**
 * Livens the actions given to it by passing the state and the given options
 * to them
 *
 * @param actions Actions to liven.
 * @param state Redux state to use to liven actions
 * @param options Config options to pass to actions
 */
export const livenActions = (actions: Actions, state,
    options: configs.SetGlobalConfig, socket): LiveActions => {
  const life = {
    dispatch: state.dispatch,
    getState: state.getState,
    socket
  };
  return Object.keys(actions).reduce((liveActions, group) => {
    const groupActions = actions[group];

    if (typeof groupActions === 'function') {
      liveActions[group] = groupActions(life, options);
    } else {
      liveActions[group] = Object.keys(groupActions).reduce((liveGroupActions, actionName) => {
        const action = groupActions[actionName];
        liveGroupActions[actionName] = (...params) => action(life, options, ...params);

        return liveGroupActions;
      }, <LiveActionsGroup>{});
    }

    return liveActions;
  }, <LiveActions>{});
};

export const createMarss = async (options: configs.SetGlobalConfig) => {
  let reducers = <State.Reducers>{
    contents: contentReducer.reducer,
    posts: postsReducer.reducer
  };
  let initialState = <State.State>{
    contents: await contentReducer.initialState(options),
    posts: await postsReducer.initialState(options)
  };
  let actions = <Actions>{
    posts: createPostsActions
  };

  if (options.functionality.tags) {
    const tagsReducer = require('../../reducers/tags');
    actions.tags = require('../../actions/tags').createTagsActions;
    reducers.tags = tagsReducer.reducer;
    initialState.tags = await tagsReducer.initialState(options);
  }

  if (options.functionality.categories) {
    const categoriesReducer = require('../../reducers/categories');
    reducers.categories = categoriesReducer.reducer;
    initialState.categories = await categoriesReducer.initialState(options);
  }

  let combinedReducers = combineReducers(reducers);

  if (process.env.NODE_ENV !== 'production') {
    const deepFreeze = require('deep-freeze');
    const original = combinedReducers;
    combinedReducers = (state = {}, action) => {
      state = original(state, action);

      deepFreeze(state);

      return state;
    };
  }

  return {
    reducers: combinedReducers,
    initialState,
    actions
  };
};
