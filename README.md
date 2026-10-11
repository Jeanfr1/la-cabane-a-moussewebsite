<div align="center">

<img src=".github/assets/banner.png" alt="La Cabane à Mousse: Ça mousse. Ça vit." width="100%" />

<h3>A one-page website for a beer cellar & bar in Herbignac, built around a pour that crosses from one section into the next.</h3>

<p>
  <a href="https://la-cabane-a-mousse-herbignac.vercel.app"><strong>🌐 Live site</strong></a>
  &nbsp;·&nbsp;
  <a href="#hero-animation"><strong>🎬 How the hero works</strong></a>
  &nbsp;·&nbsp;
  <a href="#getting-started"><strong>🛠️ Run it locally</strong></a>
</p>

<p>
  <a href="https://la-cabane-a-mousse-herbignac.vercel.app"><img src="https://img.shields.io/badge/Vercel-Live-1C1714?style=for-the-badge&logo=vercel&logoColor=white" alt="Live on Vercel" /></a>
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 6" />
  <img src="https://img.shields.io/badge/Scroll-requestAnimationFrame-EF7A18?style=for-the-badge" alt="Vanilla scroll engine" />
  <img src="https://img.shields.io/badge/JavaScript-ES2020-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/♿_Accessibility-first-BE3427?style=for-the-badge" alt="Accessibility first" />
</p>

</div>

<br />

## 🚀 Overview

**La Cabane à Mousse** is a cave & bar à bières in Herbignac, in the Brière, that also hires out beer taps for events. The site opens in the bar itself (black walls, Edison lamps in wooden frames, Tolix stools) where a woman tips a giant bottle wearing the Cabane's label. As you scroll, **the beer leaves the bottle, crosses into the next section and lands in the open mouth of a friend waiting below**, the way the brief's reference image crosses its frame.

The rest of the page follows the real place: the counter with its wooden sign, the cable-reel display of the cellar, and the anthracite facade with its crossed black slats for the address and opening hours. Colours come from the logo (honey, orange, banner red, foam, ink) plus the facade's slate. Every section leads to two actions: **call the Cabane** or **plan an event**.

- **A pour you can follow**: the fall happens while both the bottle and the mouth are on screen, at any scroll speed
- **The real venue**: photos of the counter, the room, the cellar and the facade, cleaned up and enlarged from the owner's listing
- **Built for every visitor**: no-JS and reduced-motion visitors get the full pour as a still, full keyboard support, visible focus, French copy as real text
- **Light**: about 420 KB on a phone's first load, fonts included

<br />

<a name="hero-animation"></a>

## 🎬 The hero animation

<div align="center">
  <a href="https://la-cabane-a-mousse-herbignac.vercel.app"><img src=".github/assets/hero-scroll.gif" alt="Scrolling from the hero into the bar section: the beer pours from the bottle across the foam wave into the open mouth below" width="100%" /></a>
  <sub>Scroll-scrubbed on the live site · captured at 1440 × 900</sub>
</div>

<br />

Nothing is pinned: the page scrolls normally and the pour is timed from the live positions of the bottle and the mouth.

| Moment                          | What happens                                                                                  |
| :------------------------------ | :-------------------------------------------------------------------------------------------- |
| Page load                       | The bar room, the headline, both calls to action; a few drops escape the bottle neck          |
| Neck at 60–75% of the screen    | The beer starts to fall and crosses the foam wave into **Le bar**                             |
| Neck at 25–42%                  | The beer reaches the mouth while the mouth is still at ≤ 78% of the screen                    |
| Contact                         | A burst of droplets and light at the mouth, then the stream keeps flowing with a moving shine |
| Scrolling back up               | The pour rewinds and the drops come back                                                      |

**Under the hood**

- 🧩 **One rig, two sections.** The kit ships the woman, the man and the isolated stream as cut-outs on one shared canvas. `scripts/measure-pour.py` places them in "rig units": the top of the stream sits in the bottle opening (+45, +55 from the woman), and the man is lowered until the end of the stream lands in his mouth. The rig lives in **Le bar** and reaches 900 units up into the hero, so the woman stands in the hero and the man in the next section.
- 📏 **One length scales everything.** CSS computes `--u` (one rig unit) from the viewport: on wide screens from the hero height and the room left by the text column, on phones from the width. Every layer is positioned in `calc(n * var(--u))`.
- 🎯 **Timed from geometry, tested at human speed.** `src/js/pour.js` maps the bottle neck's position on screen to the pour, so the fall always happens in view. A wheel-scroll test (16 ms cadence, easing on) checked every frame: the liquid's leading edge never left the screen, at ~750 and ~1,900 px/s, on desktop and phone.
- 📷 **Real photos, enlarged.** The venue photos were only available inside the brief's screenshot board (~500 px). `scripts/prepare-real-photos.py` crops them, removes the Google Maps interface drawn over them and enlarges them 4× with Real-ESRGAN.
- 🐢 **Graceful by default.** With `prefers-reduced-motion`, without JavaScript, or if the script hasn't started after 4 s, the full pour is shown as a still. `?p=0.5` freezes the pour for captures and `?nosmooth` turns off the easing.

<br />

## 🖥️ Sections

<div align="center">
  <img src=".github/assets/desktop-sections.jpg" alt="Desktop screenshots: the bar with the real counter, the cellar with the cable-reel display, tap hire, and the contact block on the facade's slats" width="100%" />
</div>

<br />

| #   | Section                                   | Anchor          | Role                                                                          |
| :-- | :---------------------------------------- | :-------------- | :---------------------------------------------------------------------------- |
| 01  | **Ça mousse. Ça vit.**                    | `#top`          | The bar room, the promise, both calls to action and the woman tipping the bottle |
| 02  | **Les bons moments commencent ici.**      | `#bar`          | The friend catching the beer, then the real counter and the campaign friends   |
| 03  | **Une cave. Mille envies de découvrir.**  | `#cave`         | Orange chapter with the real cable-reel display and the labelled bottle splash |
| 04  | **Vos événements prennent mousse.**       | `#evenements`   | Tap hire in three steps and a direct phone call; conditions confirmed by phone |
| 05  | **La vie de la Cabane.**                  | `#rendez-vous`  | Points to Instagram, under two line-drawn pendant lamps from the bar room     |
| 06  | **On vous garde une place à Herbignac.**  | `#nous-trouver` | The facade photo on its crossed slats, address, phone, hours with today highlighted, directions |
| 07  | Footer                                    | n/a             | Details, site map and the French health warning                               |

<br />

## 📱 Mobile first, motion optional

<div align="center">
  <img src=".github/assets/mobile-screens.jpg" alt="Mobile screenshots: the hero with the woman, the pour landing in the bar section, the cellar and the contact block" width="100%" />
</div>

<br />

- The text sits above the woman, the man waits right under the foam wave, and the pour runs top to bottom in a single column
- Header with the logo, a call button and a full-screen menu (Escape closes it)
- Every touch target is at least 44 px; no horizontal scroll at 360 or 390 px
- Nothing depends on hover

<br />

## ✨ Highlights

- **🍺 Scroll storytelling**: a small `requestAnimationFrame` engine drives one mask and a few classes; the drops, the splash and the shine are CSS
- **🏠 The real place**: the facade's slats drawn as a seamless SVG pattern generated at build time, the bar's pendant lamps redrawn as line art, real photos in the bar, the cellar and the contact block
- **📞 Contact without a form**: the brief allows no fake submission, so every action is a real `tel:` link or the directions
- **🕘 Today's hours**: opening hours are rendered into the HTML at build time; a few lines of JS only highlight today's row (Paris time)
- **♿ Accessible components**: skip link, labelled menu button with `aria-expanded`, the pour described as one image, honey never used as small text on cream
- **🖼️ Image pipeline**: the kit's PNG masters stay untouched; `npm run images` writes versioned AVIF/WebP sizes, icons and the share image
- **🔤 Lean type**: Fraunces is pinned to the one style the site uses (Black, soft) with its optical-size axis kept: 121 KB → 29 KB

<br />

## 💻 Tech stack

| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" width="40" height="40" /><br />Vite 6 | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="40" height="40" /><br />JavaScript | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="40" height="40" /><br />HTML5 | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="40" height="40" /><br />CSS3 | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg" width="40" height="40" /><br />OpenCV | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" width="40" height="40" /><br />PyTorch | <img src="https://cdn.simpleicons.org/vercel/000000/ffffff" width="40" height="40" /><br />Vercel |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |

### Why this stack?

- **Vite + plain JavaScript**: a one-page site doesn't need a framework runtime; the page is static HTML with three small modules
- **Own scroll engine**: one rig with a handful of properties; a few lines of `requestAnimationFrame` replace a scroll library
- **Python + OpenCV + PyTorch for the assets**: the rig is placed by measured offsets and the venue photos are enlarged with Real-ESRGAN, once, offline
- **Self-hosted Fraunces, Barlow Condensed and Inter**: expressive display type without third-party font requests
- **Vercel**: every push to `main` deploys automatically

<br />

## 🎨 Design system

| Token    | Value                                                                        | Use                                                  |
| :------- | :--------------------------------------------------------------------------- | :--------------------------------------------------- |
| Honey    | ![#FFC13C](https://img.shields.io/badge/%23FFC13C-FFC13C?style=flat-square) | Hero second line, primary buttons on dark, news band |
| Orange   | ![#EF7A18](https://img.shields.io/badge/%23EF7A18-EF7A18?style=flat-square) | Header (like the facade lettering), cellar chapter   |
| Red      | ![#BE3427](https://img.shields.io/badge/%23BE3427-BE3427?style=flat-square) | Tap-hire button, eyebrows on foam                    |
| Foam     | ![#FFF3D5](https://img.shields.io/badge/%23FFF3D5-FFF3D5?style=flat-square) | Light sections, text on dark                         |
| Ink      | ![#1C1714](https://img.shields.io/badge/%231C1714-1C1714?style=flat-square) | Text, dark buttons, footer                           |
| Slate    | ![#2A2725](https://img.shields.io/badge/%232A2725-2A2725?style=flat-square) | Contact block, the facade's anthracite               |

- **Palette**: the logo's colours plus the facade's slate; no green anywhere, as the brief asks
- **Type**: Fraunces Black (soft) for headlines, 44–128 px in the hero and 40–76 px for sections; Barlow Condensed for labels and buttons; Inter for body text at 16–18.5 px
- **Shapes**: beer waves with foam bubbles and torn-paper edges between chapters, the facade's crossed slats, the bar's pendant lamps, rounded photo windows
- **Motion**: entrances of 26–40 px over 700–900 ms with a light stagger; a slow parallax on the overlapping photos; all off with reduced motion

<br />

<a name="getting-started"></a>

## 🛠️ Getting started

```bash
# Clone the repository
git clone https://github.com/Jeanfr1/la-cabane-a-moussewebsite.git
cd la-cabane-a-moussewebsite

# Install dependencies (Node 20.9+)
npm install

# Start the dev server  →  http://localhost:5188
npm run dev

# Production build  →  dist/
npm run build

# Preview the production build  →  http://localhost:4188
npm run preview

# Rebuild the generated assets (Python 3 with OpenCV; PyTorch for the photos)
npm run photos -- RealESRGAN_x4plus.pth   # needs the brief's 00-referencias/ and the Real-ESRGAN weights
npm run measure
npm run images
npm run fonts                             # fonttools + brotli
```

<br />

## 📁 Project structure

```
la-cabane-a-moussewebsite/
├── index.html                  # Every section: hero → bar → cave → événements → rendez-vous → nous trouver → footer
├── vite.config.js              # Renders facts, <x-pic> pictures, rig positions and the slat pattern into the HTML
├── src/
│   ├── main.js                 # Entry: fonts, styles, module init
│   ├── data/
│   │   ├── site.js             # Name, phone, address, hours, links, structured data (single source)
│   │   ├── pour.json           # Rig geometry: layers, neck, mouth, stream span (generated)
│   │   └── images.json         # Image manifest (generated)
│   ├── styles/                 # base.css (tokens, header) · hero.css (hero + rig) · sections.css
│   └── js/
│       ├── pour.js             # Scroll position → pour, drops, contact, shine
│       ├── reveal.js           # Entrance animations and photo parallax
│       └── nav.js              # Mobile menu, compact logo, today's hours
├── scripts/
│   ├── measure-pour.py         # Places the cut-outs, softens their crops, writes pour.json
│   ├── prepare-real-photos.py  # Venue photos from the brief's board: crop, clean, enlarge
│   ├── upscale.py              # Real-ESRGAN x4plus (RRDBNet) runner
│   ├── build-images.mjs        # Masters → AVIF/WebP, icons, share image (sharp)
│   └── subset-fonts.py         # Fraunces instance + subset
├── public/                     # Generated images, font, favicons, Open Graph image
├── assets-src/                 # Rig layers and cleaned venue photos (generated)
└── 01-identidade … 08-estudo/  # The creative kit (brief, mockups, masters, scripts), kept as delivered
```

<br />

## 🚀 Deployment

Hosted on **Vercel** and connected to this repository: every push to `main` ships to production.

**Live site:** [la-cabane-a-mousse-herbignac.vercel.app](https://la-cabane-a-mousse-herbignac.vercel.app)

| Setting          | Value           |
| :--------------- | :-------------- |
| Framework        | Vite            |
| Build command    | `npm run build` |
| Output directory | `dist`          |

The creative kit folders are excluded from the deployment by `.vercelignore`.

<br />

## 📌 Content checklist

Items waiting on the owner. Each one is marked `TODO(cabane)` in `index.html` or `src/data/site.js`.

- [ ] The room photo (hero) and the counter photo come from Google Maps visitors: replace them with the owner's own photos, or confirm the rights
- [ ] Original, full-resolution files of the facade and cellar photos (the site uses enlarged crops from screenshots)
- [ ] Confirm the Instagram link and add the Facebook page (the exact URL wasn't in the brief)
- [ ] Replace the directions link (an address search) with the Cabane's own Google Maps place
- [ ] Reconfirm opening hours and any exceptional hours
- [ ] Tap-hire conditions: equipment, capacity, deposit, delivery and prices (handled by phone until then)
- [ ] A curated agenda with verified future dates for **La vie de la Cabane**
- [ ] Mentions légales (publisher, SIRET, host)
- [ ] Final domain (then update `canonical` and `og:url` and remove `noindex`)

Choices made where the brief and the owner's feedback pulled in different directions:

- The kit's sunset-beach art direction was replaced by the real bar (room, counter, cellar, facade), at the owner's request, although the brief advised against dark interiors
- The pour follows the reference image (it crosses from the hero into the next section) rather than the kit's single-frame reveal; the kit's own cut-outs made that possible
- The French copy file is canonical; text painted into the mockups was not reused
- The cellar keeps the brief's creative title but never states a number of references

<br />

## 🙏 Acknowledgments

- **La Cabane à Mousse** for the logo, the photos of the venue and the brief
- **[Real-ESRGAN](https://github.com/xinntao/Real-ESRGAN)** by Xintao Wang et al. (BSD-3-Clause) for the photo enlargement
- **[Fraunces](https://fonts.google.com/specimen/Fraunces)** by Undercase Type, **[Barlow](https://fonts.google.com/specimen/Barlow+Condensed)** by Jeremy Tribby and **[Inter](https://rsms.me/inter/)** by Rasmus Andersson (OFL)
- **[OpenCV](https://github.com/opencv/opencv)** and **[sharp](https://sharp.pixelplumbing.com)** for the measurement and image pipelines
- **[Vite](https://vite.dev)** and **[Vercel](https://vercel.com)**

<br />

---

<div align="center">
  <img src="public/favicon.png" width="44" height="44" alt="" />
  <p><strong>Ça mousse. Ça vit.</strong></p>
  <p>Built with ❤️ by <a href="https://github.com/Jeanfr1">Jean</a> for La Cabane à Mousse</p>
  <sub>L'abus d'alcool est dangereux pour la santé. À consommer avec modération.</sub>
</div>
