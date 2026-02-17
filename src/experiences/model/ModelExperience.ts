import {
  AmbientLight,
  DirectionalLight,
  EquirectangularReflectionMapping,
  Mesh,
  PointLight,
  SpotLight,
  Vector3,
} from 'three';
import {
  DRACOLoader,
  GLTFLoader,
  HDRLoader,
  KTX2Loader,
  RGBELoader,
} from 'three/examples/jsm/Addons.js';
import PMREMGenerator from 'three/src/renderers/common/extras/PMREMGenerator.js';
import type { Renderer } from 'three/webgpu';

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

    const loader = new HDRLoader();
    const envMap = loader.load('/hdr/abandoned_greenhouse_1k.hdr', () => {
      envMap.mapping = EquirectangularReflectionMapping;
      experience.environment = envMap;
      experience.renderer?.setClearColor(0x000000);
    });

    // --- LOAD MODEL ---
    gltfLoader.load(
      '/models/ornament_hietzinger_metallic_ultra_compressed.glb',
      (gltf) => {
        gltf.scene.position.set(0, 0, 0);

        experience.camera?.position.set(0, 0, 10);
        experience.camera?.lookAt(0, 0, 0);

        experience.add(gltf.scene);

        this.addLights(experience);
      },
    );
  }

  addLights(experience: Experience) {
    const spotLight = new SpotLight(0xffffff, 100, 0, Math.PI / 2);

    spotLight.position.set(0, 3, 0);
    experience.add(spotLight);
    experience.add(new AmbientLight(0xffffff, 3));
  }

  step() {}
}
