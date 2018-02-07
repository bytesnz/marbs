import * as State from '../../../typings/state';

/**
 * Creates a function to set up a context to set actions from the
 * given action creator. The following parameters are added to the test
 * context:
 * - actions - Actions created by the actionCreator
 * - dispatchedActions - Actions that the actionsCreator / called actions
 *   dispatch during the test
 * - repliers - Object to add replier functions to to reply to socket events
 *   that were created during the test
 * - handlers - Object containing event / array of handlers key/value
 *   properties
 * - events - Array of events that are emitted during the testing process
 *   via socket.emit
 * - state - The current state
 * - emit(event, ...data) - Function to an event to the registered socket
 *     handlers
 *
 * @param actionCreator Function to create actions to be tested
 * @param options Options to pass to actionCreator
 * @param state Initial state
 */
export const createSetUpTestFunction = (actionCreator, options = {}, state = null) => {
  return (t) => {
    t.context.dispatchedActions = <Array<State.Action>>[];
    t.context.repliers = {};
    t.context.handlers = {};
    t.context.events = [];
    t.context.state = state;
    t.context.emit = (event, ...data) => {
      if (typeof t.context.handlers[event] !== 'undefined') {
        t.context.handlers[event].forEach((handler) => handler(...data));
      }
    };

    t.context.actions = actionCreator({
      dispatch: (action: State.Action) => {
        t.context.dispatchedActions.push(action);
      },
      getState: () => t.context.state,
      socket: {
        emit: (event: string, ...data) => {
          t.context.events.push({
            event,
            data
          });
          if (t.context.repliers[event]) {
            t.context.repliers[event](data);
          }
        },
        on: (event: string, handler: Function) => {
          if (typeof t.context.handlers[event] === 'undefined') {
            t.context.handlers[event] = [];
          }

          t.context.handlers[event].push(handler);
        }
      }
    }, options);
  };
};
