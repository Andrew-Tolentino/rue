const fsPromises = require('fs').promises;

const FILE_NAME = 'rue_json.json';

/**
 * Method use to write into the rue json file containing saved data
 * 
 * @param {Object} jsonData 
 */
const writeFileJson = async (jsonData) => {
	try {
		const savedData = await readFileJson(); // Check for saved data already, we do not want to override
		const updatedData = savedData !== null ? { ...savedData, ...jsonData} : jsonData;
		
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