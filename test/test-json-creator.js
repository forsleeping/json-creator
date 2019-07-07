import test from 'ava';
import jsonCreator from '../dist/index';

test('test import', t => {
    t.is(typeof jsonCreator, 'function');
});

test('test context namespace', t => {
    let result, error;

    [result, error] = jsonCreator('${_}');
    t.is(error.length, 0);
    t.deepEqual(result, {});

    [result, error] = jsonCreator('${$}', undefined, undefined, '$');
    t.is(error.length, 0);
    t.deepEqual(result, {});

    [result, error] = jsonCreator('${_}', { data: 1 }, { x: 1, y: 2 });
    t.is(error.length, 0);
    t.deepEqual(result, { data: 1 });

    [result, error] = jsonCreator(
        '${_} ${x} ${y}',
        { data: 1, data_2: '2' },
        { x: 1, y: 2 }
    );
    t.is(error.length, 0);
    t.is(result, '[object Object] 1 2');

    [result, error] = jsonCreator(
        '${data} ${data_2} ${x} ${y}',
        { data: 1, data_2: '2' },
        { x: 3, y: 4 },
        ''
    );
    t.is(error.length, 0);
    t.is(result, '1 2 3 4');

    [result, error] = jsonCreator(
        '${$.data} ${$.data_2} ${_.x} ${_.y}',
        { data: 1, data_2: '2' },
        { x: 3, y: 4 },
        '$',
        '_'
    );
    t.is(error.length, 0);
    t.is(result, '1 2 3 4');

    [result, error] = jsonCreator(
        '${_}',
        { data: 1, data_2: '2' },
        { x: 1, y: 2 },
        ''
    );
    t.not(error.length, 0);
    t.is(result, '<< _ is not defined >>');

    [result, error] = jsonCreator('${_.not.exists}', {
        data: 1,
        x: 1,
        y: 2
    });
    t.not(error.length, 0);
    t.is(result, "<< Cannot read property 'exists' of undefined >>");
});

test('test jsonCreator string', t => {
    let result, error;

    [result, error] = jsonCreator(
        'abc ${_.data} def',
        { data: 1 },
        { x: 1, y: 2 }
    );
    t.is(error.length, 0);
    t.is(result, 'abc 1 def');

    [result, error] = jsonCreator('${_.data}', { data: 1 }, { x: 1, y: 2 });
    t.is(error.length, 0);
    t.is(result, 1);

    [result, error] = jsonCreator('${_}', { data: 1 }, { x: 1, y: 2 });
    t.is(error.length, 0);
    t.deepEqual(result, { data: 1 });

    [result, error] = jsonCreator(
        '${_.not.exists}',
        { data: 1 },
        { x: 1, y: 2 }
    );
    t.not(error.length, 0);
    t.is(result, "<< Cannot read property 'exists' of undefined >>");
});

test('test jsonCreator object', t => {
    let result, error;

    [result, error] = jsonCreator({ m: null }, { data: 1 }, { x: 1, y: 2 });
    t.is(error.length, 0);
    t.deepEqual(result, { m: null });

    [result, error] = jsonCreator(
        { x: '${x}', y: '${y}', data: '${_.data}' },
        { data: 1 },
        { x: 1, y: 2 }
    );
    t.is(error.length, 0);
    t.deepEqual(result, { x: 1, y: 2, data: 1 });

    [result, error] = jsonCreator(
        {
            '${x+y}': '${x} ${y}',
            deep: {
                x: 'hello ${_.data}',
                bool: true,
                self_x: '${_.self.x}',
                inner: { inner_key: '${_.parent.bool}' }
            },
            data: '${_.data}'
        },
        { data: 1 },
        { x: 1, y: 2 }
    );
    t.is(error.length, 0);
    t.deepEqual(result, {
        3: '1 2',
        data: 1,
        deep: {
            x: 'hello 1',
            bool: true,
            self_x: 'hello 1',
            inner: { inner_key: true }
        },
        data: 1
    });
});

test('test jsonCreator array', t => {
    let result, error;

    [result, error] = jsonCreator(
        ['a', 2, true, undefined, null, {}],
        { data: 1 },
        { x: 1, y: 2 }
    );
    t.is(error.length, 0);
    t.deepEqual(result, ['a', 2, true, undefined, null, {}]);

    [result, error] = jsonCreator(
        [{ x: '${x}', y: '${y}', data: '${_.data}' }],
        { data: 1 },
        { x: 1, y: 2 }
    );
    t.is(error.length, 0);
    t.deepEqual(result, [{ x: 1, y: 2, data: 1 }]);

    [result, error] = jsonCreator(
        [
            {
                '3..3': '${x} ${y}'
            }
        ],
        { data: 1 },
        { x: 1, y: 2 }
    );
    t.is(error.length, 0);
    t.deepEqual(result, ['1 2', '1 2', '1 2']);

    [result, error] = jsonCreator(
        [
            {
                '10..20': '${x} ${y}'
            }
        ],
        { data: 1 },
        { x: 1, y: 2 }
    );
    t.is(error.length, 0);
    t.is(result[0], '1 2');
    t.assert(10 <= result.length);
    t.assert(result.length <= 20);

    [result, error] = jsonCreator(
        [
            {
                '10..20': { x: '${x}', data: '${_.data}', index: '${_.index}' }
            }
        ],
        { data: 1 },
        { x: 1, y: 2 }
    );
    t.is(error.length, 0);
    t.deepEqual(result[0], { x: 1, data: 1, index: 0 });
    t.deepEqual(result[9], { x: 1, data: 1, index: 9 });
    t.assert(10 <= result.length);
    t.assert(result.length <= 20);
});

test('test jsonCreator other types', t => {
    let result, error;

    [result, error] = jsonCreator(null, { data: 1 }, { x: 1, y: 2 });
    t.is(error.length, 0);
    t.is(result, null);

    [result, error] = jsonCreator(undefined, { data: 1 }, { x: 1, y: 2 });
    t.is(error.length, 0);
    t.is(result, null);

    [result, error] = jsonCreator(321.89, { data: 1 }, { x: 1, y: 2 });
    t.is(error.length, 0);
    t.is(result, 321.89);

    [result, error] = jsonCreator(true, { data: 1 }, { x: 1, y: 2 });
    t.is(error.length, 0);
    t.is(result, true);
});
