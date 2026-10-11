import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import { site, jsonLd } from './src/data/site.js';

const images = JSON.parse(readFileSync(new URL('./src/data/images.json', import.meta.url)));
const pour = JSON.parse(readFileSync(new URL('./src/data/pour.json', import.meta.url)));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

// <x-pic name="amizade" alt="…" sizes="…" class="…" style="…" loading="lazy" fetchpriority="high"></x-pic>
function picture(tag) {
  const name = attr(tag, 'name');
  const img = images[name];
  if (!img) throw new Error(`x-pic: unknown image "${name}"`);
  const sizes = attr(tag, 'sizes') || '100vw';
  const cls = attr(tag, 'class');
  const style = attr(tag, 'style');
  const alt = attr(tag, 'alt') ?? '';
  const loading = attr(tag, 'loading') || 'lazy';
  const priority = attr(tag, 'fetchpriority');
  const srcset = (list) => list.map((u, i) => `${u} ${img.widths[i]}w`).join(', ');
  const fallback = img.webp[Math.min(1, img.webp.length - 1)];
  return `<picture${cls ? ` class="${cls}"` : ''}${style ? ` style="${style}"` : ''}>`
    + `<source type="image/avif" srcset="${srcset(img.avif)}" sizes="${sizes}">`
    + `<source type="image/webp" srcset="${srcset(img.webp)}" sizes="${sizes}">`
    + `<img src="${fallback}" width="${img.w}" height="${img.h}" alt="${esc(alt)}"`
    + ` loading="${loading}" decoding="async"${priority ? ` fetchpriority="${priority}"` : ''}>`
    + `</picture>`;
}

function logo(tag) {
  const l = images.logo;
  const cls = attr(tag, 'class');
  return `<picture${cls ? ` class="${cls}"` : ''}>`
    + `<source type="image/webp" srcset="${l.webp.map((u, i) => `${u} ${l.widths[i]}w`).join(', ')}" sizes="${attr(tag, 'sizes') || '128px'}">`
    + `<img src="${l.png[0]}" width="${l.w}" height="${l.h}" alt="${esc(attr(tag, 'alt') ?? '')}" decoding="async">`
    + `</picture>`;
}

const hoursList = site.hours
  .map((h) => `<li data-days="${h.days.join(',')}"><span>${h.label}</span><span>${h.value}</span></li>`)
  .join('');

// Pour rig layers, in rig units (src/data/pour.json, from scripts/measure-pour.py).
const box = ({ x, y, w, h }) => `--x:${x};--y:${y};--w:${w};--h:${h}`;
const point = ([x, y]) => `--x:${x};--y:${y}`;

// The facade's crossed black slats, drawn as a seamless tile from a seeded random sequence.
function mikado() {
  const W = 1200, H = 760;
  let seed = 20261011;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const sticks = [];
  for (let i = 0; i < 64; i++) {
    const cx = rnd() * W, cy = rnd() * H;
    const vertical = rnd() < 0.3;
    const a = vertical ? (Math.PI / 2) + (rnd() - 0.5) * 0.25 : (rnd() < 0.5 ? 1 : -1) * (0.35 + rnd() * 0.75);
    const len = 220 + rnd() * 340;
    const dx = Math.cos(a) * len / 2, dy = Math.sin(a) * len / 2;
    const w = (8 + rnd() * 5).toFixed(1);
    for (const ox of [-W, 0, W]) for (const oy of [-H, 0, H]) {
      const x1 = cx - dx + ox, y1 = cy - dy + oy, x2 = cx + dx + ox, y2 = cy + dy + oy;
      if (Math.max(x1, x2) < -20 || Math.min(x1, x2) > W + 20 || Math.max(y1, y2) < -20 || Math.min(y1, y2) > H + 20) continue;
      sticks.push(`<path d="M${x1.toFixed(0)} ${y1.toFixed(0)}L${x2.toFixed(0)} ${y2.toFixed(0)}" stroke-width="${w}"/>`);
    }
  }
  return `<svg class="mikado" aria-hidden="true" focusable="false"><defs><pattern id="slats" width="${W}" height="${H}" patternUnits="userSpaceOnUse">`
    + `<g stroke="#141211" stroke-linecap="square" transform="translate(3 4)" opacity=".55">${sticks.join('')}</g>`
    + `<g stroke="#1B1918" stroke-linecap="square">${sticks.join('')}</g>`
    + `</pattern></defs><rect width="100%" height="100%" fill="url(#slats)"/></svg>`;
}

const tokens = {
  ...Object.fromEntries(Object.entries(site).filter(([, v]) => typeof v === 'string').map(([k, v]) => [`site.${k}`, esc(v)])),
  hoursList,
  jsonLd: JSON.stringify(jsonLd),
  'pour.woman': box(pour.layers.woman),
  'pour.man': box(pour.layers.man),
  // the shine is masked by the stream's own alpha: same AVIF as the <picture> (cached), WebP fallback
  'pour.stream': `${box(pour.layers.stream)};--shine-webp:url(${images['pour-stream'].webp.at(-1)});`
    + `--shine:image-set(url(${images['pour-stream'].avif.at(-1)}) type('image/avif'), url(${images['pour-stream'].webp.at(-1)}) type('image/webp'))`,
  'pour.neck': point(pour.neck),
  'pour.mouth': point(pour.mouth),
  mikado: mikado(),
};

function cabaneHtml() {
  return {
    name: 'cabane-html',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html
          .replace(/<!--[\s\S]*?-->\s*/g, '')   // TODO(cabane) notes stay in the source, never in the published page
          .replace(/<x-pic\b[^>]*><\/x-pic>/g, picture)
          .replace(/<x-logo\b[^>]*><\/x-logo>/g, logo)
          .replace(/\{\{([\w.]+)\}\}/g, (m, key) => {
            if (!(key in tokens)) throw new Error(`Unknown token ${m}`);
            return tokens[key];
          });
      },
    },
  };
}

export default defineConfig({
  plugins: [cabaneHtml()],
  build: { target: 'es2020', assetsInlineLimit: 0 },
  preview: { port: 4188 },
  server: { port: 5188 },
});
