const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });


renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up camera and controls
camera.position.set(0, 1, 3);

// Add atmospheric lighting to the scene
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000, 6);
scene.add(hemiLight);

// Add ambient lighting to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 3);
scene.add(ambientLight);

// Add directional lighting to the scene
const dirLight = new THREE.DirectionalLight(0xffffff, 11);
dirLight.position.set(50, 100, 20);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

// Enable shadows for objects that receive shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const loader = new THREE.GLTFLoader();
let currentScene = null;
const availableScenes = [];

loader.load(
  "https://interactivehouse.s3.ap-southeast-2.amazonaws.com/house.glb",
  function (gltf) {
    availableScenes.length = 0;
    gltf.scenes.forEach((scene) => availableScenes.push(scene));

    // Load the first scene by default
    loadScene(0);
  }
);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Use post-processing effects to enhance the visual quality
const composer = new THREE.EffectComposer(renderer);
const renderPass = new THREE.RenderPass(scene, camera);
composer.addPass(renderPass);
const bloomPass = new THREE.BloomPass(1.0, 25, 4, 256);
composer.addPass(bloomPass);
const filmPass = new THREE.FilmPass(0.3, 0.05, 1000, false);
filmPass.renderToScreen = true;
composer.addPass(filmPass);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

function loadScene(sceneIndex) {
  if (currentScene) {
    scene.remove(currentScene);
  }

  currentScene = availableScenes[sceneIndex];
  scene.add(currentScene);
}

document
  .getElementById("scene-selector")
  .addEventListener("change", (event) => {
    const sceneIndex = parseInt(event.target.value, 10);
    loadScene(sceneIndex);
  });
