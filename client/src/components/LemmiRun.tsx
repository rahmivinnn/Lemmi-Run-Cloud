import { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

interface GameState {
  score: number;
  coins: number;
  speed: number;
  lane: number; // -1, 0, 1 (left, center, right)
  isJumping: boolean;
  isSliding: boolean;
  gameActive: boolean;
  gameOver: boolean;
  degenMode: boolean;
  powerUps: {
    magnet: number;
    shield: number;
    slowMotion: number;
  };
}

interface LemmiRunProps {
  onGameEnd: (score: number, coins: number) => void;
  onBack: () => void;
}

export function LemmiRun({ onGameEnd, onBack }: LemmiRunProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const gameStateRef = useRef<GameState>({
    score: 0,
    coins: 0,
    speed: 0.1,
    lane: 0,
    isJumping: false,
    isSliding: false,
    gameActive: true,
    gameOver: false,
    degenMode: false,
    powerUps: {
      magnet: 0,
      shield: 0,
      slowMotion: 0
    }
  });
  
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const composerRef = useRef<EffectComposer>();
  const characterRef = useRef<THREE.Group>();
  const mixerRef = useRef<THREE.AnimationMixer>();
  const animationRef = useRef<number>();
  
  const roadSegmentsRef = useRef<THREE.Group[]>([]);
  const obstaclesRef = useRef<THREE.Object3D[]>([]);
  const coinsRef = useRef<THREE.Object3D[]>([]);
  const buildingsRef = useRef<THREE.Object3D[]>([]);
  
  const [gameState, setGameState] = useState<GameState>(gameStateRef.current);
  const [isLoading, setIsLoading] = useState(false);
  const [showDegenText, setShowDegenText] = useState(false);
  
  const clockRef = useRef(new THREE.Clock());
  const keysRef = useRef<{[key: string]: boolean}>({});
  
  // Audio context
  const audioContextRef = useRef<AudioContext>();
  const audioBuffersRef = useRef<{[key: string]: AudioBuffer}>({});
  
  // Initialize game
  useEffect(() => {
    if (!mountRef.current) return;
    
    initializeGame();
    
    return () => {
      cleanup();
    };
  }, []);
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keysRef.current[event.code] = true;
      
      if (!gameStateRef.current.gameActive || gameStateRef.current.gameOver) return;
      
      switch (event.code) {
        case 'ArrowLeft':
        case 'KeyA':
          changeLane(-1);
          break;
        case 'ArrowRight':
        case 'KeyD':
          changeLane(1);
          break;
        case 'ArrowUp':
        case 'Space':
          jump();
          break;
        case 'ArrowDown':
        case 'KeyS':
          slide();
          break;
        case 'Escape':
          pauseGame();
          break;
      }
    };
    
    const handleKeyUp = (event: KeyboardEvent) => {
      keysRef.current[event.code] = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  const initializeGame = async () => {
    if (!mountRef.current) return;
    
    console.log('Starting game initialization...');
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000033, 50, 300);
    sceneRef.current = scene;
    
    // Camera setup (third-person follow)
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 8, 12);
    camera.lookAt(0, 2, 0);
    cameraRef.current = camera;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.setClearColor(0x000011);
    rendererRef.current = renderer;
    
    mountRef.current.appendChild(renderer.domElement);
    
    // Post-processing setup
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    // Bloom effect
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, // strength
      0.4, // radius
      0.85 // threshold
    );
    composer.addPass(bloomPass);
    
    // FXAA anti-aliasing
    const fxaaPass = new ShaderPass(FXAAShader);
    fxaaPass.material.uniforms['resolution'].value.x = 1 / (mountRef.current.clientWidth * renderer.getPixelRatio());
    fxaaPass.material.uniforms['resolution'].value.y = 1 / (mountRef.current.clientHeight * renderer.getPixelRatio());
    composer.addPass(fxaaPass);
    
    composerRef.current = composer;
    
    console.log('Setting up lighting...');
    // Setup lighting
    setupLighting(scene);
    
    console.log('Creating skybox...');
    // Create skybox
    createSkybox(scene);
    
    console.log('Initializing road system...');
    // Initialize road system
    initializeRoadSystem(scene);
    
    console.log('Loading character...');
    // Load character
    await loadCharacter(scene);
    
    console.log('Initializing audio...');
    // Initialize audio
    initializeAudio();
    
    console.log('Game initialization complete!');
    // Finish loading
  };
  
  const setupLighting = (scene: THREE.Scene) => {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404080, 0.3);
    scene.add(ambientLight);
    
    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    scene.add(directionalLight);
    
    // Neon accent lights
    const neonLight1 = new THREE.PointLight(0x00ffff, 2, 30);
    neonLight1.position.set(-10, 5, 0);
    scene.add(neonLight1);
    
    const neonLight2 = new THREE.PointLight(0xff0088, 2, 30);
    neonLight2.position.set(10, 5, 0);
    scene.add(neonLight2);
    
    const neonLight3 = new THREE.PointLight(0x88ff00, 1.5, 25);
    neonLight3.position.set(0, 8, -15);
    scene.add(neonLight3);
  };
  
  const createSkybox = (scene: THREE.Scene) => {
    const skyboxGeometry = new THREE.SphereGeometry(500, 32, 32);
    
    // Create gradient material
    const vertexShader = `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    
    const fragmentShader = `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      uniform float offset;
      uniform float exponent;
      varying vec3 vWorldPosition;
      
      void main() {
        float h = normalize(vWorldPosition + offset).y;
        gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
      }
    `;
    
    const skyboxMaterial = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0x000033) },
        bottomColor: { value: new THREE.Color(0x000011) },
        offset: { value: 33 },
        exponent: { value: 0.6 }
      },
      vertexShader,
      fragmentShader,
      side: THREE.BackSide
    });
    
    const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    scene.add(skybox);
    
    // Add stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsVertices = [];
    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 1000;
      const y = Math.random() * 200 + 50;
      const z = (Math.random() - 0.5) * 1000;
      starsVertices.push(x, y, z);
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    
    const starsMaterial = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 2,
      transparent: true,
      opacity: 0.8
    });
    
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
  };
  
  const initializeRoadSystem = (scene: THREE.Scene) => {
    // Create initial road segments
    for (let i = 0; i < 10; i++) {
      const roadSegment = createRoadSegment();
      roadSegment.position.z = i * -20;
      scene.add(roadSegment);
      roadSegmentsRef.current.push(roadSegment);
    }
    
    // Create buildings
    createBuildings(scene);
  };
  
  const createRoadSegment = () => {
    const group = new THREE.Group();
    
    // Main road
    const roadGeometry = new THREE.PlaneGeometry(12, 20);
    const roadMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x111133,
      transparent: true,
      opacity: 0.9
    });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.receiveShadow = true;
    group.add(road);
    
    // Lane dividers
    for (let i = -2; i <= 2; i += 2) {
      const dividerGeometry = new THREE.BoxGeometry(0.2, 0.1, 20);
      const dividerMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x00ffff,
        emissive: 0x002244
      });
      const divider = new THREE.Mesh(dividerGeometry, dividerMaterial);
      divider.position.set(i, 0.05, 0);
      group.add(divider);
    }
    
    // Neon grid pattern
    const gridGeometry = new THREE.PlaneGeometry(12, 20, 12, 20);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x0088ff,
      wireframe: true,
      transparent: true,
      opacity: 0.1
    });
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = 0.01;
    group.add(grid);
    
    return group;
  };
  
  const createBuildings = (scene: THREE.Scene) => {
    for (let i = 0; i < 20; i++) {
      // Left side buildings
      const leftBuilding = createBuilding();
      leftBuilding.position.set(-25 + Math.random() * 10, 0, i * -30 + Math.random() * 20);
      scene.add(leftBuilding);
      buildingsRef.current.push(leftBuilding);
      
      // Right side buildings
      const rightBuilding = createBuilding();
      rightBuilding.position.set(25 + Math.random() * 10, 0, i * -30 + Math.random() * 20);
      scene.add(rightBuilding);
      buildingsRef.current.push(rightBuilding);
    }
  };
  
  const createBuilding = () => {
    const group = new THREE.Group();
    
    const height = 20 + Math.random() * 40;
    const width = 5 + Math.random() * 10;
    const depth = 5 + Math.random() * 10;
    
    // Main building
    const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
    const buildingMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x001122,
      transparent: true,
      opacity: 0.8
    });
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.y = height / 2;
    building.castShadow = true;
    group.add(building);
    
    // Neon windows
    for (let y = 2; y < height; y += 4) {
      for (let x = -width/2 + 1; x < width/2; x += 2) {
        if (Math.random() > 0.3) {
          const windowGeometry = new THREE.PlaneGeometry(0.8, 1.5);
          const windowMaterial = new THREE.MeshBasicMaterial({
            color: Math.random() > 0.5 ? 0x00ffff : 0xff0088,
            emissive: Math.random() > 0.5 ? 0x004444 : 0x440022,
            transparent: true,
            opacity: 0.8
          });
          const window = new THREE.Mesh(windowGeometry, windowMaterial);
          window.position.set(x, y, depth/2 + 0.01);
          group.add(window);
        }
      }
    }
    
    return group;
  };
  
  const loadCharacter = async (scene: THREE.Scene) => {
    return new Promise<void>((resolve, reject) => {
      const loader = new FBXLoader();
      
      // Add timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        console.warn('Character loading timeout, using fallback');
        createFallbackCharacter(scene);
        resolve();
      }, 10000); // 10 second timeout
      
      loader.load(
        '/character.fbx',
        (object) => {
          clearTimeout(timeout);
          console.log('Character loaded successfully');
          // Scale and position
          object.scale.setScalar(0.02);
          object.position.set(0, 0, 5);
          object.rotation.y = 0;
          
          // Apply materials
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              
              // Create neon-style material
              const material = new THREE.MeshLambertMaterial({
                color: 0xff6600,
                emissive: 0x221100,
                transparent: true,
                opacity: 0.9
              });
              child.material = material;
            }
          });
          
          // Setup animations
          if (object.animations && object.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(object);
            mixerRef.current = mixer;
            
            // Play run animation
            const runAction = mixer.clipAction(object.animations[0]);
            runAction.play();
          }
          
          scene.add(object);
          characterRef.current = object;
          resolve();
        },
        (progress) => {
          console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
        },
        (error) => {
          clearTimeout(timeout);
          console.error('Error loading character:', error);
          // Create fallback character
          createFallbackCharacter(scene);
          resolve();
        }
      );
    });
  };
  
  const createFallbackCharacter = (scene: THREE.Scene) => {
    const group = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.CapsuleGeometry(0.5, 1.5, 4, 8);
    const bodyMaterial = new THREE.MeshLambertMaterial({ 
      color: 0xff6600,
      emissive: 0x221100
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1;
    body.castShadow = true;
    group.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.4, 8, 8);
    const headMaterial = new THREE.MeshLambertMaterial({ 
      color: 0xffaa44,
      emissive: 0x332200
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 2.2;
    head.castShadow = true;
    group.add(head);
    
    group.position.set(0, 0, 5);
    scene.add(group);
    characterRef.current = group;
  };
  
  const initializeAudio = () => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Audio context not supported:', error);
    }
  };
  
  const startGameLoop = () => {
    animate();
  };
  
  const animate = () => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
    
    const delta = clockRef.current.getDelta();
    
    // Update animations
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
    
    // Update game logic
    updateGameLogic(delta);
    
    // Update camera
    updateCamera();
    
    // Render
    if (composerRef.current) {
      composerRef.current.render();
    } else {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
    
    if (gameStateRef.current.gameActive && !gameStateRef.current.gameOver) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };
  
  const updateGameLogic = (delta: number) => {
    if (!gameStateRef.current.gameActive || gameStateRef.current.gameOver) return;
    
    // Update score
    gameStateRef.current.score += delta * 10;
    
    // Increase speed over time
    gameStateRef.current.speed = Math.min(0.3, 0.1 + gameStateRef.current.score * 0.00001);
    
    // Check for Degen Mode activation
    if (gameStateRef.current.score > 500 && !gameStateRef.current.degenMode) {
      activateDegenMode();
    }
    
    // Move world towards player
    moveWorld();
    
    // Update character position
    updateCharacterPosition(delta);
    
    // Spawn obstacles and collectibles
    spawnGameObjects();
    
    // Check collisions
    checkCollisions();
    
    // Update UI
    setGameState({...gameStateRef.current});
  };
  
  const moveWorld = () => {
    const speed = gameStateRef.current.speed * (gameStateRef.current.degenMode ? 2 : 1);
    
    // Move road segments
    roadSegmentsRef.current.forEach((segment, index) => {
      segment.position.z += speed;
      
      // Recycle segments that are behind the camera
      if (segment.position.z > 20) {
        segment.position.z = -180 + (index * -20);
      }
    });
    
    // Move buildings
    buildingsRef.current.forEach(building => {
      building.position.z += speed;
      
      if (building.position.z > 50) {
        building.position.z -= 600;
        // Randomize building position
        building.position.x = (building.position.x > 0 ? 1 : -1) * (25 + Math.random() * 10);
      }
    });
    
    // Move obstacles
    obstaclesRef.current.forEach((obstacle, index) => {
      obstacle.position.z += speed;
      
      if (obstacle.position.z > 20) {
        sceneRef.current?.remove(obstacle);
        obstaclesRef.current.splice(index, 1);
      }
    });
    
    // Move coins
    coinsRef.current.forEach((coin, index) => {
      coin.position.z += speed;
      coin.rotation.y += 0.1;
      
      if (coin.position.z > 20) {
        sceneRef.current?.remove(coin);
        coinsRef.current.splice(index, 1);
      }
    });
  };
  
  const updateCharacterPosition = (delta: number) => {
    if (!characterRef.current) return;
    
    const targetX = gameStateRef.current.lane * 4;
    const currentX = characterRef.current.position.x;
    
    // Smooth lane transition
    characterRef.current.position.x = THREE.MathUtils.lerp(currentX, targetX, delta * 8);
    
    // Handle jumping
    if (gameStateRef.current.isJumping) {
      // Simple jump arc (this could be improved with proper physics)
      const jumpTime = Date.now() % 1000 / 1000;
      characterRef.current.position.y = Math.sin(jumpTime * Math.PI) * 3;
      
      if (jumpTime > 0.9) {
        gameStateRef.current.isJumping = false;
        characterRef.current.position.y = 0;
      }
    }
    
    // Handle sliding
    if (gameStateRef.current.isSliding) {
      characterRef.current.scale.y = 0.5;
      characterRef.current.position.y = -0.5;
      
      setTimeout(() => {
        if (characterRef.current) {
          gameStateRef.current.isSliding = false;
          characterRef.current.scale.y = 1;
          characterRef.current.position.y = 0;
        }
      }, 800);
    }
  };
  
  const updateCamera = () => {
    if (!cameraRef.current || !characterRef.current) return;
    
    const targetPosition = new THREE.Vector3(
      characterRef.current.position.x,
      8 + (gameStateRef.current.degenMode ? Math.sin(Date.now() * 0.01) * 2 : 0),
      characterRef.current.position.z + 12
    );
    
    cameraRef.current.position.lerp(targetPosition, 0.1);
    cameraRef.current.lookAt(
      characterRef.current.position.x,
      characterRef.current.position.y + 2,
      characterRef.current.position.z
    );
  };
  
  const spawnGameObjects = () => {
    // Spawn obstacles
    if (Math.random() < 0.02) {
      spawnObstacle();
    }
    
    // Spawn coins
    if (Math.random() < 0.05) {
      spawnCoin();
    }
  };
  
  const spawnObstacle = () => {
    if (!sceneRef.current) return;
    
    const lane = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
    const obstacle = createObstacle();
    obstacle.position.set(lane * 4, 1, -50);
    
    sceneRef.current.add(obstacle);
    obstaclesRef.current.push(obstacle);
  };
  
  const createObstacle = () => {
    const group = new THREE.Group();
    
    if (gameStateRef.current.degenMode && Math.random() < 0.3) {
      // Degen mode obstacles
      const geometry = new THREE.BoxGeometry(2, 4, 2);
      const material = new THREE.MeshLambertMaterial({
        color: 0xff0000,
        emissive: 0x440000,
        transparent: true,
        opacity: 0.8
      });
      const obstacle = new THREE.Mesh(geometry, material);
      obstacle.castShadow = true;
      group.add(obstacle);
      
      // Add glitch effect
      const glitchGeometry = new THREE.BoxGeometry(2.2, 4.2, 2.2);
      const glitchMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      });
      const glitch = new THREE.Mesh(glitchGeometry, glitchMaterial);
      group.add(glitch);
    } else {
      // Normal obstacles
      const geometry = new THREE.BoxGeometry(1.5, 3, 1.5);
      const material = new THREE.MeshLambertMaterial({
        color: 0x00ffff,
        emissive: 0x002244,
        transparent: true,
        opacity: 0.9
      });
      const obstacle = new THREE.Mesh(geometry, material);
      obstacle.castShadow = true;
      group.add(obstacle);
    }
    
    return group;
  };
  
  const spawnCoin = () => {
    if (!sceneRef.current) return;
    
    const lane = Math.floor(Math.random() * 3) - 1;
    const coin = createCoin();
    coin.position.set(lane * 4, 1.5, -50);
    
    sceneRef.current.add(coin);
    coinsRef.current.push(coin);
  };
  
  const createCoin = () => {
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 8);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      emissive: 0x444400,
      transparent: true,
      opacity: 0.9
    });
    const coin = new THREE.Mesh(geometry, material);
    coin.castShadow = true;
    
    return coin;
  };
  
  const checkCollisions = () => {
    if (!characterRef.current) return;
    
    const characterBox = new THREE.Box3().setFromObject(characterRef.current);
    
    // Check obstacle collisions
    obstaclesRef.current.forEach((obstacle, index) => {
      const obstacleBox = new THREE.Box3().setFromObject(obstacle);
      
      if (characterBox.intersectsBox(obstacleBox)) {
        // Collision detected
        if (gameStateRef.current.powerUps.shield > 0) {
          // Shield protects from collision
          gameStateRef.current.powerUps.shield = 0;
          sceneRef.current?.remove(obstacle);
          obstaclesRef.current.splice(index, 1);
        } else {
          // Game over
          gameOver();
        }
      }
    });
    
    // Check coin collisions
    coinsRef.current.forEach((coin, index) => {
      const coinBox = new THREE.Box3().setFromObject(coin);
      
      if (characterBox.intersectsBox(coinBox)) {
        // Coin collected
        gameStateRef.current.coins++;
        gameStateRef.current.score += 10;
        
        sceneRef.current?.remove(coin);
        coinsRef.current.splice(index, 1);
        
        // Play coin sound effect
        playCoinSound();
      }
    });
  };
  
  const activateDegenMode = () => {
    gameStateRef.current.degenMode = true;
    setShowDegenText(true);
    
    // Add glitch pass to composer
    if (composerRef.current) {
      const glitchPass = new GlitchPass();
      composerRef.current.addPass(glitchPass);
    }
    
    // Change scene colors
    if (sceneRef.current) {
      sceneRef.current.fog = new THREE.Fog(0x330000, 30, 200);
    }
    
    // Hide degen text after 3 seconds
    setTimeout(() => {
      setShowDegenText(false);
    }, 3000);
  };
  
  const changeLane = (direction: number) => {
    const newLane = Math.max(-1, Math.min(1, gameStateRef.current.lane + direction));
    gameStateRef.current.lane = newLane;
  };
  
  const jump = () => {
    if (!gameStateRef.current.isJumping && !gameStateRef.current.isSliding) {
      gameStateRef.current.isJumping = true;
    }
  };
  
  const slide = () => {
    if (!gameStateRef.current.isJumping && !gameStateRef.current.isSliding) {
      gameStateRef.current.isSliding = true;
    }
  };
  
  const pauseGame = () => {
    gameStateRef.current.gameActive = !gameStateRef.current.gameActive;
    if (gameStateRef.current.gameActive) {
      animate();
    }
  };
  
  const gameOver = () => {
    gameStateRef.current.gameOver = true;
    gameStateRef.current.gameActive = false;
    setGameState({...gameStateRef.current});
    
    setTimeout(() => {
      onGameEnd(gameStateRef.current.score, gameStateRef.current.coins);
    }, 2000);
  };
  
  const restartGame = () => {
    // Reset game state
    gameStateRef.current = {
      score: 0,
      coins: 0,
      speed: 0.1,
      lane: 0,
      isJumping: false,
      isSliding: false,
      gameActive: true,
      gameOver: false,
      degenMode: false,
      powerUps: { magnet: 0, shield: 0, slowMotion: 0 }
    };
    
    // Clear objects
    obstaclesRef.current.forEach(obstacle => sceneRef.current?.remove(obstacle));
    coinsRef.current.forEach(coin => sceneRef.current?.remove(coin));
    obstaclesRef.current.length = 0;
    coinsRef.current.length = 0;
    
    // Reset character position
    if (characterRef.current) {
      characterRef.current.position.set(0, 0, 5);
    }
    
    setGameState({...gameStateRef.current});
    animate();
  };
  
  const playCoinSound = () => {
    // Simple beep sound using Web Audio API
    if (audioContextRef.current) {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.1);
    }
  };
  
  const cleanup = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    if (rendererRef.current && mountRef.current) {
      mountRef.current.removeChild(rendererRef.current.domElement);
      rendererRef.current.dispose();
    }
    
    if (composerRef.current) {
      composerRef.current.dispose();
    }
  };
  


  // Auto start game when component mounts
  useEffect(() => {
    if (!gameState.gameActive && !gameState.gameOver) {
      startGame();
    }
  }, []);
  
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Game Canvas */}
      <div ref={mountRef} className="w-full h-full" />
      
      {/* HUD */}
      <div className="absolute top-4 right-4 text-right">
        <div className="text-2xl font-bold text-green-400 mb-2">
          SCORE: {Math.floor(gameState.score)}
        </div>
        <div className="text-xl font-bold text-yellow-400 mb-2">
          COINS: {gameState.coins}
        </div>
        <div className="text-lg text-cyan-400">
          {gameState.degenMode ? 'DEGEN MODE' : 'NORMAL MODE'}
        </div>
      </div>
      
      {/* Controls Info */}
      <div className="absolute bottom-4 left-4 text-white text-sm">
        <div>A/D or ←/→: Change Lane</div>
        <div>W or ↑ or Space: Jump</div>
        <div>S or ↓: Slide</div>
        <div>ESC: Pause</div>
      </div>
      
      {/* Degen Mode Activation */}
      {showDegenText && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-6xl font-bold text-red-500 animate-pulse">
            ⚠️ DEGEN MODE ACTIVATED
          </div>
        </div>
      )}
      
      {/* Game Over Screen */}
      {gameState.gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-red-500 mb-4">GAME OVER</div>
            <div className="text-2xl text-white mb-2">Final Score: {Math.floor(gameState.score)}</div>
            <div className="text-xl text-yellow-400 mb-6">Coins Collected: {gameState.coins}</div>
            <div className="space-x-4">
              <button
                onClick={restartGame}
                className="px-6 py-3 bg-cyan-600 text-white font-bold rounded hover:bg-cyan-700 transition-colors"
              >
                RESTART
              </button>
              <button
                onClick={onBack}
                className="px-6 py-3 bg-gray-600 text-white font-bold rounded hover:bg-gray-700 transition-colors"
              >
                EXIT
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Pause Screen */}
      {!gameState.gameActive && !gameState.gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-cyan-400 mb-4">PAUSED</div>
            <div className="text-lg text-white mb-6">Press ESC to resume</div>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-gray-600 text-white font-bold rounded hover:bg-gray-700 transition-colors"
            >
              EXIT TO MENU
            </button>
          </div>
        </div>
      )}
    </div>
  );
}