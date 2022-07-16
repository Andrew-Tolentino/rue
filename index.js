#! /usr/bin/env node

const { program } = require('commander');

const Commands = require('./src/commands/index');

/**
 * 
 * Method use to set the custom Commands into Commander.
 * Argument must be the program object from the commander package.
 * 
 * @param {Command} program 
 */
 const initCommands = (program) => {
  Commands.forEach((command) => {
    const { commandName, argument, action, requiredOptions, options } = command;

    let newCommand = 
      program
        .command(commandName)
        .argument(argument.type, argument.description)
        .action(action);

    // Set required options
    if (requiredOptions.length > 0) {
      requiredOptions.forEach((requiredOption) => {
        const { optionStr, optionDesc } = requiredOption;
        newCommand.requiredOption(optionStr, optionDesc);
      });
    }

    // Set options
    if (options.length > 0) {
      options.forEach((option) => {
        const { optionStr, optionDesc } = option;
        newCommand.option(optionStr, optionDesc);
      });
    }
  });
}

program
  .name('rue')
  .description('CLI to help recall information')
  .version('1.0.1');

// Set custom commands
initCommands(program);

program.parse();