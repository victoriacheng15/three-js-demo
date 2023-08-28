import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.18/+esm";

THREE.ColorManagement.enabled = false;

const gui = new GUI();

const canvas = document.querySelector("canvas");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x21272e);

const textureLoader = new THREE.TextureLoader();
const waterTexture = textureLoader.load("./textures/water/Water_001_COLOR.jpg");
const waterDisplacement = textureLoader.load(
	"./textures/water/Water_001_DISP.png",
);
const waterNormal = textureLoader.load("./textures/water/Water_001_NORM.jpg");
const waterAmbientOcclusion = textureLoader.load(
	"./textures/water/Water_001_OCC.jpg",
);
const waterRoughness = textureLoader.load(
	"./textures/water/Water_001_SPEC.jpg",
);
waterTexture.generateMipmaps = false;
waterTexture.magFilter = THREE.NearestFilter;

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

camera.position.set(0, 3, 5);
scene.add(camera);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize();
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(directionalLight, ambientLight);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, canvas);

const parameters = {
	size: 2,
	segments: 32,
};

const plane = new THREE.PlaneGeometry(
	parameters.size,
	parameters.size,
	parameters.segments,
	parameters.segments,
);
const planeMaterial = new THREE.MeshStandardMaterial({
	wireframe: false,
	map: waterTexture,
	displacementMap: waterDisplacement,
	displacementScale: 0.25,
	normalMap: waterNormal,
	normalScale: new THREE.Vector2(2, 2),
	aoMap: waterAmbientOcclusion,
	aoMapIntensity: 0.25,
	roughnessMap: waterRoughness,
});
const floor = new THREE.Mesh(plane, planeMaterial);
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

const materialFolder = gui.addFolder("Tweak Material");
materialFolder.add(planeMaterial, "wireframe");
materialFolder.add(parameters, "size", 1, 8, 0.01).onChange((value) => {
	floor.geometry.dispose();
	floor.geometry = new THREE.PlaneGeometry(
		value,
		value,
		parameters.segments,
		parameters.segments,
	);
});
materialFolder.add(parameters, "segments", 1, 132, 1).onChange((value) => {
	floor.geometry.dispose();
	floor.geometry = new THREE.PlaneGeometry(
		parameters.size,
		parameters.size,
		value,
		value,
	);
});
materialFolder.add(planeMaterial, "roughness", 0, 1, 0.01);
materialFolder.add(planeMaterial, "metalness", 0, 1, 0.01);
materialFolder.add(planeMaterial, "displacementScale", 0, 1, 0.01);
materialFolder.add(planeMaterial, "aoMapIntensity", 0, 20, 0.01);
materialFolder.add(planeMaterial.normalScale, "x", 0, 10, 0.01);
materialFolder.add(planeMaterial.normalScale, "y", 0, 10, 0.01);
const directionalLightFolder = gui.addFolder("directional light");
directionalLightFolder.add(directionalLight, "visible").name("light intensity");
directionalLightFolder.add(directionalLight, "intensity", 0, 5, 0.001).min(0);
const ambientLightFolder = gui.addFolder("ambient light");
ambientLightFolder.add(ambientLight, "visible").name("light intensity");
ambientLightFolder.add(ambientLight, "intensity", 0, 5, 0.001).min(0);

const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	// update controls
	controls.update();
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
