import * as THREE from "three";
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

camera.position.set(3, 8, 10);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, canvas);

const material = new THREE.MeshStandardMaterial({
	roughness: 0,
	metalness: 0,
});
const materialFolder = gui.addFolder("Material");
materialFolder.add(material, "roughness", 0, 1, 0.001);
materialFolder.add(material, "metalness", 0, 1, 0.001);

/* 
lights
*/
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(2, 6, 0);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 15;

const shadowSize = 10;
directionalLight.shadow.camera.top = shadowSize;
directionalLight.shadow.camera.right = shadowSize;
directionalLight.shadow.camera.bottom = -shadowSize;
directionalLight.shadow.camera.left = -shadowSize;

const directionalLightCameraHelper = new THREE.CameraHelper(
	directionalLight.shadow.camera,
);
directionalLightCameraHelper.visible = false;
scene.add(directionalLight, directionalLightCameraHelper);

const directionalLightCameraHelperFolder = gui.addFolder(
	"Directional Light Camera Helper",
);
directionalLightCameraHelperFolder.add(directionalLightCameraHelper, "visible");

const directionLightFolder = gui.addFolder("Directional Light");
directionLightFolder.add(directionalLight, "visible");
directionLightFolder.add(directionalLight, "intensity", 0, 5, 0.001);
directionLightFolder.addColor(directionalLight, "color").onChange((value) => {
	directionalLight.color.set(value);
});
directionLightFolder.add(directionalLight.position, "x", -5, 5, 0.001);
directionLightFolder.add(directionalLight.position, "y", -5, 5, 0.001);
directionLightFolder.add(directionalLight.position, "z", -5, 5, 0.001);
directionLightFolder
	.add(directionalLight.shadow.camera, "near", 0, 20, 0.001)
	.onChange(() => {
		directionalLight.shadow.camera.updateProjectionMatrix();
	});
directionLightFolder
	.add(directionalLight.shadow.camera, "top", -20, 20, 0.001)
	.onChange(() => {
		directionalLight.shadow.camera.updateProjectionMatrix();
	});
directionLightFolder
	.add(directionalLight.shadow.camera, "right", -20, 20, 0.001)
	.onChange(() => {
		directionalLight.shadow.camera.updateProjectionMatrix();
	});
directionLightFolder
	.add(directionalLight.shadow.camera, "bottom", -20, 20, 0.001)
	.onChange(() => {
		directionalLight.shadow.camera.updateProjectionMatrix();
	});
directionLightFolder
	.add(directionalLight.shadow.camera, "left", -20, 20, 0.001)
	.onChange(() => {
		directionalLight.shadow.camera.updateProjectionMatrix();
	});

const spotLight = new THREE.SpotLight(0xffffff, 0.5, 10, Math.PI * 0.3);
spotLight.position.set(1, 6, 0);
spotLight.visible = false;
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 20;

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
spotLightCameraHelper.visible = false;
console.log(spotLight.target);
scene.add(spotLight, spotLight.target, spotLightCameraHelper);

const spotLightCameraHelperFolder = gui.addFolder("Spot Light Camera Helper");
spotLightCameraHelperFolder.add(spotLightCameraHelper, "visible");

const spotLightFolder = gui.addFolder("Spot Light");
spotLightFolder.add(spotLight, "visible");
spotLightFolder.add(spotLight, "intensity", 0, 5, 0.001);
spotLightFolder.addColor(spotLight, "color").onChange((value) => {
	spotLight.color.set(value);
});
spotLightFolder.add(spotLight.position, "x", -5, 5, 0.001);
spotLightFolder.add(spotLight.position, "y", -5, 5, 0.001);
spotLightFolder.add(spotLight.position, "z", -5, 5, 0.001);
spotLightFolder.add(spotLight, "distance", 1, 20, 0.001);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(1, 6, 0);
pointLight.visible = false;
pointLight.castShadow = true;
pointLight.shadow.camera.near = 1;
pointLight.shadow.camera.far = 10;

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
pointLightCameraHelper.visible = false;
scene.add(pointLight, pointLightCameraHelper);

const pointLightCameraHelperFolder = gui.addFolder("Point Light Camera Helper");
pointLightCameraHelperFolder.add(pointLightCameraHelper, "visible");

const pointLightFolder = gui.addFolder("Point Light");
pointLightFolder.add(pointLight, "visible");
pointLightFolder.add(pointLight, "intensity", 0, 5, 0.001);
pointLightFolder.addColor(pointLight, "color").onChange((value) => {
	pointLight.color.set(value);
});
pointLightFolder.add(pointLight.position, "x", -5, 5, 0.001);
pointLightFolder.add(pointLight.position, "y", -5, 5, 0.001);
pointLightFolder.add(pointLight.position, "z", -5, 5, 0.001);

const ambientLight = new THREE.AmbientLight(0xffffff, 0);
scene.add(ambientLight);
const ambientLightFolder = gui.addFolder("Ambient Light");
ambientLightFolder.add(ambientLight, "visible", 0, 5, 0.001);
ambientLightFolder.add(ambientLight, "intensity", 0, 1, 0.001);
ambientLightFolder.addColor(ambientLight, "color").onChange((value) => {
	ambientLight.color.set(value);
});

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.set(0, 0.5, 0);
sphere.castShadow = true;

const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
cube.position.set(-3, 0.5, 0);
cube.castShadow = true;

const torus = new THREE.Mesh(
	new THREE.TorusGeometry(0.5, 0.2, 32, 64),
	material,
);
torus.position.set(3, 0.5, 0);
torus.castShadow = true;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;
plane.receiveShadow = true;
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
		shape.rotation.x = elapsedTime * 0.25;
		shape.rotation.y = elapsedTime * 0.25;
		shape.rotation.z = elapsedTime * 0.25;
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
