#!/usr/bin/env python3
"""Convert the kit's condensed display face (Nimbus Sans Narrow Bold, 08-estudo/fonts) to WOFF2,
subset to Latin + the punctuation the copy uses, and ship its licence next to it (AGPL-3 with
font exception: the licence file must travel with the font). Needs fonttools + brotli.
Run: python3 scripts/subset-fonts.py"""
from pathlib import Path
import shutil
from fontTools.ttLib import TTFont
from fontTools import subset

ROOT = Path(__file__).resolve().parent.parent
src = ROOT / "08-estudo/fonts/NimbusSansNarrow-Bold.woff"
# public/ + versioned name: preloaded from index.html, cached immutable (bump v to replace)
out = ROOT / "public/fonts/cabane-condensed-v1.woff2"

font = TTFont(src)
opts = subset.Options()
opts.flavor = "woff2"
opts.layout_features = ["kern", "liga", "ccmp", "locl", "mark", "mkmk"]
opts.name_IDs = ["*"]
opts.name_languages = ["*"]
opts.notdef_outline = True
sub = subset.Subsetter(opts)
# Basic Latin, Latin-1, Œœ, quotes, dashes, ellipsis, arrows
sub.populate(unicodes=[*range(0x20, 0x7F), *range(0xA0, 0x100), 0x152, 0x153, 0x2013, 0x2014,
                       0x2018, 0x2019, 0x201C, 0x201D, 0x2026, 0x2191, 0x2193, 0x2197])
sub.subset(font)
out.parent.mkdir(parents=True, exist_ok=True)
font.flavor = "woff2"
font.save(out)
shutil.copyfile(ROOT / "08-estudo/fonts/LICENCE.txt", out.parent / "LICENCE-NimbusSansNarrow.txt")
print(f"{out.relative_to(ROOT)}: {out.stat().st_size // 1024} KB")
