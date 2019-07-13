#! /usr/bin/env node
"use strict";

var _json = _interopRequireDefault(require("json5"));

var _commander = _interopRequireDefault(require("commander"));

var _index = _interopRequireWildcard(require("./index"));

var _package = require("../package.json");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

_commander["default"].version(_package.version).option('-d, --data-context [object]', 'data context', _json["default"].parse).option('-m, --method-context [object]', 'method context', _json["default"].parse).option('-n, --data-namespace [namespace]', 'data namespace, default to "_"').option('-g, --method-namespace [namespace]', 'data namespace, default to global context').option('-i, --json-indent [indent]', 'output json indent number', parseInt, 0).option('-l, --list', 'output available util functions').parse(process.argv);

if (_commander["default"].list) {
  Object.values(_index.utilFunctions).forEach(function (funcBody) {
    return console.log("".concat(funcBody.toString().split('\n')[0], "...}"));
  });
  process.exit(0);
}

var inputText = '';
process.stdin.on('data', function (chunk) {
  inputText += chunk;
});
process.stdin.on('end', function () {
  var _jsonCreator = (0, _index["default"])(_json["default"].parse(inputText), _commander["default"].dataContext, _commander["default"].methodContext, _commander["default"].dataNamespace, _commander["default"].methodNamespace),
      _jsonCreator2 = _slicedToArray(_jsonCreator, 2),
      res = _jsonCreator2[0],
      err = _jsonCreator2[1];

  if (!err.length) {
    console.log(JSON.stringify(res, null, _commander["default"].jsonIndent));
  } else {
    console.error(res);
    throw new Error(err);
  }
});