import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

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
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

    const camera = new THREE.PerspectiveCamera(75, 800 / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(800, 400);
    renderer.setClearColor(0x000011);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mountRef.current.appendChild(renderer.domElement);

    // Enhanced Lighting System
    const ambientLight = new THREE.AmbientLight(0x223344, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffaa44, 1.0);
    directionalLight.position.set(20, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    scene.add(directionalLight);

    // Add rim lighting
    const rimLight = new THREE.DirectionalLight(0x4488ff, 0.3);
    rimLight.position.set(-10, 5, -10);
    scene.add(rimLight);

    // Enhanced Ground System
    const groundGeometry = new THREE.PlaneGeometry(1000, 50);
    const groundMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x112244,
      transparent: true,
      opacity: 0.9
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Cyberpunk grid pattern
    const gridHelper = new THREE.GridHelper(1000, 200, 0x00ffff, 0x003366);
    gridHelper.position.y = -1.9;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.3;
    scene.add(gridHelper);

    // Side walls for more enclosed feel
    const wallGeometry = new THREE.PlaneGeometry(1000, 20);
    const wallMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x001133,
      transparent: true,
      opacity: 0.6
    });
    
    const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
    leftWall.position.set(0, 8, -25);
    scene.add(leftWall);
    
    const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
    rightWall.position.set(0, 8, 25);
    scene.add(rightWall);

    // Character (player) - More detailed 3D character
    const characterGroup = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.4);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xff6600 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.6;
    characterGroup.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.35, 8, 8);
    const headMaterial = new THREE.MeshLambertMaterial({ color: 0xffaa44 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.5;
    characterGroup.add(head);
    
    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.05, 4, 4);
    const eyeMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15, 1.6, 0.3);
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15, 1.6, 0.3);
    characterGroup.add(leftEye);
    characterGroup.add(rightEye);
    
    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8);
    const armMaterial = new THREE.MeshLambertMaterial({ color: 0xff6600 });
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.5, 0.6, 0);
    leftArm.rotation.z = 0.3;
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.5, 0.6, 0);
    rightArm.rotation.z = -0.3;
    characterGroup.add(leftArm);
    characterGroup.add(rightArm);
    
    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.8);
    const legMaterial = new THREE.MeshLambertMaterial({ color: 0xff4400 });
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.2, -0.4, 0);
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.2, -0.4, 0);
    characterGroup.add(leftLeg);
    characterGroup.add(rightLeg);
    
    characterGroup.position.set(-8, 0, 0);
    characterGroup.castShadow = true;
    scene.add(characterGroup);

    // Camera position - more cinematic angle
    camera.position.set(-5, 6, 12);
    camera.lookAt(characterGroup.position);

    // Game state
    const game = {
      player: {
        mesh: characterGroup,
        velocityY: 0,
        isJumping: false,
        jumpPower: character.stats.jump * 0.3,
        speed: character.stats.speed * 0.1,
        runAnimation: 0
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

    // Enhanced obstacle creation with variety
    const createObstacle = () => {
      const obstacleType = Math.random();
      let obstacle: THREE.Mesh;
      
      if (obstacleType < 0.33) {
        // Spiky obstacle
        const obstacleGeometry = new THREE.ConeGeometry(0.5, 2, 6);
        const obstacleMaterial = new THREE.MeshLambertMaterial({ 
          color: 0xff2244,
          transparent: true,
          opacity: 0.9
        });
        obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
        obstacle.position.set(20, 1, Math.random() * 6 - 3);
      } else if (obstacleType < 0.66) {
        // Block obstacle
        const obstacleGeometry = new THREE.BoxGeometry(1, 2, 1);
        const obstacleMaterial = new THREE.MeshLambertMaterial({ 
          color: 0xff4400,
          transparent: true,
          opacity: 0.8
        });
        obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
        obstacle.position.set(20, 0, Math.random() * 6 - 3);
      } else {
        // Crystal obstacle
        const obstacleGeometry = new THREE.OctahedronGeometry(1);
        const obstacleMaterial = new THREE.MeshLambertMaterial({ 
          color: 0xff0066,
          transparent: true,
          opacity: 0.7
        });
        obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
        obstacle.position.set(20, 1.5, Math.random() * 6 - 3);
      }
      
      obstacle.castShadow = true;
      obstacle.receiveShadow = true;
      scene.add(obstacle);
      game.obstacles.push(obstacle);
    };

    // Enhanced coin creation with glow effect
    const createCoin = () => {
      const coinGroup = new THREE.Group();
      
      // Main coin
      const coinGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 8);
      const coinMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xffdd00,
        transparent: true,
        opacity: 0.9
      });
      const coin = new THREE.Mesh(coinGeometry, coinMaterial);
      coinGroup.add(coin);
      
      // Glow ring
      const glowGeometry = new THREE.RingGeometry(0.45, 0.65, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffff44,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.rotation.x = -Math.PI / 2;
      coinGroup.add(glow);
      
      coinGroup.position.set(20, Math.random() * 4 + 2, Math.random() * 8 - 4);
      coinGroup.castShadow = true;
      scene.add(coinGroup);
      game.coins.push(coinGroup);
    };

    // Game loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (!gameActive || gameOver) {
        renderer.render(scene, camera);
        return;
      }

      // Player physics and animation
      if (game.player.isJumping) {
        game.player.mesh.position.y += game.player.velocityY;
        game.player.velocityY -= 0.02; // gravity
        
        if (game.player.mesh.position.y <= 0) {
          game.player.mesh.position.y = 0;
          game.player.isJumping = false;
          game.player.velocityY = 0;
        }
      }
      
      // Running animation
      game.player.runAnimation += 0.2;
      if (game.player.mesh.children.length > 4) { // If we have arms and legs
        const leftArm = game.player.mesh.children[3];
        const rightArm = game.player.mesh.children[4];
        const leftLeg = game.player.mesh.children[5];
        const rightLeg = game.player.mesh.children[6];
        
        leftArm.rotation.x = Math.sin(game.player.runAnimation) * 0.5;
        rightArm.rotation.x = Math.sin(game.player.runAnimation + Math.PI) * 0.5;
        leftLeg.rotation.x = Math.sin(game.player.runAnimation + Math.PI) * 0.3;
        rightLeg.rotation.x = Math.sin(game.player.runAnimation) * 0.3;
      }

      // Spawn obstacles
      if (Date.now() - game.lastObstacle > 2000) {
        createObstacle();
        game.lastObstacle = Date.now();
      }

      // Spawn coins
      if (Date.now() - game.lastCoin > 1500) {
        createCoin();
        game.lastCoin = Date.now();
      }

      // Update obstacles
      game.obstacles.forEach((obstacle, index) => {
        obstacle.position.x -= game.gameSpeed;
        obstacle.rotation.y += 0.02;

        // Collision detection
        const distance = game.player.mesh.position.distanceTo(obstacle.position);
        if (distance < 1.2) {
          setGameOver(true);
          onGameEnd(game.score);
        }

        // Remove off-screen obstacles
        if (obstacle.position.x < -30) {
          scene.remove(obstacle);
          game.obstacles.splice(index, 1);
        }
      });

      // Update coins
      game.coins.forEach((coin, index) => {
        coin.position.x -= game.gameSpeed;
        coin.rotation.y += 0.1;

        // Collision detection
        const distance = game.player.mesh.position.distanceTo(coin.position);
        if (distance < 1) {
          scene.remove(coin);
          game.coins.splice(index, 1);
          game.score += 10;
          setScore(game.score);
        }

        // Remove off-screen coins
        if (coin.position.x < -30) {
          scene.remove(coin);
          game.coins.splice(index, 1);
        }
      });

      // Dynamic camera movement for immersive experience
      game.worldOffset += game.gameSpeed;
      
      // Smooth camera following with slight lag for cinematic effect
      camera.position.x += (game.player.mesh.position.x + 3 - camera.position.x) * 0.1;
      camera.position.y += (game.player.mesh.position.y + 6 - camera.position.y) * 0.05;
      
      // Dynamic camera angle based on player height
      const targetY = game.player.mesh.position.y > 2 ? 8 : 6;
      camera.position.y += (targetY - camera.position.y) * 0.02;
      
      // Look slightly ahead of the player
      camera.lookAt(
        game.player.mesh.position.x + 2, 
        game.player.mesh.position.y + 1, 
        game.player.mesh.position.z
      );

      // Gradually increase game speed and difficulty
      game.gameSpeed += 0.0002;

      renderer.render(scene, camera);
    };

    // Controls
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'ArrowUp') && !game.player.isJumping) {
        game.player.isJumping = true;
        game.player.velocityY = game.player.jumpPower;
      }
    };

    const handleClick = () => {
      if (!game.player.isJumping) {
        game.player.isJumping = true;
        game.player.velocityY = game.player.jumpPower;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    renderer.domElement.addEventListener('click', handleClick);

    setIsLoading(false);
    animate();

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      renderer.domElement.removeEventListener('click', handleClick);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
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
        
        <button
          onClick={onBack}
          className="bg-black border border-red-400 px-6 py-2 text-red-400 font-orbitron font-bold tracking-wider hover:bg-red-900/20 relative"
        >
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-400"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400"></div>
          EXIT
        </button>

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
        {isLoading ? (
          <div className="text-center">
            <div className="bg-black border border-orange-400 p-8 relative">
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-orange-400"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400"></div>
              <h2 className="text-xl font-orbitron font-black text-orange-400 mb-4 tracking-wider">
                LOADING 3D ENGINE...
              </h2>
              <div className="w-4 h-4 border border-orange-400 border-t-transparent animate-spin mx-auto"></div>
            </div>
          </div>
        ) : !gameActive ? (
          <div className="text-center">
            <div className="bg-black border-2 border-orange-400 p-8 relative">
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-orange-400"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-orange-400"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-orange-400"></div>
              
              <h2 className="text-3xl font-orbitron font-black text-orange-400 mb-4 tracking-wider">
                3D LEMMI RUN
              </h2>
              <p className="text-orange-300/80 font-mono mb-6">
                Press SPACE or CLICK to jump over obstacles and collect coins!<br/>
                <span className="text-sm text-orange-400">Immersive 3D Experience</span>
              </p>
              
              <button
                onClick={startGame}
                className="bg-black border border-green-400 px-8 py-4 text-green-400 font-orbitron font-bold tracking-wider hover:bg-green-900/20 relative"
              >
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-green-400"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-green-400"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-400"></div>
                START 3D GAME
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-black border-2 border-orange-400 relative">
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-orange-400"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-orange-400"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-orange-400"></div>
            
            <div ref={mountRef} className="w-[800px] h-[400px]" />
          </div>
        )}
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