import * as configs from '../../../typings/configs';
import * as State from '../../../typings/state';

import { combineReducers } from 'redux';
import * as React from 'react';
import { Provider as ReduxProvider, connect as reduxConnect } from 'react-redux';
import { createStore } from 'redux';

import { createMedia } from './media';

import * as contentReducer from '../../reducers/content';
import * as postsReducer from '../../reducers/posts';
import * as optionsReducer from '../../reducers/options';

import { createPostsActions } from '../../actions/posts';
import { createContentActions } from '../../actions/content';
import { createCategoriesActions } from '../../actions/categories';

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

const marssContext = React.createContext(null);

export const Provider = (props) => {
  return React.createElement(ReduxProvider, {
    store: props.marss.store
  }, React.createElement(marssContext.Provider, {
    value: props.marss,
    children: props.children
  }));
}

/**
 * Create a MARSS instance to use with the MARSS app
 *
 * @param options MARSS options
 * @param socket SocketIO socket to use for communications
 *
 * @returns MARSS instance
 * */
export const createMarss = async (options: configs.SetGlobalConfig, socket,
    enhancer?) => {
  let reducers: State.Reducers = {
    content: contentReducer.reducer,
    posts: postsReducer.reducer
  };
  let initialState: State.State = {
    content: await contentReducer.initialState(options),
    posts: await postsReducer.initialState(options)
  };
  let actions: Actions = {
    content: createContentActions,
    categories: createCategoriesActions,
    posts: createPostsActions
  };
  let media = null;

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

  if (options.functionality.media) {
    media = createMedia(socket, options);
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

  const store = createStore(combinedReducers, initialState, enhancer);

  const life = {
    dispatch: store.dispatch,
    getState: store.getState,
    socket
  };

  const liveActions = Object.keys(actions).reduce((liveActions, group) => {
    const groupActions = actions[group];

    if (typeof groupActions === 'function') {
      liveActions[group] = groupActions(life, options);
    } else {
      liveActions[group] = Object.keys(groupActions).reduce((liveGroupActions, actionName): LiveActionsGroup => {
        const action = groupActions[actionName];
        liveGroupActions[actionName] = (...params) => action(life, options, ...params);

        return liveGroupActions;
      }, {});
    }

    return liveActions;
  }, {});

  return {
    actions: liveActions,
    media,
    store
  };
};

/**
 * Connect a component up to MARSS with actions and media props and the
 * props returned from the mapStateToProps function if given
 *
 * @param component Component to connect to MARSS
 * @param mapStateToProps Like the react-redux connect() function parameter
 *   of the same name
 *
 * @returns The connected component
 */
export const connect = (component,
    mapStateToProps?: (state: State.State) => { [key: string]: any }) => {
  const statedComponent = reduxConnect(mapStateToProps)(component)

  return (props) => (
    <marssContext.Consumer>
      { (marss) => {
        let connectedProps;
        if (marss) {
          connectedProps = {
            ...props,
            media: marss.media,
            actions: marss.actions
          };
        } else {
          connectedProps = props;
        }

        return React.createElement(statedComponent, connectedProps);
      } }
    </marssContext.Consumer>
  );
}
