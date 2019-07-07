function getSingleValueFromTemplate(strings, ...values) {
    if (
        values.length == 1 &&
        strings.length == 2 &&
        strings[0] === '' &&
        strings[1] === ''
    ) {
        // template literal formatted as `${xxx}` (no strings, single value) will return the value of xxx
        return values[0];
    }
    // something else such as `abc_${xxx}` will return undefined;
}

function getDefaultIfUndefined(value, defaultValue) {
    if (value === undefined) return defaultValue;
    return value;
}

// avoid using window.eval, using window.Function instead
// reference: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/eval#Don't_use_eval_needlessly!
export default function evaluateSnippet(snippet, context) {
    // bind internal functions __t__ and __g__
    const bindedCtx = {
        __t__: getSingleValueFromTemplate,
        __g__: getDefaultIfUndefined,
        ...context
    };

    // TODO "`" in snippet should be escaped.
    const s = '`' + snippet + '`';

    try {
        // I suppose that Object.keys(x) and Object.values(x) keep the x's properties in the same order.
        const result = Function(`
"use strict";
return(${Object.keys(bindedCtx).join(',')})=>__g__(__t__${s},(${s}))
`)()(...Object.values(bindedCtx));

        return [result, []];
    } catch (err) {
        return [`<< ${err.message} >>`, [err]];
    }
}
