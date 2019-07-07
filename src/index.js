import evaluateSnippet from './evaluate-snippet';
import * as utilFunctions from './util-functions';
export { utilFunctions };

function getType(value) {
    // will return 'array', 'object', 'string' and 'other'
    switch (typeof value) {
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
    if (namespace === '') return { ...globalContext, ...nexContext };
    return {
        ...globalContext,
        [namespace]: { ...globalContext[namespace], ...nexContext }
    };
}

function objectCreator(objTemp, globalContext, dataNamespace) {
    const parent = { ...getContext(globalContext, dataNamespace).self };
    const self = {};
    const newContext = setContext(globalContext, dataNamespace, {
        parent,
        self
    });
    const errors = [];

    for (const key in objTemp) {
        const [evaluatedKey, keyErrors] = evaluateSnippet(key, newContext);
        errors.push(...keyErrors);

        const [evaluatedValue, valueErrors] = recursiveHelper(
            objTemp[key],
            newContext,
            dataNamespace
        );
        errors.push(...valueErrors);

        self[evaluatedKey] = evaluatedValue;
    }

    return [self, errors];
}

function getRepeatRange(keyName) {
    if (typeof keyName !== 'string') return false;
    const found = keyName.match(/^(\d+)\.{2,3}(\d+)$/);
    if (found) {
        return [parseInt(found[1]), parseInt(found[2])];
    }
    return false;
}

function getRepeatableValue(arrElement, context) {
    if (
        !arrElement ||
        typeof arrElement !== 'object' ||
        Object.keys(arrElement).length !== 1
    ) {
        return false;
    }
    for (const keyName in arrElement) {
        const [evaluatedKeyName, errs] = evaluateSnippet(keyName, context);
        if (errs.length > 0) {
            return false;
        }
        const repeateRange = getRepeatRange(evaluatedKeyName);

        if (!repeateRange) {
            return false;
        }
        const [minValue, maxValue] = repeateRange;
        return [minValue, maxValue, arrElement[keyName]];
    }
}

function arrayCreator(arrTemp, globalContext, dataNamespace) {
    const arrRes = [];
    const errors = [];

    for (const arrElement of arrTemp) {
        const repeatableValue = getRepeatableValue(arrElement, globalContext);
        if (repeatableValue) {
            const [minValue, maxValue, value] = repeatableValue;
            const size = utilFunctions.RANDINT(minValue, maxValue);
            utilFunctions.RANGE(size).forEach(index => {
                const [res, errs] = recursiveHelper(
                    value,
                    setContext(globalContext, dataNamespace, {
                        index,
                        size
                    }),
                    dataNamespace
                );
                arrRes.push(res);
                errors.push(...errs);
            });
        } else {
            const [res, errs] = recursiveHelper(
                arrElement,
                globalContext,
                dataNamespace
            );
            arrRes.push(res);
            errors.push(...errs);
        }
    }

    return [arrRes, errors];
}

function recursiveHelper(template, globalContext, dataNamespace) {
    switch (getType(template)) {
        case 'string':
            return evaluateSnippet(template, { ...globalContext });
        case 'object':
            return objectCreator(template, globalContext, dataNamespace);
        case 'array':
            return arrayCreator(template, globalContext, dataNamespace);
        default:
            // other
            return [template, []];
    }
}

export default function jsonCreator(
    template = null,
    dataContext = {},
    methodContext = utilFunctions,
    dataNamespace = '_',
    methodNamespace = ''
) {
    const globalContext = {};
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
