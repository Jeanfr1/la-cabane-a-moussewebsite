// Header: compact logo once the page moves, mobile menu with Escape/close-on-link.
export function initNav() {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-menu-toggle]');
  const label = document.querySelector('[data-menu-label]');
  const menu = document.getElementById('menu');

  const onScroll = () => root.classList.toggle('scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!toggle || !menu) return;
  const setOpen = (open) => {
    root.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'Fermer le menu' : 'Ouvrir le menu';
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.classList.contains('menu-open')) { setOpen(false); toggle.focus(); }
  });
  matchMedia('(min-width: 900px)').addEventListener('change', () => setOpen(false));
}

// Highlight today's opening-hours row (Herbignac time), the only visitor-dependent detail.
export function initHours() {
  const list = document.querySelector('[data-hours]');
  if (!list) return;
  const day = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Paris' })).getDay();
  for (const li of list.children) {
    if (li.dataset.days.split(',').map(Number).includes(day)) li.classList.add('is-today');
  }
}
