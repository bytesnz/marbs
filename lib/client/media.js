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
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
exports.createMedia = function (socket, options) {
    var requests = [];
    var nextMediaRequestId = 1;
    socket.on('media', function (data) {
        console.log('got media response', data, requests);
        var index = requests.findIndex(function (request) { return request.id === data.id; });
        // Check if request exists
        if (index === -1) {
            return;
        }
        var request = requests[index];
        console.log('request was', request);
        if (data.error) {
            request.reject(data.error);
        }
        else {
            request.resolve(data.media.map(function (image) { return (__assign({}, image, { src: utils_1.assetUrl(image.id) })); }));
        }
        requests.splice(index, 1);
    });
    return {
        getMedia: function (filter) {
            //TODO Use something that can handle a timeout
            return new Promise(function (resolve, reject) {
                var request = {
                    filter: filter,
                    id: nextMediaRequestId++,
                    resolve: resolve,
                    reject: reject
                };
                requests.push(request);
                socket.emit('media', {
                    filter: filter,
                    id: request.id
                });
            });
        }
    };
};
//# sourceMappingURL=media.js.map