import type { BasicSceneExperience } from '../experiences/BasicSceneExperience';
import type { GeometryAndWireframeExperience } from '../experiences/GeometryAndWireframeExperience';
import type { MaterialColorExperience } from '../experiences/MaterialColorExperience';

export type Experiences =
  | BasicSceneExperience
  | GeometryAndWireframeExperience
  | MaterialColorExperience;

export interface IExperience {
  step: (deltaTime: number) => void;
}
