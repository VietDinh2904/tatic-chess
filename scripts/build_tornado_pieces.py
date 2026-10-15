from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "dist/assets/pieces/source"
OUTPUT_DIR = ROOT / "dist/assets/pieces/sliced/tornadoes/2d"
PIECES = ("k", "q", "b", "n", "r", "p")
CROP_WINDOWS = ((0, 390), (320, 770), (680, 1090), (970, 1470), (1350, 1830), (1690, 2172))


def largest_component_bounds(alpha: Image.Image) -> tuple[int, int, int, int] | None:
    mask = alpha.point(lambda value: 255 if value > 28 else 0)
    width, height = mask.size
    pixels = mask.load()
    visited = bytearray(width * height)
    largest: tuple[int, int, int, int, int] | None = None
    for y in range(height):
        for x in range(width):
            offset = y * width + x
            if not pixels[x, y] or visited[offset]:
                continue
            stack = [(x, y)]
            visited[offset] = 1
            count = 0
            min_x = max_x = x
            min_y = max_y = y
            while stack:
                current_x, current_y = stack.pop()
                count += 1
                min_x, max_x = min(min_x, current_x), max(max_x, current_x)
                min_y, max_y = min(min_y, current_y), max(max_y, current_y)
                for next_x, next_y in ((current_x - 1, current_y), (current_x + 1, current_y), (current_x, current_y - 1), (current_x, current_y + 1)):
                    if 0 <= next_x < width and 0 <= next_y < height:
                        next_offset = next_y * width + next_x
                        if pixels[next_x, next_y] and not visited[next_offset]:
                            visited[next_offset] = 1
                            stack.append((next_x, next_y))
            candidate = (count, min_x, min_y, max_x + 1, max_y + 1)
            if largest is None or count > largest[0]:
                largest = candidate
    if largest is None:
        return None
    _, left, top, right, bottom = largest
    return max(0, left - 10), max(0, top - 10), min(width, right + 10), min(height, bottom + 10)


def fit_with_safe_margin(image: Image.Image) -> Image.Image:
    bounds = largest_component_bounds(image.getchannel("A"))
    if bounds:
        image = image.crop(bounds)
    image.thumbnail((216, 226), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
    x = (256 - image.width) // 2
    y = 244 - image.height
    canvas.alpha_composite(image, (x, y))
    return canvas


def build_color(color: str, filename: str) -> None:
    atlas = Image.open(SOURCE_DIR / filename).convert("RGBA")
    destination = OUTPUT_DIR / color
    destination.mkdir(parents=True, exist_ok=True)
    for piece, (left, right) in zip(PIECES, CROP_WINDOWS):
        output = fit_with_safe_margin(atlas.crop((left, 0, right, atlas.height)))
        output.save(destination / f"{piece}.png", optimize=True)


def main() -> None:
    build_color("white", "tornado-fire-atlas.png")
    build_color("black", "tornado-lightning-atlas.png")


if __name__ == "__main__":
    main()
