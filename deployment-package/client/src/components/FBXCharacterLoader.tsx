import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

interface FBXCharacterLoaderProps {
  variant: 'loading' | 'menu';
  onAnimationComplete?: () => void;
}

export function FBXCharacterLoader({ variant, onAnimationComplete }: FBXCharacterLoaderProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const animationRef = useRef<number>();
  const mixerRef = useRef<THREE.AnimationMixer>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 3);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Lighting setup - Cyberpunk neon lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    // Main key light (cyan)
    const keyLight = new THREE.DirectionalLight(0x00ffff, 1.5);
    keyLight.position.set(2, 4, 2);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Fill light (pink/magenta)
    const fillLight = new THREE.DirectionalLight(0xff0088, 0.8);
    fillLight.position.set(-2, 2, 1);
    scene.add(fillLight);

    // Rim light (orange)
    const rimLight = new THREE.DirectionalLight(0xff4400, 0.6);
    rimLight.position.set(0, 1, -2);
    scene.add(rimLight);

    // Point lights for neural effects
    const neuralLight1 = new THREE.PointLight(0x00ff88, 0.5, 10);
    neuralLight1.position.set(1, 2, 1);
    scene.add(neuralLight1);

    const neuralLight2 = new THREE.PointLight(0xff0044, 0.4, 8);
    neuralLight2.position.set(-1, 1.5, 0.5);
    scene.add(neuralLight2);

    // Texture loader for character texture
    const textureLoader = new THREE.TextureLoader();
    let characterTexture: THREE.Texture | null = null;
    
    // Load texture first - wait for texture to load before loading FBX
    textureLoader.load(
      '/tekstur.png',
      (texture) => {
        texture.flipY = false;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        texture.needsUpdate = true;
        characterTexture = texture;
        console.log('Character texture loaded successfully. Size:', texture.image?.width || 'unknown', 'x', texture.image?.height || 'unknown');
        
        // Load FBX after texture is ready
        loadFBXModel();
      },
      (progress) => {
        console.log('Texture loading progress:', (progress.loaded / progress.total) * 100);
      },
      (error) => {
        console.warn('Could not load character texture:', error);
        // Load FBX anyway without texture
        loadFBXModel();
      }
    );

    function loadFBXModel() {

      // FBX Loader with better error handling
      const loader = new FBXLoader();
      console.log('Starting FBX load from:', '/character.fbx');
      
      loader.load(
        '/character.fbx',
        (object) => {
          console.log('FBX loaded successfully:', object);
          console.log('Object children:', object.children.length);
          console.log('Object boundingBox:', new THREE.Box3().setFromObject(object));
          console.log('Object visible:', object.visible);
          
          // Scale and position the character
          object.scale.setScalar(0.1); // Much bigger scale for visibility
          object.position.set(0, -2, 0);
          object.rotation.y = 0; // Face forward towards camera
          
          // Make sure object is visible
          object.visible = true;
          object.frustumCulled = false;
        
          // Count and log meshes
          let meshCount = 0;
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              meshCount++;
              console.log(`Mesh ${meshCount}:`, child.name, child.geometry, child.material);
            }
          });
          console.log('Total meshes found:', meshCount);
          
          // Apply custom texture to all meshes
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              
              console.log('Applying material to mesh:', child.name);
              
              // Apply the tekstur.png texture to all materials
              if (characterTexture) {
                console.log('Character texture available, applying to mesh:', child.name);
                // Create new material with custom texture
                const material = new THREE.MeshLambertMaterial({
                  map: characterTexture,
                  color: 0xffffff,
                  transparent: false,
                  side: THREE.FrontSide
                });
                
                // Ensure texture is properly configured
                characterTexture.flipY = false;
                characterTexture.needsUpdate = true;
                
                child.material = material;
                child.material.needsUpdate = true;
                console.log('Applied texture material to:', child.name, 'Texture:', characterTexture);
              } else {
                console.log('No texture available, using fallback for:', child.name);
                // Create bright material without texture for debugging
                const fallbackMaterial = new THREE.MeshLambertMaterial({
                  color: 0xff0088,
                });
                child.material = fallbackMaterial;
                console.log('Applied fallback pink material to:', child.name);
              }
            }
          });

          // Add to scene
          console.log('Adding object to scene...');
          scene.add(object);
          console.log('Object added to scene, scene children count:', scene.children.length);
          
          // Store reference for animation
          // characterRef.current = object;

          // Animation setup
          if (object.animations && object.animations.length > 0) {
            console.log('Setting up animations:', object.animations.length);
            const mixer = new THREE.AnimationMixer(object);
            mixerRef.current = mixer;
            
            // Play the first animation if available
            const action = mixer.clipAction(object.animations[0]);
            action.play();
          } else {
            console.log('No animations found in FBX');
          }

          setIsLoaded(true);
          console.log('Character loading completed');
          
          // Loading complete callback for loading variant
          if (variant === 'loading') {
            setTimeout(() => {
              onAnimationComplete?.();
            }, 3000); // 3 second delay for loading animation
          }
        },
        (progress) => {
        const percentage = (progress.loaded / progress.total) * 100;
          console.log(`FBX loading progress: ${percentage.toFixed(1)}% (${progress.loaded}/${progress.total})`);
          setLoadingProgress(percentage);
        },
        (error: unknown) => {
        console.error('Error loading FBX:', error);
        console.error('FBX file path: /character.fbx');
        const err = error as Error;
        console.error('Error details:', {
          type: err?.constructor?.name || 'Unknown',
          message: err?.message || 'Unknown error',
          stack: err?.stack || 'No stack trace'
        });
        
        // Create a fallback humanoid-like character with texture
        const group = new THREE.Group();
        
        // Body
        const bodyGeometry = new THREE.BoxGeometry(0.6, 1.2, 0.3);
        const bodyMaterial = new THREE.MeshStandardMaterial({
          map: characterTexture,
          color: new THREE.Color(1, 1, 1),
          emissive: new THREE.Color(0x001122),
          emissiveIntensity: 0.3,
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.set(0, 0.6, 0);
        group.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
        const head = new THREE.Mesh(headGeometry, bodyMaterial.clone());
        head.position.set(0, 1.4, 0);
        group.add(head);
        
        // Arms
        const armGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.15);
        const leftArm = new THREE.Mesh(armGeometry, bodyMaterial.clone());
        leftArm.position.set(-0.5, 0.6, 0);
        group.add(leftArm);
        
        const rightArm = new THREE.Mesh(armGeometry, bodyMaterial.clone());
        rightArm.position.set(0.5, 0.6, 0);
        group.add(rightArm);
        
        // Legs
        const legGeometry = new THREE.BoxGeometry(0.2, 0.8, 0.2);
        const leftLeg = new THREE.Mesh(legGeometry, bodyMaterial.clone());
        leftLeg.position.set(-0.15, -0.4, 0);
        group.add(leftLeg);
        
        const rightLeg = new THREE.Mesh(legGeometry, bodyMaterial.clone());
        rightLeg.position.set(0.15, -0.4, 0);
        group.add(rightLeg);
        
        group.position.set(0, -0.5, 0);
        scene.add(group);
        
        setIsLoaded(true);
          if (variant === 'loading') {
            setTimeout(() => {
              onAnimationComplete?.();
            }, 2000);
          }
        }
      );
    }

    // Animation loop
    const clock = new THREE.Clock();
    let time = 0;

    const animate = () => {
      const delta = clock.getDelta();
      time += delta;

      // Update animation mixer
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

      // Neural scan effects
      if (neuralLight1) {
        neuralLight1.intensity = 0.5 + Math.sin(time * 3) * 0.3;
      }
      if (neuralLight2) {
        neuralLight2.intensity = 0.4 + Math.cos(time * 2.5) * 0.2;
      }

      // Variant-specific animations
      if (variant === 'loading') {
        // Materialization effect
        camera.position.x = Math.sin(time * 0.5) * 0.3;
        camera.position.y = 1 + Math.cos(time * 0.3) * 0.2;
      } else {
        // Menu idle animation
        camera.position.x = Math.sin(time * 0.2) * 0.1;
        camera.position.y = 1 + Math.cos(time * 0.15) * 0.1;
      }

      camera.lookAt(0, 0.5, 0);

      if (rendererRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, camera);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
      
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };
  }, [variant, onAnimationComplete]);

  return (
    <div className="relative w-full h-full">
      {/* 3D Character Container */}
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Loading overlay for loading variant */}
      {variant === 'loading' && !isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
          <div className="text-center">
            <div className="w-32 h-1 bg-gray-800 mb-4 mx-auto">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-green-400 transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <div className="text-cyan-400 font-mono text-sm animate-pulse">
              LOADING CHARACTER... {Math.round(loadingProgress)}%
            </div>
          </div>
        </div>
      )}
      
      {/* Neural scan lines overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent animate-pulse"></div>
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.1) 2px, rgba(0, 255, 255, 0.1) 4px)',
            animation: 'scanlines 2s linear infinite'
          }}
        />
      </div>
    </div>
  );
}