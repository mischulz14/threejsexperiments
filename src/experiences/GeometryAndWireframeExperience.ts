import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';
import type { Experience } from '../Experience';

export class GeometryAndWireframeExperience {
  experience: Experience;

  constructor(experience: Experience) {
    this.experience = experience;
  }

  init(experience: Experience) {
    const cubeGeom = new BoxGeometry(1, 1, 1);
    const mat = new MeshBasicMaterial({
      color: 0x0000ff,
    });
    const mesh = new Mesh(cubeGeom, mat);

    experience.add(mesh);
  }
}
