function displayDeoms(folders) {
	const ul = document.querySelector("[data-list]");

	for (const folder of folders) {
		const li = document.createElement("li");
		const link = document.createElement("a");
		link.textContent = folder.slice(2);
		link.href = `/${folder}`;
		link.target = "_blank";

		li.appendChild(link);
		ul.appendChild(li);
	}
}

async function getJsonData() {
	const response = await fetch("./folders.json");
	const data = await response.json();
	displayDeoms(data.folders);
}

getJsonData();
