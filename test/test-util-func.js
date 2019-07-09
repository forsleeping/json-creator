import test from 'ava';
import { utilFunctions } from '../dist/index';

test('test type', t => {
    t.is(typeof utilFunctions, 'object');
});

test('test RANGE', t => {
    t.deepEqual(utilFunctions.RANGE(6), [0, 1, 2, 3, 4, 5]);
    t.deepEqual(utilFunctions.RANGE(3, 6), [3, 4, 5]);
    t.deepEqual(utilFunctions.RANGE(3, 5, 2), [3]);
    t.deepEqual(utilFunctions.RANGE(3, 6, 2), [3, 5]);
    t.deepEqual(utilFunctions.RANGE(3, 7, 2), [3, 5]);
    t.deepEqual(utilFunctions.RANGE(6, 1, -1), [6, 5, 4, 3, 2]);
    t.deepEqual(utilFunctions.RANGE(6, 1, -2), [6, 4, 2]);
    t.deepEqual(utilFunctions.RANGE(6, 0, -2), [6, 4, 2]);
    t.deepEqual(utilFunctions.RANGE(3, 3), []);
    t.deepEqual(utilFunctions.RANGE(3, 1), []);
});

test('test CHOICE', t => {
    t.assert(0 <= utilFunctions.CHOICE(utilFunctions.RANGE(6)));
    t.assert(utilFunctions.CHOICE(utilFunctions.RANGE(6)) < 6);
});

test('test RANDINT', t => {
    t.assert(0 <= utilFunctions.RANDINT(0, 10));
    t.assert(utilFunctions.RANDINT(0, 10) <= 10);
});

test('test RECURSIVE_REPLACE', t => {
    t.deepEqual(
        utilFunctions.RECURSIVE_REPLACE({
            x: 'x',
            y: null,
            inner: { inner_x: 'inner_x', inner_y: null }
        }),
        {
            x: 'x',
            y: [],
            inner: { inner_x: 'inner_x', inner_y: [] }
        }
    );

    t.deepEqual(
        utilFunctions.RECURSIVE_REPLACE(
            {
                x: 'x',
                y: 'replace',
                inner: { inner_x: 'inner_x', inner_y: 'replace' }
            },
            'target',
            value => value === 'replace'
        ),
        {
            x: 'x',
            y: 'target',
            inner: { inner_x: 'inner_x', inner_y: 'target' }
        }
    );
});
