import { Mesh, PointLight } from 'three';
import {
  DRACOLoader,
  GLTFLoader,
  KTX2Loader,
} from 'three/examples/jsm/Addons.js';

import type { Experience } from '../../Experience';
import type { IExperience } from '../../types/types';

export class ModelExperience implements IExperience {
  experience: Experience | null = null;
  experienceName: string = 'model';
  mesh: Mesh | null = null;

  constructor(experience: Experience) {
    this.experience = experience;
  }

  init(experience: Experience) {
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    const ktxLoader = new KTX2Loader();
    gltfLoader.setDRACOLoader(dracoLoader).setKTX2Loader(ktxLoader);

    gltfLoader.load('/models/roadScene_compressed.glb', (scene) => {
      scene.scene.scale.set(0.3, 0.3, 0.3);
      scene.scene.position.set(0, 0, 0);
      experience.camera?.position.set(0, 2, -4);
      experience.add(scene.scene);

      this.addLights(experience);
    });
  }

  addLights(experience: Experience) {
    const pointLight = new PointLight('0xfff', 10);
    pointLight.position.set(0, 4, 0);
    experience.add(pointLight);
  }

  step() {}
}
