import { Clock, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { PerspectiveCamera, type WebGPURenderer } from 'three/webgpu';

import { URLS } from './constants/Constants';
import { BasicSceneExperience } from './experiences/basic/BasicSceneExperience';
import { GeometryAndWireframeExperience } from './experiences/geomAndWirefrane/GeometryAndWireframeExperience';
import { MaterialColorExperience } from './experiences/materialColor/MaterialColorExperience';
import { BasicShaderExperience } from './experiences/shaders/basicShader/BasicShaderExperience';
import { FlagShaderExperience } from './experiences/shaders/flagShader/FlagShaderExperience';
import type { Experiences } from './types/types';

export class Experience extends Scene {
  renderer?: WebGLRenderer | WebGPURenderer;
  camera?: PerspectiveCamera;
  canvas?: HTMLCanvasElement;
  orbitControls?: OrbitControls;
  currentExperience: Experiences | null = null;
  clock: Clock = new Clock();

  constructor() {
    super();
  }

  init() {
    const url = new URL(window.location.href);
    this.initResize();
    this.initStandardScene();
    this.initSceneBasedOnURL(url.pathname);
  }

  initResize() {
    window.addEventListener('resize', () => {
      this.resize();
    });
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.renderer?.setSize(w, h);
    if (this.camera) {
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }
  }

  initSceneBasedOnURL(urlPathName: string) {
    switch (urlPathName) {
      case URLS.baseScene:
        this.initBasicScene();
        return;

      case URLS.materialColor:
        this.initMaterialColorScene();
        return;

      case URLS.geomAndWireframe:
        this.initGeomScene();
        return;

      case URLS.basicShader:
        this.initBasicShaderScene();
        return;

      case URLS.flagShader:
        this.initFlagShaderScene();
        return;

      default:
        this.initBasicScene();
        break;
    }
  }

  initMaterialColorScene() {
    const scene = new MaterialColorExperience(this);
    this.currentExperience = scene;
    scene.init(this);
  }

  initStandardScene() {
    const SIZES = {
      w: window.innerWidth,
      h: window.innerHeight,
    };
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    canvas.style.width = SIZES.w + 'px';
    canvas.style.height = SIZES.h + 'px';

    this.renderer = new WebGLRenderer({
      canvas,
      antialias: true,
    });

    this.renderer.setSize(SIZES.w, SIZES.h);
    this.renderer.setClearColor(0xffffff);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.camera = new PerspectiveCamera(45, SIZES.w / SIZES.h);
    this.camera.position.set(0, 0, 4);
    this.add(this.camera);
    this.orbitControls = new OrbitControls(this.camera, canvas);
  }

  initBasicScene() {
    const basicScene = new BasicSceneExperience(this);
    this.currentExperience = basicScene;
    basicScene.init(this);
  }

  initGeomScene() {
    const geomScene = new GeometryAndWireframeExperience(this);
    this.currentExperience = geomScene;
    geomScene.init(this);
  }

  initBasicShaderScene() {
    const basicScene = new BasicShaderExperience();
    this.currentExperience = basicScene;
    basicScene.init(this);
  }

  initFlagShaderScene() {
    const scene = new FlagShaderExperience();
    this.currentExperience = scene;
    scene.init(this);
  }

  render(deltaTime: number) {
    this.renderer?.render(this, this.camera!);
    this.orbitControls?.update(deltaTime);
  }

  raf() {
    requestAnimationFrame(() => {
      const deltaTime = this.clock.getDelta();
      this.currentExperience?.step(deltaTime);
      this.render(deltaTime);
      this.raf();
    });
  }
}
