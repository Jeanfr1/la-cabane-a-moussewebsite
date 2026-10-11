#!/usr/bin/env python3
"""Pin Fraunces to the one style the site uses (Black, SOFT 100, WONK 0), keep the optical-size
axis, subset to Latin + the punctuation in the copy. Needs fonttools + brotli.
Run: python3 scripts/subset-fonts.py"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

ROOT = Path(__file__).resolve().parent.parent
src = ROOT / "node_modules/@fontsource-variable/fraunces/files/fraunces-latin-full-normal.woff2"
# public/ + versioned name: preloaded from index.html, cached immutable (bump v to replace)
out = ROOT / "public/fonts/fraunces-black-soft-v1.woff2"

font = TTFont(src)
font = instancer.instantiateVariableFont(font, {"wght": 900, "SOFT": 100, "WONK": 0})
opts = subset.Options()
opts.flavor = "woff2"
opts.layout_features = ["kern", "liga", "clig", "calt", "ccmp", "locl", "mark", "mkmk"]
opts.name_IDs = ["*"]
latin = list(range(0x20, 0x7F)) + list(range(0xA0, 0x100)) + [0x152, 0x153, 0x2013, 0x2014, 0x2019, 0x201C, 0x201D, 0x2026, 0x20AC, 0x2192]
sub = subset.Subsetter(opts)
sub.populate(unicodes=latin)
sub.subset(font)
font.flavor = "woff2"
font.save(out)
print(out.relative_to(ROOT), out.stat().st_size, "bytes")
