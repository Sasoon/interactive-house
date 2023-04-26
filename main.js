import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const controls = new OrbitControls(camera, renderer.domElement);

// Define your scenes
const scene1 = new THREE.Scene();
const scene2 = new THREE.Scene();

let currentScene = scene1; // Set default scene

// Enable shadows for objects that receive shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.useLegacyLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;

// Set up the renderer with tone mapping
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0; // Adjust this value to control the exposure
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Add lighting
function addLights(scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(5, 10, 5);
  directionalLight.target.position.set(0, 0, 0);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 512;
  directionalLight.shadow.mapSize.height = 512;
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 50;
  scene.add(directionalLight);
  scene.add(directionalLight.target);
}

addLights(scene1);
addLights(scene2);

// Set up camera and controls
camera.position.set(0, 1, 3);

// Load GLB model
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderConfig({ type: 'js' });
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
loader.setDRACOLoader(dracoLoader); // Pass the DRACOLoader instance to the GLTFLoader

loader.load('https://interactivehouse.s3.ap-southeast-2.amazonaws.com/house.glb', (gltf) => {
  scene1.add(gltf.scenes[0]); // Add the first child of the root object to the scene
  scene2.add(gltf.scenes[1]); // Add the second child of the root object to the scene
  
  // Hide the loading bar after loading is complete
  document.getElementById('loading-bar-container').style.display = 'none';
}, (xhr) => {
  // Calculate the percentage loaded
  const percentageLoaded = (xhr.loaded / xhr.total * 100);

  // Update the progress bar width
  const progressBar = document.getElementById('progress-bar');
  progressBar.style.width = percentageLoaded + '%';
}, (error) => {
  console.error(error);
});

const sceneSelect = document.querySelector('#scene-select');
sceneSelect.addEventListener('change', handleSceneChange);

function handleSceneChange(event) {
  const selectedScene = event.target.value;
  currentScene.visible = false;
  currentScene = selectedScene === '0' ? scene1 : scene2;
  currentScene.visible = true;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(currentScene, camera);
}

animate();
document.body.appendChild(renderer.domElement);
