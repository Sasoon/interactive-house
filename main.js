import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const renderer = new THREE.WebGLRenderer();
const camera = new THREE.OrthographicCamera(
  window.innerWidth / -2,
  window.innerWidth / 2,
  window.innerHeight / 2,
  window.innerHeight / -2,
  1,
  1000
);

camera.position.set(0, 0, 10);
camera.zoom = 50;
camera.updateProjectionMatrix();

const controls = new OrbitControls(camera, renderer.domElement);

// Get a reference to the toggle button
const toggleButton = document.getElementById("toggle-ui");

// Get a reference to the controls container
const controlsContainer = document.getElementById("controls-container");

// Add an event listener to the toggle button
toggleButton.addEventListener("click", () => {
  // Toggle the .ui-hidden class on the controls container
  controlsContainer.classList.toggle("ui-hidden");

  // Toggle the .ui-visible class on the controls container
  controlsContainer.classList.toggle("ui-visible");
});

const scene1 = new THREE.Scene();
const scene2 = new THREE.Scene();
const scene3 = new THREE.Scene();

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
// Create three point lights
const pointLight1 = new THREE.PointLight(0xffffff, 0.5);
const pointLight2 = new THREE.PointLight(0xffffff, 0.5);
const pointLight3 = new THREE.PointLight(0xffffff, 0.5);

// Set the position of the point lights
pointLight1.position.set(5, 15, 5);
pointLight2.position.set(-5, 15, 5);
pointLight3.position.set(0, 15, -5);

// Add the point lights to the scene
scene.add(pointLight1);
scene.add(pointLight2);
scene.add(pointLight3);
}

addLights(scene1);
addLights(scene2);
addLights(scene3);

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderConfig({ type: "js" });
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
loader.setDRACOLoader(dracoLoader);

controlsContainer.style.display = "none";
toggleButton.style.display = "none";


loader.load(
  "https://interactivehouse.s3.ap-southeast-2.amazonaws.com/house.glb",
  (gltf) => {
    scene1.add(gltf.scenes[0]);
    scene2.add(gltf.scenes[1]);
    scene3.add(gltf.scenes[2]); 

        // Log the object names
    gltf.scene.traverse((child) => {
      console.log(child.name);
    });

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

    gltf.scenes[2].traverse((child) => {
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

            gltf.scenes[2].traverse((child) => {
        if (child.isLine) {
          child.visible = outlineVisible;
        }
      });
    }

    let outlineVisible = true;

    document
      .getElementById("toggle-outline")
      .addEventListener("click", toggleOutline);

    document.getElementById("loading-bar-container").style.display = "none";

// Show the controls container and toggle button
controlsContainer.style.display = "flex";
toggleButton.style.display = "block";

// Function to toggle the visibility of the object named "beams_2"
function toggleBeamsVisibility(scene) {
  scene.traverse((child) => {
    if (child.name === "beams_2") {
      console.log('ye')
      child.visible = !child.visible;
    }
  });
}

// Get a reference to the toggle beams button
const toggleBeamsButton = document.getElementById("toggle-beams");

// Add an event listener to the toggle beams button
toggleBeamsButton.addEventListener("click", () => {
  toggleBeamsVisibility(scene1);
  toggleBeamsVisibility(scene2);
  toggleBeamsVisibility(scene3);
});


  },
  (xhr) => {
    const percentageLoaded = (xhr.loaded / xhr.total) * 100;
    const progressBar = document.getElementById("progress-bar");
    progressBar.style.width = percentageLoaded + "%";
  },
  (error) => {
    console.error(error);
  }
);

const sceneSelect = document.querySelector("#scene-select");
sceneSelect.addEventListener("change", (event) => {
  const selectedScene = event.target.value;
  currentScene.visible = false;
  if (selectedScene === "0") {
    currentScene = scene1;
  } else if (selectedScene === "1") {
    currentScene = scene2;
  } else {
    currentScene = scene3;
  }
  currentScene.visible = true;
});

function setCameraTopView() {
  camera.position.set(0, 15, 0); // Position the camera above the scene
  camera.lookAt(new THREE.Vector3(0, 0, 0)); // Look at the center of the scene
}

function setCameraFrontView() {
  camera.position.set(0, 1, 15); // Position the camera in front of the scene
  camera.lookAt(new THREE.Vector3(0, 1, 0)); // Look at the center of the scene
}

function setCameraSideView() {
  camera.position.set(15, 1, 0); // Position the camera to the side of the scene
  camera.lookAt(new THREE.Vector3(0, 1, 0)); // Look at the center of the scene
}

// Add event listeners for the buttons
document.getElementById("top-view").addEventListener("click", setCameraTopView);
document
  .getElementById("front-view")
  .addEventListener("click", setCameraFrontView);
document
  .getElementById("side-view")
  .addEventListener("click", setCameraSideView);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(currentScene, camera);
}

animate();
document.body.appendChild(renderer.domElement);
