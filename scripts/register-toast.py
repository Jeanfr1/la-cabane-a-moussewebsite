#!/usr/bin/env python3
"""Register the chapter-2 foreground (05-camadas/brinde-premier-plan.png) on the hero campaign
(03-hero/brinde-cinematographique.png) with SIFT + a RANSAC similarity transform, so the toast
layer can sit exactly on the campaign's bottles while the bar dissolves around them.
Writes src/data/toast.json (scale + offset in % of the 1536x1024 canvas) and, with --check,
a side-by-side overlay to scripts/out/toast-registration.jpg. Needs opencv-python + numpy.
Run: python3 scripts/register-toast.py [--check]"""
from pathlib import Path
import json
import sys
import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
camp = cv2.imread(str(ROOT / "03-hero/brinde-cinematographique.png"))
fg = cv2.imread(str(ROOT / "05-camadas/brinde-premier-plan.png"), cv2.IMREAD_UNCHANGED)
H, W = camp.shape[:2]

# features on the opaque core of the layer only (bottles, labels, hands)
core = (cv2.erode(fg[..., 3], np.ones((9, 9), np.uint8)) > 250).astype(np.uint8) * 255
sift = cv2.SIFT_create(8000)
k1, d1 = sift.detectAndCompute(cv2.cvtColor(fg[..., :3], cv2.COLOR_BGR2GRAY), core)
k2, d2 = sift.detectAndCompute(cv2.cvtColor(camp, cv2.COLOR_BGR2GRAY), None)
good = [a for a, b in cv2.BFMatcher().knnMatch(d1, d2, k=2) if a.distance < 0.72 * b.distance]
p1 = np.float32([k1[m.queryIdx].pt for m in good])
p2 = np.float32([k2[m.trainIdx].pt for m in good])
M, inliers = cv2.estimateAffinePartial2D(p1, p2, method=cv2.RANSAC, ransacReprojThreshold=4,
                                         maxIters=20000, confidence=0.999)
inliers = inliers.ravel().astype(bool)
scale = float(np.hypot(M[0, 0], M[1, 0]))
rotation = float(np.degrees(np.arctan2(M[1, 0], M[0, 0])))
resid = np.linalg.norm(p1[inliers] @ M[:, :2].T + M[:, 2] - p2[inliers], axis=1)

data = {
    "source": "scripts/register-toast.py",
    "canvas": [W, H],
    "scale": round(scale, 5),                      # layer px → campaign px
    "x": round(float(M[0, 2]) / W * 100, 4),       # offset, % of the canvas width
    "y": round(float(M[1, 2]) / H * 100, 4),       # offset, % of the canvas height
    "rotationDeg": round(rotation, 3),             # ignored by the page (|r| < 0.5°)
    "inliers": int(inliers.sum()),
    "residualPx": {"median": round(float(np.median(resid)), 2), "p90": round(float(np.percentile(resid, 90)), 2)},
}
out = ROOT / "src/data/toast.json"
out.write_text(json.dumps(data, indent=2) + "\n")
print(json.dumps(data))
if abs(rotation) > 0.5 or data["residualPx"]["median"] > 3:
    sys.exit("registration too loose for a match cut: check the overlay")

if "--check" in sys.argv:
    warped = cv2.warpAffine(fg, M, (W, H), flags=cv2.INTER_LINEAR, borderValue=(0, 0, 0, 0))
    a = warped[..., 3:4] / 255.0
    over = (camp * (1 - a) + warped[..., :3] * a).astype(np.uint8)
    blend = (camp * (1 - a / 2) + warped[..., :3] * a / 2).astype(np.uint8)
    (ROOT / "scripts/out").mkdir(exist_ok=True)
    cv2.imwrite(str(ROOT / "scripts/out/toast-registration.jpg"),
                cv2.resize(np.hstack([camp, over, blend]), None, fx=0.42, fy=0.42))
