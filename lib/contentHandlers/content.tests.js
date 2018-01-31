"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const contentHandlers_1 = require("../../tests/lib/contentHandlers");
const content_1 = require("./content");
contentHandlers_1.contentHandlerCreatorTests(ava_1.default, content_1.contentHandlerCreator);
