from pathlib import Path
from random import Random

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
PIECES = ROOT / "dist" / "assets" / "pieces" / "sliced"
GENERATED = Path(r"C:\Users\dinhh\.codex\generated_images\01a138a2-0b5f-7693-905b-b69b77194fcc")
ROYAL_ASSETS = {
    "n": GENERATED / "exec-9f02b568-7fed-408b-b7dd-a9420abf4095.png",
    "b": GENERATED / "exec-b40139a7-8a00-4cd5-903c-4b53360425f5.png",
}
KINDS = ("k", "q", "r", "b", "n", "p")


def centered(source: Image.Image, extent: int = 246) -> Image.Image:
    source = source.convert("RGBA")
    alpha = source.getchannel("A").point(lambda value: 0 if value < 12 else value)
    source.putalpha(alpha)
    bbox = alpha.getbbox()
    if not bbox:
        return Image.new("RGBA", (256, 256), (0, 0, 0, 0))
    source = source.crop(bbox)
    scale = min(extent / source.width, extent / source.height)
    source = source.resize(
        (max(1, round(source.width * scale)), max(1, round(source.height * scale))),
        Image.Resampling.LANCZOS,
    )
    output = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
    output.alpha_composite(source, ((256 - source.width) // 2, (256 - source.height) // 2))
    return output


def royal_black(source: Image.Image) -> Image.Image:
    source = source.copy().convert("RGBA")
    pixels = source.load()
    for y in range(source.height):
        for x in range(source.width):
            red, green, blue, alpha = pixels[x, y]
            if alpha == 0:
                continue
            # Keep skin and antique gold readable; turn emerald/ivory cloth into
            # the black side's charcoal-and-crimson Royal Court palette.
            if red > 135 and red > green * 1.12 and green > blue * 1.15:
                pixels[x, y] = (round(red * .82), round(green * .72), round(blue * .66), alpha)
            elif red > 115 and green > 70 and blue < 95 and red > blue * 1.45:
                pixels[x, y] = (round(red * .78), round(green * .72), round(blue * .58), alpha)
            else:
                light = (red * .30 + green * .59 + blue * .11) / 255
                pixels[x, y] = (
                    round(24 + 126 * light),
                    round(12 + 31 * light),
                    round(14 + 28 * light),
                    alpha,
                )
    return ImageEnhance.Contrast(source).enhance(1.08)


def celestialize(source: Image.Image, color: str, seed: int) -> Image.Image:
    source = source.convert("RGBA")
    alpha = source.getchannel("A")
    pixels = source.load()
    for y in range(source.height):
        for x in range(source.width):
            red, green, blue, opacity = pixels[x, y]
            if opacity == 0:
                continue
            light = (red * .24 + green * .55 + blue * .21) / 255
            if color == "white":
                pixels[x, y] = (
                    round(52 + 190 * light),
                    round(108 + 142 * light),
                    round(148 + 107 * light),
                    opacity,
                )
            else:
                pixels[x, y] = (
                    round(5 + 27 * light),
                    round(12 + 67 * light),
                    round(30 + 108 * light),
                    opacity,
                )

    # A restrained star field creates the celestial/abyss material while the
    # original piece silhouette stays perfectly legible.
    stars = Image.new("RGBA", source.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(stars)
    rng = Random(seed)
    alpha_pixels = alpha.load()
    for _ in range(90):
        x, y = rng.randrange(10, 246), rng.randrange(8, 246)
        if alpha_pixels[x, y] < 150:
            continue
        radius = 1 if rng.random() < .86 else 2
        star = (226, 252, 255, rng.randrange(125, 235)) if color == "white" else (68, 226, 255, rng.randrange(135, 245))
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=star)
    stars.putalpha(Image.composite(stars.getchannel("A"), Image.new("L", source.size, 0), alpha))
    source.alpha_composite(stars)
    return source


for kind, source_path in ROYAL_ASSETS.items():
    white = centered(Image.open(source_path), 244)
    black = royal_black(white)
    for mode in ("2d", "3d"):
        for color, asset in (("white", white), ("black", black)):
            destination = PIECES / "royal-human" / mode / color / f"{kind}.png"
            destination.parent.mkdir(parents=True, exist_ok=True)
            asset.save(destination, optimize=True)

for mode_index, mode in enumerate(("2d", "3d")):
    for color_index, color in enumerate(("white", "black")):
        for kind_index, kind in enumerate(KINDS):
            source = Image.open(PIECES / "nocturne" / mode / color / f"{kind}.png")
            celestial = celestialize(source, color, 6100 + mode_index * 100 + color_index * 20 + kind_index)
            destination = PIECES / "celestial" / mode / color / f"{kind}.png"
            destination.parent.mkdir(parents=True, exist_ok=True)
            celestial.save(destination, optimize=True)

print("Updated Royal Court cavalry/advisor and created 24 Celestial assets")
