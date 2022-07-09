#! /usr/bin/env node

const { program } = require('commander');

program
    .name('rue')
    .description('CLI to help recall information')
    .version('1.0.0');

program
    .command('test')
    .argument('<string>', 'Sample argument')
    .action((input, _options) => {
        if (input) {
            console.log(`Your input ${input}`);
        }
    });

program.parse();