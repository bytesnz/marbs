import * as State from '../../typings/state';
import * as Configs from '../../typings/configs';
import * as Errors from '../../typings/error';

import {
  MARSS_TAGS_SET
} from '../actions/tags';

export type TagsCount = { [tag: string]: number };

export interface TagsState {
  error?: Errors.MarssError,
  data?: TagsCount
};

const initial = null;

export const initialState = (options: Configs.SetGlobalConfig) => {
  return initial;
};

export const reducer = (state = initial, action: State.Action) => {
  switch (action.type) {
    case MARSS_TAGS_SET:
      if (action.error) {
        state = {
          error: {
            ...action.error,
            date: new Date()
          }
        };
      } else {
        state = {
          data: {
            ...action.data
          }
        };
      }
      break;
  }

  return state;
};

