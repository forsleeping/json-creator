"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = evaluateSnippet;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getSingleValueFromTemplate(strings) {
  if ((arguments.length <= 1 ? 0 : arguments.length - 1) == 1 && strings.length == 2 && strings[0] === '' && strings[1] === '') {
    // template literal formatted as `${xxx}` (no strings, single value) will return the value of xxx
    return arguments.length <= 1 ? undefined : arguments[1];
  } // something else such as `abc_${xxx}` will return undefined;

}

function getDefaultIfUndefined(value, defaultValue) {
  if (value === undefined) return defaultValue;
  return value;
} // avoid using window.eval, using window.Function instead
// reference: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/eval#Don't_use_eval_needlessly!


function evaluateSnippet(snippet, context) {
  // bind internal functions __t__ and __g__
  var bindedCtx = _objectSpread({
    __t__: getSingleValueFromTemplate,
    __g__: getDefaultIfUndefined
  }, context); // TODO "`" in snippet should be escaped.


  var s = '`' + snippet + '`';

  try {
    // I suppose that Object.keys(x) and Object.values(x) keep the x's properties in the same order.
    var result = Function("\n\"use strict\";\nreturn(".concat(Object.keys(bindedCtx).join(','), ")=>__g__(__t__").concat(s, ",(").concat(s, "))\n"))().apply(void 0, _toConsumableArray(Object.values(bindedCtx)));
    return [result, []];
  } catch (err) {
    return ["<< ".concat(err.message, " >>"), [err]];
  }
}