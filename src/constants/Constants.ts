import { Pane } from 'tweakpane';

export const URLS = {
  baseScene: '/',
  materialColor: '/materialColor',
  geomAndWireframe: '/geomAndWireframe',
};

export const EXPERIMENTS = [
  {
    name: 'Basic Scene',
    url: URLS.baseScene,
  },
  {
    name: 'Geometries And Wireframe',
    url: URLS.geomAndWireframe,
  },
  {
    name: 'Material Color',
    url: URLS.materialColor,
  },
];

export const debugPane = new Pane({
  title: 'Debug',
});
