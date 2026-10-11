#!/usr/bin/env python3
"""Build the hero pour rig from the kit's cut-outs (05-camadas, one shared 1024x1536 canvas).

The woman (pessoa-superior) sits in the hero, the man (pessoa-inferior) in the next section,
and the isolated stream (fluxo-fotografico) crosses the boundary between them, as in the
brief's reference (person above tipping a giant container, liquid crossing the middle frame,
person below catching it). Offsets were measured on gridded crops:
  - the top of the stream matches the bottle opening when shifted (+45, +55) from the woman;
  - the stream's main column ends at (778, 1340) in its own canvas;
  - the open mouth's centre is (800, 1140) in the man's canvas.
Everything is expressed in "rig units" (1 unit = 1 canvas px); the page scales the rig with
one CSS length, --u. Output: assets-src/pour-*.png, src/data/pour.json, scripts/out/pour-*.jpg.
Run: ~/anaconda3/bin/python3 scripts/measure-pour.py
"""
import json
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "scripts" / "out"
OUT.mkdir(exist_ok=True)
load = lambda f: cv2.imread(str(ROOT / "05-camadas" / f), cv2.IMREAD_UNCHANGED).astype(np.float32)

woman, man, flow = load("pessoa-superior.png"), load("pessoa-inferior.png"), load("fluxo-fotografico.png")
CW, CH = 1024, 1536

# rig placement (units). The man's canvas is the rig's x origin and is anchored to the right
# edge of the page (his head is cut by the canvas edge, so it bleeds off the screen).
WOMAN = (-23, 0)
FLOW = (WOMAN[0] + 45, WOMAN[1] + 55)
MOUTH_IN_MAN = (800, 1140)
FLOW_END = (778 + FLOW[0], 1340 + FLOW[1])            # (800, 1395) in rig units
MAN = (0, FLOW_END[1] - MOUTH_IN_MAN[1] - 5)          # stream ends just inside the mouth
MOUTH = (MOUTH_IN_MAN[0] + MAN[0], MOUTH_IN_MAN[1] + MAN[1])
NECK = (757 + WOMAN[0], 815 + WOMAN[1])               # lower lip of the bottle opening
BOUNDARY = 900                                         # hero bottom, in rig units
RIG_W, RIG_H = CW, MAN[1] + CH

# Soft falloff where the cut-outs were cropped: the woman's torso (right of the bottle)
# dissolves into the dark hero; the man's shirt (canvas bottom) dissolves into the section.
yy, xx = np.mgrid[0:CH, 0:CW].astype(np.float32)
torso = np.clip((xx - 790) / 60, 0, 1) * np.clip((yy - 560) / 210, 0, 1)
woman[..., 3] *= 1 - torso ** 1.4
man[..., 3] *= np.clip((CH - 8 - yy) / 170, 0, 1) ** 1.2


def save_trimmed(img, name, origin):
    a = img[..., 3]
    ys, xs = np.nonzero(a > 3)
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    cv2.imwrite(str(ROOT / "assets-src" / f"pour-{name}.png"), img[y0:y1, x0:x1].clip(0, 255).astype(np.uint8))
    return {"x": int(origin[0] + x0), "y": int(origin[1] + y0), "w": int(x1 - x0), "h": int(y1 - y0)}


layers = {
    "woman": save_trimmed(woman, "woman", WOMAN),
    "man": save_trimmed(man, "man", MAN),
    "stream": save_trimmed(flow, "stream", FLOW),
}
data = {
    "rig": [RIG_W, RIG_H],
    "boundary": BOUNDARY,
    "neck": list(NECK),
    "mouth": list(MOUTH),
    "streamStart": NECK[1] - 30,          # first visible row of liquid (inside the opening)
    "streamEnd": FLOW_END[1] + 30,        # end of the column plus the drops on the lips
    "layers": layers,
}
(ROOT / "src/data/pour.json").write_text(json.dumps(data, indent=2) + "\n")

# verification composite: dark hero above the boundary, foam below, markers on anchors
comp = np.zeros((RIG_H, RIG_W, 3), np.float32)
comp[:BOUNDARY] = (40, 30, 28)
comp[BOUNDARY:] = (213, 243, 255)
for name in ("man", "woman", "stream"):
    r = layers[name]
    img = cv2.imread(str(ROOT / "assets-src" / f"pour-{name}.png"), cv2.IMREAD_UNCHANGED).astype(np.float32)
    x0, y0 = r["x"], r["y"]
    sx0, sy0 = max(0, -x0), max(0, -y0)
    img = img[sy0:, sx0:]
    x0, y0 = max(0, x0), max(0, y0)
    h, w = min(img.shape[0], RIG_H - y0), min(img.shape[1], RIG_W - x0)
    a = img[:h, :w, 3:] / 255
    comp[y0:y0 + h, x0:x0 + w] = comp[y0:y0 + h, x0:x0 + w] * (1 - a) + img[:h, :w, :3] * a
vis = comp.clip(0, 255).astype(np.uint8)
cv2.circle(vis, NECK, 10, (0, 255, 0), 3)
cv2.circle(vis, MOUTH, 10, (255, 0, 255), 3)
cv2.line(vis, (0, BOUNDARY), (RIG_W, BOUNDARY), (0, 160, 255), 2)
cv2.imwrite(str(OUT / "pour-overlay.jpg"), cv2.resize(vis, (RIG_W // 2, RIG_H // 2)))
print(json.dumps(data))
