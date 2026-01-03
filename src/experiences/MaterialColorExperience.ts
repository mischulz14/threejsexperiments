import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';

import { debugPane } from '../constants/Constants';
import type { Experience } from '../Experience';
import type { IExperience } from '../types/types';

export class MaterialColorExperience implements IExperience {
  experience: Experience;
  mesh: Mesh | null = null;

  constructor(experience: Experience) {
    this.experience = experience;
  }

  init(experience: Experience) {
    const cubeGeom = new BoxGeometry(1, 1, 1);
    const mat = new MeshBasicMaterial({
      color: 0x000000,
    });
    const mesh = new Mesh(cubeGeom, mat);
    this.mesh = mesh;

    experience.add(mesh);

    this.addToPane(mat);
  }

  addToPane(mat: MeshBasicMaterial) {
    const colorParams = {
      materialColor: 0x000000,
    };

    const folder = debugPane.addFolder({ title: 'Material' });

    // Constrain the folder itself
    folder.element.style.gridTemplateColumns = '1fr 80px';
    folder.element.style.maxWidth = '300px';

    const binding = folder.addBinding(colorParams, 'materialColor', {
      view: 'color',
      color: { type: 'float' },
      label: 'Color',
    });

    binding.on('change', (evt) => {
      mat.color.set(evt.value);
    });
  }

  step(deltaTime: number) {
    if (this.mesh) this.mesh.rotation.y += deltaTime;
  }
}
