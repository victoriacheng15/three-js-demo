import * as THREE from "three"
import GUI from 'lil-gui';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

const gui = new GUI();

const canvas = document.querySelector("canvas")
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x21272e)

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

camera.position.set(0, 0, 3);
scene.add(camera);

const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(1, 1, 1).normalize();
// const lightHelper = new THREE.DirectionalLightHelper(light, 0.5);
scene.add(light);
// scene.add(lightHelper)

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, canvas);

const colorParameters = {
  string: "#1ea8fc"
}

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({ color: colorParameters.string })
const box = new THREE.Mesh(boxGeometry, boxMaterial)
scene.add(box)

gui.add(boxMaterial, "wireframe")
gui.add(light, "visible").name("light intensity")
gui.add(light, "intensity").min(0).max(10).step(0.001).name("")
gui.addColor(colorParameters, "string").onChange(() => {
  boxMaterial.color.set(colorParameters.string)
}).name("color")

const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  // update controls
  controls.update();

  box.rotation.x = elapsedTime * 0.1
  box.rotation.y = elapsedTime * 0.1
  box.rotation.z = elapsedTime * 0.1

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
