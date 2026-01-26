import type { BasicSceneExperience } from '../experiences/basic/BasicSceneExperience';
import type { GeometryAndWireframeExperience } from '../experiences/geomAndWirefrane/GeometryAndWireframeExperience';
import type { MaterialColorExperience } from '../experiences/materialColor/MaterialColorExperience';
import type { ModelExperience } from '../experiences/model/ModelExperience';
import type { BasicShaderExperience } from '../experiences/shaders/basicShader/BasicShaderExperience';

export type Experiences =
  | BasicSceneExperience
  | GeometryAndWireframeExperience
  | MaterialColorExperience
  | BasicShaderExperience
  | ModelExperience;

export interface IExperience {
  step: (deltaTime: number) => void;
  experienceName: string;
}

export interface ResourceLink {
  label?: string;
  url: string;
}

export type InfoPanelInfo = 'info' | 'challenge' | 'resources' | 'notes';
