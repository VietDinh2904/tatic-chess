from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
BACKGROUND_DIR = ROOT / "dist/assets/backgrounds"


def main() -> None:
    for source in BACKGROUND_DIR.glob("*.png"):
        image = Image.open(source).convert("RGB")
        image.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
        image.save(source.with_suffix(".webp"), "WEBP", quality=82, method=6)
        source.unlink()


if __name__ == "__main__":
    main()
