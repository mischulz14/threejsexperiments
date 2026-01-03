import type { JSX } from 'react';
import { Pane } from 'tweakpane';

import BasicSceneChallenge from '../experiences/basic/Challenge';
import BasicSceneInfo from '../experiences/basic/Info';
import BasicSceneNotes from '../experiences/basic/Notes';
import BasicSceneResources from '../experiences/basic/Resources';
import GeomChallenge from '../experiences/geomAndWirefrane/Challenge';
import GeomInfo from '../experiences/geomAndWirefrane/Info';
import GeomNotes from '../experiences/geomAndWirefrane/Notes';
import GeomResources from '../experiences/geomAndWirefrane/Resources';

export const URLS = {
  baseScene: '/',
  materialColor: '/materialColor',
  geomAndWireframe: '/geomAndWireframe',
};

export const EXPERIMENTS = [
  {
    name: 'Basic Scene',
    url: URLS.baseScene,
    info: BasicSceneInfo,
    challenge: BasicSceneChallenge,
    resources: BasicSceneResources,
    notes: BasicSceneNotes,
  },
  {
    name: 'Material Color',
    url: URLS.materialColor,
  },
  {
    name: 'Geometries And Wireframe',
    url: URLS.geomAndWireframe,
    info: GeomInfo,
    challenge: GeomChallenge,
    resources: GeomResources,
    notes: GeomNotes,
  },
] satisfies {
  name: string;
  url: string;
  info?: () => JSX.Element;
  challenge?: () => JSX.Element;
  resources?: () => JSX.Element;
  notes?: () => JSX.Element;
}[];

export const debugPane = new Pane({
  title: 'Debug',
});
