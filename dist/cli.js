#! /usr/bin/env node
// example:
// $ echo '[{"3..5": "${RANGE(_.a, _.b)}"}]' | json-creator -d '{a:10, b:15}'
// [[10,11,12,13,14],[10,11,12,13,14],[10,11,12,13,14],[10,11,12,13,14],[10,11,12,13,14]]
// $ echo '[{"3..5": "${FAKE(`{{hacker.phrase}}`)}"}]' | json-creator -i 4
// [
//     "If we compress the bandwidth, we can get to the PNG sensor through the optical IB program!",
//     "I'll navigate the bluetooth CSS capacitor, that should card the RSS program!",
//     "You can't transmit the program without overriding the solid state JBOD transmitter!",
//     "The PNG bus is down, compress the primary monitor so we can transmit the HDD protocol!"
// ]
"use strict";

var _json = _interopRequireDefault(require("json5"));

var _commander = _interopRequireDefault(require("commander"));

var _index = _interopRequireDefault(require("./index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

_commander["default"].version('0.0.1').option('-d, --data-context [object]', 'data context', _json["default"].parse).option('-m, --method-context [object]', 'method context', _json["default"].parse).option('-n, --data-namespace [namespace]', 'data namespace, default to "_"').option('-g, --method-namespace [namespace]', 'data namespace, default to global context').option('-i, --json-indent [indent]', 'output json indent number', parseInt, 0).parse(process.argv);

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