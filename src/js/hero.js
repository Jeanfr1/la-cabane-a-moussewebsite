// Hero: "pessoa acima → boca aberta abaixo" (06-roteiros/MOTION.md).
// Scroll progress p ∈ [0,1] over the pinned track drives:
//   0.15–0.25  camera push 1 → 1.025 on the whole scene (no anatomy moves)
//   0.25–0.60  the stream is revealed from the bottle neck down to the mouth
//   ≥ 0.60     contact: timed crossfade to the final photo (550 ms) + a short splash flash
//   0.75–0.90  warm sun reading of the full photo
// Flags: ?p=0.42 freezes the progress (captures), ?nosmooth disables easing.
import scene from '../data/scene.json';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ramp = (p, a, b) => clamp((p - a) / (b - a));
const smooth = (t) => t * t * (3 - 2 * t);

export function initHero() {
  const root = document.documentElement;
  const track = document.querySelector('[data-hero-track]');
  const stage = document.querySelector('[data-hero-stage]');
  const sceneEl = document.querySelector('[data-scene]');
  if (!track || !stage || !sceneEl) return;
  const cam = sceneEl.querySelector('[data-cam]');
  const stream = sceneEl.querySelector('[data-stream]');
  const sky = document.querySelector('[data-sky]');

  const params = new URLSearchParams(location.search);
  const frozen = params.has('p') ? clamp(parseFloat(params.get('p')) || 0) : null;
  const ease = params.has('nosmooth') ? 1 : 0.2;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  const { timeline: T, stream: S, reveal: R, horizon: HZ, sky: SK, canvas } = scene;
  const CH = canvas[1];

  // Map the sky plate (a crop of hero-desktop.png) in scene units so both horizons meet,
  // the plate covers the stage's left edge and the desktop people stay under the opaque scene.
  function layoutSky() {
    if (!sky) return;
    const box = sky.parentElement.getBoundingClientRect();   // .hero__visual, the sky's containing block
    const sc = sceneEl.getBoundingClientRect();
    const k = sc.height / CH;                          // px per scene unit
    if (!k) return;
    const left = (sc.left - box.left) / k;             // units from the visual's edge to the scene's edge
    const f = Math.max(2.1, (SK.keepX + left) / SK.peopleX);  // scene units per desktop px
    Object.assign(sky.style, {
      left: '0px',
      top: `${sc.top - box.top + (HZ.scene - (HZ.desktop - SK.y) * f) * k}px`,
      width: `${SK.w * f * k}px`,
      height: `${SK.h * f * k}px`,
    });
    sky.classList.add('is-mapped');
  }

  let target = 0;
  let current = -1;
  let raf = 0;
  let geometry = { start: 0, length: 1 };

  function measure() {
    const top = track.getBoundingClientRect().top + scrollY;
    const hh = parseFloat(getComputedStyle(root).getPropertyValue('--hh')) || 0;
    geometry = { start: top - hh, length: Math.max(1, track.offsetHeight - stage.offsetHeight) };
  }

  function readScroll() {
    target = frozen ?? clamp((scrollY - geometry.start) / geometry.length);
  }

  function render(p) {
    const zoom = 1 + (T.zoom - 1) * smooth(ramp(p, T.prep[0], T.prep[1]));
    cam.style.transform = `scale(${zoom.toFixed(4)})`;

    const q = ramp(p, T.pour[0], T.pour[1]);
    const front = R.from + (R.to - R.from) * q;          // scene units
    stream.style.setProperty('--front', `${(((front - S.y) / S.h) * 100).toFixed(2)}%`);
    stream.style.setProperty('--feather', `${((R.feather / S.h) * 100).toFixed(2)}%`);
    sceneEl.style.setProperty('--front-scene', `${((front / CH) * 100).toFixed(2)}%`);

    const contact = p >= T.contact;
    sceneEl.classList.toggle('is-contact', contact);

    // the glint rides the stream while it falls, then settles to a faint line until release
    const glint = q > 0 ? (q < 1 ? 0.42 * Math.sin(Math.PI * Math.min(1, q * 1.15)) + 0.12 : 0.24) : 0;
    sceneEl.style.setProperty('--glint', (glint * (1 - ramp(p, 0.9, 1))).toFixed(3));
    sceneEl.querySelector('[data-glint]').style.strokeDashoffset = `${(-p * 260).toFixed(1)}`;

    sceneEl.style.setProperty('--sun', smooth(ramp(p, T.read[0], T.read[1])).toFixed(3));
    stage.dataset.progress = p.toFixed(3);
  }

  function tick() {
    raf = 0;
    const delta = target - current;
    // long jumps (anchor links, ?p=) snap; small ones ease
    current = Math.abs(delta) > 0.25 || ease === 1 || current < 0 ? target : current + delta * ease;
    if (Math.abs(target - current) < 0.0005) current = target;
    render(current);
    if (current !== target) raf = requestAnimationFrame(tick);
  }
  const queue = () => { if (!raf) raf = requestAnimationFrame(tick); };

  function onScroll() { readScroll(); queue(); }
  function onResize() { measure(); layoutSky(); readScroll(); queue(); }

  function start() {
    root.classList.add('hero-motion');
    measure(); layoutSky(); readScroll(); current = -1; queue();
    addEventListener('scroll', onScroll, { passive: true });
  }
  function stop() {
    removeEventListener('scroll', onScroll);
    cancelAnimationFrame(raf); raf = 0;
    root.classList.remove('hero-motion');
    sceneEl.classList.remove('is-contact');
    cam.style.transform = '';
    layoutSky();
  }

  addEventListener('resize', onResize);
  new ResizeObserver(() => layoutSky()).observe(stage);
  reduced.addEventListener('change', () => (reduced.matches ? stop() : start()));
  if (reduced.matches) stop(); else start();
  window.__cabaneReady = true;
}
