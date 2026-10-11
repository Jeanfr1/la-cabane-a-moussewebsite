import '@fontsource-variable/inter/wght.css';
import './styles/base.css';
import './styles/hero.css';
import './styles/sections.css';
import { initHero } from './js/hero.js';
import { initReveal } from './js/reveal.js';
import { initNav, initHours } from './js/nav.js';

initNav();
initHero();
initReveal();
initHours();
