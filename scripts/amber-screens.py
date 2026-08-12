"""Shift Playlight UI screenshot accents from blue to amber and polish for the site."""

from __future__ import annotations

import colorsys
import sys
from pathlib import Path

from PIL import Image, ImageEnhance


def blue_to_amber(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    px = im.load()
    assert px is not None
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 8:
                continue
            rf, gf, bf = r / 255.0, g / 255.0, b / 255.0
            hue, sat, val = colorsys.rgb_to_hsv(rf, gf, bf)
            # Cyan–blue–indigo accents in the Playlight UI
            if 0.48 <= hue <= 0.72 and sat >= 0.18 and val >= 0.18:
                t = (hue - 0.48) / (0.72 - 0.48)
                # Amber / warm filament: ~28–42°
                hue = 0.078 + t * 0.035
                sat = min(1.0, sat * 1.08 + 0.04)
                val = min(1.0, val * 1.02)
                rf, gf, bf = colorsys.hsv_to_rgb(hue, sat, val)
                px[x, y] = (int(rf * 255), int(gf * 255), int(bf * 255), a)
            # Cool slate fills that read as blue-tinted darks
            elif 0.52 <= hue <= 0.70 and sat >= 0.06 and val < 0.45:
                hue = 0.07
                sat = min(0.35, sat * 1.4)
                rf, gf, bf = colorsys.hsv_to_rgb(hue, sat, val)
                px[x, y] = (int(rf * 255), int(gf * 255), int(bf * 255), a)
    return im


def polish(im: Image.Image) -> Image.Image:
    im = ImageEnhance.Contrast(im).enhance(1.06)
    im = ImageEnhance.Color(im).enhance(1.08)
    im = ImageEnhance.Sharpness(im).enhance(1.12)
    return im


def process(src: Path, dest: Path, max_w: int = 900) -> None:
    im = Image.open(src)
    if im.width > max_w:
        ratio = max_w / im.width
        im = im.resize((max_w, int(im.height * ratio)), Image.Resampling.LANCZOS)
    im = blue_to_amber(im)
    im = polish(im)
    dest_webp = dest.with_suffix(".webp")
    dest_png = dest.with_suffix(".png")
    rgb = im.convert("RGB")
    rgb.save(dest_webp, "WEBP", quality=86, method=6)
    rgb.save(dest_png, "PNG", optimize=True)
    print(f"wrote {dest_webp.name} ({dest_webp.stat().st_size // 1024}kb) and {dest_png.name}")


def main() -> None:
    if len(sys.argv) != 5:
        raise SystemExit("usage: amber-screens.py <now> <whole> <trail> <outdir>")
    out = Path(sys.argv[4])
    out.mkdir(parents=True, exist_ok=True)
    for src, name in zip(sys.argv[1:4], ("now", "whole", "trail"), strict=True):
        process(Path(src), out / name)


if __name__ == "__main__":
    main()
