import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const controls = new OrbitControls(camera, renderer.domElement);


// Define your scenes
const scene1 = new THREE.Scene();
addLighting(scene1);
const scene2 = new THREE.Scene();
addLighting(scene2);

let currentScene = scene1; // Set default scene

function addLighting(scene) {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 3);
  scene.add(ambientLight);

  // Directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 7);
  directionalLight.position.set(0, 10, 0);
  scene.add(directionalLight);
}

// Enable shadows for objects that receive shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Set up camera and controls
camera.position.set(0, 1, 3);

// Load GLB model
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderConfig({ type: 'js' });
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
loader.setDRACOLoader( dracoLoader ); // Pass the DRACOLoader instance to the GLTFLoader




// ... Your other imports and setup code ...

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

// ... The rest of your code ...




const sceneSelect = document.querySelector('#scene-select');
sceneSelect.addEventListener('change', (event) => {
  const selectedScene = event.target.value;
  currentScene.visible = false;
  currentScene = selectedScene === '0' ? scene1 : scene2;
  currentScene.visible = true;
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(currentScene, camera);
}
animate();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
