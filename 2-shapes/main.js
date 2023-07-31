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
camera.position.set(7, 7, 20);
scene.add(camera);

const light = new THREE.DirectionalLight(0xffffff, 5);
light.position.set(3, 4, 5);
scene.add(light);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, canvas);

const total = -3;
const offset = 5;
const material = new THREE.MeshStandardMaterial({
	color: 0x1ea8fc,
	wireframe: false,
});
gui.add(material, "wireframe");
gui.add(light, "visible").name("light visible");
gui.add(light, "intensity", 0, 8, 0.001);

function objectPosition(obj, position, y = 0) {
	return obj.position.set(total + offset * position, y, 0);
}

const boxParameters = {
	width: 1,
	height: 1,
	depth: 1,
	widthSegments: 1,
	heightSegments: 1,
	depthSegments: 1,
};

const boxGeometry = new THREE.BoxGeometry(
	boxParameters.width,
	boxParameters.height,
	boxParameters.depth,
	boxParameters.widthSegments,
	boxParameters.heightSegments,
	boxParameters.depthSegments,
);
const box = new THREE.Mesh(boxGeometry, material);
objectPosition(box, 0, 8);

const boxSize = gui.addFolder("box");
boxSize.add(boxParameters, "width", 0.5, 5, 0.001).onChange((valueue) => {
	box.scale.x = valueue;
});
boxSize.add(boxParameters, "height", 0.5, 5, 0.001).onChange((valueue) => {
	box.scale.y = valueue;
});
boxSize.add(boxParameters, "depth", 0.5, 5, 0.001).onChange((valueue) => {
	box.scale.z = valueue;
});
boxSize
	.add(boxParameters, "widthSegments", 1, 10, 0.001)
	.onChange((valueue) => {
		box.geometry.dispose(); // Dispose of the old geometry
		box.geometry = new THREE.BoxGeometry(
			boxParameters.width,
			boxParameters.height,
			boxParameters.depth,
			valueue, // New width segments
			boxParameters.heightSegments,
			boxParameters.depthSegments,
		);
	});
boxSize
	.add(boxParameters, "heightSegments", 1, 10, 0.001)
	.onChange((valueue) => {
		box.geometry.dispose(); // Dispose of the old geometry
		box.geometry = new THREE.BoxGeometry(
			boxParameters.width,
			boxParameters.height,
			boxParameters.depth,
			boxParameters.widthSegments,
			valueue, // New height segments
			boxParameters.depthSegments,
		);
	});
boxSize
	.add(boxParameters, "depthSegments", 1, 10, 0.001)
	.onChange((valueue) => {
		box.geometry.dispose(); // Dispose of the old geometry
		box.geometry = new THREE.BoxGeometry(
			boxParameters.width,
			boxParameters.height,
			boxParameters.depth,
			boxParameters.widthSegments,
			boxParameters.heightSegments,
			valueue, // New depth segments
		);
	});

const capsuleParameters = {
	radius: 0.5,
	length: 0.5,
	capSegments: 1,
	radialSegments: 4,
};

const capsuleGeometry = new THREE.CapsuleGeometry(
	capsuleParameters.radius,
	capsuleParameters.length,
	capsuleParameters.capSegments,
	capsuleParameters.radialSegments,
);
const capsule = new THREE.Mesh(capsuleGeometry, material);
objectPosition(capsule, 1, 8);

const capsuleSize = gui.addFolder("capsule");
capsuleSize
	.add(capsuleParameters, "radius", 0.5, 5, 0.001)
	.onChange((valueue) => {
		capsule.scale.x = valueue;
		capsule.scale.z = valueue;
	});
capsuleSize
	.add(capsuleParameters, "length", 0.5, 5, 0.001)
	.onChange((valueue) => {
		capsule.scale.y = valueue;
	});
capsuleSize
	.add(capsuleParameters, "radialSegments", 1, 20, 0.001)
	.onChange((valueue) => {
		capsule.geometry.dispose(); // Dispose of the old geometry
		capsule.geometry = new THREE.CapsuleGeometry(
			capsuleParameters.radius,
			capsuleParameters.length,
			capsuleParameters.capSegments,
			valueue,
		);
	});
capsuleSize
	.add(capsuleParameters, "capSegments", 1, 20, 0.001)
	.onChange((valueue) => {
		capsule.geometry.dispose(); // Dispose of the old geometry
		capsule.geometry = new THREE.CapsuleGeometry(
			capsuleParameters.radius,
			capsuleParameters.length,
			valueue,
			capsuleParameters.radialSegments,
		);
	});

const circleParamters = {
	radius: 1,
	segments: 16,
	thetaStart: 1,
	thetaLength: 2,
};

const circleGeometry = new THREE.CircleGeometry(
	circleParamters.radius,
	circleParamters.segments,
	circleParamters.thetaStart,
	circleParamters.thetaLength * Math.PI,
);
const circle = new THREE.Mesh(circleGeometry, material);
objectPosition(circle, 2, 8);

const circleFolder = gui.addFolder("circle");
circleFolder.add(circleParamters, "radius", 0.5, 5, 0.001).onChange((value) => {
	circle.scale.set(value, value);
});
circleFolder
	.add(circleParamters, "segments", 1, 20, 0.001)
	.onChange((value) => {
		circle.geometry.dispose();
		circle.geometry = new THREE.CircleGeometry(
			circleParamters.radius,
			value,
			circleParamters.thetaStart,
			circleParamters.thetaLength,
		);
	});
circleFolder
	.add(circleParamters, "thetaStart", 1, 20, 0.001)
	.onChange((value) => {
		circle.geometry.dispose();
		circle.geometry = new THREE.CircleGeometry(
			circleParamters.radius,
			circleParamters.segments,
			value,
			circleParamters.thetaLength,
		);
	});
circleFolder
	.add(circleParamters, "thetaStart", 1, 20, 0.001)
	.onChange((value) => {
		circle.geometry.dispose();
		circle.geometry = new THREE.CircleGeometry(
			circleParamters.radius,
			circleParamters.segments,
			circleParamters.thetaStart,
			value,
		);
	});

const coneParamters = {
	radius: 1,
	height: 2,
	radialSegments: 32,
	heightSegments: 1,
};

const coneGeometry = new THREE.ConeGeometry(
	coneParamters.radius,
	coneParamters.height,
	coneParamters.radialSegments,
	coneParamters.heightSegments,
);
const cone = new THREE.Mesh(coneGeometry, material);
objectPosition(cone, 0, 3);

const coneFolder = gui.addFolder("cone");
coneFolder.add(coneParamters, "radius", 1, 10, 0.001).onChange((value) => {
	cone.scale.set(value, coneParamters.height);
});
coneFolder.add(coneParamters, "height", 1, 10, 0.001).onChange((value) => {
	cone.scale.set(coneParamters.radius, value);
});
coneFolder
	.add(coneParamters, "radialSegments", 3, 30, 0.001)
	.onChange((value) => {
		cone.geometry.dispose();
		cone.geometry = new THREE.ConeGeometry(
			coneParamters.radius,
			coneParamters.height,
			value,
			coneParamters.heightSegments,
		);
	});
coneFolder
	.add(coneParamters, "heightSegments", 1, 30, 0.001)
	.onChange((value) => {
		cone.geometry.dispose();
		cone.geometry = new THREE.ConeGeometry(
			coneParamters.radius,
			coneParamters.height,
			coneParamters.radialSegments,
			value,
		);
	});

const cylinderParameters = {
	radiusTop: 1,
	radiusBottom: 1,
	height: 2,
	radialSegments: 32,
	heightSegments: 1,
};

const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
const cylinder = new THREE.Mesh(cylinderGeometry, material);
objectPosition(cylinder, 1, 3);
const cylinderFolder = gui.addFolder("cylinder");

cylinderFolder
	.add(cylinderParameters, "radiusTop", 0.5, 10, 0.001)
	.onChange((value) => {
		cylinder.geometry.dispose();
		cylinder.geometry = new THREE.CylinderGeometry(
			value,
			cylinderParameters.radiusBottom,
			cylinderParameters.height,
			cylinderParameters.radialSegments,
			cylinderParameters.heightSegments,
		);
	});
cylinderFolder
	.add(cylinderParameters, "radiusBottom", 0.5, 10, 0.001)
	.onChange((value) => {
		cylinder.geometry.dispose();
		cylinder.geometry = new THREE.CylinderGeometry(
			cylinderParameters.radiusTop,
			value,
			cylinderParameters.height,
			cylinderParameters.radialSegments,
			cylinderParameters.heightSegments,
		);
	});
cylinderFolder
	.add(cylinderParameters, "height", 0.5, 10, 0.001)
	.onChange((value) => {
		cylinder.geometry.dispose();
		cylinder.geometry = new THREE.CylinderGeometry(
			cylinderParameters.radiusTop,
			cylinderParameters.radiusBottom,
			value,
			cylinderParameters.radialSegments,
			cylinderParameters.heightSegments,
		);
	});
cylinderFolder
	.add(cylinderParameters, "radialSegments", 3, 30, 0.001)
	.onChange((value) => {
		cylinder.geometry.dispose();
		cylinder.geometry = new THREE.CylinderGeometry(
			cylinderParameters.radiusTop,
			cylinderParameters.radiusBottom,
			cylinderParameters.height,
			value,
			cylinderParameters.heightSegments,
		);
	});
cylinderFolder
	.add(cylinderParameters, "heightSegments", 1, 30, 0.001)
	.onChange((value) => {
		cylinder.geometry.dispose();
		cylinder.geometry = new THREE.CylinderGeometry(
			cylinderParameters.radiusTop,
			cylinderParameters.radiusBottom,
			cylinderParameters.height,
			cylinderParameters.radialSegments,
			value,
		);
	});

const dodecahedronParameters = {
	radius: 1,
	detail: 0,
};

const dodecahedronGeometry = new THREE.DodecahedronGeometry(
	dodecahedronParameters.radius,
	dodecahedronParameters.detail,
);
const dodecahedron = new THREE.Mesh(dodecahedronGeometry, material);
objectPosition(dodecahedron, 2, 3);

const dodecahedronFolder = gui.addFolder("dodechedron");
dodecahedronFolder
	.add(dodecahedronParameters, "radius", 0.5, 10, 0.001)
	.onChange((valueue) => {
		dodecahedron.geometry.dispose();
		dodecahedron.geometry = new THREE.DodecahedronGeometry(
			valueue,
			dodecahedronParameters.detail,
		);
	});
dodecahedronFolder
	.add(dodecahedronParameters, "detail", 1, 10, 1)
	.onChange((valueue) => {
		dodecahedron.geometry.dispose();
		dodecahedron.geometry = new THREE.DodecahedronGeometry(
			dodecahedronParameters.radius,
			valueue,
		);
	});

const icosahedroneParameters = {
	radius: 1,
	detail: 1,
};

const icosahedronGeometry = new THREE.IcosahedronGeometry(
	icosahedroneParameters.radius,
	icosahedroneParameters.detail,
);
const icosahedrone = new THREE.Mesh(icosahedronGeometry, material);
objectPosition(icosahedrone, 0, -3);

const icosahedroneFolder = gui.addFolder("icosahedrone");
icosahedroneFolder
	.add(icosahedroneParameters, "radius", 0.5, 10, 0.001)
	.onChange((value) => {
		icosahedrone.geometry.dispose();
		icosahedrone.geometry = new THREE.IcosahedronGeometry(
			value, // New radius
			icosahedroneParameters.detail,
		);
	});
icosahedroneFolder
	.add(icosahedroneParameters, "detail", 1, 10, 1)
	.onChange((value) => {
		icosahedrone.geometry.dispose();
		icosahedrone.geometry = new THREE.IcosahedronGeometry(
			icosahedroneParameters.radius,
			value, // New detail
		);
	});

const octahedroneParameters = {
	radius: 1,
	detail: 0,
};

const octahedronGeometry = new THREE.OctahedronGeometry(
	octahedroneParameters.radius,
	octahedroneParameters.detail,
);
const octahedrone = new THREE.Mesh(octahedronGeometry, material);
objectPosition(octahedrone, 1, -3);

const octahedroneFolder = gui.addFolder("octahedrone");
octahedroneFolder
	.add(octahedroneParameters, "radius", 0.5, 10, 0.001)
	.onChange((valueue) => {
		octahedrone.geometry.dispose();
		octahedrone.geometry = new THREE.IcosahedronGeometry(
			valueue,
			octahedroneParameters.detail,
		);
	});
octahedroneFolder
	.add(octahedroneParameters, "detail", 1, 10, 1)
	.onChange((valueue) => {
		octahedrone.geometry.dispose();
		octahedrone.geometry = new THREE.IcosahedronGeometry(
			octahedroneParameters.radius,
			valueue,
		);
	});

const ringParameters = {
	innerRadius: 0.5,
	outerRadius: 1,
	thetaSegments: 12,
};

const ringGeometry = new THREE.RingGeometry(
	ringParameters.innerRadius,
	ringParameters.outerRadius,
	ringParameters.thetaSegments,
);
const ring = new THREE.Mesh(ringGeometry, material);
objectPosition(ring, 2, -3);

const ringFolder = gui.addFolder("Ring");
ringFolder
	.add(ringParameters, "innerRadius", 0.5, 10, 0.001)
	.onChange((value) => {
		ring.geometry.dispose(); // Dispose of the old geometry
		ring.geometry = new THREE.RingGeometry(
			value, // New innerRadius
			ringParameters.outerRadius,
			ringParameters.thetaSegments,
		);
	});
ringFolder
	.add(ringParameters, "outerRadius", 0.5, 10, 0.001)
	.onChange((value) => {
		ring.geometry.dispose();
		ring.geometry = new THREE.RingGeometry(
			ringParameters.innerRadius,
			value,
			ringParameters.thetaSegments,
		);
	});
ringFolder.add(ringParameters, "thetaSegments", 4, 40, 1).onChange((value) => {
	ring.geometry.dispose();
	ring.geometry = new THREE.RingGeometry(
		ringParameters.innerRadius,
		ringParameters.outerRadius,
		value,
	);
});

const tetrahedronGeometry = new THREE.TetrahedronGeometry(0.75, 0);
const tetrahedron = new THREE.Mesh(tetrahedronGeometry, material);
objectPosition(tetrahedron, 0, -8);

const tetrahedronFolder = gui.addFolder("Tetrahedron");
tetrahedronFolder.add(tetrahedron.scale, "x", 0.1, 5, 0.001).name("Scale X");
tetrahedronFolder.add(tetrahedron.scale, "y", 0.1, 5, 0.001).name("Scale Y");
tetrahedronFolder.add(tetrahedron.scale, "z", 0.1, 5, 0.001).name("Scale Z");

const torusGeometry = new THREE.TorusGeometry(0.5, 0.25, 6, 24);
const torus = new THREE.Mesh(torusGeometry, material);
objectPosition(torus, 1, -8);

const torusFolder = gui.addFolder("Torus");
torusFolder.add(torus.scale, "x", 0.1, 5, 0.001).name("Scale X");
torusFolder.add(torus.scale, "y", 0.1, 5, 0.001).name("Scale Y");
torusFolder.add(torus.scale, "z", 0.1, 5, 0.001).name("Scale Z");
torusFolder
	.add(torusGeometry.parameters, "radius", 0.5, 5, 0.001)
	.onChange(() => {
		torus.geometry.dispose();
		torus.geometry = new THREE.TorusGeometry(
			torusGeometry.parameters.radius,
			torusGeometry.parameters.tube,
			torusGeometry.parameters.radialSegments,
			torusGeometry.parameters.tubularSegments,
		);
	});
torusFolder
	.add(torusGeometry.parameters, "tube", 0.5, 5, 0.001)
	.onChange(() => {
		torus.geometry.dispose();
		torus.geometry = new THREE.TorusGeometry(
			torusGeometry.parameters.radius,
			torusGeometry.parameters.tube,
			torusGeometry.parameters.radialSegments,
			torusGeometry.parameters.tubularSegments,
		);
	});
torusFolder
	.add(torusGeometry.parameters, "radialSegments", 3, 50, 1)
	.name("Radial Segments")
	.onChange(() => {
		torus.geometry.dispose();
		torus.geometry = new THREE.TorusGeometry(
			torusGeometry.parameters.radius,
			torusGeometry.parameters.tube,
			torusGeometry.parameters.radialSegments,
			torusGeometry.parameters.tubularSegments,
		);
	});
torusFolder
	.add(torusGeometry.parameters, "tubularSegments", 3, 50, 1)
	.name("Tubular Segments")
	.onChange(() => {
		torus.geometry.dispose();
		torus.geometry = new THREE.TorusGeometry(
			torusGeometry.parameters.radius,
			torusGeometry.parameters.tube,
			torusGeometry.parameters.radialSegments,
			torusGeometry.parameters.tubularSegments,
		);
	});

const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.15, 65, 8);
const torusKnot = new THREE.Mesh(torusKnotGeometry, material);
objectPosition(torusKnot, 2, -8);

const torusKnotFolder = gui.addFolder("Torus Knot");
torusKnotFolder.add(torusKnot.scale, "x", 0.25, 5, 0.001).name("Scale X");
torusKnotFolder.add(torusKnot.scale, "y", 0.25, 5, 0.001).name("Scale Y");
torusKnotFolder.add(torusKnot.scale, "z", 0.25, 5, 0.001).name("Scale Z");
torusKnotFolder
	.add(torusKnotGeometry.parameters, "radius", 0.25, 5, 0.001)
	.onChange(() => {
		torusKnot.geometry.dispose();
		torusKnot.geometry = new THREE.TorusKnotGeometry(
			torusKnotGeometry.parameters.radius,
			torusKnotGeometry.parameters.tube,
			torusKnotGeometry.parameters.tubularSegments,
			torusKnotGeometry.parameters.radialSegments,
		);
	});
torusKnotFolder
	.add(torusKnotGeometry.parameters, "tube", 0.25, 5, 0.001)
	.onChange(() => {
		torusKnot.geometry.dispose();
		torusKnot.geometry = new THREE.TorusKnotGeometry(
			torusKnotGeometry.parameters.radius,
			torusKnotGeometry.parameters.tube,
			torusKnotGeometry.parameters.tubularSegments,
			torusKnotGeometry.parameters.radialSegments,
		);
	});
torusKnotFolder
	.add(torusKnotGeometry.parameters, "tubularSegments", 3, 40, 1)
	.name("Tubular Segments")
	.onChange(() => {
		torusKnot.geometry.dispose();
		torusKnot.geometry = new THREE.TorusKnotGeometry(
			torusKnotGeometry.parameters.radius,
			torusKnotGeometry.parameters.tube,
			torusKnotGeometry.parameters.tubularSegments,
			torusKnotGeometry.parameters.radialSegments,
		);
	});
torusKnotFolder
	.add(torusKnotGeometry.parameters, "radialSegments", 3, 40, 1)
	.name("Radial Segments")
	.onChange(() => {
		torusKnot.geometry.dispose();
		torusKnot.geometry = new THREE.TorusKnotGeometry(
			torusKnotGeometry.parameters.radius,
			torusKnotGeometry.parameters.tube,
			torusKnotGeometry.parameters.tubularSegments,
			torusKnotGeometry.parameters.radialSegments,
		);
	});

const shapes = [
	box,
	capsule,
	circle,
	cone,
	cylinder,
	dodecahedron,
	icosahedrone,
	octahedrone,
	ring,
	tetrahedron,
	torus,
	torusKnot,
];

for (const shape of shapes) {
	scene.add(shape);
}

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
