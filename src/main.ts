import { Experience } from './Experience';
import { createApp } from './ui/components/App';

export const experience = new Experience();

experience.init();
experience.raf();

createApp();
