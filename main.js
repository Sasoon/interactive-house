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

  // Hemisphere light
  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 5);
  hemisphereLight.position.set(0, 20, 0);
  scene.add(hemisphereLight);
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
loader.load('https://interactivehouse.s3.ap-southeast-2.amazonaws.com/house.glb', (gltf) => {
    scene1.add(gltf.scenes[0]); // Add the first scene from the GLTF file to the first THREE.Scene object
    scene2.add(gltf.scenes[1]); // Add the second scene from the GLTF file to the second THREE.Scene object
}, (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
}, (error) => {
    console.error(error);
});

// Get a reference to the select element
const sceneSelect = document.querySelector('#scene-select');

// Listen for the change event on the select element
sceneSelect.addEventListener('change', (event) => {
  const selectedScene = event.target.value;
  switch (selectedScene) {
    case '0':
      // Show scene 1 and hide other scenes
      currentScene.visible = false;
      currentScene = scene1;
      currentScene.visible = true;
      console.log('scene 1')
      break;
    case '1':
      // Show scene 2 and hide other scenes
      currentScene.visible = false;
      currentScene = scene2;
      currentScene.visible = true;
      console.log('scene 2')
      break;
    // ...
    default:
      break;
  }
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(currentScene, camera);
}
animate();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
