import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.18/+esm";

THREE.ColorManagement.enabled = false;

const gui = new GUI();

const canvas = document.querySelector("canvas");
const scene = new THREE.Scene();

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

camera.position.set(0, 10, 15);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, canvas);

const parameters = {};
parameters.count = 5000;
parameters.size = 0.02;
parameters.radius = 8;
parameters.branches = 5;
parameters.spin = 1;
parameters.randomness = 3;
parameters.randomnessPower = 3;
parameters.insideColor = "#c051ff";
parameters.outsideColor = "#404be3";

let geometry = null;
let material = null;
let points = null;

const generateParticles = () => {
	if (points) {
		geometry.dispose();
		material.dispose();
		scene.remove(points);
	}
	geometry = new THREE.BufferGeometry();
	const positions = new Float32Array(parameters.count * 3);
	const colors = new Float32Array(parameters.count * 3);

	const colorInside = new THREE.Color(parameters.insideColor);
	const colorOutside = new THREE.Color(parameters.outsideColor);

	for (let i = 0; i < parameters.count; i++) {
		const i3 = i * 3;
		const radius = Math.random() * parameters.radius;
		const branchAngle =
			((i % parameters.branches) / parameters.branches) * Math.PI * 2;
		const spinAngle = radius * parameters.spin;

		function randomPoisition() {
			return (
				Math.pow(Math.random(), parameters.randomnessPower) *
				(Math.random() < 0.5 ? 1 : -1) *
				parameters.randomness *
				radius
			);
		}

		positions[i3] =
			Math.sin(branchAngle + spinAngle) * radius + randomPoisition();
		positions[i3 + 1] = randomPoisition();
		positions[i3 + 2] =
			Math.cos(branchAngle + spinAngle) * radius + randomPoisition();

		const mixedColor = colorInside.clone();
		mixedColor.lerp(colorOutside, radius / parameters.radius);

		colors[i3] = mixedColor.r;
		colors[i3 + 1] = mixedColor.g;
		colors[i3 + 2] = mixedColor.b;
	}

	geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
	geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

	material = new THREE.PointsMaterial({
		size: parameters.size,
		sizeAttenuation: true,
		depthWrite: false,
		blending: THREE.AdditiveBlending,
		vertexColors: true,
	});

	points = new THREE.Points(geometry, material);
	scene.add(points);
};

generateParticles();

gui.add(parameters, "count", 100, 10000, 100).onFinishChange(generateParticles);
gui
	.add(parameters, "size", 0.001, 0.1, 0.001)
	.onFinishChange(generateParticles);
gui.add(parameters, "radius", 3, 20, 0.01).onFinishChange(generateParticles);
gui.add(parameters, "branches", 2, 20, 1).onFinishChange(generateParticles);
gui.add(parameters, "spin", -5, 5, 0.001).onFinishChange(generateParticles);
gui
	.add(parameters, "randomness", 0, 5, 0.001)
	.onFinishChange(generateParticles);
gui
	.add(parameters, "randomnessPower", 1, 10, 0.001)
	.onFinishChange(generateParticles);
gui.addColor(parameters, "insideColor").onFinishChange(generateParticles);
gui.addColor(parameters, "outsideColor").onFinishChange(generateParticles);

const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	// update controls
	controls.update();
	points.rotation.y = elapsedTime * 0.05;

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
