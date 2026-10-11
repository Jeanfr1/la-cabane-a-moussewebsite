import '@fontsource-variable/inter/wght.css';
import '@fontsource/barlow-condensed/latin-600.css';
import '@fontsource/barlow-condensed/latin-700.css';
import './styles/base.css';
import './styles/hero.css';
import './styles/sections.css';
import { initHero } from './js/hero.js';
import { initReveal, initDrift } from './js/reveal.js';
import { initNav, initHours } from './js/nav.js';

initNav();
initHero();
initReveal();
initDrift();
initHours();
