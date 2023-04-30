import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const controls = new OrbitControls(camera, renderer.domElement);

const scene1 = new THREE.Scene();
const scene2 = new THREE.Scene();

let currentScene = scene1;

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.useLegacyLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

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

camera.position.set(0, 1, 3);

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderConfig({ type: 'js' });
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
loader.setDRACOLoader(dracoLoader);

loader.load('https://interactivehouse.s3.ap-southeast-2.amazonaws.com/house.glb', (gltf) => {
  scene1.add(gltf.scenes[0]);
  scene2.add(gltf.scenes[1]);

  const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x00000 });

  gltf.scenes[0].traverse((child) => {
    if (child.isMesh) {
      const edgesGeometry = new THREE.EdgesGeometry(child.geometry, 1);
      const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
      child.add(edges);
    }
  });

  gltf.scenes[1].traverse((child) => {
    if (child.isMesh) {
      const edgesGeometry = new THREE.EdgesGeometry(child.geometry, 1);
      const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
      child.add(edges);
    }
  });

  function toggleOutline() {
  outlineVisible = !outlineVisible;

  gltf.scenes[0].traverse((child) => {
    if (child.isLine) {
      child.visible = outlineVisible;
    }
  });

  gltf.scenes[1].traverse((child) => {
    if (child.isLine) {
      child.visible = outlineVisible;
    }
  });
}

let outlineVisible = true;



document.getElementById('toggle-outline').addEventListener('click', toggleOutline);

  document.getElementById('loading-bar-container').style.display = 'none';
}, (xhr) => {
  const percentageLoaded = (xhr.loaded / xhr.total * 100);
  const progressBar = document.getElementById('progress-bar');
  progressBar.style.width = percentageLoaded + '%';
}, (error) => {
  console.error(error);
});

const sceneSelect = document.querySelector('#scene-select');
sceneSelect.addEventListener('change', (event) => {
  const selectedScene = event.target.value;
  currentScene.visible = false;
  currentScene = selectedScene === '0' ? scene1 : scene2;
  currentScene.visible = true;
});

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
