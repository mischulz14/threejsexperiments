import {
  BoxGeometry,
  type Camera,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  EdgesGeometry,
  Group,
  LineDashedMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  Object3D,
  Plane,
  Raycaster,
  type Scene,
  SphereGeometry,
  TorusGeometry,
  Vector2,
  Vector3,
} from 'three';

import type { Experience } from '../../Experience';
import type { IExperience } from '../../types/types';

const COLORS = {
  x: 0xe74c3c,
  y: 0x2ecc71,
  z: 0x3498db,
  hover: 0xffff00,
  scale: 0xf39c12,
};

class TransformGizmo extends Group {
  target: Object3D | null = null;
  private boundingBox: LineSegments | null = null;
  private translationGroup: Group;
  private scaleGroup: Group;
  private rotationGroup: Group;

  private raycaster = new Raycaster();
  private mouse = new Vector2();
  private activeHandle: Object3D | null = null;
  private isDragging = false;

  private dragStartPoint = new Vector3();
  private dragPlane = new Plane();
  private axisDirection = new Vector3();

  private initialScale = new Vector3();
  private initialPosition = new Vector3();
  private initialRotation = new Vector3();
  private objectCenter = new Vector3();

  private camera: Camera;
  private domElement: HTMLElement;
  private scene: Scene;

  constructor(camera: Camera, domElement: HTMLElement, scene: Scene) {
    super();
    this.camera = camera;
    this.domElement = domElement;
    this.scene = scene;

    this.translationGroup = new Group();
    this.translationGroup.name = 'translation';
    this.scaleGroup = new Group();
    this.scaleGroup.name = 'scale';
    this.rotationGroup = new Group();
    this.rotationGroup.name = 'rotation';

    this.add(this.translationGroup);
    this.add(this.scaleGroup);
    this.add(this.rotationGroup);

    this.createTranslationHandles();
    this.createScaleHandles();
    this.createRotationHandles();

    this.setupEventListeners();
  }

  attach(object: Object3D) {
    this.target = object;
    this.updateFromTarget();
    this.visible = true;
    this.createBoundingBox();
  }

  detach() {
    this.target = null;
    this.visible = false;
    if (this.boundingBox) {
      this.remove(this.boundingBox);
      this.boundingBox = null;
    }
  }

  private createBoundingBox() {
    if (this.boundingBox) {
      this.remove(this.boundingBox);
    }

    if (!this.target) return;

    const box = new BoxGeometry(1, 1, 1);
    const edges = new EdgesGeometry(box);

    const material = new LineDashedMaterial({
      color: 0x4a90d9,
      dashSize: 0.05,
      gapSize: 0.03,
      linewidth: 1,
    });

    this.boundingBox = new LineSegments(edges, material);
    this.boundingBox.computeLineDistances();
    this.boundingBox.name = 'boundingBox';

    if (this.target instanceof Mesh && this.target.geometry) {
      this.target.geometry.computeBoundingBox();
      const bbox = this.target.geometry.boundingBox;
      if (bbox) {
        const size = new Vector3();
        bbox.getSize(size);
        this.boundingBox.scale
          .copy(size)
          .multiply(this.target.scale)
          .multiplyScalar(1.1);
      }
    }

    this.add(this.boundingBox);
  }

  private createTranslationHandles() {
    const axes: Array<{ axis: 'x' | 'y' | 'z'; dir: Vector3 }> = [
      { axis: 'x', dir: new Vector3(1, 0, 0) },
      { axis: 'y', dir: new Vector3(0, 1, 0) },
      { axis: 'z', dir: new Vector3(0, 0, 1) },
    ];

    axes.forEach(({ axis, dir }) => {
      const arrow = this.createArrow(COLORS[axis], dir);
      arrow.name = `translate_${axis}`;
      arrow.userData = { type: 'translate', axis };
      this.translationGroup.add(arrow);
    });
  }

  private createArrow(color: number, direction: Vector3): Group {
    const group = new Group();

    const shaftGeom = new CylinderGeometry(0.02, 0.02, 0.5, 8);
    const shaftMat = new MeshBasicMaterial({ color });
    const shaft = new Mesh(shaftGeom, shaftMat);
    shaft.position.y = 0.25;

    const headGeom = new ConeGeometry(0.06, 0.15, 12);
    const headMat = new MeshBasicMaterial({ color });
    const head = new Mesh(headGeom, headMat);
    head.position.y = 0.55;

    group.add(shaft);
    group.add(head);

    if (direction.x === 1) {
      group.rotation.z = -Math.PI / 2;
    } else if (direction.z === 1) {
      group.rotation.x = Math.PI / 2;
    }

    return group;
  }

  private createScaleHandles() {
    const positions: Array<{
      axis: 'x' | 'y' | 'z';
      pos: Vector3;
      negative: boolean;
    }> = [
      { axis: 'x', pos: new Vector3(0.6, 0, 0), negative: false },
      { axis: 'x', pos: new Vector3(-0.6, 0, 0), negative: true },
      { axis: 'y', pos: new Vector3(0, 0.6, 0), negative: false },
      { axis: 'y', pos: new Vector3(0, -0.6, 0), negative: true },
      { axis: 'z', pos: new Vector3(0, 0, 0.6), negative: false },
      { axis: 'z', pos: new Vector3(0, 0, -0.6), negative: true },
    ];

    positions.forEach(({ axis, pos, negative }) => {
      const sphereGeom = new SphereGeometry(0.05, 16, 16);
      const sphereMat = new MeshBasicMaterial({ color: COLORS.scale });
      const sphere = new Mesh(sphereGeom, sphereMat);
      sphere.position.copy(pos);
      sphere.name = `scale_${axis}_${negative ? 'neg' : 'pos'}`;
      sphere.userData = { type: 'scale', axis, negative };
      this.scaleGroup.add(sphere);
    });
  }

  private createRotationHandles() {
    const axes: Array<{
      axis: 'x' | 'y' | 'z';
      rotation: Vector3;
      color: number;
    }> = [
      { axis: 'x', rotation: new Vector3(0, Math.PI / 2, 0), color: COLORS.x },
      { axis: 'y', rotation: new Vector3(Math.PI / 2, 0, 0), color: COLORS.y },
      { axis: 'z', rotation: new Vector3(0, 0, 0), color: COLORS.z },
    ];

    axes.forEach(({ axis, rotation, color }) => {
      const torusGeom = new TorusGeometry(0.55, 0.015, 8, 48, Math.PI * 0.5);
      const torusMat = new MeshBasicMaterial({
        color,
        side: DoubleSide,
      });
      const torus = new Mesh(torusGeom, torusMat);
      torus.rotation.set(rotation.x, rotation.y, rotation.z);
      torus.name = `rotate_${axis}`;
      torus.userData = { type: 'rotate', axis };

      const arrowGeom = new ConeGeometry(0.04, 0.1, 8);
      const arrowMat = new MeshBasicMaterial({ color });
      const arrow = new Mesh(arrowGeom, arrowMat);

      if (axis === 'x') {
        arrow.position.set(0, 0.55, 0);
        arrow.rotation.z = Math.PI / 2;
        torus.add(arrow);
      } else if (axis === 'y') {
        arrow.position.set(0.55, 0, 0);
        arrow.rotation.z = Math.PI;
        torus.add(arrow);
      } else {
        arrow.position.set(0, 0.55, 0);
        arrow.rotation.x = Math.PI;
        torus.add(arrow);
      }

      this.rotationGroup.add(torus);
    });
  }

  private setupEventListeners() {
    this.domElement.addEventListener('pointermove', this.onPointerMove);
    this.domElement.addEventListener('pointerdown', this.onPointerDown);
    this.domElement.addEventListener('pointerup', this.onPointerUp);
  }

  private getAxisVector(axis: string): Vector3 {
    if (axis === 'x') return new Vector3(1, 0, 0);
    if (axis === 'y') return new Vector3(0, 1, 0);
    return new Vector3(0, 0, 1);
  }

  private setupDragPlane(axis: string, point: Vector3) {
    this.axisDirection = this.getAxisVector(axis);

    // Create a plane that contains the axis and faces the camera
    const cameraDir = new Vector3();
    this.camera.getWorldDirection(cameraDir);

    // Get a vector perpendicular to both the axis and camera direction
    const planeNormal = new Vector3().crossVectors(
      this.axisDirection,
      cameraDir,
    );

    // If parallel, use a different approach
    if (planeNormal.lengthSq() < 0.001) {
      planeNormal.crossVectors(this.axisDirection, new Vector3(0, 1, 0));
      if (planeNormal.lengthSq() < 0.001) {
        planeNormal.crossVectors(this.axisDirection, new Vector3(1, 0, 0));
      }
    }

    planeNormal.normalize();

    // Make the plane contain the axis by crossing again
    const finalNormal = new Vector3().crossVectors(
      this.axisDirection,
      planeNormal,
    );
    finalNormal.normalize();

    this.dragPlane.setFromNormalAndCoplanarPoint(finalNormal, point);
  }

  private intersectDragPlane(): Vector3 | null {
    const intersection = new Vector3();
    const ray = this.raycaster.ray;

    if (ray.intersectPlane(this.dragPlane, intersection)) {
      return intersection;
    }
    return null;
  }

  private onPointerMove = (event: PointerEvent) => {
    this.updateMouse(event);

    if (this.isDragging && this.activeHandle && this.target) {
      this.handleDrag();
      return;
    }

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const allHandles = [
      ...this.translationGroup.children,
      ...this.scaleGroup.children,
      ...this.rotationGroup.children,
    ];

    const intersects = this.raycaster.intersectObjects(allHandles, true);

    allHandles.forEach((handle) => {
      handle.traverse((child) => {
        if (child instanceof Mesh) {
          const originalColor = this.getOriginalColor(handle);
          (child.material as MeshBasicMaterial).color.setHex(originalColor);
        }
      });
    });

    if (intersects.length > 0) {
      let handle = intersects[0].object;
      while (handle.parent && !handle.userData.type) {
        handle = handle.parent;
      }
      handle.traverse((child) => {
        if (child instanceof Mesh) {
          (child.material as MeshBasicMaterial).color.setHex(COLORS.hover);
        }
      });
      this.domElement.style.cursor = 'pointer';
    } else {
      this.domElement.style.cursor = 'default';
    }
  };

  private onPointerDown = (event: PointerEvent) => {
    this.updateMouse(event);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const allHandles = [
      ...this.translationGroup.children,
      ...this.scaleGroup.children,
      ...this.rotationGroup.children,
    ];

    const intersects = this.raycaster.intersectObjects(allHandles, true);

    if (intersects.length > 0 && this.target) {
      let handle = intersects[0].object;
      while (handle.parent && !handle.userData.type) {
        handle = handle.parent;
      }

      this.activeHandle = handle;
      this.isDragging = true;

      this.initialScale.copy(this.target.scale);
      this.initialPosition.copy(this.target.position);
      this.initialRotation.set(
        this.target.rotation.x,
        this.target.rotation.y,
        this.target.rotation.z,
      );
      this.objectCenter.copy(this.target.position);

      const axis = handle.userData.axis;
      this.setupDragPlane(axis, this.target.position);

      const startIntersection = this.intersectDragPlane();
      if (startIntersection) {
        this.dragStartPoint.copy(startIntersection);
      }
    }
  };

  private onPointerUp = () => {
    this.isDragging = false;
    this.activeHandle = null;
    this.domElement.style.cursor = 'default';
  };

  private handleDrag() {
    if (!this.activeHandle || !this.target) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const currentIntersection = this.intersectDragPlane();
    if (!currentIntersection) return;

    const { type, axis, negative } = this.activeHandle.userData;

    // Calculate movement along the axis
    const delta = currentIntersection.clone().sub(this.dragStartPoint);
    const axisMovement = delta.dot(this.axisDirection);

    if (type === 'translate') {
      const movement = this.axisDirection.clone().multiplyScalar(axisMovement);
      this.target.position.copy(this.initialPosition.clone().add(movement));
    } else if (type === 'scale') {
      const scaleSensitivity = 2;
      let scaleDelta = axisMovement * scaleSensitivity;

      // Invert for negative handles
      if (negative) {
        scaleDelta = -scaleDelta;
      }

      const newScale = Math.max(0.1, 1 + scaleDelta);

      if (axis === 'x') {
        this.target.scale.x = this.initialScale.x * newScale;
      } else if (axis === 'y') {
        this.target.scale.y = this.initialScale.y * newScale;
      } else {
        this.target.scale.z = this.initialScale.z * newScale;
      }

      this.createBoundingBox();
    } else if (type === 'rotate') {
      const rotationSensitivity = 2;
      const rotationDelta = axisMovement * rotationSensitivity;

      if (axis === 'x') {
        this.target.rotation.x = this.initialRotation.x + rotationDelta;
      } else if (axis === 'y') {
        this.target.rotation.y = this.initialRotation.y + rotationDelta;
      } else {
        this.target.rotation.z = this.initialRotation.z + rotationDelta;
      }
    }

    this.updateFromTarget();
  }

  private getOriginalColor(handle: Object3D): number {
    const { type, axis } = handle.userData;
    if (type === 'scale') return COLORS.scale;
    return COLORS[axis as 'x' | 'y' | 'z'];
  }

  private updateMouse(event: PointerEvent) {
    const rect = this.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private updateFromTarget() {
    if (!this.target) return;
    this.position.copy(this.target.position);
  }

  update() {
    if (this.target) {
      this.updateFromTarget();
    }
  }

  dispose() {
    this.domElement.removeEventListener('pointermove', this.onPointerMove);
    this.domElement.removeEventListener('pointerdown', this.onPointerDown);
    this.domElement.removeEventListener('pointerup', this.onPointerUp);
  }
}

export class GizmoSceneExperience implements IExperience {
  experience: Experience;
  experienceName: string = 'Gizmo Scene';
  private gizmo: TransformGizmo | null = null;
  private targetMesh: Mesh | null = null;

  constructor(experience: Experience) {
    this.experience = experience;
  }

  init(experience: Experience) {
    const cubeGeom = new BoxGeometry(1, 1, 1);
    const mat = new MeshNormalMaterial();
    this.targetMesh = new Mesh(cubeGeom, mat);

    experience.add(this.targetMesh);

    this.gizmo = new TransformGizmo(
      experience.camera,
      experience.renderer.domElement,
      experience.scene,
    );

    experience.add(this.gizmo);
    this.gizmo.attach(this.targetMesh);
  }

  step() {
    if (this.gizmo) {
      this.gizmo.update();
    }
  }
}
