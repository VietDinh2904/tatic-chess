from pathlib import Path

from collections import deque

from PIL import Image, ImageChops, ImageEnhance, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "dist" / "assets" / "pieces" / "sliced"
GENERATED = Path(r"C:\Users\dinhh\.codex\generated_images\01a138a2-0b5f-7693-905b-b69b77194fcc")

SETS = {
    "crystal": {
        "source": GENERATED / "exec-fc6435d2-445e-4136-915e-8073cf2d1a1a.png",
        "white": ("#16364c", "#63c7e9", "#f1ffff"),
        "black": ("#020713", "#09365d", "#58d8ff"),
    },
    "gothic": {
        "source": GENERATED / "exec-a518f661-d105-4dfe-8ab0-dd1e88de7445.png",
        "white": ("#332e2a", "#afa28f", "#fff4d7"),
        "black": ("#090706", "#533218", "#d99a42"),
    },
    "viking": {
        "source": GENERATED / "exec-2df5d25b-9661-4cdb-bebc-b09ce3805bee.png",
        "white": ("#613615", "#d59b54", "#ffe6aa"),
        "black": ("#170b05", "#653014", "#bd6c32"),
    },
}

PIECES = ((0, 0, "k"), (1, 0, "q"), (2, 0, "r"),
          (0, 1, "b"), (1, 1, "n"), (2, 1, "p"))


def fit_piece(piece: Image.Image) -> Image.Image:
    alpha = piece.getchannel("A")
    # Image generation can leave a detached ground-glow streak in a cell.
    # Keep only the largest connected alpha component, then restore a small
    # antialiased fringe around it.
    threshold = alpha.point(lambda value: 255 if value > 34 else 0)
    width, height = threshold.size
    pixels = threshold.load()
    seen, largest = set(), []
    for y in range(height):
        for x in range(width):
            if not pixels[x, y] or (x, y) in seen:
                continue
            queue, component = deque([(x, y)]), []
            seen.add((x, y))
            while queue:
                px, py = queue.popleft()
                component.append((px, py))
                for nx in range(max(0, px - 1), min(width, px + 2)):
                    for ny in range(max(0, py - 1), min(height, py + 2)):
                        if pixels[nx, ny] and (nx, ny) not in seen:
                            seen.add((nx, ny)); queue.append((nx, ny))
            if len(component) > len(largest):
                largest = component
    component_mask = Image.new("L", alpha.size, 0)
    component_pixels = component_mask.load()
    for x, y in largest:
        component_pixels[x, y] = 255
    component_mask = component_mask.filter(ImageFilter.MaxFilter(9))
    piece.putalpha(ImageChops.multiply(alpha, component_mask))
    alpha = piece.getchannel("A")
    bbox = alpha.getbbox()
    if not bbox:
        raise ValueError("Generated cell has no visible piece")
    piece = piece.crop(bbox)
    piece.thumbnail((466, 466), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    x = (512 - piece.width) // 2
    y = 512 - piece.height - 18
    canvas.alpha_composite(piece, (x, y))
    return canvas


def recolor(piece: Image.Image, palette) -> Image.Image:
    alpha = piece.getchannel("A")
    gray = ImageOps.grayscale(piece)
    gray = ImageEnhance.Contrast(gray).enhance(1.12)
    colored = ImageOps.colorize(gray, palette[0], palette[2], mid=palette[1])
    colored.putalpha(alpha)
    return colored


for set_name, config in SETS.items():
    sheet = Image.open(config["source"]).convert("RGBA")
    cell_w, cell_h = sheet.width // 3, sheet.height // 2
    for column, row, name in PIECES:
        crop = sheet.crop((column * cell_w, row * cell_h,
                           (column + 1) * cell_w, (row + 1) * cell_h))
        crop = fit_piece(crop)
        for side in ("white", "black"):
            destination = OUT / set_name / "2d" / side
            destination.mkdir(parents=True, exist_ok=True)
            recolor(crop, config[side]).save(destination / f"{name}.png", optimize=True)

print(f"Created {len(SETS) * len(PIECES) * 2} chess-piece assets in {OUT}")
