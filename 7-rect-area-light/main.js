import * as THREE from "three";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.18/+esm";

THREE.ColorManagement.enabled = false

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

const intensity = 2;
const width = 1;
const height = 1;
const rectAreaLight = new THREE.RectAreaLight(
	0x1fc600,
	intensity,
	width,
	height,
);
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLight, rectAreaLightHelper);

const ambientLight = new THREE.AmbientLight(0x404040, 0);
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
materialFolder.add(material, "roughness", 0, 1, 0.001)
materialFolder.add(material, "metalness", 0, 1, 0.001)

/* 
react area light GUI
*/
const rectAreaLightFolder = gui.addFolder("React Area Light");
rectAreaLightFolder.add(rectAreaLight, "visible");
rectAreaLightFolder.add(rectAreaLight, "intensity", 0, 5, 0.001);
rectAreaLightFolder.addColor(rectAreaLight, "color").onChange((value) => {
	reactAreaLight.color.set(value);
});
rectAreaLightFolder.add(rectAreaLight, "width", 0, 20, 0.001);
rectAreaLightFolder.add(rectAreaLight, "height", 0, 20, 0.001);
rectAreaLightFolder.add(rectAreaLight.position, "x", -10, 10, 0.001);
rectAreaLightFolder.add(rectAreaLight.position, "y", -10, 10, 0.001);
rectAreaLightFolder.add(rectAreaLight.position, "z", -10, 10, 0.001);

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
