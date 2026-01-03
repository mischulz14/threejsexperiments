import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';

import type { Experience } from '../Experience';
import type { IExperience } from '../types/types';

export class GeometryAndWireframeExperience implements IExperience {
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

  step() {}
}
