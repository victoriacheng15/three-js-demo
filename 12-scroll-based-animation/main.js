import * as THREE from "three";
import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.18/+esm";

THREE.ColorManagement.enabled = false;

const gui = new GUI();

const parameters = {
	materialColor: "#ffeded",
	particlesCount: 300,
	size: 0.01
};

const canvas = document.querySelector("canvas");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x21272e);

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

const groupCamera = new THREE.Group();
scene.add(groupCamera);
const camera = new THREE.PerspectiveCamera(
	55,
	sizes.width / sizes.height,
	0.1,
	100,
);

camera.position.set(0, 0, 6);
groupCamera.add(camera);

const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(1, 1, 0).normalize();
scene.add(light);

const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	alpha: true,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const textureLoader = new THREE.TextureLoader();
const gradients = textureLoader.load("./textures/gradients/5.jpg");
gradients.magFilter = THREE.NearestFilter;

const objectDistance = 5;

const material = new THREE.MeshToonMaterial({
	color: parameters.materialColor,
	gradientMap: gradients,
});

const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.3, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 1.75, 32), material);
const mesh3 = new THREE.Mesh(
	new THREE.TorusKnotGeometry(0.6, 0.25, 100, 16),
	material,
);

const meshes = [mesh1, mesh2, mesh3];
mesh1.position.set(2, 0, 0);
mesh2.position.set(-2, 0, 0);
mesh3.position.set(2, 0, 0);

mesh1.position.y = -objectDistance * 0;
mesh2.position.y = -objectDistance * 1;
mesh3.position.y = -objectDistance * 2;


for (const mesh of meshes) {
	scene.add(mesh)
}

let particlesGeometry = null;
let particlesMaterial = null;
let particles = null;

const generateParticles = () => {
	if (particles) {
		particlesGeometry.dispose()
		particlesMaterial.dispose()
		scene.remove(particles)
	}

	particlesGeometry = new THREE.BufferGeometry();
	const positions = new Float32Array(parameters.particlesCount * 3)

	for (let i = 0; i < parameters.particlesCount; i++) {
		positions[i * 3 + 0] = (Math.random() - 0.5) * 15
		positions[i * 3 + 1] = objectDistance * 0.5 - Math.random() * objectDistance * meshes.length
		positions[i * 3 + 2] = (Math.random() - 0.5) * 5
	}

	particlesGeometry.setAttribute(
		"position",
		new THREE.BufferAttribute(positions, 3),
	);

	particlesMaterial = new THREE.PointsMaterial({
		size: parameters.size,
		color: parameters.materialColor,
		sizeAttenuation: true,
		depthWrite: false,
		blending: THREE.AdditiveBlending,
	});

	particles = new THREE.Points(particlesGeometry, particlesMaterial);
	scene.add(particles);
}

generateParticles()

gui.addColor(parameters, "materialColor").onChange(() => {
	material.color.set(parameters.materialColor);
	particlesMaterial.color.set(parameters.materialColor);
})
gui.add(light, "intensity", 1, 4, 0.01)
gui.add(parameters, "particlesCount", 100, 10000, 100).onFinishChange(generateParticles)
gui.add(parameters, "size", 0.01, 0.1, 0.01).onFinishChange(generateParticles)

const cursor = {
	x: 0,
	y: 0,
};

window.addEventListener("mousemove", (event) => {
	cursor.x = event.clientX / sizes.width - 0.5;
	cursor.y = event.clientY / sizes.height - 0.5;
});


let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener("scroll", () => {
	scrollY = window.scrollY;
	const newSection = Math.round(scrollY / sizes.height);
	if (newSection !== currentSection) {
		currentSection = newSection;
		gsap.to(meshes[currentSection].rotation, {
			duration: 1.5,
			ease: "bounce.out",
			z: "+=1.5",
		})
	}
})

const clock = new THREE.Clock();
let previousTime = 0;


const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	const deltaTime = elapsedTime - previousTime;
	previousTime = elapsedTime;

	for (const mesh of meshes) {
		mesh.rotation.x = elapsedTime * 0.1;
		mesh.rotation.y = elapsedTime * 0.12;
	}

	camera.position.y = (-scrollY / sizes.height) * objectDistance;
	const parallaxX = cursor.x;
	const parallaxY = -cursor.y;
	groupCamera.position.x +=
		(parallaxX - groupCamera.position.x) * 15 * deltaTime;
	groupCamera.position.y +=
		(parallaxY - groupCamera.position.y) * 15 * deltaTime;

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
