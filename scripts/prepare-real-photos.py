#!/usr/bin/env python3
"""Real photos of the venue, cut from the kit's screenshot board 00-referencias/informacoes.jpg.

Each photo is cropped out of the board, the Google Maps interface drawn over it (title bar,
author line, close button, carousel arrows) is cropped away or inpainted, then the photo is
enlarged 4x with Real-ESRGAN (scripts/upscale.py) because the board holds them at ~500 px.
Output: assets-src/real-<name>.png (the board stays untouched; 00-referencias is not in git).

Run: ~/anaconda3/bin/python3 scripts/prepare-real-photos.py <RealESRGAN_x4plus.pth>
"""
import subprocess
import sys
import tempfile
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
BOARD = ROOT / "00-referencias/informacoes.jpg"
OUT = ROOT / "assets-src"

# board rectangle (x0, y0, x1, y1), then crop inside it (left, top, right, bottom) in board px,
# and white-text boxes to inpaint (in photo px, after the crop). Measured on the board.
PHOTOS = {
    # business photo: cable-reel display in the cave; title bar on top
    "cave": dict(rect=(15, 40, 490, 630), crop=(0, 46, 0, 0), text=[]),
    # business photo: facade CAVE / logo / BAR, parasols, deckchairs; title bar over the sky
    "facade": dict(rect=(615, 40, 1090, 630), crop=(0, 0, 0, 0), text=[(0, 0, 475, 46)]),
    # visitor photo (Google Maps): bar room, Edison lamps, wooden sign; author line, X, arrows
    "interior": dict(rect=(1215, 40, 1785, 460), crop=(34, 40, 34, 0), text=[]),
    # visitor photo (Google Maps): counter, wooden "BAR LA CABANE A MOUSSE" sign; author line
    "counter": dict(rect=(15, 700, 499, 1290), crop=(6, 40, 0, 0), text=[]),
}


def inpaint_text(img, boxes):
    if not boxes:
        return img
    mask = np.zeros(img.shape[:2], np.uint8)
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    bright = ((hsv[..., 2] > 170) & (hsv[..., 1] < 70)).astype(np.uint8)
    for x0, y0, x1, y1 in boxes:
        mask[y0:y1, x0:x1] = bright[y0:y1, x0:x1]
    mask = cv2.dilate(mask * 255, np.ones((5, 5), np.uint8), iterations=2)
    return cv2.inpaint(img, mask, 7, cv2.INPAINT_TELEA)


def main():
    weights = sys.argv[1]
    board = cv2.imread(str(BOARD))
    OUT.mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        for name, spec in PHOTOS.items():
            x0, y0, x1, y1 = spec["rect"]
            l, t, r, b = spec["crop"]
            photo = board[y0 + t:y1 - b, x0 + l:x1 - r].copy()
            photo = inpaint_text(photo, spec["text"])
            src = Path(tmp) / f"{name}.png"
            cv2.imwrite(str(src), photo)
            dst = OUT / f"real-{name}.png"
            subprocess.run([sys.executable, "-I", str(ROOT / "scripts/upscale.py"), weights, str(src), str(dst), "4"], check=True)


if __name__ == "__main__":
    main()
