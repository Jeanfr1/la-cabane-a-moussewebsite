<div align="center">

<img src=".github/assets/banner.png" alt="La Cabane à Mousse: Le goût d’être ensemble." width="100%" />

<h3>A one-page website for a beer cellar & bar in Herbignac, opening on a toast that scrolls into the real bar.</h3>

<p>
  <a href="https://la-cabane-a-mousse-herbignac.vercel.app"><strong>🌐 Live site</strong></a>
  &nbsp;·&nbsp;
  <a href="#hero-animation"><strong>🎬 How the hero works</strong></a>
  &nbsp;·&nbsp;
  <a href="#getting-started"><strong>🛠️ Run it locally</strong></a>
</p>

<p>
  <a href="https://la-cabane-a-mousse-herbignac.vercel.app"><img src="https://img.shields.io/badge/Vercel-Live-191918?style=for-the-badge&logo=vercel&logoColor=white" alt="Live on Vercel" /></a>
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 6" />
  <img src="https://img.shields.io/badge/Scroll-requestAnimationFrame-F3B43F?style=for-the-badge" alt="Vanilla scroll engine" />
  <img src="https://img.shields.io/badge/JavaScript-ES2020-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/♿_Accessibility-first-8A5F35?style=for-the-badge" alt="Accessibility first" />
</p>

</div>

<br />

## 🚀 Overview

**La Cabane à Mousse** is a cave & bar à bières in Herbignac, in the Brière, that also hires out beer taps for events. The site opens on a toast: three friends clink bottles wearing the Cabane's label under the headline **Le goût d’être ensemble.** As you scroll, the bar dissolves around the bottles, the camera moves in on the clink, and **a window opens from the centre onto the real room of the Cabane**, which leads into the rest of the page.

Then comes the real place: the counter with its wooden sign, the facade and its terrace of deckchairs, the cable-reel display of the cellar. Tap hire and the contact block close the page on two full-bleed photos (golden bottles and a glass being poured, friends toasting) that melt into the section colours. The palette comes from the bar itself (graphite walls, black metal, wood, beer amber, the orange of the facade lettering, foam) and the type is a massive condensed face. Every section leads to one of two actions: **come by** or **call the Cabane**.

- **A three-chapter opening**: Le rendez-vous → Le tchin → La vraie Cabane, scrubbed by the scroll, never blocking it
- **The real venue**: the four photos of the room, counter, facade and cellar, framed so the screenshot interface never shows
- **Built for every visitor**: an animation switch, reduced-motion and no-JS visitors get the full static hero, keyboard menu with Escape, French copy as real text
- **Light**: 225 KB on a phone's first load and 445 KB on desktop, fonts and images included; 2.3 KB of JavaScript (gzip)

<br />

<a name="hero-animation"></a>

## 🎬 The hero animation

<div align="center">
  <a href="https://la-cabane-a-mousse-herbignac.vercel.app"><img src=".github/assets/hero-scroll.gif" alt="Scrolling through the hero: the friends toasting, the bar fading around the three bottles, the close-up, then the real room opening from the centre" width="100%" /></a>
  <sub>Scroll-scrubbed on the live site · captured at 1440 × 900</sub>
</div>

<br />

The hero section is 190 % of the screen height (165 % on phones); its stage stays pinned under the header while the page scrolls normally.

| Scroll progress | Chapter               | What happens                                                                                   |
| :-------------- | :-------------------- | :--------------------------------------------------------------------------------------------- |
| 0–18 %          | **Le rendez-vous**    | The toast, the headline and both calls to action; a slow push towards the clinking necks       |
| 18–37 %         | Into the close-up     | The headline lifts away and the bar dissolves around the bottles, which stay exactly in place  |
| 37–64 %         | **Le tchin**          | The three bottles alone on graphite, the camera moves in, a short amber glint where they touch |
| 64–76 %         | The door opens        | The real room appears in a small window in the centre                                          |
| 76–100 %        | **La vraie Cabane**   | The window opens to full screen and hands over to the sections                                 |

**Under the hood**

- 🎯 **The close-up is registered, not cross-faded.** The kit ships the three bottles as a separate transparent layer. `scripts/register-toast.py` matches it to the campaign photo with SIFT features and a RANSAC similarity transform (515 inliers, 1.6 px median error): the layer is the campaign's bottles at 1.233×. `src/js/hero.js` composes that transform with the campaign's own zoom, so the layer sits on the bottles while the bar fades out, then eases to the close-up framing. No second group of bottles ever shows.
- 📐 **Image coordinates at every size.** Each layer lives in a box with the image's own aspect ratio that covers the stage, computed in CSS with container units (`max(100cqw, 100cqh * 1.5)`). Zoom origins, the glint and the registration are written in percentages of the image, so they hold from 1024 to 1920 px wide.
- 🧮 **One function, one frame.** `motionAt(p)` (the ranges of the kit's study) returns every value for a progress `p`; a single pending `requestAnimationFrame` writes them as custom properties on the hero. Progress comes from the sticky offset and the stage's own height, so it stays exact when a phone's address bar resizes the window.
- 📱 **Phones get the portrait campaign.** Below 850 px the hero uses the portrait toast, keeps it on screen while it zooms, and skips the close-up layer entirely (its `<picture>` only has sources above 850 px, so phones never download it). The real room still opens at the end.
- 🐢 **Motion is optional.** The **Désactiver l’animation** switch (remembered per visitor), `prefers-reduced-motion`, no JavaScript, or a script that hasn't started within 4 s all give the static hero with every action. `?p=0.5` freezes the progress for captures.

<br />

## 🖥️ Sections

<div align="center">
  <img src=".github/assets/desktop-sections.jpg" alt="Desktop screenshots: the bar with the real counter, the cellar with its cable-reel display, tap hire in three steps, and the contact block with today's hours" width="100%" />
</div>

<br />

| #   | Section                                          | Anchor        | Role                                                                            |
| :-- | :----------------------------------------------- | :------------ | :------------------------------------------------------------------------------ |
| 01  | **Le goût d’être ensemble.**                     | `#accueil`    | The toast in three chapters, the headline, *Entrer dans la Cabane* and *Louer une tireuse* |
| 02  | Signature band                                   | n/a           | La Cabane à Mousse ✳ Herbignac ✳ De bons moments, tout simplement.               |
| 03  | **C’est ici que ça se passe.**                   | `#bar`        | The real counter in a tilted frame, then the facade and terrace with the address |
| 04  | **Le goût de la découverte.**                    | `#cave`       | The cellar's cable-reel display; advice by phone, no stock or prices promised    |
| 05  | **Votre fête. Notre mousse.**                    | `#tireuses`   | Golden bottles and a poured glass melting into amber; tap hire in three steps and a direct call |
| 06  | **On garde le contact.**                         | `#actualites` | News on Instagram; no past poster shown as a future event                       |
| 07  | **À tout à l’heure.**                            | `#contact`    | Friends toasting behind the title, fading into graphite; address, phone, hours with today highlighted |
| 08  | Footer                                           | n/a           | Details, site map and the French health warning                                 |

<br />

## 📱 Mobile first, motion optional

<div align="center">
  <img src=".github/assets/mobile-screens.jpg" alt="Mobile screenshots: the portrait toast hero, the real room at the end of the hero, the bar, the cellar and tap hire" width="100%" />
</div>

<br />

- The toast fills the top of the screen; title and actions sit on the dark counter below it
- Header with the logo and a **Menu** button: full-height panel, `aria-expanded`, Escape closes it and returns focus
- Every touch target is at least 44 px; no horizontal scroll at 320, 390 or 430 px
- Nothing depends on hover

<br />

## ✨ Highlights

- **🍻 Scroll storytelling**: zoom, dissolve, a registered close-up and a clip-path window, driven by one function and custom properties
- **🏠 The real place**: the four venue photos are framed by the rectangles documented in the kit, so the screenshots' interface never shows and the masters stay untouched
- **🌅 Photo backgrounds**: on desktop the tap-hire and contact photos bleed in from the right and melt into the section colour; on phones they become a band at the top. All text sits on the solid side of the gradient
- **📞 Contact without a form**: every action is a real `tel:` link, the directions or Instagram
- **🕘 Today's hours**: opening hours are rendered into the HTML at build time; a few lines of JS only highlight today's row (Paris time)
- **♿ Accessible components**: skip link, labelled menu button, a pressed-state animation switch, faded titles taken out of the tab order, focus rings in amber or ink depending on the background
- **🖼️ Image pipeline**: `npm run images` writes versioned AVIF/WebP sizes, icons and the share image (itself a capture of the built hero)
- **🔤 Lean type**: the kit's condensed face subset to Latin in WOFF2, 58 KB → 16 KB, its licence shipped next to it

<br />

## 💻 Tech stack

| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" width="40" height="40" /><br />Vite 6 | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="40" height="40" /><br />JavaScript | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="40" height="40" /><br />HTML5 | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="40" height="40" /><br />CSS3 | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" width="40" height="40" /><br />Python | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg" width="40" height="40" /><br />OpenCV | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" width="40" height="40" /><br />PyTorch | <img src="https://cdn.simpleicons.org/vercel/000000/ffffff" width="40" height="40" /><br />Vercel |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |

### Why this stack?

- **Vite + plain JavaScript**: a one-page site doesn't need a framework runtime; the page is static HTML with three small modules
- **Own scroll engine**: one progress value and a dozen custom properties; a few lines of `requestAnimationFrame` replace a scroll library
- **Python + OpenCV + PyTorch for the assets**: the close-up layer is registered on the campaign once, offline, and the result is a small JSON file the page reads; the two section backgrounds arrived as ~410 px screenshots and are enlarged 4× with Real-ESRGAN
- **Self-hosted fonts**: the kit's condensed face and Inter, without third-party font requests
- **Vercel**: every push to `main` deploys automatically

<br />

## 🎨 Design system

| Token    | Value                                                                        | Use                                                        |
| :------- | :--------------------------------------------------------------------------- | :--------------------------------------------------------- |
| Graphite | ![#191918](https://img.shields.io/badge/%23191918-191918?style=flat-square) | Hero, header, contact and footer                           |
| Charcoal | ![#292824](https://img.shields.io/badge/%23292824-292824?style=flat-square) | The cellar                                                 |
| Wood     | ![#8A5F35](https://img.shields.io/badge/%238A5F35-8A5F35?style=flat-square) | Accent words and the street number on foam                 |
| Beer     | ![#F3B43F](https://img.shields.io/badge/%23F3B43F-F3B43F?style=flat-square) | *Ensemble*, primary buttons, signature band, tap hire      |
| Orange   | ![#E67F22](https://img.shields.io/badge/%23E67F22-E67F22?style=flat-square) | From the logo and the facade lettering; accent on dark only |
| Foam     | ![#F5EBDD](https://img.shields.io/badge/%23F5EBDD-F5EBDD?style=flat-square) | The bar and news sections, text on dark                    |

- **Contrast**: beer on graphite 9.6:1, wood on foam 4.7:1; foam is never used as text on beer (1.6:1)
- **Type**: the condensed display face in capitals for every headline (54–158 px in the hero, 52–128 px for sections), Inter for text at 15–18 px and spaced capitals for labels
- **Shapes**: square buttons and frames, a tilted photo frame for the counter, thin rules between steps and hours
- **Motion**: entrances of 26 px over 800–900 ms with a light stagger; all off with reduced motion

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

# Rebuild the generated assets
npm run images                        # sharp: kit masters → AVIF/WebP, icons, share image
npm run fonts                         # fonttools + brotli
python3 scripts/register-toast.py     # opencv-python: writes src/data/toast.json (--check for an overlay)
python3 scripts/prepare-backgrounds.py RealESRGAN_x4plus.pth   # opencv + torch: section backgrounds
```

<br />

## 📁 Project structure

```
la-cabane-a-moussewebsite/
├── index.html                  # Every section: hero → bar/terrasse → cave → tireuses → actualités → contact → footer
├── vite.config.js              # Renders facts and <x-pic> pictures (art-directed, desktop-only) into the HTML
├── src/
│   ├── main.js                 # Entry: fonts, styles, module init
│   ├── data/
│   │   ├── site.js             # Name, phone, address, hours, links, structured data (single source)
│   │   ├── toast.json          # Close-up registration on the campaign (generated)
│   │   └── images.json         # Image manifest (generated)
│   ├── styles/                 # base.css (tokens, type, header) · hero.css (three chapters) · sections.css
│   └── js/
│       ├── hero.js             # motionAt(p), scroll → custom properties, animation switch
│       ├── reveal.js           # Entrance animations
│       └── nav.js              # Mobile menu, today's hours
├── scripts/
│   ├── register-toast.py       # SIFT + RANSAC similarity: close-up layer → campaign
│   ├── prepare-backgrounds.py  # Section backgrounds: crop the screenshots, fill the viewer's buttons, enlarge
│   ├── upscale.py              # Real-ESRGAN x4plus (RRDBNet) runner
│   ├── build-images.mjs        # Masters → framed, resized AVIF/WebP, icons, share image (sharp)
│   └── subset-fonts.py         # Condensed face → Latin WOFF2 + licence
├── public/                     # Generated images, fonts and licence, favicons, Open Graph image
├── assets-src/                 # Share-image capture, background screenshots as supplied, enlarged backgrounds
└── 01-identidade … 08-estudo/  # The creative kit V3 (direction, masters, scripts, study), kept as delivered
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

- [ ] Full-resolution originals of the four venue photos (the site frames screenshots); the room and counter photos come from Google Maps visitors, so replace them or confirm the rights
- [ ] The official logo master (the site uses the reconstruction from the kit)
- [ ] The tap-hire and contact backgrounds are screenshots of third-party brand photos (Modelo, Corona Extra): confirm the rights, or replace them with the Cabane's own photos, before launch
- [ ] Confirm the Instagram link and add the Facebook page (the exact URL wasn't in the brief)
- [ ] Replace the directions link (an address search) with the Cabane's own Google Maps place
- [ ] Reconfirm opening hours and any exceptional hours
- [ ] Tap-hire conditions: equipment, availability, prices, deposit, delivery, cleaning and booking (handled by phone until then)
- [ ] A curated agenda with verified future dates for **On garde le contact**
- [ ] Mentions légales (publisher, SIRET, host)
- [ ] Final domain (then update `canonical` and `og:url` and remove `noindex`)

Choices made where the kit left room for interpretation:

- The kit describes the close-up layer as an independent shot to cross-fade; measured, it is the campaign's bottles at 1.233×, so it is placed on them and the bar dissolves around them instead of showing two groups of bottles
- The kit asks to remove a "previous green palette"; the V2 site had none, so the previous honey/orange/red tokens were replaced entirely
- Where the study and the mockups differ, the mockups set the look (amber cellar title and button, graphite contact block) and the study sets the behaviour
- The hire title stays ink on beer for both lines: foam on beer would fall to 1.6:1

<br />

## 🙏 Acknowledgments

- **La Cabane à Mousse** for the logo, the photos of the venue and the brief
- **Nimbus Sans Narrow** by URW++ (AGPL-3 with font exception, licence in `public/fonts/`) and **[Inter](https://rsms.me/inter/)** by Rasmus Andersson (OFL)
- **[Real-ESRGAN](https://github.com/xinntao/Real-ESRGAN)** by Xintao Wang et al. (BSD-3-Clause) for the background enlargement
- **[OpenCV](https://github.com/opencv/opencv)** and **[sharp](https://sharp.pixelplumbing.com)** for the registration and image pipelines
- **[Vite](https://vite.dev)** and **[Vercel](https://vercel.com)**

<br />

---

<div align="center">
  <img src="public/favicon.png" width="44" height="44" alt="" />
  <p><strong>Le goût d’être ensemble.</strong></p>
  <p>Built with ❤️ by <a href="https://github.com/Jeanfr1">Jean</a> for La Cabane à Mousse</p>
  <sub>L’abus d’alcool est dangereux pour la santé. À consommer avec modération.</sub>
</div>
