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

import type { Experience } from '../Experience';
import type { IExperience } from '../types/types';

export class BasicMaterialSceneExperience implements IExperience {
  experience: Experience;
  experienceName: string = 'Basic Scene';
  normalMap: Texture | null = null;
  colorMap: Texture | null = null;
  aoMap: Texture | null = null;
  displacementMap: Texture | null = null;
  roughnessMap: Texture | null = null;
  metalnessMap: Texture | null = null;

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

    pointLight.position.set(0, 3, 0);
    experience.add(pointLight);
    experience.add(new AmbientLight(0xffffff, 3));
  }

  init(experience: Experience) {
    this.loadMaps();
    this.addLights(experience);
    const cubeGeom = new SphereGeometry(1, 64, 64);
    const mat = new MeshStandardMaterial({
      map: this.colorMap,
      aoMap: this.aoMap,
      normalMap: this.normalMap,
      roughnessMap: this.roughnessMap,
      metalnessMap: this.metalnessMap,
      displacementMap: this.displacementMap,
      displacementScale: 0.03,
      displacementBias: -0.1,
    });
    const mesh = new Mesh(cubeGeom, mat);
    mesh.position.set(0, 0, 0);

    experience.add(mesh);
  }

  step() {}
}
