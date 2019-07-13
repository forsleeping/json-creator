# json-creator

Generate JSON data from a JSON template.
Thanks to ES6 Template Literals, we dynamicly evaluate the string parts using the notation `${}`.

This is a useful library for dummy data generating or generally data processing.

### Usage

```
npm install json-creator
```

```js
import jsonCreator from 'json-creator';
// or using CommonJS
// const jsonCreator = require('json-creator').default;

const template = [
    {
        '3..5': {
            name: '${FAKE("{{commerce.productName}}")} ${RANDINT(1000,10000)}'
        }
    }
];
const [result, err] = jsonCreator(template);
// result:
// [
//   {
//     'name': 'Handmade Metal Salad 2102'
//   },
//   {
//     'name': 'Small Metal Mouse 6396'
//   },
//   {
//     'name': 'Rustic Granite Shirt 5762'
//   },
//   {
//     'name': 'Ergonomic Soft Chicken 5489'
//   }
// ]
```

### API

The json-creator interface was some kind of inspired by [json-generator](https://next.json-generator.com/) (by [Vazha Omanashvili](https://vazha.me/)), but simpler to learn and use, IMO.

```js
function jsonCreator(
    template = null,
    dataContext = {},
    methodContext = utilFunctions,
    dataNamespace = '_',
    methodNamespace = ''
)
```

The `template` is a json-like any-type template data.

-   Basicly, it will produce json as it is.
    e.g. `{name: ['Charlie', 'Green'], age: 18}`
    will produce `{name: ['Charlie', 'Green'], age: 18}`.
-   In a template part, if there is an array with an object element `obj` whose key is in form of `a..b` or `a...b`,
    (`a` and `b` are integers and `a`<=`b`), it will produce an array with `x` elements `a`<=`x`<=`b`, and the `x` elements are generated by the `obj`'s value.
    e.g. `['3..5': {name: ['Charlie', 'Green'], age: 18}]`
    (`['3...5': {name: ['Charlie', 'Green'], age: 18}]` the same)
    will produce something as below or an array with maybe 4 or 5 elements.

    ```js
    [
        { name: ['Charlie', 'Green'], age: 18 },
        { name: ['Charlie', 'Green'], age: 18 },
        { name: ['Charlie', 'Green'], age: 18 }
    ];
    ```

-   Additionally, any string part in the template (including object keys) who contains ES2015 template literals `${xx}` (without back-tick), will be dynamicly evaluated.
    e.g. `{name: ['Charlie', 'Green'], age: '${Math.round(Math.random()*50)}'}`.
    will produce `{ name: [ 'Charlie', 'Green' ], age: 10 }`.
-   The dynamic evaluation uses two contexts `dataContext` (default under namespace `_`, you can change it by parameter `dataNamespace`) and `methodContext` (default under global namespace, set by empty string '', you can also change it by parameter `methodNamespace`).
    e.g.

```js
// generate data with dataContext
jsonCreator(
    {
        name: ['${_.firstName}', '${_.lastName}'],
        age: '${RANDINT(_.from, _.to)}'
    },
    {
        firstName: 'Charlie',
        lastName: 'Green',
        from: 10,
        to: 50
    }
);
// [ { name: [ 'Charlie', 'Green' ], age: 32 }, [] ]
```

This library uses JavaScript ES2015 template literals evaluation behind the scenes, but there are 2 key differences in our dynamic evaluation.

-   You do not need to "back-tick" the template, just use normal string (without any back-ticks)
-   ES2015 template literals return only string, but our occupiesdynamic evaluation keeps the type when the expression the whole template, which is in form`'${xx}'`(in constrast to`'ww\${xx}yy\${zz}'`).

Just like the example above, even though the `age` in the template is defined as a string, the evaluation result will keep the type (`age: 32` is evaluated into number, not a string "32"). But `'{${1} ${2}}'` will be evaluated into `'1 2'`, since a number type cannot hold both values and a space between them.

Also, there are some default `utilFunctions` that is convenient to use. You can import and use them directly, or add your own util functions. e.g.

```js
import jsonCreator, { utilFunctions } from 'json-creator';
import moment from 'moment';
// or using CommonJS
// const jsonCreator = require('json-creator').default;
// const { utilFunctions } = require('json-creator');
// const momnet = require('moment');

utilFunctions.RANGE(2, 8, 2);
// [ 2, 4, 6 ]

jsonCreator(
    { time: '${MOMENT().format("YYYY/MM/DD")}', description: '${_.str}' },
    { str: 'today' },
    Object.assign({ MOMENT: moment }, utilFunctions)
);
// [ { time: '2019/07/09', description: 'today' }, [] ]
```

### Built-in utilFunctions

Here is a brief list of the currently supported built-in utilFunctions.

-   `RANGE(start, stop, step)` like Python2 `range` function, prototype `RANGE(stop)` and `RANGE(start, stop)` are also acceptalbe. Returns an array of integers.
-   `CHOICE(array)` like Python `random.choice` function, returns one random elememt from an `array`.
-   `RANDINT(a, b)` like python random.randint funcion, returns a integer ranged between `a` and `b`(included).
-   FAKE Faker.fake function from [a powerful but light fake data generator](https://www.npmjs.com/package/faker), accepts mastache templates, returns a string.
-   `RECURSIVE_REPLACE(obj, target = [], filterCond = value => value === null)` will recursively replace values into `target` when `filterCond(value)` is `true`. The default target and filterCond will replace all `null` value into `[]`, and returns the original `obj` after the replacement.

### CLI

You can install the pacakge globally and use the commandline tool for convinience.

```
npm install -g json-creator
```

`json-creator` command recieves the template (in [JSON5](https://json5.org/) format) from stdin.
e.g.

```bash
$ echo '[{"3...5": "${RANGE(_.a, _.b)}"}]' | json-creator -d '{a:10, b:15}'

[[10,11,12,13,14],[10,11,12,13,14],[10,11,12,13,14],[10,11,12,13,14],[10,11,12,13,14]]
```

Output with 4-space indent JSON:

```bash
$ echo '[{"3..5": "${FAKE(`{{hacker.phrase}}`)}"}]' | json-creator -i 4

[
    'If we compress the bandwidth, we can get to the PNG sensor through the optical IB program!',
    "I'll navigate the bluetooth CSS capacitor, that should card the RSS program!",
    "You can't transmit the program without overriding the solid state JBOD transmitter!",
    'The PNG bus is down, compress the primary monitor so we can transmit the HDD protocol!'
]
```

The help message shows the command options.

```bash
$ json-creator -h
Usage: cli [options]

Options:
  -V, --version                       output the version number
  -d, --data-context [object]         data context
  -m, --method-context [object]       method context
  -n, --data-namespace [namespace]    data namespace, default to "_"
  -g, --method-namespace [namespace]  data namespace, default to global context
  -i, --json-indent [indent]          output json indent number (default: 0)
  -l, --list                          output available util functions
  -h, --help                          output usage information
```
