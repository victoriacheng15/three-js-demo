const fs = require("fs");
const path = require("path");

function getFolders(directoryPath) {
	const folders = [];

	const items = fs.readdirSync(directoryPath);

	for (const item of items) {
		if (
			fs.statSync(item).isDirectory() &&
			item !== ".git" &&
			item !== "template-vite"
		) {
			folders.push(item);
		}
	}

	return folders;
}

const currentDirectory = process.cwd();
const folders = getFolders(currentDirectory);

const data = {
	folders
};

const jsonData = JSON.stringify(data, null, 2);
const jsonFile = path.join(currentDirectory, "folders.json");
fs.writeFileSync(jsonFile, jsonData);
