import {
  DoubleSide,
  Mesh,
  PlaneGeometry,
  Points,
  PointsMaterial,
  ShaderMaterial,
  Vector3,
} from 'three';

import { debugPane } from '../../../constants/Constants';
import type { Experience } from '../../../Experience';
import fragmentShader from '../../../shaders/flag/fragment-shader.glsl';
import vertexShader from '../../../shaders/flag/vertex-shader.glsl';
import type { IExperience } from '../../../types/types';

export class FlagShaderExperience implements IExperience {
  experience: Experience | null = null;
  experienceName: string = 'flagShader';
  mesh: Mesh | null = null;
  material: ShaderMaterial | null = null;
  points: Points | null = null;

  constructor(experience: Experience) {
    this.experience = experience;
  }

  init(experience: Experience) {
    const geom = new PlaneGeometry(1, 1, 16, 16);

    const mat = new ShaderMaterial({
      fragmentShader,
      vertexShader,
      transparent: true,
      side: DoubleSide,
      uniforms: {
        uColor: {
          value: new Vector3(0, 0, 1),
        },
        uWaveSize: {
          value: 0.1,
        },
        uWaveAmount: {
          value: 10,
        },
        uTime: { value: 0 },
      },
    });
    this.material = mat;

    const mesh = new Mesh(geom, mat);
    this.mesh = mesh;
    experience.add(mesh);

    const pointsMaterial = new PointsMaterial({
      color: 0x000000,
      size: 0.02,
    });

    const points = new Points(geom, pointsMaterial);
    this.points = points;
    experience.add(points);

    this.addShaderColorBinding();
    this.addWaveSizeBinding();
    this.addWaveAmountBinding();
  }

  addShaderColorBinding() {
    const PARAMS = {
      color: { r: 255, g: 0, b: 55 },
    };
    debugPane.addBinding(PARAMS, 'color').on('change', (ev) => {
      const color = ev.value;

      this.material!.uniforms.uColor.value = new Vector3(
        color.r / 255,
        color.g / 255,
        color.b / 255,
      );
    });
  }

  addWaveSizeBinding() {
    const PARAMS = {
      waveSize: 0.1,
    };

    debugPane
      .addBinding(PARAMS, 'waveSize', {
        min: 0.1,
        max: 1,
        step: 0.1,
      })
      .on('change', (ev) => {
        const value = ev.value;

        this.material!.uniforms.uWaveSize.value = value;
      });
  }

  addWaveAmountBinding() {
    const PARAMS = {
      waveAmount: 10,
    };

    debugPane
      .addBinding(PARAMS, 'waveAmount', {
        min: 1,
        max: 50,
        step: 1,
      })
      .on('change', (ev) => {
        const value = ev.value;

        this.material!.uniforms.uWaveAmount.value = value;
      });
  }

  step() {
    const elapsedTime = this.experience?.clock.getElapsedTime();
    if (!this.material) return;
    this.material!.uniforms.uTime.value = elapsedTime;
  }
}
