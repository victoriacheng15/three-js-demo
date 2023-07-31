import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.18/+esm";

THREE.ColorManagement.enabled = false;

const gui = new GUI();

const canvas = document.querySelector("canvas");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x21272e);

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	1000,
);

camera.position.set(3, 4, 5);
scene.add(camera);

const lightColors = {
	directional: "#00fffc",
	ambient: "#404040",
};

const directionalLight = new THREE.DirectionalLight(
	lightColors.directional,
	0.5,
);
directionalLight.position.set(1, 1, 1);
const directionalLightHelper = new THREE.DirectionalLightHelper(
	directionalLight,
	0.5,
);
scene.add(directionalLight, directionalLightHelper);

const ambientLight = new THREE.AmbientLight(lightColors.ambient, 0.5);
scene.add(ambientLight);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, canvas);

const material = new THREE.MeshStandardMaterial({
	roughness: 0.5,
	metalness: 0,
});
const materialFolder = gui.addFolder("Material");
materialFolder.add(material, "roughness", 0, 1, 0.001).onChange((value) => {
	material.roughness = value;
});
materialFolder.add(material, "metalness", 0, 1, 0.001).onChange((value) => {
	material.metalness = value;
});

/* 
directional and ambient light GUI
*/
const directionalFolder = gui.addFolder("Directional Light");
directionalFolder.add(directionalLight, "visible").name("Visible");
directionalFolder.add(directionalLightHelper, "visible").name("Helper Visible");
directionalFolder
	.add(directionalLight, "intensity")
	.min(0)
	.max(2)
	.step(0.001)
	.name("Intensity");
directionalFolder.addColor(lightColors, "directional").onChange(() => {
	directionalLight.color.set(lightColors.directional);
});
directionalFolder
	.add(directionalLight.position, "x")
	.min(-5)
	.max(5)
	.step(0.001)
	.name("X");
directionalFolder
	.add(directionalLight.position, "y")
	.min(-5)
	.max(5)
	.step(0.001)
	.name("Y");
directionalFolder
	.add(directionalLight.position, "z")
	.min(-5)
	.max(5)
	.step(0.001)
	.name("Z");

const ambientFolder = gui.addFolder("Ambient Light");
ambientFolder.add(ambientLight, "visible").name("Visible");
ambientFolder
	.add(ambientLight, "intensity")
	.min(0)
	.max(1)
	.step(0.001)
	.name("Intensity");
ambientFolder.addColor(lightColors, "ambient").onChange(() => {
	ambientLight.color.set(lightColors.ambient);
});

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -2;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
	new THREE.TorusGeometry(0.3, 0.2, 32, 64),
	material,
);
torus.position.x = 2;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(plane);

const shapes = [sphere, cube, torus];

for (const shape of shapes) {
	scene.add(shape);
}

const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	// update controls
	controls.update();

	for (const shape of shapes) {
		shape.rotation.x = elapsedTime * 0.1;
		shape.rotation.y = elapsedTime * 0.1;
		shape.rotation.z = elapsedTime * 0.1;
	}

	//render
	renderer.render(scene, camera);
	window.requestAnimationFrame(tick);
};

tick();

window.addEventListener("resize", () => {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
