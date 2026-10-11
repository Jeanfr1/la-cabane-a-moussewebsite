import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import { site, jsonLd } from './src/data/site.js';

const images = JSON.parse(readFileSync(new URL('./src/data/images.json', import.meta.url)));
const scene = JSON.parse(readFileSync(new URL('./src/data/scene.json', import.meta.url)));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

// <x-pic name="amizade" alt="…" sizes="…" class="…" loading="lazy" fetchpriority="high"></x-pic>
function picture(tag) {
  const name = attr(tag, 'name');
  const img = images[name];
  if (!img) throw new Error(`x-pic: unknown image "${name}"`);
  const sizes = attr(tag, 'sizes') || '100vw';
  const cls = attr(tag, 'class');
  const imgCls = attr(tag, 'img-class');
  const alt = attr(tag, 'alt') ?? '';
  const loading = attr(tag, 'loading') || 'lazy';
  const priority = attr(tag, 'fetchpriority');
  const srcset = (list) => list.map((u, i) => `${u} ${img.widths[i]}w`).join(', ');
  const fallback = img.webp[Math.min(1, img.webp.length - 1)];
  return `<picture${cls ? ` class="${cls}"` : ''}>`
    + `<source type="image/avif" srcset="${srcset(img.avif)}" sizes="${sizes}">`
    + `<source type="image/webp" srcset="${srcset(img.webp)}" sizes="${sizes}">`
    + `<img src="${fallback}" width="${img.w}" height="${img.h}" alt="${esc(alt)}"`
    + `${imgCls ? ` class="${imgCls}"` : ''} loading="${loading}" decoding="async"${priority ? ` fetchpriority="${priority}"` : ''}>`
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

// Stream layer and keep mask as CSS custom properties, in % of the 1024×1536 scene canvas.
const [cw, ch] = scene.canvas;
const pct = (v, of) => `${((v / of) * 100).toFixed(3)}%`;
const sceneVars = [
  `--stream-x:${pct(scene.stream.x, cw)}`,
  `--stream-y:${pct(scene.stream.y, ch)}`,
  `--stream-w:${pct(scene.stream.w, cw)}`,
  `--stream-h:${pct(scene.stream.h, ch)}`,
  `--keep:url(${images['scene-keep'].src})`,
].join(';');

const tokens = {
  ...Object.fromEntries(Object.entries(site).filter(([, v]) => typeof v === 'string').map(([k, v]) => [`site.${k}`, esc(v)])),
  hoursList,
  sceneVars,
  jsonLd: JSON.stringify(jsonLd),
  'img.streamAvif': images['scene-stream'].avif[0],
  'img.streamWebp': images['scene-stream'].webp[0],
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
