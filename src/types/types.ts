import type { BasicSceneExperience } from '../experiences/basic/BasicSceneExperience';
import type { BasicShaderExperience } from '../experiences/basicShader/BasicShaderExperience';
import type { GeometryAndWireframeExperience } from '../experiences/geomAndWirefrane/GeometryAndWireframeExperience';
import type { MaterialColorExperience } from '../experiences/materialColor/MaterialColorExperience';

export type Experiences =
  | BasicSceneExperience
  | GeometryAndWireframeExperience
  | MaterialColorExperience
  | BasicShaderExperience;

export interface IExperience {
  step: (deltaTime: number) => void;
  experienceName: string;
}

export interface ResourceLink {
  label?: string;
  url: string;
}

export type InfoPanelInfo = 'info' | 'challenge' | 'resources' | 'notes';
