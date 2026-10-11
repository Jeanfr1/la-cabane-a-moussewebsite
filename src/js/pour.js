// The pour (brief reference: person above tips the bottle, the liquid crosses into the next
// frame, person below catches it). The woman stands in the hero, the man in #bar; as the page
// scrolls, the beer leaves the bottle and falls across the boundary into his mouth.
//
// Timing is computed from the live geometry so the whole fall happens on screen:
//   the pour starts when the bottle neck is at `start` px from the top of the viewport and ends
//   when it reaches `end`, chosen so the mouth sits at ≤ 78% of the viewport at contact.
// Flags: ?p=0.5 freezes the pour (captures), ?nosmooth disables easing.
import pour from '../data/pour.json';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export function initPour() {
  const root = document.documentElement;
  const rig = document.querySelector('[data-pour]');
  const stream = rig?.querySelector('[data-stream]');
  if (!rig || !stream) return;

  const params = new URLSearchParams(location.search);
  const frozen = params.has('p') ? clamp(parseFloat(params.get('p')) || 0) : null;
  const ease = params.has('nosmooth') ? 1 : 0.34;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  const S = pour.layers.stream;
  const neckU = pour.neck[1], mouthU = pour.mouth[1];
  const toStream = (u) => ((u - S.y) / S.h) * 100;           // rig units → % of stream height

  let unit = 1, target = 0, current = -1, raf = 0, contact = false;

  function measure() {
    unit = rig.getBoundingClientRect().height / pour.rig[1];
  }

  function readScroll() {
    if (frozen !== null) { target = frozen; return; }
    const top = rig.getBoundingClientRect().top;
    const vh = innerHeight;
    const neck = top + neckU * unit;
    const gap = (mouthU - neckU) * unit;
    const end = Math.min(vh * 0.42, vh * 0.78 - gap);
    const start = end + Math.max(vh * 0.34, 240);
    target = clamp((start - neck) / (start - end));
  }

  function render(q) {
    const front = pour.streamStart + (pour.streamEnd - pour.streamStart) * q;
    stream.style.setProperty('--front', `${toStream(front).toFixed(2)}%`);
    rig.classList.toggle('is-waiting', q <= 0.001);
    rig.classList.toggle('is-flowing', q >= 0.999);
    // contact fires once per arrival; scrolling back above 90% re-arms it
    if (q >= 0.999 && !contact) { contact = true; rig.classList.add('is-contact'); }
    else if (q < 0.9 && contact) { contact = false; rig.classList.remove('is-contact'); }
    rig.dataset.progress = q.toFixed(3);
  }

  function tick() {
    raf = 0;
    const delta = target - current;
    current = current < 0 || ease === 1 || Math.abs(delta) > 0.5 ? target : current + delta * ease;
    if (Math.abs(target - current) < 0.001) current = target;
    render(current);
    if (current !== target) raf = requestAnimationFrame(tick);
  }
  const queue = () => { if (!raf) raf = requestAnimationFrame(tick); };
  const onScroll = () => { readScroll(); queue(); };
  const onResize = () => { if (!root.classList.contains('pour-motion')) return; measure(); readScroll(); queue(); };

  function start() {
    root.classList.add('pour-motion');
    measure(); readScroll(); current = -1; queue();
    addEventListener('scroll', onScroll, { passive: true });
  }
  function stop() {
    removeEventListener('scroll', onScroll);
    cancelAnimationFrame(raf); raf = 0;
    root.classList.remove('pour-motion');
    rig.classList.remove('is-waiting', 'is-flowing', 'is-contact');
  }

  addEventListener('resize', onResize);
  reduced.addEventListener('change', () => (reduced.matches ? stop() : start()));
  if (reduced.matches) stop(); else start();
  window.__cabaneReady = true;
}
