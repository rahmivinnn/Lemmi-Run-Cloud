import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

interface Model3DLoaderProps {
  modelPath: string;
  texturePaths: {
    diffuse: string;
    normal?: string;
    metallic?: string;
    roughness?: string;
    pbr?: string;
  };
  onLoad?: (model: THREE.Group) => void;
  onError?: (error: Error) => void;
}

export function Model3DLoader({ modelPath, texturePaths, onLoad, onError }: Model3DLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Create loaders
        const objLoader = new OBJLoader();
        const textureLoader = new THREE.TextureLoader();

        // Load textures
        const diffuseTexture = await textureLoader.loadAsync(texturePaths.diffuse);
        
        let normalTexture, metallicTexture, roughnessTexture;
        
        if (texturePaths.normal) {
          normalTexture = await textureLoader.loadAsync(texturePaths.normal);
        }
        
        if (texturePaths.metallic) {
          metallicTexture = await textureLoader.loadAsync(texturePaths.metallic);
        }
        
        if (texturePaths.roughness) {
          roughnessTexture = await textureLoader.loadAsync(texturePaths.roughness);
        }

        // Create material with PBR textures
        const material = new THREE.MeshStandardMaterial({
          map: diffuseTexture,
          normalMap: normalTexture,
          metalnessMap: metallicTexture,
          roughnessMap: roughnessTexture,
          metalness: 0.5,
          roughness: 0.5,
        });

        // Load model
        const model = await objLoader.loadAsync(modelPath);
        
        // Apply material to all meshes
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = material;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        // Scale and position model appropriately
        model.scale.setScalar(1);
        model.position.set(0, 0, 0);
        
        modelRef.current = model;
        setIsLoading(false);
        
        if (onLoad) {
          onLoad(model);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load model');
        setError(error.message);
        setIsLoading(false);
        
        if (onError) {
          onError(error);
        }
      }
    };

    loadModel();
  }, [modelPath, texturePaths, onLoad, onError]);

  if (error) {
    return (
      <div className="text-red-500 text-sm">
        Error loading 3D model: {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-cyan-400 text-sm animate-pulse">
        Loading 3D model...
      </div>
    );
  }

  return null;
}

export default Model3DLoader;