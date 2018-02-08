import * as State from '../../typings/state';
import * as Configs from '../../typings/configs';
import * as Errors from '../../typings/error';
import { Document } from '../../typings/data';

import {
  MARSS_POSTS_SET,
  MARSS_POSTS_UPDATE
} from '../actions/posts';

const initial = null;

export interface PostsState {
  error?: {
    message: string,
    code: number
  },
  data?: Array<Document>
}

export const initialState = (options: Configs.SetGlobalConfig) => {
  return initial;
};

export const reducer = (state = initial, action: State.Action) => {
  switch (action.type) {
    case MARSS_POSTS_SET:
      if (action.error) {
        state = {
          error: {
            ...action.error,
            date: new Date()
          }
        };
      } else {
        state = {
          data: action.data
        };
      }
      break;
    case MARSS_POSTS_UPDATE:
      if (action.error) {
      } else {
        if (!state || !Array.isArray(state.data)) {
          state = {
            data: action.data
          }
        } else {
          state = {
            data: state.data.slice()
          };

          action.data.forEach((newPost) => {
            const currentPostIndex = state.data.findIndex((post) => post.id === newPost.id);

            if (currentPostIndex !== -1) {
              state.data[currentPostIndex] = {
                ...state.data[currentPostIndex],
                ...newPost,
                attributes: {
                  ...state.data[currentPostIndex].attributes,
                  ...newPost.attributes
                }
              };
            } else { // Post not currently in list
              // Find where new post should be inserted
              let i;
              for (i = 0; i < state.data.length; i++) {
                if (state.data[i].attributes.date.getTime() > newPost.attributes.date.getTime()) {
                  break;
                }
              }
              state.data.splice(i, 0, newPost);
            }
          });
        }
      }
      break;
  }

  return state;
};


