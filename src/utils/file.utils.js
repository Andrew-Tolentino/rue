const fsPromises = require('fs').promises;

const FILE_NAME = 'rue_json.json';

/**
 * Method use to write into the rue json file containing saved data
 * 
 * @param {Object} jsonData
 * @param {Array<string>} pathKeys
 */
const writeFileJson = async (jsonData, pathKeys) => {
	try {
		const savedData = await readFileJson(); // Check for saved data already, we do not want to override

		// Need to correctly update json with override other areas
		if (savedData !== null) {
			let currentData = savedData;
			let incomingData = jsonData;

			console.log('pathKeys', pathKeys);

			for (let i = 0; i < pathKeys.length; i++) {
				const key = pathKeys[i];

				if (currentData[key] !== undefined) {
					// Check if subMap maps to a value rather than another object
					if (Array.isArray(currentData[key]) || typeof currentData[key] !== 'object') {
						Reflect.set(currentData, key, incomingData[key]);
						break;
					}
					else {
						currentData = currentData[key];
						incomingData = incomingData[key];
					}
				}
				else {
					Reflect.set(currentData, key, incomingData[key]);
					break;
				}
			}
		}

		const updatedData = savedData !== null ? savedData : jsonData;
		await fsPromises.writeFile(FILE_NAME, JSON.stringify(updatedData, null, 2));
	}
	catch(err) {
		console.log('Unable to write to Rue file', err);
	}
}

/**
 * Method use to return saved data in the rue file as JSON
 * 
 * @returns Object
 */
const readFileJson = async () => {
	try {
		const rawData = await fsPromises.readFile(FILE_NAME);
		return JSON.parse(rawData);
	}
	catch(err) {
		console.log('Unable to read Rue file', err);
		return null;
	}
}

module.exports = {
	writeFileJson,
	readFileJson
};