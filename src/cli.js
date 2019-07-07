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

import JSON5 from 'json5';
import program from 'commander';
import jsonCreator from './index';

program
    .version('0.0.1')
    .option('-d, --data-context [object]', 'data context', JSON5.parse)
    .option('-m, --method-context [object]', 'method context', JSON5.parse)
    .option(
        '-n, --data-namespace [namespace]',
        'data namespace, default to "_"'
    )
    .option(
        '-g, --method-namespace [namespace]',
        'data namespace, default to global context'
    )
    .option(
        '-i, --json-indent [indent]',
        'output json indent number',
        parseInt,
        0
    )
    .parse(process.argv);

let inputText = '';
process.stdin.on('data', chunk => {
    inputText += chunk;
});

process.stdin.on('end', () => {
    const [res, err] = jsonCreator(
        JSON5.parse(inputText),
        program.dataContext,
        program.methodContext,
        program.dataNamespace,
        program.methodNamespace
    );
    if (!err.length) {
        console.log(JSON.stringify(res, null, program.jsonIndent));
    } else {
        console.error(res);
        throw new Error(err);
    }
});
