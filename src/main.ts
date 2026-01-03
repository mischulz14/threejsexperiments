import { Experience } from './Experience';
import { createApp } from './ui/components/App';

const experience = new Experience();

experience.init();
experience.raf();

createApp();
