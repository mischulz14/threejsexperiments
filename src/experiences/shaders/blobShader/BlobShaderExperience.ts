import {
  AmbientLight,
  Mesh,
  MeshStandardMaterial,
  PointLight,
  RepeatWrapping,
  SphereGeometry,
  SRGBColorSpace,
  Texture,
  TextureLoader,
} from 'three';

import type { Experience } from '../../../Experience';
import type { IExperience } from '../../../types/types';

export class BlobShaderExperience implements IExperience {
  experience: Experience;
  experienceName: string = 'Blob Shader Scene';
  normalMap: Texture | null = null;
  colorMap: Texture | null = null;
  aoMap: Texture | null = null;
  displacementMap: Texture | null = null;
  roughnessMap: Texture | null = null;
  metalnessMap: Texture | null = null;
  material: MeshStandardMaterial | null = null;

  constructor(experience: Experience) {
    this.experience = experience;
  }

  loadMaps() {
    const loader = new TextureLoader();

    this.normalMap = loader.load(
      '/materials/alien/alien_stone_78_55_normal_opengl.png',
    );
    this.colorMap = loader.load(
      '/materials/alien/alien_stone_78_55_basecolor_diffuse.png',
    );
    this.aoMap = loader.load('/materials/alien/alien_stone_78_55_ao.png');

    this.roughnessMap = loader.load(
      '/materials/alien/alien_stone_78_55_roughness.jpg',
    );
    this.metalnessMap = loader.load(
      '/materials/alien/alien_stone_78_55_metallic.png',
    );

    this.displacementMap = loader.load(
      '/materials/alien/alien_stone_78_55_height.png',
    );

    this.colorMap.colorSpace = SRGBColorSpace;

    const maps = [
      this.colorMap,
      this.normalMap,
      this.aoMap,
      this.roughnessMap,
      this.metalnessMap,
      this.displacementMap,
    ];

    const tilesX = 4;
    const tilesY = 2;

    maps.forEach((tex) => {
      if (!tex) return;
      tex.wrapS = tex.wrapT = RepeatWrapping;
      tex.repeat.set(tilesX, tilesY);
    });
  }

  addLights(experience: Experience) {
    const pointLight = new PointLight(0xffffff, 50);

    pointLight.position.set(0, 3.5, 0);
    experience.add(pointLight);
    experience.add(new AmbientLight(0xffffff, 3));
  }

  init(experience: Experience) {
    this.loadMaps();
    this.addLights(experience);

    const sphereGeom = new SphereGeometry(1, 256, 256);

    // aoMap needs uv2, reuse uv as uv2
    if (!sphereGeom.attributes.uv2) {
      sphereGeom.setAttribute('uv2', sphereGeom.attributes.uv);
    }

    const mat = new MeshStandardMaterial({
      map: this.colorMap,
      aoMap: this.aoMap,
      normalMap: this.normalMap,
      roughnessMap: this.roughnessMap,
      metalnessMap: this.metalnessMap,
      displacementMap: this.displacementMap,
      displacementScale: 0.05,
      displacementBias: -0.25,
    });

    // Hook into the material shader
    // Hook into the material shader
    mat.onBeforeCompile = (shader) => {
      // 1) Add uniforms in JS
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uRippleFrequency = { value: 6.0 };
      shader.uniforms.uRippleAmplitude = { value: 0.04 };
      shader.uniforms.uRippleSpeed = { value: 2.0 };

      // 2) Declare uniforms in the vertex shader GLSL
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
      #include <common>
      uniform float uTime;
      uniform float uRippleFrequency;
      uniform float uRippleAmplitude;
      uniform float uRippleSpeed;
    `,
      );

      // 3) Inject the ripple deformation after begin_vertex
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
      #include <begin_vertex>

      // --- custom ripple deformation ---
      // radial distance in XZ plane (so ripples travel around the Y axis)
      float rippleRadius = length(transformed.xz);
      float ripplePhase = uRippleFrequency * rippleRadius - uTime * uRippleSpeed;
      float ripple = sin(ripplePhase) * uRippleAmplitude;

      transformed += normal * ripple;
      // --- end custom ripple deformation ---
    `,
      );

      // store shader so we can update uniforms in step()
      (mat as any).userData.shader = shader;
    };

    this.material = mat;

    const mesh = new Mesh(sphereGeom, mat);
    mesh.position.set(0, 0, 0);

    experience.add(mesh);
  }

  step() {
    const elapsedTime = this.experience?.clock.getElapsedTime();
    if (!this.material || elapsedTime === undefined) return;

    const shader = (this.material as any).userData.shader;
    if (!shader) return;

    shader.uniforms.uTime.value = elapsedTime;
  }
}
