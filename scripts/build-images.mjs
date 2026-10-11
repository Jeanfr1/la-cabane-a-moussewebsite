#!/usr/bin/env node
// Derives every web image from the kit masters (which stay untouched).
// Output: public/img/<name>-v<rev>-<width>.{avif,webp} + src/data/images.json
// The cache is immutable: to replace an image, bump its `rev` so the file name changes.
import { mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public/img');
const kit = (p) => path.join(root, p);

// The four venue photos are screenshots: each one is framed to the useful rectangle the kit
// documents (07-integracao/provenance-photos.json), which leaves the capture's interface out.
const provenance = JSON.parse(await readFile(kit('07-integracao/provenance-photos.json'), 'utf8'));
const rect = (file) => {
  const { x, y, width, height } = provenance.find((p) => p.file === file).display_rect;
  return { left: x, top: y, width, height };
};

// alpha: keep transparency; widths: responsive variants (never above the source);
// crop: rectangle taken from the master before resizing
const jobs = [
  // hero campaign (03-hero): landscape above 850 px, portrait below
  { name: 'brinde', src: '03-hero/brinde-cinematographique.png', rev: 1, widths: [960, 1536] },
  { name: 'brinde-mobile', src: '03-hero/brinde-mobile.png', rev: 1, widths: [640, 1024] },
  // chapter 2 foreground (05-camadas), desktop only
  { name: 'brinde-premier-plan', src: '05-camadas/brinde-premier-plan.png', rev: 1, widths: [960, 1536], alpha: true },
  // the real venue (04-photos-originales)
  { name: 'salle', src: '04-photos-originales/salle-originale.png', rev: 1, widths: [720, 1040], crop: true },
  { name: 'comptoir', src: '04-photos-originales/comptoir-original.png', rev: 1, widths: [480, 806], crop: true },
  { name: 'terrasse', src: '04-photos-originales/facade-terrasse-originale.png', rev: 1, widths: [480, 806], crop: true },
  { name: 'cave', src: '04-photos-originales/cave-originale.png', rev: 1, widths: [480, 810], crop: true },
  // section backgrounds supplied on 2026-10-12 (scripts/prepare-backgrounds.py)
  { name: 'fete', src: 'assets-src/bg-fete.png', rev: 1, widths: [640, 1100, 1616] },
  { name: 'retrouvailles', src: 'assets-src/bg-retrouvailles.png', rev: 1, widths: [640, 1100, 1612] },
];

const manifest = {};

async function variants(job) {
  const source = () => {
    const img = sharp(kit(job.src));
    return job.crop ? img.extract(rect(job.src)) : img;
  };
  const { info } = await source().toBuffer({ resolveWithObject: true });
  const entry = { w: info.width, h: info.height, widths: [], avif: [], webp: [] };
  for (const w of job.widths.filter((w) => w <= info.width)) {
    const base = `${job.name}-v${job.rev}-${w}`;
    const img = () => {
      const pipeline = source().resize({ width: w, withoutEnlargement: true });
      return job.alpha ? pipeline : pipeline.removeAlpha();
    };
    await img().avif({ quality: job.alpha ? 60 : 56, effort: 6 }).toFile(path.join(out, `${base}.avif`));
    await img().webp({ quality: job.alpha ? 82 : 80, alphaQuality: 90, effort: 6 }).toFile(path.join(out, `${base}.webp`));
    entry.widths.push(w);
    entry.avif.push(`/img/${base}.avif`);
    entry.webp.push(`/img/${base}.webp`);
  }
  manifest[job.name] = entry;
}

async function logo() {
  // Trim the transparent margin; clear space is handled in CSS.
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

  // Icons: the badge on graphite, like the header it sits in.
  const badge = async (size, pad) => {
    const inner = Math.round(size * (1 - pad * 2));
    const mark = await sharp(trimmed).resize({ width: inner, height: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
    return sharp({ create: { width: size, height: size, channels: 4, background: '#191918' } })
      .composite([{ input: mark, gravity: 'center' }])
      .png({ palette: true, quality: 92 });
  };
  await (await badge(180, 0.08)).toFile(path.join(root, 'public/apple-touch-icon.png'));
  await (await badge(512, 0.08)).toFile(path.join(root, 'public/icon-512.png'));
  await (await badge(64, 0.03)).toFile(path.join(root, 'public/favicon.png'));
}

async function ogImage() {
  // 1200x630 share image: a capture of the built hero (assets-src/og.png, made after the site
  // is built) when present, else the landscape campaign.
  const captured = existsSync(kit('assets-src/og.png'));
  const img = captured
    ? sharp(kit('assets-src/og.png')).resize({ width: 1200, height: 630, fit: 'cover', position: 'left' })
    : sharp(kit('03-hero/brinde-cinematographique.png')).resize({ width: 1200, height: 630, fit: 'cover', position: 'centre' });
  await img.removeAlpha().jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(root, 'public/og-v3.jpg'));
}

if (existsSync(out)) await rm(out, { recursive: true });
await mkdir(out, { recursive: true });
for (const job of jobs) await variants(job);
await logo();
await ogImage();
await writeFile(path.join(root, 'src/data/images.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(Object.entries(manifest).map(([k, v]) => `${k}: ${v.w}x${v.h} → ${(v.widths || []).join(',')}`).join('\n'));
