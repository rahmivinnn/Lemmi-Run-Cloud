import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { WalletConnector } from './CardanoWallet';

interface Character {
  id: string;
  name: string;
  image: string;
  description: string;
  stats: {
    speed: number;
    jump: number;
    special: number;
  };
}

interface Game3DRunnerProps {
  character: Character;
  onGameEnd: (score: number) => void;
  onBack: () => void;
}

export function Game3DRunner({ character, onGameEnd, onBack }: Game3DRunnerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<any>(null);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x001122, 30, 200);
    
    // Skybox/Background
    const skyboxGeometry = new THREE.SphereGeometry(500, 32, 32);
    const skyboxMaterial = new THREE.MeshBasicMaterial({
      color: 0x001122,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.8
    });
    const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    scene.add(skybox);

    const camera = new THREE.PerspectiveCamera(60, 800 / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: false, // Disable for better performance
      powerPreference: "high-performance"
    });
    renderer.setSize(800, 400);
    renderer.setClearColor(0x000011);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap; // Use basic shadows for performance
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio

    mountRef.current.appendChild(renderer.domElement);

    // Enhanced lighting system for maximum character visibility
    const ambientLight = new THREE.AmbientLight(0x808080, 2.0); // Very bright ambient light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0); // Very bright directional light
    directionalLight.position.set(0, 20, 10); // Position above and behind character
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 512;
    directionalLight.shadow.mapSize.height = 512;
    directionalLight.shadow.camera.left = -30;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.bottom = -30;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);

    // Additional front light to illuminate character from camera direction
    const frontLight = new THREE.DirectionalLight(0xffffff, 1.0);
    frontLight.position.set(-15, 5, 0); // Light from camera direction (behind character on X axis)
    scene.add(frontLight);

    // Multiple point lights for better atmosphere
    const pointLight1 = new THREE.PointLight(0x00aaff, 0.8, 30);
    pointLight1.position.set(0, 8, 0);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xffaa00, 0.6, 25);
    pointLight2.position.set(-10, 6, -5);
    scene.add(pointLight2);
    
    const pointLight3 = new THREE.PointLight(0xaa00ff, 0.6, 25);
    pointLight3.position.set(10, 6, 5);
    scene.add(pointLight3);

    // Enhanced Road System - More visible and realistic
    const roadGeometry = new THREE.PlaneGeometry(1000, 12); // Road width
    const roadMaterial = new THREE.MeshLambertMaterial({
      color: 0x2a2a2a, // Dark asphalt color
      transparent: false
    });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.y = -1.95;
    scene.add(road);

    // Road side areas (grass/ground)
    const sideGeometry = new THREE.PlaneGeometry(1000, 100);
    const sideMaterial = new THREE.MeshLambertMaterial({
      color: 0x1a3a1a, // Dark green for grass
      transparent: false
    });
    const leftSide = new THREE.Mesh(sideGeometry, sideMaterial);
    leftSide.rotation.x = -Math.PI / 2;
    leftSide.position.set(0, -2, -56);
    scene.add(leftSide);
    
    const rightSide = new THREE.Mesh(sideGeometry, sideMaterial);
    rightSide.rotation.x = -Math.PI / 2;
    rightSide.position.set(0, -2, 56);
    scene.add(rightSide);

    // Road center line (yellow dashed)
    for (let i = -500; i < 500; i += 8) {
      const centerLineGeometry = new THREE.BoxGeometry(4, 0.05, 0.3);
      const centerLineMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffff00,
        emissive: 0x444400
      });
      const centerLine = new THREE.Mesh(centerLineGeometry, centerLineMaterial);
      centerLine.position.set(i, -1.9, 0);
      scene.add(centerLine);
    }

    // Road edge lines (white solid lines)
    const edgeLineGeometry = new THREE.BoxGeometry(1000, 0.05, 0.2);
    const edgeLineMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      emissive: 0x222222
    });
    
    const leftEdgeLine = new THREE.Mesh(edgeLineGeometry, edgeLineMaterial);
    leftEdgeLine.position.set(0, -1.9, -6);
    scene.add(leftEdgeLine);
    
    const rightEdgeLine = new THREE.Mesh(edgeLineGeometry, edgeLineMaterial);
    rightEdgeLine.position.set(0, -1.9, 6);
    scene.add(rightEdgeLine);
    
    // Lane divider lines (white dashed)
    for (let i = -500; i < 500; i += 6) {
      const leftLaneGeometry = new THREE.BoxGeometry(3, 0.05, 0.15);
      const rightLaneGeometry = new THREE.BoxGeometry(3, 0.05, 0.15);
      const laneLineMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        emissive: 0x111111
      });
      
      const leftLaneLine = new THREE.Mesh(leftLaneGeometry, laneLineMaterial);
      leftLaneLine.position.set(i, -1.9, -3);
      scene.add(leftLaneLine);
      
      const rightLaneLine = new THREE.Mesh(rightLaneGeometry, laneLineMaterial);
      rightLaneLine.position.set(i, -1.9, 3);
      scene.add(rightLaneLine);
    }
    
    // Road barriers (guardrails)
    const barrierGeometry = new THREE.BoxGeometry(1000, 0.8, 0.3);
    const barrierMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x888888,
      emissive: 0x111111
    });
    
    const leftBarrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
    leftBarrier.position.set(0, -1.2, -8);
    scene.add(leftBarrier);
    
    const rightBarrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
    rightBarrier.position.set(0, -1.2, 8);
    scene.add(rightBarrier);

    // Realistic Citylight Background
    const createBuilding = (width: number, height: number, depth: number, x: number, z: number) => {
      const buildingGroup = new THREE.Group();
      
      // Main building structure
      const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
      const buildingMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x2a2a2a,
        transparent: true,
        opacity: 0.9
      });
      const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
      building.position.y = height / 2 - 2;
      buildingGroup.add(building);
      
      // Add windows with lights
      const windowSize = 0.8;
      const windowSpacing = 2;
      const floorsCount = Math.floor(height / 3);
      const windowsPerFloor = Math.floor(width / windowSpacing);
      
      for (let floor = 0; floor < floorsCount; floor++) {
        for (let window = 0; window < windowsPerFloor; window++) {
          if (Math.random() > 0.3) { // 70% chance of light being on
            const windowGeometry = new THREE.PlaneGeometry(windowSize, windowSize);
            const windowMaterial = new THREE.MeshBasicMaterial({ 
              color: Math.random() > 0.5 ? 0xffff88 : 0x88aaff,
              transparent: true,
              opacity: 0.8
            });
            const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
            
            windowMesh.position.x = (window - windowsPerFloor/2) * windowSpacing;
            windowMesh.position.y = (floor * 3) + 1 - 2;
            windowMesh.position.z = depth/2 + 0.01;
            
            buildingGroup.add(windowMesh);
            
            // Add window light glow
            const windowLight = new THREE.PointLight(
              Math.random() > 0.5 ? 0xffff88 : 0x88aaff, 
              0.2, 
              5
            );
            windowLight.position.copy(windowMesh.position);
            windowLight.position.z += 1;
            buildingGroup.add(windowLight);
          }
        }
      }
      
      buildingGroup.position.set(x, 0, z);
      return buildingGroup;
    };
    
    // Left side cityscape
    for (let i = 0; i < 8; i++) {
      const height = 15 + Math.random() * 25;
      const width = 8 + Math.random() * 6;
      const depth = 6 + Math.random() * 4;
      const x = -50 - Math.random() * 100;
      const z = -20 - i * 15;
      
      const building = createBuilding(width, height, depth, x, z);
      scene.add(building);
    }
    
    // Right side cityscape
    for (let i = 0; i < 8; i++) {
      const height = 15 + Math.random() * 25;
      const width = 8 + Math.random() * 6;
      const depth = 6 + Math.random() * 4;
      const x = 30 + Math.random() * 50; // Moved closer to be visible
      const z = -20 - i * 15;
      
      const building = createBuilding(width, height, depth, x, z);
      scene.add(building);
    }
    
    // Background buildings (further away)
    for (let i = 0; i < 12; i++) {
      const height = 20 + Math.random() * 30;
      const width = 10 + Math.random() * 8;
      const depth = 8 + Math.random() * 6;
      const x = -200 + Math.random() * 400;
      const z = -200 - Math.random() * 100;
      
      const building = createBuilding(width, height, depth, x, z);
      building.scale.setScalar(0.7); // Make background buildings smaller
      scene.add(building);
    }

    // Model configurations for each character
    const MODEL_CONFIGS = {
      ashina: {
        modelPath: '/3D Model/King lemmi/base.obj',
        textures: {
          diffuse: '/3D Model/King lemmi/texture_diffuse.png',
          normal: '/3D Model/King lemmi/texture_normal.png',
          metallic: '/3D Model/King lemmi/texture_metallic.png',
          roughness: '/3D Model/King lemmi/texture_roughness.png',
          pbr: '/3D Model/King lemmi/texture_pbr.png'
        },
        color: '#00ff88'
      },
      cowboy: {
        modelPath: '/3D Model/cowboy gerbil/base.obj',
        textures: {
          diffuse: '/3D Model/cowboy gerbil/texture_diffuse.png',
          normal: '/3D Model/cowboy gerbil/texture_normal.png',
          metallic: '/3D Model/cowboy gerbil/texture_metallic.png',
          roughness: '/3D Model/cowboy gerbil/texture_roughness.png',
          pbr: '/3D Model/cowboy gerbil/texture_pbr.png'
        },
        color: '#ff6600'
      },
      grim: {
        modelPath: '/3D Model/grim reaper/base.obj',
        textures: {
          diffuse: '/3D Model/grim reaper/texture_diffuse.png',
          normal: '/3D Model/grim reaper/texture_normal.png',
          metallic: '/3D Model/grim reaper/texture_metallic.png',
          roughness: '/3D Model/grim reaper/texture_roughness.png',
          pbr: '/3D Model/grim reaper/texture_pbr.png'
        },
        color: '#8800ff'
      },
      snow: {
        modelPath: '/3D Model/snow gerbil/base.obj',
        textures: {
          diffuse: '/3D Model/snow gerbil/texture_diffuse.png',
          normal: '/3D Model/snow gerbil/texture_normal.png',
          metallic: '/3D Model/snow gerbil/texture_metallic.png',
          roughness: '/3D Model/snow gerbil/texture_roughness.png',
          pbr: '/3D Model/snow gerbil/texture_pbr.png'
        },
        color: '#ff0088'
      }
    };

    // Character (player) - Load OBJ model with PBR textures
    const characterGroup = new THREE.Group();
    let characterModel: THREE.Object3D | null = null;
    
    // Get character configuration
    const characterId = character.id as keyof typeof MODEL_CONFIGS;
    const config = MODEL_CONFIGS[characterId];
    
    console.log(`Loading character: ${character.name} (ID: ${character.id})`);
    
    // Force fallback character for now to ensure visibility
    createFallbackCharacter();
    
    if (false && config) { // Temporarily disabled 3D model loading
      // Load character model
      const objLoader = new OBJLoader();
      const textureLoader = new THREE.TextureLoader();
      
      // Load textures
      const diffuseTexture = textureLoader.load(config.textures.diffuse);
      const normalTexture = textureLoader.load(config.textures.normal);
      const metallicTexture = textureLoader.load(config.textures.metallic);
      const roughnessTexture = textureLoader.load(config.textures.roughness);
      
      // Create PBR material
      const material = new THREE.MeshStandardMaterial({
        map: diffuseTexture,
        normalMap: normalTexture,
        metalnessMap: metallicTexture,
        roughnessMap: roughnessTexture,
        metalness: 0.5,
        roughness: 0.5
      });
      
      objLoader.load(config.modelPath, (model) => {
        characterModel = model;
        
        // Apply material to all meshes
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = material;
            child.castShadow = true;
            child.receiveShadow = true;
            child.frustumCulled = true;
            
            // Optimize geometry
            if (child.geometry) {
              child.geometry.computeBoundingSphere();
              child.geometry.computeBoundingBox();
            }
          }
        });
        
        // Scale and position the character
         model.scale.setScalar(0.5);
         model.position.set(0, 0, 0); // Position relative to characterGroup
         model.rotation.y = Math.PI / 2; // Rotate 90 degrees to face forward
        
        characterGroup.add(model);
        console.log(`${character.name} model loaded successfully`);
      }, (progress) => {
        if (progress.total > 0) {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          if (percent % 25 === 0) {
            console.log(`Loading ${character.name}:`, percent + '%');
          }
        }
      }, (error) => {
        console.error(`Error loading ${character.name} model:`, error);
        createFallbackCharacter();
      });
    }
    
    // Fallback character function
    function createFallbackCharacter() {
      const characterId = character.id as keyof typeof MODEL_CONFIGS;
      const config = MODEL_CONFIGS[characterId];
      const fallbackColor = config ? config.color : '#ff6600';
      
      // Create fallback character with more detailed and visible geometry
      const bodyGeometry = new THREE.BoxGeometry(0.8, 1.6, 0.5);
      const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
      const limbGeometry = new THREE.CylinderGeometry(0.12, 0.12, 1.0, 8);
      
      // Create materials with very bright colors and strong emissive properties
      const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color(0x4169E1), // Royal blue
        emissive: new THREE.Color(0x002288),
        emissiveIntensity: 0.8, // Much brighter
        shininess: 100
      });
      const headMaterial = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color(0xffdbac), // Skin color
        emissive: new THREE.Color(0x664422),
        emissiveIntensity: 0.6, // Much brighter
        shininess: 100
      });
      const limbMaterial = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color(0x8B4513), // Brown
        emissive: new THREE.Color(0x442200),
        emissiveIntensity: 0.6, // Much brighter
        shininess: 100
      });

      // Create body parts
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.set(0, 0, 0);
      body.castShadow = true;
      characterGroup.add(body);

      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.set(0, 1.2, 0);
      head.castShadow = true;
      characterGroup.add(head);

      // Arms
      const leftArm = new THREE.Mesh(limbGeometry, limbMaterial);
      leftArm.position.set(-0.6, 0.3, 0);
      leftArm.rotation.z = Math.PI / 6;
      leftArm.castShadow = true;
      characterGroup.add(leftArm);

      const rightArm = new THREE.Mesh(limbGeometry, limbMaterial);
      rightArm.position.set(0.6, 0.3, 0);
      rightArm.rotation.z = -Math.PI / 6;
      rightArm.castShadow = true;
      characterGroup.add(rightArm);

      // Legs
      const leftLeg = new THREE.Mesh(limbGeometry, limbMaterial);
      leftLeg.position.set(-0.25, -1.3, 0);
      leftLeg.castShadow = true;
      characterGroup.add(leftLeg);

      const rightLeg = new THREE.Mesh(limbGeometry, limbMaterial);
      rightLeg.position.set(0.25, -1.3, 0);
      rightLeg.castShadow = true;
      characterGroup.add(rightLeg);

      // Add bright glow effect for better visibility
       const glowGeometry = new THREE.SphereGeometry(0.15, 8, 8);
       const glowMaterial = new THREE.MeshBasicMaterial({ 
         color: 0x00ffff, 
         transparent: true, 
         opacity: 0.8,
         emissive: 0x00ffff,
         emissiveIntensity: 1.0
       });
       const glowEffect = new THREE.Mesh(glowGeometry, glowMaterial);
       glowEffect.position.set(0, 1.2, 0); // Position at head level
       characterGroup.add(glowEffect);
       
       // Add outline effect for better character definition
       const outlineGeometry = new THREE.SphereGeometry(1.2, 16, 16);
       const outlineMaterial = new THREE.MeshBasicMaterial({ 
         color: 0xffffff, 
         transparent: true, 
         opacity: 0.1,
         side: THREE.BackSide
       });
       const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
       outline.position.set(0, 0, 0);
       characterGroup.add(outline);
      
      console.log(`Using enhanced fallback character for ${character.name} with improved visibility`);
    }
    
    characterGroup.position.set(0, -1.5, 0); // Position character on road surface
    characterGroup.castShadow = true;
    scene.add(characterGroup);

    // Camera position - behind character for better visibility (runner 3D style)
    camera.position.set(-8, 4, 0); // Position camera behind character on X axis
    camera.lookAt(0, 0, 0); // Look at character center
    
    // Set camera field of view for better perspective
    camera.fov = 75;
    camera.updateProjectionMatrix();
    
    console.log('Camera position:', camera.position);
    console.log('Character group position:', characterGroup.position);
    console.log('Character group children count:', characterGroup.children.length);

    // Game state
    const game = {
      player: {
        mesh: characterGroup,
        // No jumping mechanics
        speed: character.stats.speed * 0.1,
        runAnimation: 0,
        targetLane: 0, // -1 = left, 0 = center, 1 = right
        currentLane: 0,
        laneWidth: 3,
        forwardSpeed: 0, // Speed for forward/backward movement
        maxForwardSpeed: 0.3
      },
      obstacles: [] as THREE.Mesh[],
      coins: [] as THREE.Mesh[],
      gameSpeed: 0.1 + (character.stats.speed * 0.02),
      score: 0,
      lastObstacle: 0,
      lastCoin: 0,
      worldOffset: 0
    };

    gameRef.current = game;

    // Professional realistic obstacle creation
    const createObstacle = () => {
      const obstacleType = Math.random();
      const obstacleGroup = new THREE.Group();
      
      if (obstacleType < 0.4) {
        // Futuristic Car
        const carBody = new THREE.BoxGeometry(4, 1.2, 2);
        const carMaterial = new THREE.MeshLambertMaterial({ 
          color: Math.random() > 0.5 ? 0x2244ff : 0xff4422,
          transparent: true,
          opacity: 0.9,
          emissive: 0x111111
        });
        const car = new THREE.Mesh(carBody, carMaterial);
        car.position.y = 0.6;
        obstacleGroup.add(car);
        
        // Car windows
        const windowGeometry = new THREE.BoxGeometry(3.5, 0.8, 1.8);
        const windowMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x001133,
          transparent: true,
          opacity: 0.7
        });
        const windows = new THREE.Mesh(windowGeometry, windowMaterial);
        windows.position.y = 1.4;
        obstacleGroup.add(windows);
        
        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 8);
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 });
        
        const wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel1.position.set(-1.2, 0.4, -1.2);
        wheel1.rotation.z = Math.PI / 2;
        obstacleGroup.add(wheel1);
        
        const wheel2 = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel2.position.set(1.2, 0.4, -1.2);
        wheel2.rotation.z = Math.PI / 2;
        obstacleGroup.add(wheel2);
        
        const wheel3 = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel3.position.set(-1.2, 0.4, 1.2);
        wheel3.rotation.z = Math.PI / 2;
        obstacleGroup.add(wheel3);
        
        const wheel4 = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel4.position.set(1.2, 0.4, 1.2);
        wheel4.rotation.z = Math.PI / 2;
        obstacleGroup.add(wheel4);
        
        // Headlights
        const lightGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        const lightMaterial = new THREE.MeshBasicMaterial({ 
          color: 0xffffff,
          emissive: 0xffffff,
          emissiveIntensity: 0.5
        });
        
        const light1 = new THREE.Mesh(lightGeometry, lightMaterial);
        light1.position.set(-1.5, 0.8, -1.1);
        obstacleGroup.add(light1);
        
        const light2 = new THREE.Mesh(lightGeometry, lightMaterial);
        light2.position.set(1.5, 0.8, -1.1);
        obstacleGroup.add(light2);
        
      } else if (obstacleType < 0.7) {
        // Delivery Truck
        const truckBody = new THREE.BoxGeometry(6, 2.5, 2.5);
        const truckMaterial = new THREE.MeshLambertMaterial({ 
          color: 0x666666,
          transparent: true,
          opacity: 0.9
        });
        const truck = new THREE.Mesh(truckBody, truckMaterial);
        truck.position.y = 1.25;
        obstacleGroup.add(truck);
        
        // Truck cabin
        const cabinGeometry = new THREE.BoxGeometry(2, 2, 2.5);
        const cabinMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });
        const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
        cabin.position.set(-2.5, 1.25, 0);
        obstacleGroup.add(cabin);
        
        // Truck wheels
        const truckWheelGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 8);
        const truckWheelMaterial = new THREE.MeshLambertMaterial({ color: 0x111111 });
        
        for (let i = 0; i < 6; i++) {
          const wheel = new THREE.Mesh(truckWheelGeometry, truckWheelMaterial);
          wheel.position.set(-2 + i * 1.2, 0.6, i % 2 === 0 ? -1.5 : 1.5);
          wheel.rotation.z = Math.PI / 2;
          obstacleGroup.add(wheel);
        }
        
      } else {
        // Hover Drone
        const droneBody = new THREE.SphereGeometry(1, 12, 8);
        const droneMaterial = new THREE.MeshLambertMaterial({ 
          color: 0x00ff88,
          transparent: true,
          opacity: 0.8,
          emissive: 0x002244
        });
        const drone = new THREE.Mesh(droneBody, droneMaterial);
        drone.position.y = 2;
        obstacleGroup.add(drone);
        
        // Drone propellers
        const propellerGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 6);
        const propellerMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x888888,
          transparent: true,
          opacity: 0.6
        });
        
        const propeller1 = new THREE.Mesh(propellerGeometry, propellerMaterial);
        propeller1.position.set(-1.2, 2.8, -1.2);
        obstacleGroup.add(propeller1);
        
        const propeller2 = new THREE.Mesh(propellerGeometry, propellerMaterial);
        propeller2.position.set(1.2, 2.8, -1.2);
        obstacleGroup.add(propeller2);
        
        const propeller3 = new THREE.Mesh(propellerGeometry, propellerMaterial);
        propeller3.position.set(-1.2, 2.8, 1.2);
        obstacleGroup.add(propeller3);
        
        const propeller4 = new THREE.Mesh(propellerGeometry, propellerMaterial);
        propeller4.position.set(1.2, 2.8, 1.2);
        obstacleGroup.add(propeller4);
        
        // Drone lights
        const droneLightGeometry = new THREE.SphereGeometry(0.15, 6, 6);
        const droneLightMaterial = new THREE.MeshBasicMaterial({ 
          color: 0xff0000,
          emissive: 0xff0000,
          emissiveIntensity: 0.8
        });
        
        const droneLight = new THREE.Mesh(droneLightGeometry, droneLightMaterial);
        droneLight.position.y = 2;
        obstacleGroup.add(droneLight);
      }
      
      // Position obstacle in lane
      const lanes = [-6, -2, 2, 6];
      const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
      obstacleGroup.position.set(game.player.mesh.position.x + 20, 0, randomLane);
      
      scene.add(obstacleGroup);
      game.obstacles.push(obstacleGroup as any);
    };

    // Enhanced coin creation with glow effect - Optimized for performance
    const createCoin = () => {
      const coinGroup = new THREE.Group();
      
      // Main coin
      const coinGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 6); // Reduced segments
      const coinMaterial = new THREE.MeshBasicMaterial({ // Use basic material
        color: 0xffdd00,
        transparent: true,
        opacity: 0.9
      });
      const coin = new THREE.Mesh(coinGeometry, coinMaterial);
      coinGroup.add(coin);
      
      // Glow ring
      const glowGeometry = new THREE.RingGeometry(0.45, 0.65, 8); // Reduced segments
      const glowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffff44,
        transparent: true,
        opacity: 0.2, // Reduced opacity
        side: THREE.DoubleSide
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.rotation.x = -Math.PI / 2;
      coinGroup.add(glow);
      
      // Position coins at proper height and in lanes
      const lanes = [-3, 0, 3]; // Left, center, right lanes
      const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
      coinGroup.position.set(game.player.mesh.position.x + 25, 1.2, randomLane); // Proper height above ground
      coinGroup.castShadow = false; // Disable shadows for performance
      scene.add(coinGroup);
      game.coins.push(coinGroup);
    };

    // Game loop with performance optimization
    let lastTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;
    
    const animate = (currentTime: number = 0) => {
      requestAnimationFrame(animate);
      
      // Frame rate limiting
      if (currentTime - lastTime < frameInterval) {
        return;
      }
      lastTime = currentTime;

      if (!gameActive || gameOver) {
        renderer.render(scene, camera);
        return;
      }

      // Keep character on road surface
      game.player.mesh.position.y = -1.5;
      
      // Character walking animation
      game.player.runAnimation += 0.15;
      
      // Animate character model if it exists
      if (characterModel) {
        // Simple bobbing animation for the whole character
        characterModel.position.y = Math.sin(game.player.runAnimation * 2) * 0.05;
        
        // Slight rotation for walking effect
        characterModel.rotation.z = Math.sin(game.player.runAnimation) * 0.02;
        
        // Forward lean when moving
        if (Math.abs(game.player.forwardSpeed) > 0.01) {
          characterModel.rotation.x = game.player.forwardSpeed * 0.3;
        } else {
          characterModel.rotation.x *= 0.95; // Gradually return to upright
        }
      }
      
      // Animate fallback character if using simple geometry
      if (characterGroup.children.length > 2 && !characterModel) {
        const body = characterGroup.children[0];
        const head = characterGroup.children[1];
        const leftArm = characterGroup.children[2];
        const rightArm = characterGroup.children[3];
        const leftLeg = characterGroup.children[4];
         const rightLeg = characterGroup.children[5];
         const glow = characterGroup.children[6];
        
        // Enhanced running animation
        const bobOffset = Math.sin(game.player.runAnimation * 4) * 0.1;
        const runTime = game.player.runAnimation;
        
        // Body movement with running lean
        body.position.y = 0 + bobOffset;
        body.rotation.z = Math.sin(runTime * 4) * 0.05;
        body.rotation.x = Math.abs(game.player.forwardSpeed) * 0.3; // Lean forward when moving
        
        // Head movement - more dynamic
        head.position.y = 1.2 + bobOffset * 0.8;
        head.rotation.y = Math.sin(runTime * 2) * 0.15;
        head.rotation.x = Math.sin(runTime * 3) * 0.05;
        
        // Enhanced arm swinging animation
        if (leftArm && rightArm) {
          leftArm.rotation.x = Math.sin(runTime * 6) * 0.4;
          leftArm.rotation.z = Math.PI / 6 + Math.sin(runTime * 4) * 0.1;
          
          rightArm.rotation.x = Math.sin(runTime * 6 + Math.PI) * 0.4;
          rightArm.rotation.z = -Math.PI / 6 + Math.sin(runTime * 4) * 0.1;
        }
        
        // Enhanced leg movement animation
        if (leftLeg && rightLeg) {
          leftLeg.rotation.x = Math.sin(runTime * 6 + Math.PI) * 0.3;
          rightLeg.rotation.x = Math.sin(runTime * 6) * 0.3;
        }
        
        // Animate glow effect
        const glowEffect = characterGroup.children.find(child => 
          child instanceof THREE.Mesh && 
          child.geometry instanceof THREE.SphereGeometry &&
          child.position.y === 1.2
        );
        if (glowEffect) {
          glowEffect.material.opacity = 0.4 + Math.sin(runTime * 4) * 0.2;
          glowEffect.scale.setScalar(1 + Math.sin(runTime * 5) * 0.3);
        }
      }

      // Optimized spawning system
      if (Date.now() - game.lastObstacle > 2500 && game.obstacles.length < 6) { // Reduced spawn rate and limit
        createObstacle();
        game.lastObstacle = Date.now();
      }

      if (Date.now() - game.lastCoin > 2000 && game.coins.length < 5) { // Reduced spawn rate and limit
        createCoin();
        game.lastCoin = Date.now();
      }

      // Manual forward/backward movement (main direction)
      game.player.mesh.position.x += game.player.forwardSpeed;
      
      // Smooth lane switching (secondary movement)
      const targetZ = game.player.targetLane * game.player.laneWidth;
      game.player.mesh.position.z += (targetZ - game.player.mesh.position.z) * 0.15;
      game.player.currentLane = game.player.targetLane;
      
      // Apply friction to gradually slow down forward speed
      game.player.forwardSpeed *= 0.98;
      
      // Update obstacles with LOD system - Optimized
      for (let i = game.obstacles.length - 1; i >= 0; i--) {
        const obstacle = game.obstacles[i];
        // Obstacles now stay static in world, only rotate
        obstacle.rotation.y += 0.02;
        
        // Update LOD based on distance from camera
        if (obstacle instanceof THREE.LOD) {
          obstacle.update(camera);
        }

        // Optimized collision detection
        const dx = game.player.mesh.position.x - obstacle.position.x;
        const dy = game.player.mesh.position.y - obstacle.position.y;
        const dz = game.player.mesh.position.z - obstacle.position.z;
        const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
        
        if (distance < 1.2) {
          setGameOver(true);
          onGameEnd(game.score);
        }
        // Remove distant obstacles with proper cleanup
        else if (distance > 50) {
          scene.remove(obstacle);
          // Clean up LOD levels
          if (obstacle instanceof THREE.LOD) {
            obstacle.levels.forEach(level => {
              if (level.object instanceof THREE.Mesh) {
                if (level.object.geometry) level.object.geometry.dispose();
                if (level.object.material) level.object.material.dispose();
              }
            });
          } else {
            // Fallback for regular meshes
            if ((obstacle as any).geometry) (obstacle as any).geometry.dispose();
            if ((obstacle as any).material) (obstacle as any).material.dispose();
          }
          game.obstacles.splice(i, 1);
        }
      }

      // Update coins - Optimized
      for (let i = game.coins.length - 1; i >= 0; i--) {
        const coin = game.coins[i];
        // Coins now stay static in world, only rotate and float
        coin.rotation.y += 0.1;
        
        // Simplified floating animation
        coin.position.y = 1.2 + Math.sin(currentTime * 0.002 + i) * 0.2;

        // Collision detection - improved range
        const dx = game.player.mesh.position.x - coin.position.x;
        const dy = game.player.mesh.position.y - coin.position.y;
        const dz = game.player.mesh.position.z - coin.position.z;
        const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
        
        if (distance < 1.5) {
          scene.remove(coin);
          game.coins.splice(i, 1);
          game.score += 10;
          setScore(game.score);
        }
        // Remove distant coins with proper cleanup
        else if (distance > 50) {
          scene.remove(coin);
          coin.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              if (child.geometry) child.geometry.dispose();
              if (child.material) child.material.dispose();
            }
          });
          game.coins.splice(i, 1);
        }
      }

      // Dynamic camera positioning - always behind character (runner 3D style)
      const cameraDistance = 8; // Distance behind character
      const cameraHeight = 4; // Height above character
      const cameraOffset = 0; // No side offset for straight behind view
      
      // Camera follows player from behind with smooth movement
      const targetCameraX = game.player.mesh.position.x - cameraDistance; // Behind character on X axis
      const targetCameraY = game.player.mesh.position.y + cameraHeight;
      const targetCameraZ = game.player.mesh.position.z; // Same Z as character for side-to-side movement
      
      // Smooth camera interpolation
      camera.position.x += (targetCameraX - camera.position.x) * 0.1;
      camera.position.y += (targetCameraY - camera.position.y) * 0.1;
      camera.position.z += (targetCameraZ - camera.position.z) * 0.1;
      
      // Camera always looks at character center
      const lookAtTarget = new THREE.Vector3(
        game.player.mesh.position.x,
        game.player.mesh.position.y + 0.5,
        game.player.mesh.position.z
      );
      camera.lookAt(lookAtTarget);

      // Gradually increase game speed and difficulty
      game.gameSpeed += 0.0002;

      // Frustum culling optimization
      camera.updateMatrixWorld();
      
      renderer.render(scene, camera);
    };

    // Controls
    const handleKeyPress = (e: KeyboardEvent) => {
      // Space key for lane switching
      if (e.code === 'Space') {
        handleClick(); // Use same logic as tap
      }
      
      // Forward movement (main direction)
      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        game.player.forwardSpeed = Math.min(game.player.maxForwardSpeed, game.player.forwardSpeed + 0.05);
      }
      
      // Backward movement
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        game.player.forwardSpeed = Math.max(-game.player.maxForwardSpeed, game.player.forwardSpeed - 0.05);
      }
      
      // Lane switching (now secondary movement)
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        game.player.targetLane = Math.max(-1, game.player.targetLane - 1);
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        game.player.targetLane = Math.min(1, game.player.targetLane + 1);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Gradually slow down when keys are released
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'ArrowDown' || e.code === 'KeyS') {
        game.player.forwardSpeed *= 0.9; // Gradual deceleration
      }
    };

    const handleClick = () => {
      // Tap to move character left/right
      if (game.player.mesh.position.z > -2) {
        game.player.mesh.position.z -= 4; // Move to left lane
      } else if (game.player.mesh.position.z <= -2 && game.player.mesh.position.z > -6) {
        game.player.mesh.position.z = 2; // Move to right lane
      } else {
        game.player.mesh.position.z = -2; // Move to center lane
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keyup', handleKeyUp);
    renderer.domElement.addEventListener('click', handleClick);

    // setIsLoading(false); // Removed loading state
    animate();

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keyup', handleKeyUp);
      renderer.domElement.removeEventListener('click', handleClick);
      
      // Comprehensive cleanup for memory management
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of all geometries and materials
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
      
      // Clean up game objects
      game.obstacles.forEach(obstacle => {
        scene.remove(obstacle);
        if (obstacle.geometry) obstacle.geometry.dispose();
        if (obstacle.material) obstacle.material.dispose();
      });
      
      game.coins.forEach(coin => {
        scene.remove(coin);
        coin.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
          }
        });
      });
      
      // Dispose renderer and clear arrays
      renderer.dispose();
      game.obstacles.length = 0;
      game.coins.length = 0;
    };
   }, [character, gameActive, gameOver, onGameEnd]);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setGameOver(false);
    if (gameRef.current) {
      gameRef.current.score = 0;
      gameRef.current.obstacles = [];
      gameRef.current.coins = [];
      gameRef.current.player.mesh.position.y = 0;
      gameRef.current.player.isJumping = false;
      gameRef.current.gameSpeed = 0.1 + (character.stats.speed * 0.02);
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Game Header */}
      <div className="h-20 bg-black border-b-2 border-orange-400 relative flex items-center justify-between px-8">
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-orange-400"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-orange-400"></div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="bg-black border border-red-400 px-6 py-2 text-red-400 font-orbitron font-bold tracking-wider hover:bg-red-900/20 relative"
          >
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-400"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400"></div>
            EXIT
          </button>
          
          {/* Cardano Wallet Integration */}
           <div className="max-w-xs">
             <WalletConnector />
           </div>
        </div>

        <div className="flex items-center space-x-8">
          <div className="bg-black border border-orange-400 px-4 py-2 relative">
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-orange-400"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400"></div>
            <span className="font-orbitron text-orange-400 font-bold tracking-wider">
              PLAYER: {character.name}
            </span>
          </div>
          
          <div className="bg-black border border-green-400 px-4 py-2 relative">
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-green-400"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400"></div>
            <span className="font-orbitron text-green-400 font-bold tracking-wider">
              SCORE: {score}
            </span>
          </div>
        </div>

        <div className="w-24"></div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="bg-black border-2 border-orange-400 relative">
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-orange-400"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-orange-400"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-orange-400"></div>
          
          <div ref={mountRef} className="w-[800px] h-[400px]" />
        </div>
      </div>

      {/* Game Over Screen */}
      {gameOver && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-black border-2 border-red-400 p-8 relative text-center">
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-400"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-red-400"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-400"></div>
            
            <h2 className="text-4xl font-orbitron font-black text-red-400 mb-4 tracking-wider">
              GAME OVER
            </h2>
            <p className="text-2xl font-mono text-orange-400 mb-6">
              FINAL SCORE: {score}
            </p>
            
            <div className="flex space-x-4">
              <button
                onClick={startGame}
                className="bg-black border border-green-400 px-6 py-3 text-green-400 font-orbitron font-bold tracking-wider hover:bg-green-900/20 relative"
              >
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-green-400"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400"></div>
                PLAY AGAIN
              </button>
              
              <button
                onClick={onBack}
                className="bg-black border border-red-400 px-6 py-3 text-red-400 font-orbitron font-bold tracking-wider hover:bg-red-900/20 relative"
              >
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-400"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400"></div>
                EXIT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}