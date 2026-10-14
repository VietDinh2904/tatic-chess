from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "dist" / "assets" / "pieces" / "sliced"
SOURCE_ROOT = Path(r"C:\Users\dinhh\.codex\generated_images\01a138a2-0b5f-7693-905b-b69b77194fcc")
SOURCES = {
    "twisted": SOURCE_ROOT / "exec-1e7e42b7-9f45-4a8d-be86-370bd5fda4bb.png",
    "bauhaus": SOURCE_ROOT / "exec-92241a70-1b3b-4afc-8fda-582b975f4c47.png",
    "marble": SOURCE_ROOT / "exec-9c8dcd30-12ad-44c1-b1f3-e7fdec2f5352.png",
    "nocturne": SOURCE_ROOT / "exec-d1e0c99a-2e7d-4281-bfa4-b020e797a01a.png",
    "royal-human": SOURCE_ROOT / "exec-9ff9e0af-bda7-41d0-921d-d9bccf07ae88.png",
}
PIECES = ("k", "q", "r", "b", "n", "p")
ROWS = (("2d", "white"), ("2d", "black"), ("3d", "white"), ("3d", "black"))
CANVAS = 256


def connected_components(mask: Image.Image):
    width, height = mask.size
    pixels = mask.load()
    visited = bytearray(width * height)
    components = []

    for y in range(height):
        for x in range(width):
            index = y * width + x
            if visited[index] or pixels[x, y] == 0:
                continue
            queue = deque([(x, y)])
            visited[index] = 1
            points = []
            while queue:
                px, py = queue.popleft()
                points.append((px, py))
                for nx, ny in ((px - 1, py), (px + 1, py), (px, py - 1), (px, py + 1)):
                    if 0 <= nx < width and 0 <= ny < height:
                        ni = ny * width + nx
                        if not visited[ni] and pixels[nx, ny] != 0:
                            visited[ni] = 1
                            queue.append((nx, ny))
            components.append(points)
    return components


def isolate_piece(cell: Image.Image) -> Image.Image:
    cell = cell.convert("RGBA")
    alpha = cell.getchannel("A").point(lambda value: 255 if value >= 18 else 0)
    components = connected_components(alpha)
    if not components:
        return Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))

    components.sort(key=len, reverse=True)
    # The generated sheet occasionally lets a fragment from the neighbouring
    # cell spill into this one. The chess figure is always the largest connected
    # alpha component, so retaining only that component removes the bleed
    # without relying on fragile pixel coordinates.
    keep = components[:1]
    clean_alpha = Image.new("L", cell.size, 0)
    clean_pixels = clean_alpha.load()
    original_alpha = cell.getchannel("A").load()
    for component in keep:
        for x, y in component:
            clean_pixels[x, y] = original_alpha[x, y]
    cell.putalpha(clean_alpha)

    bbox = clean_alpha.getbbox()
    if not bbox:
        return Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
    piece = cell.crop(bbox)

    # Fill the square while retaining a small safety margin on every edge.
    max_extent = 246
    scale = min(max_extent / piece.width, max_extent / piece.height)
    size = (max(1, round(piece.width * scale)), max(1, round(piece.height * scale)))
    piece = piece.resize(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
    canvas.alpha_composite(piece, ((CANVAS - piece.width) // 2, (CANVAS - piece.height) // 2))
    return canvas


for style, source_path in SOURCES.items():
    source = Image.open(source_path).convert("RGBA")
    cell_width, cell_height = source.width // 6, source.height // 4
    for row, (mode, color) in enumerate(ROWS):
        for column, piece_name in enumerate(PIECES):
            box = (
                column * cell_width,
                row * cell_height,
                (column + 1) * cell_width,
                (row + 1) * cell_height,
            )
            output_path = OUTPUT / style / mode / color / f"{piece_name}.png"
            output_path.parent.mkdir(parents=True, exist_ok=True)
            isolate_piece(source.crop(box)).save(output_path, optimize=True)

print(f"Created {len(SOURCES) * len(ROWS) * len(PIECES)} centered chess-piece images in {OUTPUT}")
