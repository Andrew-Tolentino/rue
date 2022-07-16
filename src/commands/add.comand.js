const COMMAND_NAME = 'add';
const ARGUMENT_TYPE = '<string>';
const ARGUMENT_DESCRIPTION = 'A string that maps the nested path of keys using "|" as the delimiter. For Example, "parent|child1|child2" creates { parent: { child1: { child2: <value> } } }';

const action = (input, options) => {
	const { value, list: listFlag } = options;
  let rawKeys = input.split('|');

	// Remove keys that are just whitespace (i.e. '||')
	let filteredKeys = rawKeys.filter((key) => key !== '');

	// Remove any whitespace for each key
	filteredKeys = filteredKeys.map((key) => {
		return key.trim();
	});

	// Reverse order of keys so that we can build the mapping starting with last key
	filteredKeys.reverse();

	console.log('options', options);

	const keyMapping = filteredKeys.reduce((map, key, index) => {
		if (index === 0) {
			// If list flag is enabled, set value to be an array delimited by ','
			map[key] = listFlag ? value.split(',') : value;
		}
		else
			map = { [key]: map };

		return map;
	}, {});

	console.log('keyMapping', JSON.stringify(keyMapping));
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