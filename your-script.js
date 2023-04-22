const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(10, 10, 10);
// Adjust the ambient light intensity
const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
scene.add(ambientLight);

// Add a directional light with a softer intensity
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Add one or more spotlights or point lights to highlight specific areas
const spotlight = new THREE.SpotLight(0xffffff, 0.8);
spotlight.position.set(0, 10, 0);
spotlight.angle = Math.PI / 4;
spotlight.penumbra = 0.1;
spotlight.decay = 2;
spotlight.distance = 50;
spotlight.castShadow = true;
scene.add(spotlight);
const loader = new THREE.GLTFLoader();
let currentScene = null;
const availableScenes = [];

loader.load("house.glb", function (gltf) {
  availableScenes.length = 0;
  gltf.scenes.forEach((scene) => availableScenes.push(scene));

  // Load the first scene by default
  loadScene(0);
});

const controls = new THREE.OrbitControls(camera, renderer.domElement);

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
