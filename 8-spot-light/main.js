import * as THREE from "three";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.18/+esm";

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

const distance = 0;
const angle = 3;
const penumbra = 0.5;
const decay = 0;
const spotLight = new THREE.SpotLight(
	0x1fc600,
	0.5,
	distance,
	Math.PI / angle,
	penumbra,
	decay,
);
spotLight.position.set(0, 3, 0);
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLight, spotLightHelper);

const ambientLight = new THREE.AmbientLight(0x404040, 0);
scene.add(ambientLight);

const renderer = new THREE.WebGLRenderer({ canvas });
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
spot light GUI
*/
const spotLightFolder = gui.addFolder("Spot Light");
spotLightFolder.add(spotLight, "visible");
spotLightFolder.add(spotLight, "intensity", 0, 3, 0.001);
spotLightFolder.addColor(spotLight, "color").onChange((value) => {
	spotLight.color.set(value);
});
spotLightFolder.add(spotLight, "penumbra", 0, 1, 0.001);
spotLightFolder.add(spotLight, "angle", 1, 6, 0.001).onChange((value) => {
	spotLight.angle = Math.PI / value;
});
spotLightFolder.add(spotLight.position, "x", -10, 10, 0.001);
spotLightFolder.add(spotLight.position, "y", -10, 10, 0.001);
spotLightFolder.add(spotLight.position, "z", -10, 10, 0.001);

const ambientFolder = gui.addFolder("Ambient Light");
ambientFolder.add(ambientLight, "visible");
ambientFolder.add(ambientLight, "intensity", 0, 1, 0.001);
ambientFolder.addColor(ambientLight, "color").onChange((value) => {
	ambientLight.color.set(value);
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

shapes.forEach((shape) => {
	scene.add(shape);
});

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
