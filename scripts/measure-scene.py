#!/usr/bin/env python3
"""Measure the hero scene from the kit and derive the web layers.

Reads the before/after pair (05-camadas/cena-sem-fluxo.png, 03-hero/hero-mobile.png,
same 1024x1536 canvas) and the 3:2 desktop hero, then writes:
  assets-src/scene-stream.png  after-pixels where the pour differs, RGBA, cropped
  assets-src/scene-keep.png    alpha mask that feathers the scene's left edge into the sky
  assets-src/hero-sky.png      sky/sun/sea crop of hero-desktop.png (people excluded)
  src/data/scene.json          every number the hero code reads
  scripts/out/*.jpg            overlays drawn back on the source (verification)
Run: ~/anaconda3/bin/python3 scripts/measure-scene.py
"""
import json
from pathlib import Path
import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "scripts" / "out"
OUT.mkdir(exist_ok=True)

before = cv2.imread(str(ROOT / "05-camadas/cena-sem-fluxo.png"))
after = cv2.imread(str(ROOT / "03-hero/hero-mobile.png"))
desk = cv2.imread(str(ROOT / "03-hero/hero-desktop.png"))
H, W = after.shape[:2]
assert before.shape == after.shape == (1536, 1024, 3)

# 1. Stream: difference between the registered pair, limited to the pour corridor.
blur = lambda im: cv2.GaussianBlur(im.astype(np.float32), (0, 0), 1.2)
diff = np.abs(blur(after) - blur(before)).max(axis=2)
corridor = np.zeros((H, W), np.uint8)
cv2.fillPoly(corridor, [np.array([[690, 735], [880, 735], [900, 1040], [890, 1180],
                                  [860, 1440], [560, 1440], [560, 1150], [680, 1030]])], 1)
m = ((diff > 30) & (corridor > 0)).astype(np.uint8)
m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
m = cv2.dilate(m, np.ones((5, 5), np.uint8))
alpha = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 1.6)
alpha = np.clip(alpha * 1.25, 0, 1)
ys, xs = np.nonzero(alpha > 0.02)
x0, x1, y0, y1 = int(xs.min()) - 2, int(xs.max()) + 3, int(ys.min()) - 2, int(ys.max()) + 3
rgba = np.dstack([after, (alpha * 255).astype(np.uint8)])[y0:y1, x0:x1]
cv2.imwrite(str(ROOT / "assets-src/scene-stream.png"), rgba)

# neck exit: topmost stream rows; mouth: where the stream meets the open mouth
core = (diff > 60) & (corridor > 0)
top_rows = [y for y in range(700, 900) if core[y, 680:880].sum() > 6]
neck_y = top_rows[0]
neck_x = int(np.median(np.nonzero(core[neck_y:neck_y + 12, :])[1]))

# 2. Keep mask: 1 right of a hand-checked curve c(y), blurred. The curve runs left of
# the hand (y<330), left of the bottle (330..1000), right of the scene's own sun and
# its reflection (1060..1300) so that only the desktop sun remains, then hugs the shirt.
# Knots sit >= 60 px left of the people cut-outs (05-camadas) so alpha >= 0.98 on them.
ky = np.array([0, 120, 240, 300, 360, 420, 480, 560, 1000, 1060, 1300, 1340, 1400, 1440, 1480, 1536], np.float32)
kx = np.array([220, 175, 140, 150, 215, 260, 300, 330, 330, 190, 190, 170, 125, 70, 30, 0], np.float32)
c = np.interp(np.arange(H), ky, kx)
keep = (np.arange(W)[None, :] > c[:, None]).astype(np.float32)
keep = cv2.GaussianBlur(keep, (0, 0), 28)
small = cv2.resize(keep, (256, 384), interpolation=cv2.INTER_AREA)
mask_png = np.dstack([np.full_like(small, 255), np.full_like(small, 255),
                      np.full_like(small, 255), small * 255]).astype(np.uint8)
cv2.imwrite(str(ROOT / "assets-src/scene-keep.png"), mask_png)

# 2b. Colour bridge: the scene's own sky is paler than the desktop sky. A per-row colour
# sampled where the keep mask fades (x ≈ c(y)) is laid under the scene and ramps in from
# BRIDGE_L units left of it, so the desktop sky reaches the seam already in the scene's colour.
# Rows below the hills (y > 1000) keep the desktop hills and sea untouched.
BRIDGE_L, BRIDGE_R, BS = 380, 420, 3        # extent in scene units, downscale factor
bw, bh = (BRIDGE_L + BRIDGE_R) // BS, H // BS
rowcol = np.array([after[y, max(0, int(c[y]) - 30):int(c[y]) + 4].reshape(-1, 3).mean(axis=0) for y in range(H)], np.float32)
rowcol = cv2.GaussianBlur(rowcol[:, None, :], (0, 0), sigmaX=0.1, sigmaY=18)[:, 0, :]
u = np.arange(bw) * BS - BRIDGE_L                                   # scene units, 0 = scene left edge
bridge = np.zeros((bh, bw, 4), np.float32)
for j in range(bh):
    y = j * BS
    end = c[y] - 40
    t = np.clip((u + BRIDGE_L) / max(1, end + BRIDGE_L), 0, 1)
    a = t * t * (3 - 2 * t)
    v = np.clip((1060 - y) / 60, 0, 1)
    bridge[j, :, :3] = rowcol[y]
    bridge[j, :, 3] = a * v * 255
cv2.imwrite(str(ROOT / "assets-src/scene-bridge.png"), bridge.astype(np.uint8))

# 3. Sky crop from the desktop hero: x < 900 holds sky, sun and sea only (people start
# at x≈850 and stay under the opaque part of the scene); rows above 280 never show.
SKY = dict(x=0, y=280, w=900, h=1024 - 280)
sky = desk[SKY["y"]:SKY["y"] + SKY["h"], SKY["x"]:SKY["x"] + SKY["w"]]
cv2.imwrite(str(ROOT / "assets-src/hero-sky.png"), sky)

data = {
    "canvas": [W, H],
    "neck": [neck_x, neck_y],
    "mouth": [790, 1135],
    "stream": {"x": x0, "y": y0, "w": x1 - x0, "h": y1 - y0},
    "reveal": {"from": neck_y - 6, "to": 1262, "feather": 46},
    "horizon": {"scene": 1185, "desktop": 845},
    "sky": {**SKY, "src": [1536, 1024], "peopleX": 850, "keepX": 300},
    "bridge": {"left": BRIDGE_L, "right": BRIDGE_R},
    "timeline": {"prep": [0.15, 0.25], "pour": [0.25, 0.60], "contact": 0.60,
                 "read": [0.75, 0.90], "release": [0.90, 1.0], "zoom": 1.025},
}
(ROOT / "src/data/scene.json").write_text(json.dumps(data, indent=2) + "\n")

# Verification overlays
vis = after.copy()
vis[alpha > 0.3] = (0.4 * vis[alpha > 0.3] + 0.6 * np.array([60, 60, 255])).astype(np.uint8)
cv2.rectangle(vis, (x0, y0), (x1, y1), (255, 255, 0), 2)
for y in (data["reveal"]["from"], data["reveal"]["to"]):
    cv2.line(vis, (x0 - 40, y), (x1 + 40, y), (0, 255, 255), 2)
cv2.circle(vis, (neck_x, neck_y), 9, (0, 255, 0), 3)
cv2.circle(vis, tuple(data["mouth"]), 9, (255, 0, 255), 3)
for y in range(0, H, 4):
    cv2.circle(vis, (int(c[y]), y), 1, (255, 255, 255), -1)
cv2.line(vis, (0, 1185), (W, 1185), (255, 128, 0), 1)
cv2.imwrite(str(OUT / "scene-overlay.jpg"), cv2.resize(vis, (512, 768)))
print(json.dumps(data))
