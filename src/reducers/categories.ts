import * as State from '../../typings/state';
import * as Configs from '../../typings/configs';

import {
  MARSS_CATEGORIES_SET
} from '../actions/categories';

const initial = {};

export const initialState = (options: Configs.AppFunctionalityConfig) => {
  return initial;
};

export const reducer = (state = initial, action: State.Action) => {
  switch (action.type) {
    case MARSS_CATEGORIES_SET:
      state = {
        ...action.data
      };
      break;
  }

  return state;
};


