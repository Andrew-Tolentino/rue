const { writeFileJsonWithPathKeys } = require('../utils/file.utils');
const { ERROR_MESSAGES } = require('./error_constants.command');

const COMMAND_NAME = 'add';
const ARGUMENT_TYPE = '<string>';
const ARGUMENT_DESCRIPTION = 'A string that maps the nested path of keys using "|" as the delimiter. For Example, "parent|child1|child2" creates { parent: { child1: { child2: <value> } } }';

const action = async (input, options) => {
  const { value, list: listFlag } = options;

  // Input from value flag is invalid
  if (value === '' || value.trim() === '') {
    console.log(ERROR_MESSAGES.INVALID_VALUE);
    return;
  }

  let rawKeys = input.split('|');

  // Remove keys that are just whitespace (i.e. '||')
  let filteredKeys = rawKeys.filter((key) => key !== '');

  // Remove any whitespace for each key
  filteredKeys = filteredKeys.map((key) => {
    return key.trim();
  });

  // Reverse order of keys so that we can build the mapping starting with last key
  const keyMapping = [...filteredKeys].reverse().reduce((map, key, index) => {
  	if (index === 0) {
  		// If list flag is enabled, set value to be an array delimited by ','
  		map[key] = listFlag ? value.split(',') : value;
  	}
  	else
  		map = { [key]: map };
  	return map;
  }, {});

  await writeFileJsonWithPathKeys(keyMapping, filteredKeys);
}

const requiredOptions = [
  {
  	optionStr: '-v, --value <string>',
  	optionDesc: '(Required) Value to assign to the last key path (<last_key>: <value>)'
  }
];

const options = [
  {
  	optionStr: '-l, --list',
  	optionDesc: 'Converts the -v/--value option arg into a list using "," as a delimiter'
  }
];

module.exports = {
  commandName: COMMAND_NAME,
  argument: {
    type: ARGUMENT_TYPE,
    description: ARGUMENT_DESCRIPTION
  },
  action,
  requiredOptions,
  options
};