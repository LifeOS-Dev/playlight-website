"""Put the road's sample life into the three app screenshots on the homepage.

The captures in public/look/ came from the founder's own phone, so they showed
a real name, an age, a work task and live business numbers (users, MRR,
audience). This script replaces exactly those strings with the sample life the
homepage already tells - the night owl training for a half marathon, saving a
six-month runway, learning Spanish - and leaves every other pixel alone. The
road describes one life; the app screens now show that same life.

How:
  1. Each personal string is erased by interpolating the background across its
     box (the cards are smooth gradients, so the seam does not show).
  2. The replacement is set in the typeface the capture was drawn in - Fraunces,
     Hanken Grotesk or Space Mono, the app's faces at the time - at the size
     that reproduces the ORIGINAL string's measured width, on its baseline.

Fonts: the app dropped these three families on 2026-10-25 (commit abaee71 in
los_client), so take them from the commit before it:

    git -C <los_client> show abaee71^:assets/fonts/<Name>.ttf > fonts/<Name>.ttf

Usage:
    python scripts/sample-life-screens.py <originals-dir> <fonts-dir> <out-dir>

<originals-dir> holds now.png, whole.png and trail.png as they were before this
script ever ran (git: `git show before-light-narrates:public/look/now.png`).
Writes .png and .webp next to each other, the pair public/look/ serves.
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

Box = tuple[int, int, int, int]


def text_pixels(img: Image.Image, box: Box, kind: str):
    """Pixels belonging to the glyphs in `box`: white text, or amber text."""
    px = img.load()
    x0, y0, x1, y1 = box
    out = []
    for y in range(y0, y1):
        for x in range(x0, x1):
            r, g, b = px[x, y][:3]
            if kind == "white" and min(r, g, b) >= 120:
                out.append((x, y, (r, g, b)))
            elif kind == "grey" and min(r, g, b) >= 78 and max(r, g, b) - min(r, g, b) < 60:
                out.append((x, y, (r, g, b)))
            elif kind == "amber" and r >= 150 and r - b >= 90:
                out.append((x, y, (r, g, b)))
    return out


def tight(img: Image.Image, box: Box, kind: str) -> Box:
    pts = text_pixels(img, box, kind)
    if not pts:
        raise SystemExit(f"no {kind} text found in {box}")
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    return (min(xs), min(ys), max(xs) + 1, max(ys) + 1)


def ink(img: Image.Image, box: Box, kind: str) -> tuple[int, int, int]:
    """The glyphs' own colour: the brightest third of their pixels, averaged."""
    pts = sorted(text_pixels(img, box, kind), key=lambda p: sum(p[2]), reverse=True)
    top = pts[: max(1, len(pts) // 3)]
    return tuple(round(sum(p[2][i] for p in top) / len(top)) for i in range(3))  # type: ignore[return-value]


def erase(img: Image.Image, box: Box, mode: str = "h", pad: int = 2) -> None:
    """Fill `box` by interpolating the background across it.

    "h" reads the columns just outside the left and right edges, "v" the rows
    just outside the top and bottom, "hv" averages the two. The pad keeps the
    sampled edge clear of antialiasing.
    """
    px = img.load()
    x0, y0, x1, y1 = box
    x0, y0, x1, y1 = x0 - pad, y0 - pad, x1 + pad, y1 + pad

    def avg(points):
        cols = [px[x, y][:3] for x, y in points]
        return [sum(c[i] for c in cols) / len(cols) for i in range(3)]

    h: dict[tuple[int, int], list[float]] = {}
    v: dict[tuple[int, int], list[float]] = {}
    if "h" in mode:
        for y in range(y0, y1):
            left = avg([(x, y) for x in range(x0 - 3, x0)])
            right = avg([(x, y) for x in range(x1, x1 + 3)])
            for x in range(x0, x1):
                t = (x - x0 + 0.5) / (x1 - x0)
                h[(x, y)] = [left[i] * (1 - t) + right[i] * t for i in range(3)]
    if "v" in mode:
        for x in range(x0, x1):
            top = avg([(x, y) for y in range(y0 - 3, y0)])
            bottom = avg([(x, y) for y in range(y1, y1 + 3)])
            for y in range(y0, y1):
                t = (y - y0 + 0.5) / (y1 - y0)
                v[(x, y)] = [top[i] * (1 - t) + bottom[i] * t for i in range(3)]
    for y in range(y0, y1):
        for x in range(x0, x1):
            parts = [d[(x, y)] for d in (h, v) if (x, y) in d]
            c = [sum(p[i] for p in parts) / len(parts) for i in range(3)]
            px[x, y] = tuple(round(n) for n in c)


def fit(font_path: Path, sample: str, width: float) -> float:
    """The point size at which `sample` sets exactly `width` px wide."""
    lo, hi = 4.0, 120.0
    for _ in range(40):
        mid = (lo + hi) / 2
        f = ImageFont.truetype(str(font_path), mid)
        x0, _, x1, _ = f.getbbox(sample, anchor="ls")
        if x1 - x0 < width:
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


SCALE = 4  # set the type 4x up and bring it down, as the captures were


def set_text(
    img: Image.Image,
    font_path: Path,
    size: float,
    text: str,
    colour: tuple[int, int, int],
    baseline: float,
    *,
    left: float | None = None,
    centre: float | None = None,
    stroke: int = 0,
) -> None:
    """Set `text` on `img`. `stroke` thickens the glyphs by that many
    oversampled pixels - a quarter of a screen pixel each."""
    layer = Image.new("RGBA", (img.width * SCALE, img.height * SCALE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    f = ImageFont.truetype(str(font_path), size * SCALE)
    if centre is not None:
        draw.text(
            (centre * SCALE, baseline * SCALE), text, font=f, fill=colour + (255,), anchor="ms",
            stroke_width=stroke, stroke_fill=colour + (255,),
        )
    else:
        assert left is not None
        # line up the ink, not the advance origin, with the original's left edge
        ink_x0 = f.getbbox(text, anchor="ls")[0]
        draw.text(
            (left * SCALE - ink_x0, baseline * SCALE), text, font=f, fill=colour + (255,), anchor="ls"
        )
    layer = layer.resize(img.size, Image.Resampling.LANCZOS)
    base = img.convert("RGBA")
    base.alpha_composite(layer)
    img.paste(base.convert("RGB"))


def replace(
    img: Image.Image,
    region: Box,
    kind: str,
    font_path: Path,
    old: str,
    new: str,
    *,
    align: str,
    mode: str = "h",
    erase_box: Box | None = None,
) -> None:
    """Swap the string `old`, found inside `region`, for `new` - same face,
    same size, same colour, same baseline."""
    box = tight(img, region, kind)
    colour = ink(img, box, kind)
    size = fit(font_path, old, box[2] - box[0])
    f = ImageFont.truetype(str(font_path), size)
    descent = f.getbbox(old, anchor="ls")[3]
    baseline = box[3] - descent
    erase(img, erase_box or box, mode)
    if align == "centre":
        set_text(img, font_path, size, new, colour, baseline, centre=(box[0] + box[2]) / 2)
    else:
        set_text(img, font_path, size, new, colour, baseline, left=box[0])


def main(src: Path, fonts: Path, out: Path) -> None:
    fraunces_light = fonts / "Fraunces_72pt-Light.ttf"
    fraunces = fonts / "Fraunces_72pt-Regular.ttf"
    hanken = fonts / "HankenGrotesk-Regular.ttf"
    hanken_semi = fonts / "HankenGrotesk-SemiBold.ttf"
    mono = fonts / "SpaceMono-Regular.ttf"
    out.mkdir(parents=True, exist_ok=True)

    # ── Home: the one lit thing ──────────────────────────────────────
    now = Image.open(src / "now.png").convert("RGB")
    replace(now, (90, 40, 420, 95), "white", fraunces_light,
            "Good evening, Aqib", "Good evening", align="centre")
    # The task was two lines; the run is one, set on the block's middle.
    task = tight(now, (40, 225, 462, 318), "white")
    line1 = tight(now, (40, 225, 462, 272), "white")
    colour = ink(now, task, "white")
    size = fit(hanken_semi, "feed product knowledge to", line1[2] - line1[0])
    f = ImageFont.truetype(str(hanken_semi), size)
    cap = -f.getbbox("L", anchor="ls")[1]
    erase(now, task, "hv", pad=3)
    set_text(now, hanken_semi, size, "Long run, 12 km", colour,
             (task[1] + task[3]) / 2 + cap / 2, centre=(task[0] + task[2]) / 2)
    replace(now, (200, 325, 300, 352), "amber", mono, "~60m", "~75m", align="centre")

    # ── Player: the whole life on one surface ────────────────────────
    whole = Image.open(src / "whole.png").convert("RGB")
    # The orb's glow reaches into the name's left edge, so look for the
    # name's white only to the right of it.
    # Horizontal fill only: the amber rule runs just under the name, and a
    # vertical fill would drag it up into the gap.
    replace(whole, (150, 90, 300, 138), "white", fraunces_light, "Aqib", "Alex", align="left")
    replace(whole, (90, 176, 140, 198), "white", mono, "27.9", "26.2", align="left")
    replace(whole, (50, 265, 300, 305), "white", fraunces, "Creator Phase", "Launch Season",
            align="left")
    replace(whole, (50, 308, 460, 334), "grey", hanken,
            "Creating Product and content simultaneously.",
            "Opening the shop. Training for the half.", align="left")

    # ── Game Plan: your own evidence ─────────────────────────────────
    trail = Image.open(src / "trail.png").convert("RGB")
    # Each new goal keeps its ring's arc honest: 9/30, 1,200/6,000 and 23/50
    # are the same 30%, 20% and 46% the arcs were drawn at.
    rings = [
        ((80, 278, 148, 322), "30", "9"),
        ((206, 278, 296, 322), "200", "1,200"),
        ((340, 278, 434, 322), "2,300", "23"),
    ]
    # The app sizes a ring's number by how many characters it has: "30" and
    # "200" are set large, "2,300" smaller to fit. So each new number takes
    # the size the app gave the original of its own length.
    measured = {}
    for region, old, _ in rings:
        box = tight(trail, region, "white")
        measured[old] = (box, fit(mono, old, box[2] - box[0]))
    size_for = {"9": measured["30"][1], "23": measured["30"][1], "1,200": measured["2,300"][1]}
    for region, old, new in rings:
        box, old_size = measured[old]
        colour = ink(trail, box, "white")
        f_old = ImageFont.truetype(str(mono), old_size)
        f_new = ImageFont.truetype(str(mono), size_for[new])
        baseline_old = box[3] - f_old.getbbox(old, anchor="ls")[3]
        # keep the digits' middle where the old digits' middle was
        cap_old = -f_old.getbbox("0", anchor="ls")[1]
        cap_new = -f_new.getbbox("0", anchor="ls")[1]
        baseline = baseline_old - cap_old / 2 + cap_new / 2
        erase(trail, box, "hv", pad=3)
        # The captured digits went through two resamples and a sharpen on
        # their way here, which thickened them; a quarter-pixel stroke matches.
        set_text(trail, mono, size_for[new], new, colour, baseline,
                 centre=(box[0] + box[2]) / 2, stroke=1)

    labels = [
        ((60, 364, 170, 392), "App Users", "Km this week"),
        ((200, 364, 300, 392), "MRR", "Runway fund"),
        ((330, 364, 450, 392), "Audience", "Spanish"),
    ]
    label_box = tight(trail, labels[2][0], "white")
    label_size = fit(hanken_semi, "Audience", label_box[2] - label_box[0])
    for region, old, new in labels:
        box = tight(trail, region, "white")
        colour = ink(trail, box, "white")
        f = ImageFont.truetype(str(hanken_semi), label_size)
        baseline = box[3] - f.getbbox(old, anchor="ls")[3]
        centre = (box[0] + box[2]) / 2
        # the new labels are wider than the old: clear the whole column
        erase(trail, (int(centre - 58), box[1], int(centre + 58), box[3]), "h", pad=2)
        set_text(trail, hanken_semi, label_size, new, colour, baseline, centre=centre)

    subs = [
        ((60, 393, 170, 414), "30 of 100", "9 of 30"),
        ((190, 393, 312, 414), "200 of 1,000", "1,200 of 6,000"),
        ((322, 393, 456, 414), "2,300 of 5,000", "23 of 50"),
    ]
    sub_box = tight(trail, subs[2][0], "grey")
    sub_size = fit(hanken, "2,300 of 5,000", sub_box[2] - sub_box[0])
    for region, old, new in subs:
        box = tight(trail, region, "grey")
        colour = ink(trail, box, "grey")
        f = ImageFont.truetype(str(hanken), sub_size)
        baseline = box[3] - f.getbbox(old, anchor="ls")[3]
        centre = (box[0] + box[2]) / 2
        erase(trail, (int(centre - 60), box[1], int(centre + 60), box[3]), "h", pad=2)
        set_text(trail, hanken, sub_size, new, colour, baseline, centre=centre)

    for name, im in (("now", now), ("whole", whole), ("trail", trail)):
        im.save(out / f"{name}.png", "PNG", optimize=True)
        im.save(out / f"{name}.webp", "WEBP", quality=86, method=6)
        print("wrote", out / f"{name}.png")


if __name__ == "__main__":
    if len(sys.argv) != 4:
        raise SystemExit(__doc__)
    main(Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3]))
