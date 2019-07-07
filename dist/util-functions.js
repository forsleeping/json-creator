"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RANGE = RANGE;
exports.CHOICE = CHOICE;
exports.RANDINT = RANDINT;
exports.FAKE = FAKE;
exports.RECURSIVE_REPLACE = RECURSIVE_REPLACE;

var _faker = _interopRequireDefault(require("faker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function RANGE(start, stop) {
  var step = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  if (stop === undefined) {
    return RANGE(0, start);
  }

  var count = Math.max(Math.ceil((stop - start) / step), 0);
  return _toConsumableArray(Array(count).keys()).map(function (x) {
    return x * step + start;
  });
}

function CHOICE(enumList) {
  return _faker["default"].helpers.randomize(enumList);
}

function RANDINT(minValue, maxValue) {
  return _faker["default"].random.number({
    min: minValue,
    max: maxValue
  });
}

function FAKE(mustache) {
  return _faker["default"].fake(mustache);
}

function RECURSIVE_REPLACE(obj) {
  var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var filterCond = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (value) {
    return value === null;
  };
  if (filterCond(obj)) return target;
  if (_typeof(obj) === 'object') for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      obj[key] = RECURSIVE_REPLACE(obj[key], target, filterCond);
    }
  }
  return obj;
}