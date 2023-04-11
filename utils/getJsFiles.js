const fs = require('fs');
const path = require('path');

const allFilesAndSubdirectories = [];

const readTargetDir = (directory) => {
	fs.readdirSync(directory).forEach((file) => {
		const absoluteFilepath = path.join(directory, file);

		if (fs.statSync(absoluteFilepath).isDirectory()) {
			readTargetDir(absoluteFilepath);
		}
		else if (absoluteFilepath.endsWith('.js')) {
			allFilesAndSubdirectories.push(absoluteFilepath);
		}
	});
};

function getJsFiles(directory = './commands/') {
	readTargetDir(directory);
	return allFilesAndSubdirectories;
}

module.exports = { getJsFiles };
