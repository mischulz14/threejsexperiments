import { Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import {
  PerspectiveCamera,
  type OrthographicCamera,
  type WebGPURenderer,
} from 'three/webgpu';
import { BasicSceneExperience } from './experiences/BasicSceneExperience';
import { URLS } from './constants/Constants';

export class Experience extends Scene {
  renderer?: WebGLRenderer | WebGPURenderer;
  camera?: OrthographicCamera | PerspectiveCamera;
  canvas?: HTMLCanvasElement;
  orbitControls?: OrbitControls;

  constructor() {
    super();
  }

  init() {
    const url = new URL(window.location.href);
    this.initSceneBasedOnURL(url.pathname);
  }

  initSceneBasedOnURL(urlPathName: string) {
    switch (urlPathName) {
      case URLS.baseScene:
        this.initBasicScene();
        return;

      default:
        this.initBasicScene();
        break;
    }
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
    this.initStandardScene();
    const basicScene = new BasicSceneExperience(this);
    basicScene.init(this);
  }

  render() {
    this.renderer?.render(this, this.camera!);
    this.orbitControls?.update();

    requestAnimationFrame(() => this.render());
  }
}
