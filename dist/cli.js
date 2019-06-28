#! /usr/bin/env node
"use strict";

var _faker = _interopRequireDefault(require("faker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

console.log(_faker["default"].fake("{{hacker.phrase}}"));