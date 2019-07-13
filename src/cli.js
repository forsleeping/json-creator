#! /usr/bin/env node

import JSON5 from 'json5';
import program from 'commander';
import jsonCreator, { utilFunctions } from './index';
import { version } from '../package.json';

program
    .version(version)
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
    .option('-l, --list', 'output available util functions')
    .parse(process.argv);

if (program.list) {
    Object.values(utilFunctions).forEach(funcBody =>
        console.log(`${funcBody.toString().split('\n')[0]}...}`)
    );
    process.exit(0);
}

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
