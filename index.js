const fs = require("fs");
const path = require("path");

function getFolders(directoryPath) {
	const folders = [];

	const items = fs.readdirSync(directoryPath);
	const notIncluded = [".git", "template-vite"];
	const filtered = items.filter(
		(item) => !notIncluded.includes(item),
	);

	for (const item of filtered) {
		if (fs.statSync(item).isDirectory()) {
			folders.push(item);
		}
	}

	return folders;
}

function updateREADME() {
	try {
		const page = "https://victoriacheng15.github.io/three-js-demo/";

		const currentDirectory = process.cwd();
		const folders = getFolders(currentDirectory);
		const displayFolder = folders
			.map((folder) => `- [${folder.slice(2)}](${page}${folder})`)
			.join("\n");

		const markdownContent = `# Three.js Demos

${displayFolder}`;

		const markdownFilePath = path.join(currentDirectory, "README.md");
		fs.writeFileSync(markdownFilePath, markdownContent);
		console.log(`README.md has been updated.`);
	} catch (error) {
		console.error("Error updating README.md:", error);
	}
}

updateREADME();
