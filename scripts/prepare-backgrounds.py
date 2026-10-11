#!/usr/bin/env python3
"""Section backgrounds for Les tireuses and Nous trouver, from the two screenshots the owner's
designer supplied on 2026-10-12 (assets-src/ref-*-source.png, kept as delivered).
Each screenshot is cropped to the photo, the viewer's buttons left inside the crop are filled in
(OpenCV inpainting; they end up under the section's gradient), then the photo is enlarged 4x with
Real-ESRGAN (scripts/upscale.py). Output: assets-src/bg-fete.png, assets-src/bg-retrouvailles.png.
Needs opencv-python + torch and the x4plus weights:
  https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth
Run: python3 scripts/prepare-backgrounds.py <RealESRGAN_x4plus.pth> [--check]"""
from pathlib import Path
import subprocess
import sys
import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets-src"

# crop = (x0, y0, x1, y1) of the photo inside the screenshot, chosen to leave out the viewer's
# frame and as many of its buttons as the composition allows; patches = buttons still inside the
# crop, in screenshot coordinates (x0, y0, x1, y1), filled before enlarging
JOBS = {
    "fete": {           # golden bottles and a poured glass: background of Les tireuses
        "src": "ref-fete-source.png",
        "crop": (0, 0, 404, 422),
        "patches": [(0, 0, 44, 44)],                         # back arrow
    },
    "retrouvailles": {  # friends toasting, seen from below: background of Nous trouver
        "src": "ref-contact-source.png",
        "crop": (10, 13, 413, 476),
        "patches": [(8, 11, 50, 57), (364, 436, 409, 476)],  # back arrow, expand icon
    },
}


def main():
    weights = sys.argv[1]
    out_dir = ROOT / "scripts/out"
    out_dir.mkdir(exist_ok=True)
    for name, job in JOBS.items():
        img = cv2.imread(str(SRC / job["src"]), cv2.IMREAD_COLOR)
        cx0, cy0, cx1, cy1 = job["crop"]
        crop = img[cy0:cy1, cx0:cx1].copy()        # crop first: the viewer's frame must not bleed in
        mask = np.zeros(crop.shape[:2], np.uint8)
        for x0, y0, x1, y1 in job["patches"]:
            mask[max(0, y0 - cy0):y1 - cy0, max(0, x0 - cx0):x1 - cx0] = 255
        crop = cv2.inpaint(crop, mask, 9, cv2.INPAINT_TELEA)
        tmp = out_dir / f"{name}-crop.png"
        cv2.imwrite(str(tmp), crop)
        dst = SRC / f"bg-{name}.png"
        subprocess.run([sys.executable, str(ROOT / "scripts/upscale.py"), weights, str(tmp), str(dst), "4"], check=True)
        if "--check" in sys.argv:
            big = cv2.imread(str(dst))
            side = np.hstack([cv2.resize(crop, (big.shape[1] // 2, big.shape[0] // 2), interpolation=cv2.INTER_CUBIC),
                              cv2.resize(big, (big.shape[1] // 2, big.shape[0] // 2), interpolation=cv2.INTER_AREA)])
            cv2.imwrite(str(out_dir / f"{name}-check.jpg"), side)


if __name__ == "__main__":
    main()
