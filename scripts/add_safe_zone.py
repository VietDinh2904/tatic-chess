from pathlib import Path
from PIL import Image


ROOT = Path(__file__).resolve().parents[1] / "dist" / "assets" / "pieces"
COLS, ROWS = 6, 4


def add_safe_zone(path: Path, scale: float) -> None:
    source = Image.open(path).convert("RGBA")
    cell_w, cell_h = source.width // COLS, source.height // ROWS
    output = Image.new("RGBA", source.size, (0, 0, 0, 0))
    target_w, target_h = round(cell_w * scale), round(cell_h * scale)

    for row in range(ROWS):
        for col in range(COLS):
            box = (col * cell_w, row * cell_h, (col + 1) * cell_w, (row + 1) * cell_h)
            cell = source.crop(box)
            cell.thumbnail((target_w, target_h), Image.Resampling.LANCZOS)
            x = col * cell_w + (cell_w - cell.width) // 2
            y = row * cell_h + (cell_h - cell.height) // 2
            output.alpha_composite(cell, (x, y))

    output.save(path, optimize=True)


for sprite in ROOT.glob("*.png"):
    # Human figures have wide shields, cloaks, and spears, so reserve more room.
    add_safe_zone(sprite, 0.78 if sprite.stem == "royal-human" else 0.84)
