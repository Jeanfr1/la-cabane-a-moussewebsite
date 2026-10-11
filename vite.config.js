import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import { site, jsonLd } from './src/data/site.js';

const images = JSON.parse(readFileSync(new URL('./src/data/images.json', import.meta.url)));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

const image = (name) => {
  const img = images[name];
  if (!img) throw new Error(`x-pic: unknown image "${name}"`);
  return img;
};
const srcset = (img, list) => list.map((u, i) => `${u} ${img.widths[i]}w`).join(', ');
const sources = (img, sizes, media) => {
  const m = media ? ` media="${media}"` : '';
  return `<source${m} type="image/avif" srcset="${srcset(img, img.avif)}" sizes="${sizes}">`
    + `<source${m} type="image/webp" srcset="${srcset(img, img.webp)}" sizes="${sizes}">`;
};

// <x-pic name="comptoir" alt="…" sizes="…" class="…" loading="lazy" fetchpriority="high"></x-pic>
//   mobile="brinde-mobile" + mobile-sizes="…": art-directed portrait source up to 850 px
//   only="(min-width: 851px)": the image exists in that range only; elsewhere a 1 px
//   placeholder keeps the <img> from downloading anything (display: none does not stop it)
function picture(tag) {
  const img = image(attr(tag, 'name'));
  const sizes = attr(tag, 'sizes') || '100vw';
  const cls = attr(tag, 'class');
  const alt = attr(tag, 'alt') ?? '';
  const loading = attr(tag, 'loading') || 'lazy';
  const priority = attr(tag, 'fetchpriority');
  const only = attr(tag, 'only');
  const mobileName = attr(tag, 'mobile');
  let html = `<picture${cls ? ` class="${cls}"` : ''}>`;
  if (mobileName) html += sources(image(mobileName), attr(tag, 'mobile-sizes') || '100vw', '(max-width: 850px)');
  html += sources(img, sizes, only);
  const src = only ? BLANK : img.webp[Math.min(1, img.webp.length - 1)];
  html += `<img src="${src}" width="${img.w}" height="${img.h}" alt="${esc(alt)}"`
    + ` loading="${loading}" decoding="async"${priority ? ` fetchpriority="${priority}"` : ''}>`;
  return html + `</picture>`;
}

function logo(tag) {
  const l = images.logo;
  const cls = attr(tag, 'class');
  return `<picture${cls ? ` class="${cls}"` : ''}>`
    + `<source type="image/webp" srcset="${l.webp.map((u, i) => `${u} ${l.widths[i]}w`).join(', ')}" sizes="${attr(tag, 'sizes') || '64px'}">`
    + `<img src="${l.png[0]}" width="${l.w}" height="${l.h}" alt="${esc(attr(tag, 'alt') ?? '')}" decoding="async">`
    + `</picture>`;
}

const hoursList = site.hours
  .map((h) => `<li data-days="${h.days.join(',')}"><span>${h.label}</span><span>${h.value}</span></li>`)
  .join('');

const tokens = {
  ...Object.fromEntries(Object.entries(site).filter(([, v]) => typeof v === 'string').map(([k, v]) => [`site.${k}`, esc(v)])),
  hoursList,
  jsonLd: JSON.stringify(jsonLd),
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
