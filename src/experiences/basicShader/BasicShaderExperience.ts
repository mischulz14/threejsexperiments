import { BoxGeometry, Mesh, ShaderMaterial, Vector3 } from 'three';

import { debugPane } from '../../constants/Constants';
import type { Experience } from '../../Experience';
import fragmentShader from '../../shaders/basic/fragment-shader.glsl';
import vertexShader from '../../shaders/basic/vertex-shader.glsl';
import type { IExperience } from '../../types/types';

export class BasicShaderExperience implements IExperience {
  experienceName: string = 'basicShader';
  mesh: Mesh | null = null;
  material: ShaderMaterial | null = null;

  init(experience: Experience) {
    const geom = new BoxGeometry(1, 1, 1);
    const mat = new ShaderMaterial({
      fragmentShader,
      vertexShader,
      transparent: false,
      uniforms: {
        uColor: {
          value: new Vector3(0, 0, 1),
        },
      },
    });
    this.material = mat;

    const mesh = new Mesh(geom, mat);
    this.mesh = mesh;
    experience.add(mesh);
    this.addShaderColorBinding();
  }

  addShaderColorBinding() {
    const PARAMS = {
      color: { r: 255, g: 0, b: 55 },
    };
    debugPane.addBinding(PARAMS, 'color').on('change', (ev) => {
      const color = ev.value;

      console.log(color);
      this.material!.uniforms.uColor.value = new Vector3(
        color.r / 255,
        color.g / 255,
        color.b / 255,
      );
    });
  }

  step() {}
}
