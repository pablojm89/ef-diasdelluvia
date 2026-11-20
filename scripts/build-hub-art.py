#!/usr/bin/env python3
"""Cut the pictures of the hub front page from the art each room already has.

Writes assets/door-<room>.webp (what is seen through each arch), assets/frieze.webp
(the tile band of the equipment room, mirrored so it repeats without a seam) and
assets/wall.webp (its plaster, mirrored both ways).

The Mate Arena door needs a capture of the court saved as a PNG:
  python3 scripts/build-hub-art.py court.png
Without it, that door is left as it is. Requires Pillow.
"""
import sys
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'assets'
gym = Image.open(ROOT / 'gimnasio/assets/gym.webp').convert('RGB')
store = Image.open(ROOT / 'gimnasio/assets/store.webp').convert('RGB')
world = Image.open(ROOT / 'assets/world.webp').convert('RGB')

doors = {
    'gimnasio': (gym, (540, 0, 1308, 1024)),
    'mision': (world, (600, 0, 1080, 640)),
    'pulso': (world, (20, 300, 470, 900)),
    'liga': (world, (1030, 330, 1480, 930)),
}
if len(sys.argv) > 1:
    doors['mate'] = (Image.open(sys.argv[1]).convert('RGB'), (385, 120, 825, 706))
for name, (picture, box) in doors.items():
    picture.crop(box).resize((480, 640), Image.LANCZOS).save(OUT / f'door-{name}.webp', quality=82, method=6)


def mirrored(tile, vertical=False):
    width, height = tile.size
    sheet = Image.new('RGB', (width * 2, height * (2 if vertical else 1)))
    sheet.paste(tile, (0, 0))
    sheet.paste(ImageOps.mirror(tile), (width, 0))
    if vertical:
        sheet.paste(ImageOps.flip(sheet.crop((0, 0, width * 2, height))), (0, height))
    return sheet


mirrored(store.crop((1300, 481, 1500, 509))).save(OUT / 'frieze.webp', quality=88, method=6)
mirrored(store.crop((1296, 190, 1496, 390)), vertical=True).save(OUT / 'wall.webp', quality=80, method=6)
print('Wrote', ', '.join(sorted(f'door-{name}.webp' for name in doors)), 'frieze.webp and wall.webp')
