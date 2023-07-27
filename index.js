const fs = require("fs").promises;
const path = require("path");

async function getFolders(directoryPath) {
	const folders = [];

	try {
		const items = await fs.readdir(directoryPath);
		const filtered = items.filter(
			(item) => !item.startsWith(".") && !item.startsWith("template"),
		);

		for (const item of filtered) {
			const stats = await fs.stat(item);
			if (stats.isDirectory()) {
				folders.push(item);
			}
		}
	} catch (error) {
		console.error("Error reading folders:", error);
	}

	return folders;
}

function capitalizeLink(str) {
	const getWords = str.slice(2).replace(/-/g, " ");
	const capFirstLetter = getWords[0].toUpperCase();
	return capFirstLetter + getWords.slice(1);
}

async function updateREADME() {
	try {
		const page = "https://victoriacheng15.github.io/three-js-demo/";

		const currentDirectory = process.cwd();
		const folders = await getFolders(currentDirectory);
		const displayFolder = folders
			.map((folder) => `- [${capitalizeLink(folder)}](${page}${folder})`)
			.join("\n");

		const markdownContent = `# Three.js Demos\n\n${displayFolder}`;

		const markdownFilePath = path.join(currentDirectory, "README.md");
		await fs.writeFile(markdownFilePath, markdownContent);
		console.log("README.md has been updated.");
	} catch (error) {
		console.error("Error updating README.md:", error);
	}
}

updateREADME();
