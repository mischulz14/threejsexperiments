import { BoxGeometry, Mesh, MeshNormalMaterial } from 'three';
import type { Experience } from '../Experience';

export class BasicSceneExperience {
  experience: Experience;

  constructor(experience: Experience) {
    this.experience = experience;
  }

  init(experience: Experience) {
    const cubeGeom = new BoxGeometry(1, 1, 1);
    const mat = new MeshNormalMaterial();
    const mesh = new Mesh(cubeGeom, mat);

    experience.add(mesh);
  }
}
