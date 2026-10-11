// Scroll reveals. The hidden state lives under .reveal-on, which this module adds itself
// right before observing: if the bundle never runs, everything stays visible.
export function initReveal() {
  const items = [...document.querySelectorAll('[data-reveal]')];
  if (!items.length || !('IntersectionObserver' in window)) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // stagger siblings that share a parent
  const groups = new Map();
  for (const el of items) {
    const n = groups.get(el.parentElement) ?? 0;
    el.style.setProperty('--i', n);
    groups.set(el.parentElement, n + 1);
  }

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  document.documentElement.classList.add('reveal-on');
  items.forEach((el) => io.observe(el));
}

// Gentle parallax for the cave collage: translate only, motion-safe.
export function initDrift() {
  const els = [...document.querySelectorAll('[data-drift]')];
  if (!els.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let raf = 0;
  const update = () => {
    raf = 0;
    const vh = innerHeight;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      const offset = (r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.drift);
      el.style.translate = `0 ${offset.toFixed(1)}px`;
    }
  };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
  addEventListener('resize', update);
  update();
}
