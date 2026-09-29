from pathlib import Path
from PIL import Image, ImageDraw
import sys

source = Path(sys.argv[1])
output = Path(sys.argv[2])
files = sorted(source.glob("*.jpg"))
per_sheet, columns = 48, 8
thumb_w, thumb_h, label_h = 219, 135, 20
for page, offset in enumerate(range(0, len(files), per_sheet), 1):
    batch = files[offset:offset + per_sheet]
    rows = (len(batch) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * thumb_w, rows * (thumb_h + label_h)), "white")
    draw = ImageDraw.Draw(sheet)
    for i, path in enumerate(batch):
        image = Image.open(path).convert("RGB")
        image.thumbnail((thumb_w, thumb_h))
        x = (i % columns) * thumb_w
        y = (i // columns) * (thumb_h + label_h)
        sheet.paste(image, (x, y))
        draw.text((x + 4, y + thumb_h + 2), path.stem, fill="black")
    sheet.save(output.with_name(f"{output.stem}-{page}.jpg"), quality=88)
