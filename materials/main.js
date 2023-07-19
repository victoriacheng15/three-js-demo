import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";
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
  5000,
);

camera.position.set(0, 5, 12);
scene.add(camera);

const light = new THREE.DirectionalLight(0xfdf4dc, 1);
const directionalHelper = new THREE.DirectionalLightHelper(light, 1);
scene.add(directionalHelper);
light.position.set(1, 5, 8);
scene.add(light);
gui.add(light, "visible").name("Llight on/off");
gui.add(light, "intensity", 0, 5, 0.001).name("Light intensity");
gui.add(light.position, "x", -10, 10, 0.001).name("Light x position");
gui.add(light.position, "y", -10, 10, 0.001).name("Light y position");
gui.add(light.position, "z", -10, 10, 0.001).name("Light z position");

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, canvas);

function mesh(geometry, material) {
  return new THREE.Mesh(geometry, material);
}

const sphere = new THREE.SphereGeometry(1, 32, 16);

const material1 = new THREE.MeshBasicMaterial({ color: 0x1ea8fc });

const material2 = new THREE.MeshDepthMaterial();

const material3 = new THREE.MeshLambertMaterial({ color: 0x1ea8fc });

const matcapTexture = new THREE.TextureLoader().load(
  "./images/3E2335_D36A1B_8E4A2E_2842A5-512px.png",
);
const material4 = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
console.log(material4);

const material5 = new THREE.MeshNormalMaterial();

const material6 = new THREE.MeshPhongMaterial({ color: 0x1ea8fc });

const material7 = new THREE.MeshPhysicalMaterial({ color: 0x1ea8fc });

const material8 = new THREE.MeshToonMaterial({ color: 0x1ea8fc });

const basic = mesh(sphere, material1);
basic.position.set(-5, 1.5, 0);

const depth = mesh(sphere, material2);
depth.position.set(-1.5, 1.5, 0);

const lambert = mesh(sphere, material3);
lambert.position.set(1.5, 1.5, 0);

const matcap = mesh(sphere, material4);
matcap.position.set(5, 1.5, 0);

const normal = mesh(sphere, material5);
normal.position.set(-5, -1.5, 0);

const phong = mesh(sphere, material6);
phong.position.set(-1.5, -1.5, 0);

const toon = mesh(sphere, material7);
toon.position.set(1.5, -1.5, 0);

const physical = mesh(sphere, material8);
physical.position.set(5, -1.5, 0);

const materials = [
  basic,
  depth,
  lambert,
  matcap,
  normal,
  phong,
  toon,
  physical,
];

for (const material of materials) {
  scene.add(material);
}

const tick = () => {
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
