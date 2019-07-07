"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = jsonCreator;
exports.utilFunctions = void 0;

var _evaluateSnippet5 = _interopRequireDefault(require("./evaluate-snippet"));

var utilFunctions = _interopRequireWildcard(require("./util-functions"));

exports.utilFunctions = utilFunctions;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function getType(value) {
  // will return 'array', 'object', 'string' and 'other'
  switch (_typeof(value)) {
    case 'object':
      if (value === null) break;

      if (Array.isArray(value)) {
        return 'array';
      }

      return 'object';

    case 'string':
      return 'string';
  }

  return 'other';
}

function getContext(globalContext, namespace) {
  if (namespace === '') return globalContext;
  return globalContext[namespace];
}

function setContext(globalContext, namespace, nexContext) {
  if (namespace === '') return _objectSpread({}, globalContext, nexContext);
  return _objectSpread({}, globalContext, _defineProperty({}, namespace, _objectSpread({}, globalContext[namespace], nexContext)));
}

function objectCreator(objTemp, globalContext, dataNamespace) {
  var parent = _objectSpread({}, getContext(globalContext, dataNamespace).self);

  var self = {};
  var newContext = setContext(globalContext, dataNamespace, {
    parent: parent,
    self: self
  });
  var errors = [];

  for (var key in objTemp) {
    var _evaluateSnippet = (0, _evaluateSnippet5["default"])(key, newContext),
        _evaluateSnippet2 = _slicedToArray(_evaluateSnippet, 2),
        evaluatedKey = _evaluateSnippet2[0],
        keyErrors = _evaluateSnippet2[1];

    errors.push.apply(errors, _toConsumableArray(keyErrors));

    var _recursiveHelper = recursiveHelper(objTemp[key], newContext, dataNamespace),
        _recursiveHelper2 = _slicedToArray(_recursiveHelper, 2),
        evaluatedValue = _recursiveHelper2[0],
        valueErrors = _recursiveHelper2[1];

    errors.push.apply(errors, _toConsumableArray(valueErrors));
    self[evaluatedKey] = evaluatedValue;
  }

  return [self, errors];
}

function getRepeatRange(keyName) {
  if (typeof keyName !== 'string') return false;
  var found = keyName.match(/^(\d+)\.{2,3}(\d+)$/);

  if (found) {
    return [parseInt(found[1]), parseInt(found[2])];
  }

  return false;
}

function getRepeatableValue(arrElement, context) {
  if (!arrElement || _typeof(arrElement) !== 'object' || Object.keys(arrElement).length !== 1) {
    return false;
  }

  for (var keyName in arrElement) {
    var _evaluateSnippet3 = (0, _evaluateSnippet5["default"])(keyName, context),
        _evaluateSnippet4 = _slicedToArray(_evaluateSnippet3, 2),
        evaluatedKeyName = _evaluateSnippet4[0],
        errs = _evaluateSnippet4[1];

    if (errs.length > 0) {
      return false;
    }

    var repeateRange = getRepeatRange(evaluatedKeyName);

    if (!repeateRange) {
      return false;
    }

    var _repeateRange = _slicedToArray(repeateRange, 2),
        minValue = _repeateRange[0],
        maxValue = _repeateRange[1];

    return [minValue, maxValue, arrElement[keyName]];
  }
}

function arrayCreator(arrTemp, globalContext, dataNamespace) {
  var arrRes = [];
  var errors = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = arrTemp[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var arrElement = _step.value;
      var repeatableValue = getRepeatableValue(arrElement, globalContext);

      if (repeatableValue) {
        (function () {
          var _repeatableValue = _slicedToArray(repeatableValue, 3),
              minValue = _repeatableValue[0],
              maxValue = _repeatableValue[1],
              value = _repeatableValue[2];

          var size = utilFunctions.RANDINT(minValue, maxValue);
          utilFunctions.RANGE(size).forEach(function (index) {
            var _recursiveHelper3 = recursiveHelper(value, setContext(globalContext, dataNamespace, {
              index: index,
              size: size
            }), dataNamespace),
                _recursiveHelper4 = _slicedToArray(_recursiveHelper3, 2),
                res = _recursiveHelper4[0],
                errs = _recursiveHelper4[1];

            arrRes.push(res);
            errors.push.apply(errors, _toConsumableArray(errs));
          });
        })();
      } else {
        var _recursiveHelper5 = recursiveHelper(arrElement, globalContext, dataNamespace),
            _recursiveHelper6 = _slicedToArray(_recursiveHelper5, 2),
            res = _recursiveHelper6[0],
            errs = _recursiveHelper6[1];

        arrRes.push(res);
        errors.push.apply(errors, _toConsumableArray(errs));
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return [arrRes, errors];
}

function recursiveHelper(template, globalContext, dataNamespace) {
  switch (getType(template)) {
    case 'string':
      return (0, _evaluateSnippet5["default"])(template, _objectSpread({}, globalContext));

    case 'object':
      return objectCreator(template, globalContext, dataNamespace);

    case 'array':
      return arrayCreator(template, globalContext, dataNamespace);

    default:
      // other
      return [template, []];
  }
}

function jsonCreator() {
  var template = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var dataContext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var methodContext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : utilFunctions;
  var dataNamespace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '_';
  var methodNamespace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
  var globalContext = {};

  if (methodNamespace === '') {
    Object.assign(globalContext, methodContext);
  } else {
    globalContext[methodNamespace] = methodContext;
  }

  if (dataNamespace === '') {
    Object.assign(globalContext, dataContext); // global context may overwrite
  } else {
    globalContext[dataNamespace] = dataContext;
  }

  return recursiveHelper(template, globalContext, dataNamespace);
}