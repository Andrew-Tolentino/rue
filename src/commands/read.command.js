const { readFileJson } = require('../utils/file.utils');
const { ERROR_MESSAGES } = require('./error_constants.command');

const COMMAND_NAME = 'read';
const ARGUMENT_TYPE = '<string>';
const ARGUMENT_DESCRIPTION = 'A string that maps the nested path of keys using "|" as the delimiter. For Example, "parent|child1|child2" creates { parent: { child1: { child2: <value> } } }';

const action = async (input, _options) => {
  let rawKeys = input.split('|');

  // Remove keys that are just whitespace (i.e. '||')
  let filteredKeys = rawKeys.filter((key) => key !== '');

  // Remove any whitespace for each key
  filteredKeys = filteredKeys.map((key) => {
  	return key.trim();
  });

  // Grab currently saved data
  const savedData = await readFileJson();
  
  // There is no currently saved data
  if (savedData === null) {
  	console.log(ERROR_MESSAGES.UNKNOWN_PATH);
  	return;
  }

  const result = filteredKeys.reduce((map, key) => {
  	const childData = map[key];
  	return childData;
  }, savedData);

  printResult(result);
}

const printResult = (result) => {
  if (Array.isArray(result) || typeof result === 'string') {
  	console.log(result);
  }
  else if (typeof result === 'object') {
  	console.log('List of child keys from path', Object.keys(result));
  }
  else {
  	console.log(ERROR_MESSAGES.UNKNOWN_PATH);
  }
}

module.exports = {
  commandName: COMMAND_NAME,
  argument: {
    type: ARGUMENT_TYPE,
    description: ARGUMENT_DESCRIPTION
  },
  action,
  requiredOptions: [],
  options: []
};