#!/usr/bin/env node
// Derives every web image from the kit masters (which stay untouched).
// Output: public/img/<name>-v<rev>-<width>.{avif,webp} + src/data/images.json
// The cache is immutable: to replace an image, bump its `rev` so the file name changes.
// assets-src/ is written by scripts/measure-pour.py and scripts/prepare-real-photos.py.
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public/img');
const kit = (p) => path.join(root, p);

// alpha: keep transparency; widths: responsive variants (never above the source);
// tune: optional sharp pipeline applied before resizing (colour grade, blur)
const jobs = [
  // hero pour rig (scripts/measure-pour.py)
  { name: 'pour-woman', src: 'assets-src/pour-woman.png', rev: 1, widths: [400, 759], alpha: true },
  { name: 'pour-man', src: 'assets-src/pour-man.png', rev: 1, widths: [500, 972], alpha: true },
  { name: 'pour-stream', src: 'assets-src/pour-stream.png', rev: 1, widths: [120, 233], alpha: true },
  // the real venue (scripts/prepare-real-photos.py)
  {
    name: 'hero-bar', src: 'assets-src/real-interior.png', rev: 1, widths: [900, 1400, 2008],
    // dim, warm and slightly soften the room so the people in front stay the subject
    tune: (img) => img.blur(0.9).linear([1.04, 0.98, 0.88], [6, 0, -8]).modulate({ brightness: 0.86, saturation: 1.08 }),
  },
  { name: 'counter', src: 'assets-src/real-counter.png', rev: 1, widths: [640, 1024, 1400] },
  { name: 'cave-real', src: 'assets-src/real-cave.png', rev: 1, widths: [640, 1024, 1400] },
  { name: 'facade', src: 'assets-src/real-facade.png', rev: 1, widths: [640, 1024, 1400] },
  // campaign images from the kit
  { name: 'amizade', src: '04-secoes/amizade.png', rev: 1, widths: [640, 1024, 1536] },
  { name: 'splash', src: '04-secoes/produto-splash.png', rev: 1, widths: [640, 1024, 1536] },
  { name: 'location', src: '04-secoes/locacao-verao.png', rev: 1, widths: [640, 1024, 1536] },
];

const manifest = {};

async function variants(job) {
  const meta = await sharp(kit(job.src)).metadata();
  const entry = { w: meta.width, h: meta.height, widths: [], avif: [], webp: [] };
  for (const w of job.widths.filter((w) => w <= meta.width)) {
    const base = `${job.name}-v${job.rev}-${w}`;
    const img = () => {
      const base = sharp(kit(job.src));
      return (job.tune ? job.tune(base) : base).resize({ width: w, withoutEnlargement: true });
    };
    await img().avif({ quality: job.alpha ? 60 : 52, effort: 6 }).toFile(path.join(out, `${base}.avif`));
    await img().webp({ quality: job.alpha ? 82 : 78, alphaQuality: 90, effort: 6 }).toFile(path.join(out, `${base}.webp`));
    entry.widths.push(w);
    entry.avif.push(`/img/${base}.avif`);
    entry.webp.push(`/img/${base}.webp`);
  }
  manifest[job.name] = entry;
}

async function logo() {
  // Trim the transparent margin; the brand guide keeps 10% clear space in CSS instead.
  const trimmed = await sharp(kit('01-identidade/logo-transparente.png')).trim({ threshold: 1 }).toBuffer();
  const meta = await sharp(trimmed).metadata();
  const entry = { w: meta.width, h: meta.height, png: [], webp: [], widths: [] };
  for (const w of [180, 320]) {
    const base = `logo-v1-${w}`;
    await sharp(trimmed).resize({ width: w }).png({ compressionLevel: 9, palette: true, quality: 92 }).toFile(path.join(out, `${base}.png`));
    await sharp(trimmed).resize({ width: w }).webp({ quality: 88, alphaQuality: 95, effort: 6 }).toFile(path.join(out, `${base}.webp`));
    entry.widths.push(w);
    entry.png.push(`/img/${base}.png`);
    entry.webp.push(`/img/${base}.webp`);
  }
  manifest.logo = entry;

  // Icons: the badge on the header orange, so the white lettering keeps its contrast.
  const badge = async (size, pad) => {
    const inner = Math.round(size * (1 - pad * 2));
    const mark = await sharp(trimmed).resize({ width: inner, height: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
    return sharp({ create: { width: size, height: size, channels: 4, background: '#EF7A18' } })
      .composite([{ input: mark, gravity: 'center' }])
      .png({ palette: true, quality: 92 });
  };
  await (await badge(180, 0.06)).toFile(path.join(root, 'public/apple-touch-icon.png'));
  await (await badge(512, 0.06)).toFile(path.join(root, 'public/icon-512.png'));
  await (await badge(64, 0.02)).toFile(path.join(root, 'public/favicon.png'));
}

async function ogImage() {
  // 1200x630 share image: a capture of the built hero (assets-src/og.png, made after the site
  // is built) when present, else the kit's approved 3:2 hero.
  const captured = existsSync(kit('assets-src/og.png'));
  const img = captured
    ? sharp(kit('assets-src/og.png')).resize({ width: 1200, height: 630, fit: 'cover', position: 'right' })
    : sharp(kit('03-hero/hero-desktop.png')).resize({ width: 1200 }).extract({ left: 0, top: 70, width: 1200, height: 630 });
  await img.jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(root, 'public/og-v2.jpg'));
}

if (existsSync(out)) await rm(out, { recursive: true });
await mkdir(out, { recursive: true });
for (const job of jobs) await variants(job);
await logo();
await ogImage();
await writeFile(path.join(root, 'src/data/images.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(Object.entries(manifest).map(([k, v]) => `${k}: ${(v.widths || []).join(',')}`).join('\n'));
