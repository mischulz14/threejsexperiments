import {
  AmbientLight,
  Mesh,
  MeshStandardMaterial,
  PointLight,
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
      '/materials/alien/alien_stone_78__55metallic.png',
    );

    this.colorMap.colorSpace = SRGBColorSpace;
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
    const cubeGeom = new SphereGeometry(1, 128, 128);
    const mat = new MeshStandardMaterial({
      map: this.colorMap,
      aoMap: this.aoMap,
      normalMap: this.normalMap,
      roughnessMap: this.roughnessMap,
      metalnessMap: this.metalnessMap,
    });
    const mesh = new Mesh(cubeGeom, mat);
    mesh.position.set(0, 0, 0);

    experience.add(mesh);
  }

  step() {}
}
