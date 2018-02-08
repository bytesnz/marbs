import * as State from '../../typings/state';
import * as Configs from '../../typings/configs';
import * as Errors from '../../typings/error';

import {
  MARSS_CATEGORIES_SET
} from '../actions/categories';

type TagsCount = { [category: string]: number};

export type CategoriesState = TagsCount | Errors.MarssError;

const initial = null;

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

