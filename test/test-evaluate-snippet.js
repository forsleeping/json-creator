import test from 'ava';
import evaluateSnippet from '../dist/evaluate-snippet';

test('test import', t => {
    t.is(typeof evaluateSnippet, 'function');
});

test('test evaluateSnippet', t => {
    let result, error;

    [result, error] = evaluateSnippet('abc', { data: 1, x: 1, y: 2 });
    t.is(error.length, 0);
    t.is(result, 'abc');

    [result, error] = evaluateSnippet('abc ${x}', { data: 1, x: 1, y: 2 });
    t.is(error.length, 0);
    t.is(result, 'abc 1');

    [result, error] = evaluateSnippet('abc ${x +y +     data}', {
        data: 1,
        x: 1,
        y: 2
    });
    t.is(error.length, 0);
    t.is(result, 'abc 4');

    [result, error] = evaluateSnippet('${x} abc', { data: 1, x: 1, y: 2 });
    t.is(error.length, 0);
    t.is(result, '1 abc');

    [result, error] = evaluateSnippet('abc ${data} def', {
        data: 1,
        x: 1,
        y: 2
    });
    t.is(error.length, 0);
    t.is(result, 'abc 1 def');

    [result, error] = evaluateSnippet('${data}', { data: 1, x: 1, y: 2 });
    t.is(error.length, 0);
    t.is(result, 1);

    [result, error] = evaluateSnippet('${Math.floor(data/0)}', {
        data: 1,
        x: 1,
        y: 2
    });
    t.is(error.length, 0);
    t.is(result, Infinity);

    [result, error] = evaluateSnippet('${_', { data: 1 }, { x: 1, y: 2 });
    t.not(error.length, 0);
    t.is(result, '<< Missing } in template expression >>');
});
