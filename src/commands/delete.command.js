const { readFileJson, writeFileJson } = require('../utils/file.utils');
const { ERROR_MESSAGES } = require('./error_constants.command');

const COMMAND_NAME = 'delete';
const ARGUMENT_TYPE = '<string>';
const ARGUMENT_DESCRIPTION = 'A string that maps the nested path of keys using "|" as the delimiter. For Example, "parent|child1|child2" creates { parent: { child1: { child2: <value> } } }. Must not be an empty string!';

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

  let pathRef = savedData;
  const successfullyDeleted = deletePath(pathRef, filteredKeys, 0); // Checks if path was valid and data has been deleted

  if (!successfullyDeleted) {
    console.log(ERROR_MESSAGES.UNKNOWN_PATH);
    return;
  }

  await writeFileJson(savedData);
}

const deletePath = (currentRef, keyPathList, currentIndex) => {
  const key = keyPathList[currentIndex];

  if (currentRef[key] === undefined)
  	return false;

  // Second to last key in the path
  if (currentIndex === keyPathList.length - 2) {
    const nextKey = keyPathList[currentIndex + 1];

    // Check if the last key exists with the current reference in the object
    if (currentRef[key][nextKey] === undefined)
      return false;

    delete currentRef[key][nextKey];

    // Check if the current sub path is an empty object
    if (Object.keys(currentRef[key]).length === 0)
      delete currentRef[key];

    return true;
  }

  // Check if the current key is not valid
  if (currentRef[key] === undefined)
    return false;

  let successfulDelete = deletePath(currentRef[key], keyPathList, currentIndex + 1); // Recursively call to check next subPath

  // Check if current reference is object is now paired to an empty object after deletion
  if (successfulDelete && Object.keys(currentRef[key]).length === 0)
    delete currentRef[key];

  return successfulDelete;
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