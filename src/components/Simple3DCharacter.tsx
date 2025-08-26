import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Simple3DCharacterProps {
  variant: 'loading' | 'menu';
  onAnimationComplete?: () => void;
}

export function Simple3DCharacter({ variant, onAnimationComplete }: Simple3DCharacterProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const characterRef = useRef<THREE.Group>();
  const animationRef = useRef<number>();
  const [isLoaded, setIsLoaded] = useState(false);

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
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    // Main key light (cyan)
    const keyLight = new THREE.DirectionalLight(0x00ffff, 1.8);
    keyLight.position.set(2, 4, 2);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Fill light (pink/magenta)
    const fillLight = new THREE.DirectionalLight(0xff0088, 1.0);
    fillLight.position.set(-2, 2, 1);
    scene.add(fillLight);

    // Rim light (orange)
    const rimLight = new THREE.DirectionalLight(0xff4400, 0.8);
    rimLight.position.set(0, 1, -2);
    scene.add(rimLight);

    // Load character texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      '/tekstur.png',
      (texture) => {
        texture.flipY = false;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        
        // Create character group
        const characterGroup = new THREE.Group();
        characterRef.current = characterGroup;
        
        // Create cyberpunk material with character texture
        const characterMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          color: new THREE.Color(1.2, 1.2, 1.2),
          emissive: new THREE.Color(0x002244),
          emissiveIntensity: 0.4,
          metalness: 0.6,
          roughness: 0.3,
        });
        
        // Body
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.35, 1.2, 8);
        const body = new THREE.Mesh(bodyGeometry, characterMaterial);
        body.position.set(0, 0.6, 0);
        body.castShadow = true;
        characterGroup.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.28, 12, 12);
        const head = new THREE.Mesh(headGeometry, characterMaterial.clone());
        head.position.set(0, 1.4, 0);
        head.castShadow = true;
        characterGroup.add(head);
        
        // Arms
        const armGeometry = new THREE.CylinderGeometry(0.08, 0.12, 0.8, 6);
        const leftArm = new THREE.Mesh(armGeometry, characterMaterial.clone());
        leftArm.position.set(-0.45, 0.6, 0);
        leftArm.rotation.z = 0.2;
        leftArm.castShadow = true;
        characterGroup.add(leftArm);
        
        const rightArm = new THREE.Mesh(armGeometry, characterMaterial.clone());
        rightArm.position.set(0.45, 0.6, 0);
        rightArm.rotation.z = -0.2;
        rightArm.castShadow = true;
        characterGroup.add(rightArm);
        
        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.9, 6);
        const leftLeg = new THREE.Mesh(legGeometry, characterMaterial.clone());
        leftLeg.position.set(-0.18, -0.4, 0);
        leftLeg.castShadow = true;
        characterGroup.add(leftLeg);
        
        const rightLeg = new THREE.Mesh(legGeometry, characterMaterial.clone());
        rightLeg.position.set(0.18, -0.4, 0);
        rightLeg.castShadow = true;
        characterGroup.add(rightLeg);
        
        // Neural glow effects
        const glowGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const glowMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x00ffff, 
          transparent: true, 
          opacity: 0.8 
        });
        
        // Eye glows
        const leftEye = new THREE.Mesh(glowGeometry, glowMaterial);
        leftEye.position.set(-0.1, 1.5, 0.25);
        characterGroup.add(leftEye);
        
        const rightEye = new THREE.Mesh(glowGeometry, glowMaterial.clone());
        rightEye.position.set(0.1, 1.5, 0.25);
        characterGroup.add(rightEye);
        
        characterGroup.position.set(0, -0.5, 0);
        scene.add(characterGroup);
        
        setIsLoaded(true);
        
        // Loading complete callback for loading variant
        if (variant === 'loading') {
          setTimeout(() => {
            onAnimationComplete?.();
          }, 3000);
        }
      },
      undefined,
      (error) => {
        console.warn('Could not load character texture:', error);
        
        // Create character without texture
        const characterGroup = new THREE.Group();
        characterRef.current = characterGroup;
        
        const fallbackMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0.8, 0.4, 0.9),
          emissive: new THREE.Color(0x002244),
          emissiveIntensity: 0.4,
          metalness: 0.6,
          roughness: 0.3,
        });
        
        // Simple character without texture
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.35, 1.2, 8);
        const body = new THREE.Mesh(bodyGeometry, fallbackMaterial);
        body.position.set(0, 0.6, 0);
        characterGroup.add(body);
        
        const headGeometry = new THREE.SphereGeometry(0.28, 12, 12);
        const head = new THREE.Mesh(headGeometry, fallbackMaterial);
        head.position.set(0, 1.4, 0);
        characterGroup.add(head);
        
        characterGroup.position.set(0, -0.5, 0);
        scene.add(characterGroup);
        
        setIsLoaded(true);
        
        if (variant === 'loading') {
          setTimeout(() => {
            onAnimationComplete?.();
          }, 2000);
        }
      }
    );

    // Point lights for neural effects
    const neuralLight1 = new THREE.PointLight(0x00ff88, 0.5, 10);
    neuralLight1.position.set(1, 2, 1);
    scene.add(neuralLight1);

    const neuralLight2 = new THREE.PointLight(0xff0044, 0.4, 8);
    neuralLight2.position.set(-1, 1.5, 0.5);
    scene.add(neuralLight2);

    // Animation loop
    const clock = new THREE.Clock();
    let time = 0;

    const animate = () => {
      const delta = clock.getDelta();
      time += delta;

      // Neural light effects
      if (neuralLight1) {
        neuralLight1.intensity = 0.5 + Math.sin(time * 3) * 0.3;
      }
      if (neuralLight2) {
        neuralLight2.intensity = 0.4 + Math.cos(time * 2.5) * 0.2;
      }

      // Character animations
      if (characterRef.current) {
        if (variant === 'loading') {
          // Materialization effect
          characterRef.current.rotation.y = time * 0.5;
          characterRef.current.position.y = -0.5 + Math.sin(time * 2) * 0.1;
          
          // Scale animation for materialization
          const scale = Math.min(1, time * 0.3);
          characterRef.current.scale.setScalar(scale);
          
          camera.position.x = Math.sin(time * 0.5) * 0.3;
          camera.position.y = 1 + Math.cos(time * 0.3) * 0.2;
        } else {
          // Menu idle animation
          characterRef.current.rotation.y = Math.sin(time * 0.3) * 0.3;
          characterRef.current.position.y = -0.5 + Math.sin(time * 1.5) * 0.05;
          
          camera.position.x = Math.sin(time * 0.2) * 0.1;
          camera.position.y = 1 + Math.cos(time * 0.15) * 0.1;
        }
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
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="text-center">
            <div className="text-cyan-400 font-mono text-sm animate-pulse">
              MATERIALIZING CHARACTER...
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