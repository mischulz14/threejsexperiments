import { BoxGeometry, Mesh, MeshNormalMaterial } from 'three';

import { debugPane } from '../../constants/Constants';
import type { Experience } from '../../Experience';
import type { IExperience } from '../../types/types';

export class GeometryAndWireframeExperience implements IExperience {
  experience: Experience;
  experienceName: string = 'Geometries And Wireframe';
  mesh: Mesh | null = null;

  constructor(experience: Experience) {
    this.experience = experience;
  }

  init(experience: Experience) {
    const cubeGeom = new BoxGeometry(1, 1, 1);
    const mat = new MeshNormalMaterial();
    const mesh = new Mesh(cubeGeom, mat);
    this.mesh = mesh;

    experience.add(mesh);

    this.addWireFrameBinding();
  }

  addWireFrameBinding() {
    const PARAMS = {
      wireframe: false,
    };

    debugPane.addBinding(PARAMS, 'wireframe').on('change', (ev) => {
      this.mesh?.traverse((object) => {
        if (object instanceof Mesh) {
          object.material.wireframe = ev.value;
        }
      });
    });
  }

  step() {}
}
