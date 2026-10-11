// Hero in three chapters: Le rendez-vous → Le tchin → La vraie Cabane
// (06-roteiros/02-HERO-E-ANIMACAO.md, 07-integracao/timeline.json).
// motionAt(p) keeps the chapters, ranges and amplitudes of the kit's study (08-estudo/portal.js),
// with one change: the foreground layer is registered on the campaign (scripts/register-toast.py),
// so it first sits exactly on the campaign's bottles while the bar dissolves around them, then
// pushes in to the study's close-up (scale 1.24, -18 px). No second group of bottles ever shows.
// The stage is sticky under the header: progress runs over the section height minus the stage.
// Flag for captures: ?p=0.5 freezes the progress.
import toast from '../data/toast.json';

const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));
const range = (p, a, b) => clamp((p - a) / (b - a));
const ease = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

const CHAPTERS = ['01 / Le rendez-vous', '02 / Le tchin', '03 / La vraie Cabane'];
const PREF = 'cabane-motion';
const ZOOM_ORIGIN = [68, 23];      // campaign push-in origin, % of the image (the clinking necks)
const CLOSE_ORIGIN = [65, 50];     // close-up origin of the study, % of the image
const CLOSE_SCALE = 1.24;

export function motionAt(p) {
  p = clamp(p);
  const heroScale = 1 + 0.17 * ease(range(p, 0, 0.65));
  // foreground transform (origin 0 0, translate in % of the image box)
  const fit = ease(range(p, 0.3, 0.62));
  const regScale = heroScale * toast.scale;
  const regX = heroScale * toast.x + ZOOM_ORIGIN[0] * (1 - heroScale);
  const regY = heroScale * toast.y + ZOOM_ORIGIN[1] * (1 - heroScale);
  return {
    p,
    heroScale,
    campaignOpacity: 1 - ease(range(p, 0.2, 0.37)),
    copyOpacity: 1 - ease(range(p, 0.18, 0.52)),
    copyY: -50 * ease(range(p, 0.12, 0.5)),
    shadeOpacity: 1 - ease(range(p, 0.2, 0.45)),
    toastOpacity: ease(range(p, 0.1, 0.2)) * (1 - ease(range(p, 0.58, 0.78))),
    toastScale: lerp(regScale, CLOSE_SCALE, fit),
    toastTx: lerp(regX, CLOSE_ORIGIN[0] * (1 - CLOSE_SCALE), fit),
    toastTy: lerp(regY, CLOSE_ORIGIN[1] * (1 - CLOSE_SCALE), fit),
    toastX: -18 * fit,
    revealOpacity: ease(range(p, 0.64, 0.76)),
    revealInset: 46 * (1 - ease(range(p, 0.65, 1))),
    glintOpacity: Math.sin(Math.PI * range(p, 0.38, 0.59)),
    chapter: p < 0.35 ? 0 : p < 0.7 ? 1 : 2,
  };
}

const readPref = () => { try { return localStorage.getItem(PREF) === 'off'; } catch { return false; } };
const writePref = (off) => { try { off ? localStorage.setItem(PREF, 'off') : localStorage.removeItem(PREF); } catch { /* private mode */ } };

export function initHero() {
  const root = document.documentElement;
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  const stage = hero.querySelector('.hero__stage');
  const toggle = hero.querySelector('[data-motion-toggle]');
  const chapter = hero.querySelector('[data-chapter]');
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const forced = new URLSearchParams(location.search).get('p');

  let manual = readPref();
  let pending = 0;
  let last = null;

  const apply = (m) => {
    const s = hero.style;
    s.setProperty('--p', m.p.toFixed(4));
    s.setProperty('--campaign-opacity', m.campaignOpacity.toFixed(3));
    s.setProperty('--hero-scale', m.heroScale.toFixed(4));
    s.setProperty('--copy-opacity', m.copyOpacity.toFixed(3));
    s.setProperty('--copy-y', `${m.copyY.toFixed(1)}px`);
    s.setProperty('--shade-opacity', m.shadeOpacity.toFixed(3));
    s.setProperty('--toast-opacity', m.toastOpacity.toFixed(3));
    s.setProperty('--toast-scale', m.toastScale.toFixed(4));
    s.setProperty('--toast-tx', `${m.toastTx.toFixed(3)}%`);
    s.setProperty('--toast-ty', `${m.toastTy.toFixed(3)}%`);
    s.setProperty('--toast-x', `${m.toastX.toFixed(1)}px`);
    s.setProperty('--reveal-opacity', m.revealOpacity.toFixed(3));
    s.setProperty('--reveal-inset', `${m.revealInset.toFixed(2)}%`);
    s.setProperty('--glint-opacity', Math.max(0, m.glintOpacity).toFixed(3));
    // a faded title must not keep its links clickable or focusable
    hero.toggleAttribute('data-copy-off', m.copyOpacity < 0.04);
    hero.dataset.chapter = m.chapter;
    chapter.textContent = CHAPTERS[m.chapter];
  };

  const render = () => {
    pending = 0;
    const reduced = manual || media.matches;
    root.classList.toggle('hero-motion', !reduced);
    toggle.disabled = media.matches;
    toggle.setAttribute('aria-pressed', String(reduced));
    toggle.textContent = media.matches ? 'Mouvement réduit' : 'Désactiver l’animation';
    if (reduced) {
      if (last !== 0) { apply(motionAt(0)); last = 0; }
      return;
    }
    let p;
    if (forced !== null) p = clamp(parseFloat(forced) || 0);
    else {
      const top = parseFloat(getComputedStyle(stage).top) || 0;      // sticky offset = header height
      const span = Math.max(hero.offsetHeight - stage.offsetHeight, 1);
      p = clamp((top - hero.getBoundingClientRect().top) / span);
    }
    if (p === last) return;
    last = p;
    apply(motionAt(p));
  };
  const request = () => { if (!pending) pending = requestAnimationFrame(render); };

  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    if (media.matches) return;
    const wasInside = hero.getBoundingClientRect().bottom > innerHeight;
    manual = !manual;
    writePref(manual);
    last = null;
    render();
    // switching off shortens the section: keep the (now static) hero in view
    if (manual && wasInside) scrollTo({ top: 0, behavior: 'instant' });
  });
  media.addEventListener?.('change', () => { last = null; render(); });
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', () => { last = null; request(); }, { passive: true });

  render();
  window.__cabaneReady = true;
}
