import * as State from '../../typings/state';
import * as Configs from '../../typings/configs';

import {
  MARSS_TAGS_SET
} from '../actions/tags';

const initial = {};

export const initialState = (options: Configs.SetGlobalConfig) => {
  return initial;
};

export const reducer = (state = initial, action: State.Action) => {
  switch (action.type) {
    case MARSS_TAGS_SET:
  }

  return state;
};

