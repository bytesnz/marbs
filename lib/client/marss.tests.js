"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var marss_1 = require("./marss");
var options = {
    title: 'test',
    baseUri: '/',
    functionality: {},
    tagsUri: 'tags',
    categoriesUri: 'categories',
    staticUri: 'static'
};
ava_1.default('should return a Promise', function (t) {
    t.is((marss_1.createMarss(options, {})) instanceof Promise, true, 'createMarss() did not return a Promise');
});
ava_1.default('should return a reducer and initial state with site and content with no functionality selected', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var marss, initialState;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, marss_1.createMarss(options, {})];
            case 1:
                marss = _a.sent();
                initialState = {
                    content: null,
                    posts: null
                };
                t.is(typeof marss.reducers, 'function');
                t.deepEqual(initialState, marss.initialState);
                return [2 /*return*/];
        }
    });
}); });
ava_1.default('initialState should include tags when enabled', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var testOptions, marss;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                testOptions = __assign({}, options, { functionality: {
                        tags: true
                    } });
                return [4 /*yield*/, marss_1.createMarss(testOptions, {})];
            case 1:
                marss = _a.sent();
                t.not(typeof marss.initialState.tags, 'undefined');
                return [2 /*return*/];
        }
    });
}); });
ava_1.default('initialState should include categories when enabled', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var testOptions, marss;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                testOptions = __assign({}, options, { functionality: {
                        categories: true
                    } });
                return [4 /*yield*/, marss_1.createMarss(testOptions, {})];
            case 1:
                marss = _a.sent();
                t.not(typeof marss.initialState.categories, 'undefined');
                return [2 /*return*/];
        }
    });
}); });
ava_1.default('livenAction() calls liven functions given to it', function (t) {
    var callCount = 0;
    marss_1.livenActions({
        test: function () { return callCount++ && {}; }
    }, {}, options, {});
    t.is(1, callCount, 'livenActions did not call the liven function for test once');
});
ava_1.default('liveAction() wraps functions in a actions group to pass state and options', function (t) {
    var receivedLife, receivedOptions, receivedOther;
    var state = {
        dispatch: {},
        getState: {}
    }, other = {}, socket = {};
    var actions = {
        test: {
            test: function (life, options, other) {
                receivedLife = life;
                receivedOptions = options;
                receivedOther = other;
            }
        }
    };
    var liveActions = marss_1.livenActions(actions, state, options, socket);
    liveActions.test.test(other);
    t.not(actions, liveActions, 'liveActions() did not map actions into new Object');
    t.is(state.dispatch, receivedLife.dispatch, 'liveActions() wrapper did not pass state as first argument');
    t.is(state.getState, receivedLife.getState, 'liveActions() wrapper did not pass state as first argument');
    t.is(socket, receivedLife.socket, 'liveActions() wrapper did not pass state as first argument');
    t.is(options, receivedOptions, 'liveActions() wrapper did not pass options as second argument');
    t.is(other, receivedOther, 'liveActions() wrapper did not pass arguments');
});
//# sourceMappingURL=marss.tests.js.map