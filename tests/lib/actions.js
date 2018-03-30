"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.createSetUpTestFunction = function (actionCreator, options, state) {
    if (options === void 0) { options = {}; }
    if (state === void 0) { state = null; }
    return function (t) {
        t.context.dispatchedActions = [];
        t.context.repliers = {};
        t.context.handlers = {};
        t.context.events = [];
        t.context.state = state;
        t.context.emit = function (event) {
            var data = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                data[_i - 1] = arguments[_i];
            }
            if (typeof t.context.handlers[event] !== 'undefined') {
                t.context.handlers[event].forEach(function (handler) { return handler.apply(void 0, data); });
            }
        };
        t.context.actions = actionCreator({
            dispatch: function (action) {
                t.context.dispatchedActions.push(action);
            },
            getState: function () { return t.context.state; },
            socket: {
                emit: function (event) {
                    var data = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        data[_i - 1] = arguments[_i];
                    }
                    t.context.events.push({
                        event: event,
                        data: data
                    });
                    if (t.context.repliers[event]) {
                        t.context.repliers[event](data);
                    }
                },
                on: function (event, handler) {
                    if (typeof t.context.handlers[event] === 'undefined') {
                        t.context.handlers[event] = [];
                    }
                    t.context.handlers[event].push(handler);
                }
            }
        }, options);
    };
};
//# sourceMappingURL=actions.js.map