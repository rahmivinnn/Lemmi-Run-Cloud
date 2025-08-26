import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

// Global texture cache to prevent reloading
const textureCache = new Map<string, THREE.Texture>();
const modelCache = new Map<string, THREE.Group>();

interface Character {
  id: string;
  name: string;
  image: string;
  stats: {
    speed: number;
    jump: number;
    special: number;
  };
}

interface Game3DProps {
  character: Character;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  gameState: {
    player: {
      x: number;
      y: number;
      width: number;
      height: number;
      isJumping: boolean;
    };
  };
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

export function Game3D({ character, canvasRef, gameState }: Game3DProps) {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Create scene
    const scene = new THREE.Scene();
    scene.background = null; // Transparent background
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      rect.width / rect.height,
      0.1,
      1000
    );
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Add neural interface lighting effects
    const pointLight1 = new THREE.PointLight(0x00ffff, 0.5, 10);
    pointLight1.position.set(-3, 2, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff6600, 0.5, 10);
    pointLight2.position.set(3, 2, 2);
    scene.add(pointLight2);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      renderer.dispose();
    };


  // Enhanced cleanup on unmount with memory management
  useEffect(() => {
    return () => {
      // Cancel animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Dispose of Three.js resources
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
      }
      
      // Clean up scene and models
      if (sceneRef.current) {
        sceneRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.geometry) {
              child.geometry.dispose();
            }
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => {
                  mat.dispose();
                  // Dispose textures
                  Object.values(mat).forEach(value => {
                    if (value instanceof THREE.Texture) {
                      value.dispose();
                    }
                  });
                });
              } else {
                child.material.dispose();
                // Dispose textures
                Object.values(child.material).forEach(value => {
                  if (value instanceof THREE.Texture) {
                    value.dispose();
                  }
                });
              }
            }
          }
        });
        sceneRef.current.clear();
      }
      
      // Clear references
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      modelRef.current = null;
    };
  }, []);

  // Periodic memory cleanup
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      // Clear unused cached textures (keep only last 10)
      if (textureCache.size > 10) {
        const entries = Array.from(textureCache.entries());
        const toRemove = entries.slice(0, entries.length - 10);
        toRemove.forEach(([key, texture]) => {
          texture.dispose();
          textureCache.delete(key);
        });
      }
      
      // Clear unused cached models (keep only last 5)
      if (modelCache.size > 5) {
        const entries = Array.from(modelCache.entries());
        const toRemove = entries.slice(0, entries.length - 5);
        toRemove.forEach(([key, model]) => {
          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              if (child.geometry) child.geometry.dispose();
              if (child.material) {
                if (Array.isArray(child.material)) {
                  child.material.forEach(mat => mat.dispose());
                } else {
                  child.material.dispose();
                }
              }
            }
          });
          modelCache.delete(key);
        });
      }
    }, 30000); // Clean up every 30 seconds
    
    return () => clearInterval(cleanupInterval);
  }, []);
  }, [canvasRef]);

  // Load character model with optimization
  useEffect(() => {
    if (!sceneRef.current) return;

    const characterId = character.id as keyof typeof MODEL_CONFIGS;
    const config = MODEL_CONFIGS[characterId];
    
    if (!config) {
      console.warn(`No 3D model config found for character: ${character.id}`);
      return;
    }

    let isCancelled = false;

    const loadModel = useCallback(async () => {
      try {
        const cacheKey = `${config.modelPath}_${JSON.stringify(config.textures)}`;
        
        // Check if model is already cached
        if (modelCache.has(cacheKey)) {
          const cachedModel = modelCache.get(cacheKey)!.clone();
          
          // Remove previous model if exists
          if (modelRef.current) {
            sceneRef.current?.remove(modelRef.current);
          }
          
          // Setup cached model
          cachedModel.scale.setScalar(0.5);
          cachedModel.position.set(0, -1, 0);
          cachedModel.rotation.y = Math.PI;
          
          modelRef.current = cachedModel;
          sceneRef.current?.add(cachedModel);
          setIsModelLoaded(true);
          return;
        }

        const objLoader = new OBJLoader();
        const textureLoader = new THREE.TextureLoader();

        // Optimized texture loading with caching
        const loadTexture = async (path: string) => {
          if (textureCache.has(path)) {
            return textureCache.get(path)!.clone();
          }
          
          try {
            const texture = await textureLoader.loadAsync(path);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.flipY = false;
            texture.generateMipmaps = true;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            
            textureCache.set(path, texture);
            return texture.clone();
          } catch (error) {
            console.warn(`Failed to load texture: ${path}`, error);
            return null;
          }
        };

        const [diffuseTexture, normalTexture, metallicTexture, roughnessTexture] = await Promise.all([
          loadTexture(config.textures.diffuse),
          loadTexture(config.textures.normal),
          loadTexture(config.textures.metallic),
          loadTexture(config.textures.roughness)
        ]);

        if (isCancelled) return;

        // Create optimized PBR material with performance settings
        const material = new THREE.MeshStandardMaterial({
          map: diffuseTexture,
          normalMap: normalTexture || undefined,
          metalnessMap: metallicTexture || undefined,
          roughnessMap: roughnessTexture || undefined,
          metalness: metallicTexture ? 0.7 : 0.3,
          roughness: roughnessTexture ? 0.3 : 0.5,
          emissive: new THREE.Color(config.color),
          emissiveIntensity: 0.1,
          transparent: false,
          side: THREE.FrontSide
        });

        // Load model with error handling
        let model;
        try {
          model = await objLoader.loadAsync(config.modelPath);
        } catch (error) {
          console.error(`Failed to load model: ${config.modelPath}`, error);
          // Create optimized fallback geometry
          const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
          model = new THREE.Group();
          const mesh = new THREE.Mesh(geometry, material);
          model.add(mesh);
        }
        
        if (isCancelled) return;

        // Apply material and optimize meshes
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = material;
            child.castShadow = true;
            child.receiveShadow = true;
            child.frustumCulled = true; // Enable frustum culling
            
            // Optimize geometry
            if (child.geometry) {
              child.geometry.computeBoundingSphere();
              child.geometry.computeBoundingBox();
              // Merge vertices for better performance
              child.geometry.mergeVertices?.();
            }
          }
        });

        // Scale and position model
        model.scale.setScalar(0.5);
        model.position.set(0, -1, 0);
        model.rotation.y = Math.PI; // Face forward
        
        // Cache the loaded model
        modelCache.set(cacheKey, model.clone());
        
        // Remove previous model if exists
        if (modelRef.current) {
          sceneRef.current?.remove(modelRef.current);
          // Dispose of previous model resources
          modelRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.geometry?.dispose();
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => mat.dispose());
              } else {
                child.material?.dispose();
              }
            }
          });
        }
        
        modelRef.current = model;
        sceneRef.current?.add(model);
        setIsModelLoaded(true);
        
      } catch (error) {
        console.error('Failed to load 3D model:', error);
        setIsModelLoaded(false);
      }
    }, [config]);

    loadModel();

    return () => {
      isCancelled = true;
    };
  }, [character]);

  // Optimized animation loop with frame rate control
  useEffect(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    let lastTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

      // Frame rate control
      if (currentTime - lastTime < frameInterval) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTime = currentTime;

      // Update model position based on game state
      if (modelRef.current && isModelLoaded) {
        const { player } = gameState;
        
        // Convert 2D game coordinates to 3D world coordinates
        const worldX = (player.x / 800) * 10 - 5; // Normalize to -5 to 5 range
        const worldY = (1 - player.y / 400) * 3 - 1; // Normalize and invert Y
        
        // Smooth position interpolation
        const lerpFactor = 0.1;
        modelRef.current.position.x += (worldX - modelRef.current.position.x) * lerpFactor;
        modelRef.current.position.y += (worldY - modelRef.current.position.y) * lerpFactor;
        
        // Add jumping animation with smooth transitions
        const time = currentTime * 0.001;
        if (player.isJumping) {
          modelRef.current.rotation.x = Math.sin(time * 10) * 0.2;
          const targetScale = 0.55;
          const currentScale = modelRef.current.scale.x;
          modelRef.current.scale.setScalar(currentScale + (targetScale - currentScale) * 0.2);
        } else {
          modelRef.current.rotation.x *= 0.9; // Smooth return to 0
          const targetScale = 0.5;
          const currentScale = modelRef.current.scale.x;
          modelRef.current.scale.setScalar(currentScale + (targetScale - currentScale) * 0.1);
        }
        
        // Add subtle idle animation
        modelRef.current.rotation.y = Math.PI + Math.sin(time * 3) * 0.05;
        
        // Add breathing effect
        const breathingScale = 1 + Math.sin(time * 4) * 0.02;
        modelRef.current.scale.multiplyScalar(breathingScale);
      }

      // Only render if something has changed
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, isModelLoaded]);

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !rendererRef.current || !cameraRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      cameraRef.current.aspect = rect.width / rect.height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(rect.width, rect.height);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [canvasRef]);

  return null; // This component doesn't render anything directly
}

export default Game3D;