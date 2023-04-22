const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(10, 10, 10);

const ambientLight = new THREE.AmbientLight(0x404040, 1.0);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

const loader = new THREE.GLTFLoader();
let currentScene = null;
const availableScenes = [];

loader.load('house.glb', function (gltf) {
  availableScenes.length = 0;
  gltf.scenes.forEach((scene) => availableScenes.push(scene));

  // Load the first scene by default
  loadScene(0);
});

const controls = new THREE.PointerLockControls(camera, document.body);

function animate() {
  const delta = clock.getDelta();

  velocity.copy(moveForward).add(moveRight).normalize().multiplyScalar(speed * delta);
  controls.moveRight(velocity.x);
  controls.moveForward(velocity.z);

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

document.getElementById('scene-selector').addEventListener('change', (event) => {
  const sceneIndex = parseInt(event.target.value, 10);
  loadScene(sceneIndex);
});

renderer.domElement.addEventListener('click', () => {
  controls.lock();
});

controls.addEventListener('lock', () => {
  // Hide any UI elements when pointer lock is enabled
});

controls.addEventListener('unlock', () => {
  // Show any UI elements when pointer lock is disabled
});

const moveForward = new THREE.Vector3();
const moveRight = new THREE.Vector3();
const velocity = new THREE.Vector3();
const speed = 5;
const clock = new THREE.Clock();

document.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyW':
      moveForward.set(1, 0, 0);
      break;
    case 'KeyS':
      moveForward.set(-1, 0, 0);
      break;
    case 'KeyA':
      moveRight.set(0, 0, 1);
      break;
    case 'KeyD':
      moveRight.set(0, 0, -1);
      break;
  }
});

document.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'KeyW':
    case 'KeyS':
      moveForward.set(0, 0, 0);
      break;
    case 'KeyA':
    case 'KeyD':
      moveRight.set(0, 0, 0);
      break;
  }
});
