import * as configs from '../../../typings/configs';
import * as State from '../../../typings/state';

import { combineReducers } from 'redux';

import * as contentReducer from '../../reducers/content';
import * as optionsReducer from '../../reducers/options';

export const createMarss = async (options: configs.SetGlobalConfig) => {
  let reducers = <State.Reducers>{
    contents: contentReducer.reducer,
    options: optionsReducer.reducer
  };
  let initialState = <State.State>{
    contents: await contentReducer.initialState(options),
    options: await optionsReducer.initialState(options)
  };

  if (options.functionality.tags) {
    const tagsReducer = require('../../reducers/tags');
    reducers.tags = tagsReducer.reducer;
    initialState.tags = await tagsReducer.initialState(options);
  }

  if (options.functionality.categories) {
    const categoriesReducer = require('../../reducers/categories');
    reducers.categories = categoriesReducer.reducer;
    initialState.categories = await categoriesReducer.initialState(options);
  }

  let combinedReducers = combineReducers(reducers);

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
};
