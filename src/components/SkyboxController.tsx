import * as THREE from 'three';

export interface SkyboxConfig {
  timeOfDay: 'dawn' | 'morning' | 'noon' | 'afternoon' | 'dusk' | 'night';
  colors: {
    top: string;
    middle: string;
    bottom: string;
  };
  fogColor: string;
  fogNear: number;
  fogFar: number;
  ambientLightColor: string;
  ambientLightIntensity: number;
  directionalLightColor: string;
  directionalLightIntensity: number;
  pointLights: Array<{
    color: string;
    intensity: number;
    distance: number;
    position: [number, number, number];
  }>;
}

export const SKYBOX_PRESETS: Record<string, SkyboxConfig> = {
  dawn: {
    timeOfDay: 'dawn',
    colors: {
      top: '#1a1a2e',
      middle: '#16213e',
      bottom: '#0f3460'
    },
    fogColor: '#16213e',
    fogNear: 30,
    fogFar: 200,
    ambientLightColor: '#404080',
    ambientLightIntensity: 1.2,
    directionalLightColor: '#6666ff',
    directionalLightIntensity: 1.5,
    pointLights: [
      { color: '#4444ff', intensity: 0.6, distance: 30, position: [0, 8, 0] },
      { color: '#8844ff', intensity: 0.4, distance: 25, position: [-10, 6, -5] }
    ]
  },
  morning: {
    timeOfDay: 'morning',
    colors: {
      top: '#87ceeb',
      middle: '#98d8e8',
      bottom: '#b0e0e6'
    },
    fogColor: '#87ceeb',
    fogNear: 40,
    fogFar: 250,
    ambientLightColor: '#ffffff',
    ambientLightIntensity: 1.8,
    directionalLightColor: '#ffeeaa',
    directionalLightIntensity: 2.2,
    pointLights: [
      { color: '#ffeeaa', intensity: 0.8, distance: 35, position: [0, 10, 0] },
      { color: '#aaeeff', intensity: 0.6, distance: 30, position: [10, 8, 5] }
    ]
  },
  noon: {
    timeOfDay: 'noon',
    colors: {
      top: '#4169e1',
      middle: '#6495ed',
      bottom: '#87ceeb'
    },
    fogColor: '#87ceeb',
    fogNear: 50,
    fogFar: 300,
    ambientLightColor: '#ffffff',
    ambientLightIntensity: 2.5,
    directionalLightColor: '#ffffff',
    directionalLightIntensity: 3.0,
    pointLights: [
      { color: '#ffffff', intensity: 1.0, distance: 40, position: [0, 15, 0] },
      { color: '#ffffaa', intensity: 0.8, distance: 35, position: [15, 10, 10] }
    ]
  },
  afternoon: {
    timeOfDay: 'afternoon',
    colors: {
      top: '#ff8c00',
      middle: '#ffa500',
      bottom: '#ffb347'
    },
    fogColor: '#ffa500',
    fogNear: 35,
    fogFar: 220,
    ambientLightColor: '#ffaa66',
    ambientLightIntensity: 2.0,
    directionalLightColor: '#ffaa44',
    directionalLightIntensity: 2.5,
    pointLights: [
      { color: '#ffaa44', intensity: 0.9, distance: 35, position: [0, 12, 0] },
      { color: '#ff6644', intensity: 0.7, distance: 30, position: [-12, 8, -8] }
    ]
  },
  dusk: {
    timeOfDay: 'dusk',
    colors: {
      top: '#2f1b69',
      middle: '#8b008b',
      bottom: '#ff1493'
    },
    fogColor: '#8b008b',
    fogNear: 25,
    fogFar: 180,
    ambientLightColor: '#aa44aa',
    ambientLightIntensity: 1.5,
    directionalLightColor: '#ff44aa',
    directionalLightIntensity: 1.8,
    pointLights: [
      { color: '#ff44aa', intensity: 0.8, distance: 30, position: [0, 8, 0] },
      { color: '#aa44ff', intensity: 0.6, distance: 25, position: [8, 6, 8] }
    ]
  },
  night: {
    timeOfDay: 'night',
    colors: {
      top: '#000011',
      middle: '#001122',
      bottom: '#002244'
    },
    fogColor: '#001122',
    fogNear: 20,
    fogFar: 150,
    ambientLightColor: '#444488',
    ambientLightIntensity: 1.0,
    directionalLightColor: '#6666aa',
    directionalLightIntensity: 1.2,
    pointLights: [
      { color: '#4444aa', intensity: 0.5, distance: 25, position: [0, 6, 0] },
      { color: '#aa44aa', intensity: 0.4, distance: 20, position: [-8, 4, -6] },
      { color: '#44aaaa', intensity: 0.3, distance: 18, position: [8, 4, 6] }
    ]
  }
};

export class SkyboxController {
  private scene: THREE.Scene;
  private skybox: THREE.Mesh;
  private ambientLight: THREE.AmbientLight;
  private directionalLight: THREE.DirectionalLight;
  private pointLights: THREE.PointLight[] = [];
  private currentConfig: SkyboxConfig;
  private transitionDuration: number = 2000; // 2 seconds
  private isTransitioning: boolean = false;

  constructor(scene: THREE.Scene, initialConfig: SkyboxConfig = SKYBOX_PRESETS.dawn) {
    this.scene = scene;
    this.currentConfig = initialConfig;
    
    this.createSkybox();
    this.createLights();
    this.applySkyboxConfig(initialConfig);
  }

  private createSkybox(): void {
    const skyboxGeometry = new THREE.SphereGeometry(500, 32, 32);
    const skyboxMaterial = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      transparent: true,
      opacity: 1.0
    });
    
    this.skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    this.scene.add(this.skybox);
  }

  private createLights(): void {
    // Ambient light
    this.ambientLight = new THREE.AmbientLight(0x404040, 1.0);
    this.scene.add(this.ambientLight);

    // Directional light (sun/moon)
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    this.directionalLight.position.set(0, 20, 10);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.width = 512;
    this.directionalLight.shadow.mapSize.height = 512;
    this.directionalLight.shadow.camera.left = -30;
    this.directionalLight.shadow.camera.right = 30;
    this.directionalLight.shadow.camera.top = 30;
    this.directionalLight.shadow.camera.bottom = -30;
    this.directionalLight.shadow.camera.near = 0.1;
    this.directionalLight.shadow.camera.far = 50;
    this.scene.add(this.directionalLight);
  }

  private createGradientTexture(topColor: string, middleColor: string, bottomColor: string): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d')!;

    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, topColor);
    gradient.addColorStop(0.5, middleColor);
    gradient.addColorStop(1, bottomColor);

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  private applySkyboxConfig(config: SkyboxConfig): void {
    // Update skybox material
    const gradientTexture = this.createGradientTexture(
      config.colors.top,
      config.colors.middle,
      config.colors.bottom
    );
    
    if (this.skybox.material instanceof THREE.MeshBasicMaterial) {
      this.skybox.material.map = gradientTexture;
      this.skybox.material.needsUpdate = true;
    }

    // Update fog
    this.scene.fog = new THREE.Fog(
      new THREE.Color(config.fogColor).getHex(),
      config.fogNear,
      config.fogFar
    );

    // Update ambient light
    this.ambientLight.color.setHex(new THREE.Color(config.ambientLightColor).getHex());
    this.ambientLight.intensity = config.ambientLightIntensity;

    // Update directional light
    this.directionalLight.color.setHex(new THREE.Color(config.directionalLightColor).getHex());
    this.directionalLight.intensity = config.directionalLightIntensity;

    // Remove old point lights
    this.pointLights.forEach(light => {
      this.scene.remove(light);
    });
    this.pointLights = [];

    // Add new point lights
    config.pointLights.forEach(lightConfig => {
      const pointLight = new THREE.PointLight(
        new THREE.Color(lightConfig.color).getHex(),
        lightConfig.intensity,
        lightConfig.distance
      );
      pointLight.position.set(...lightConfig.position);
      this.scene.add(pointLight);
      this.pointLights.push(pointLight);
    });

    this.currentConfig = config;
  }

  public transitionTo(newConfig: SkyboxConfig, duration: number = this.transitionDuration): Promise<void> {
    if (this.isTransitioning) {
      return Promise.resolve();
    }

    this.isTransitioning = true;
    const startTime = Date.now();
    const startConfig = { ...this.currentConfig };

    return new Promise((resolve) => {
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = this.easeInOutCubic(progress);

        // Interpolate between configs
        const interpolatedConfig = this.interpolateConfigs(startConfig, newConfig, easeProgress);
        this.applySkyboxConfig(interpolatedConfig);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.isTransitioning = false;
          resolve();
        }
      };

      animate();
    });
  }

  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  private interpolateConfigs(start: SkyboxConfig, end: SkyboxConfig, progress: number): SkyboxConfig {
    const interpolateColor = (startColor: string, endColor: string, t: number): string => {
      const startRGB = new THREE.Color(startColor);
      const endRGB = new THREE.Color(endColor);
      const result = new THREE.Color();
      result.lerpColors(startRGB, endRGB, t);
      return `#${result.getHexString()}`;
    };

    const interpolateNumber = (start: number, end: number, t: number): number => {
      return start + (end - start) * t;
    };

    return {
      timeOfDay: end.timeOfDay,
      colors: {
        top: interpolateColor(start.colors.top, end.colors.top, progress),
        middle: interpolateColor(start.colors.middle, end.colors.middle, progress),
        bottom: interpolateColor(start.colors.bottom, end.colors.bottom, progress)
      },
      fogColor: interpolateColor(start.fogColor, end.fogColor, progress),
      fogNear: interpolateNumber(start.fogNear, end.fogNear, progress),
      fogFar: interpolateNumber(start.fogFar, end.fogFar, progress),
      ambientLightColor: interpolateColor(start.ambientLightColor, end.ambientLightColor, progress),
      ambientLightIntensity: interpolateNumber(start.ambientLightIntensity, end.ambientLightIntensity, progress),
      directionalLightColor: interpolateColor(start.directionalLightColor, end.directionalLightColor, progress),
      directionalLightIntensity: interpolateNumber(start.directionalLightIntensity, end.directionalLightIntensity, progress),
      pointLights: end.pointLights.map((endLight, index) => {
        const startLight = start.pointLights[index] || endLight;
        return {
          color: interpolateColor(startLight.color, endLight.color, progress),
          intensity: interpolateNumber(startLight.intensity, endLight.intensity, progress),
          distance: interpolateNumber(startLight.distance, endLight.distance, progress),
          position: [
            interpolateNumber(startLight.position[0], endLight.position[0], progress),
            interpolateNumber(startLight.position[1], endLight.position[1], progress),
            interpolateNumber(startLight.position[2], endLight.position[2], progress)
          ] as [number, number, number]
        };
      })
    };
  }

  public getCurrentConfig(): SkyboxConfig {
    return this.currentConfig;
  }

  public dispose(): void {
    // Clean up resources
    if (this.skybox.material instanceof THREE.MeshBasicMaterial && this.skybox.material.map) {
      this.skybox.material.map.dispose();
    }
    this.skybox.material.dispose();
    this.skybox.geometry.dispose();
    this.scene.remove(this.skybox);
    
    this.scene.remove(this.ambientLight);
    this.scene.remove(this.directionalLight);
    
    this.pointLights.forEach(light => {
      this.scene.remove(light);
    });
    this.pointLights = [];
  }
}

// Character to skybox mapping
export const CHARACTER_SKYBOX_MAPPING: Record<string, keyof typeof SKYBOX_PRESETS> = {
  'ashina': 'noon',        // King Lemmi - Royal noon sunlight
  'cowboy': 'dusk',        // Cowboy Gerbil - Wild west sunset
  'snow': 'dawn',          // Snow Gerbil - Cold early morning
  'grim': 'night'          // Grim Reaper - Dark night
};

export function getSkyboxForCharacter(characterId: string): SkyboxConfig {
  const skyboxKey = CHARACTER_SKYBOX_MAPPING[characterId] || 'dawn';
  return SKYBOX_PRESETS[skyboxKey];
}