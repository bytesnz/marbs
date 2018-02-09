import * as Errors from '../../typings/error';
import { Document } from '../../typings/data';

import { diff } from 'just-diff';

import {
  MARSS_CONTENT_SET,
  MARSS_CONTENT_CLEAR,
  MARSS_CONTENT_UPDATE
} from '../actions/content';

export interface ContentState {
  error?: Errors.MarssError,
  data?: Document
  update?: any
};

export const initialState = (options) => null;

export const reducer = (state = null, action) => {
  switch(action.type) {
    case MARSS_CONTENT_SET:
      if (action.error) {
        state = {
          error: action.error
        };
        break;
      }

      if (state && state.data && state.data.id === action.data.id) {
        const contentDiff = diff(state.data, action.data);
        if (contentDiff.length) {
          state = {
            data: state.data,
            update: action.data
          };
        }
      } else {
        state = {
          data: action.data
        };
      }
      break;
    case MARSS_CONTENT_CLEAR:
      state = null;
      break;
    case MARSS_CONTENT_UPDATE:
      if (state.data && state.update) {
        state = {
          data: state.update
        };
      }
      break;
  }

  return state;
};
