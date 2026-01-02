import { Experience } from './Experience';
import { createApp } from './ui/app';

const experience = new Experience();

createApp();

experience.initBasicScene();
experience.render();
