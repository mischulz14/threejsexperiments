import type { BasicSceneExperience } from '../experiences/basic/BasicSceneExperience';
import type { GeometryAndWireframeExperience } from '../experiences/geomAndWirefrane/GeometryAndWireframeExperience';
import type { MaterialColorExperience } from '../experiences/materialColor/MaterialColorExperience';

export type Experiences =
  | BasicSceneExperience
  | GeometryAndWireframeExperience
  | MaterialColorExperience;

export interface IExperience {
  step: (deltaTime: number) => void;
  experienceName: string;
}

export interface ResourceLink {
  label?: string;
  url: string;
}

export type InfoPanelInfo = 'info' | 'challenge' | 'resources' | 'notes';
