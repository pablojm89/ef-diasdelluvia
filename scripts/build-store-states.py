#!/usr/bin/env python3
"""Paint the stored equipment into the equipment-room background.

Reads   gimnasio/assets/store.webp (empty room) and the prop-*.webp drawings.
Writes  gimnasio/assets/store-tidy.webp   whole room with everything put away
        gimnasio/assets/set-<id>.webp     the part of the tidy room that one item changes
        gimnasio/store-layout.js          where each part sits, in % of the picture

The game shows the empty room and fades in one part per stored item, so the
background itself changes state. To repaint the tidy room by hand (or with an
image model), keep the same 1536x1024 framing, save it as store-tidy.webp and
run this script with --from-tidy to cut the parts again.

Requires Pillow:  python3 scripts/build-store-states.py
"""
import json
import sys
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
ART = ROOT / 'gimnasio' / 'assets'
SHADOW = (58, 34, 22)


def prop(name, width, rotate=0, shade=1.0):
    image = Image.open(ART / f'prop-{name}.webp').convert('RGBA')
    if rotate:
        image = image.rotate(rotate, resample=Image.BICUBIC, expand=True)
        image = image.crop(image.getbbox())
    height = round(image.height * width / image.width)
    image = image.resize((width, height), Image.LANCZOS)
    if shade != 1.0:
        rgb = ImageEnhance.Brightness(image.convert('RGB')).enhance(shade)
        rgb.putalpha(image.getchannel('A'))
        image = rgb
    return image


def paste(canvas, image, left, top):
    layer = Image.new('RGBA', canvas.size, (0, 0, 0, 0))
    layer.alpha_composite(image, (round(left), round(top)))
    return Image.alpha_composite(canvas, layer)


def cast(canvas, image, left, top, dx=5, dy=6, blur=4, strength=.34):
    """Soft shadow of a drawing on the surface right behind it."""
    alpha = image.getchannel('A').point(lambda a: round(a * strength))
    shadow = Image.new('RGBA', image.size, SHADOW + (0,))
    shadow.putalpha(alpha)
    layer = Image.new('RGBA', canvas.size, (0, 0, 0, 0))
    layer.alpha_composite(shadow, (round(left + dx), round(top + dy)))
    return Image.alpha_composite(canvas, layer.filter(ImageFilter.GaussianBlur(blur)))


def ground(canvas, cx, cy, rx, ry, strength=.3):
    layer = Image.new('RGBA', canvas.size, (0, 0, 0, 0))
    ImageDraw.Draw(layer).ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=SHADOW + (round(255 * strength),))
    return Image.alpha_composite(canvas, layer.filter(ImageFilter.GaussianBlur(3)))


def restore(canvas, empty, box, mask):
    """Put pieces of the empty room back in front (wires, hooks, basket fronts)."""
    region = empty.crop(box)
    region.putalpha(mask)
    layer = Image.new('RGBA', canvas.size, (0, 0, 0, 0))
    layer.paste(region, box[:2])
    return Image.alpha_composite(canvas, layer)


def metal_mask(empty, box, saturation=62, feather=.6):
    """Grey wire and hooks stand out from the warm wall and floor by saturation."""
    hsv = empty.crop(box).convert('RGB').convert('HSV')
    mask = hsv.getchannel('S').point(lambda s: 255 if s < saturation else 0)
    return mask.filter(ImageFilter.GaussianBlur(feather))


def paint_item(item, empty):
    """Return the room with only this item put away."""
    room = empty.copy()
    if item == 'softball':
        ball = prop('softball', 54, shade=.93)
        room = ground(room, 418, 668, 22, 5)
        room = paste(room, ball, 391, 612)
    elif item == 'basketball':
        ball = prop('basketball', 64, shade=.95)
        room = ground(room, 366, 674, 26, 6)
        room = paste(room, ball, 334, 610)
    elif item == 'football':
        ball = prop('football', 60, shade=.95)
        room = ground(room, 466, 674, 25, 6)
        room = paste(room, ball, 436, 614)
    if item in ('softball', 'basketball', 'football'):
        cage = (316, 520, 536, 692)
        room = restore(room, empty, cage, metal_mask(empty, cage))
    elif item == 'cone':
        cone = prop('cone', 42)
        room = cast(room, cone, 575, 448, dx=5, dy=2, blur=3, strength=.25)
        room = paste(room, cone, 575, 448)
    elif item == 'beanbag':
        bag = prop('beanbag', 50, rotate=-6)
        room = paste(room, bag, 756, 445)
        front = (748, 473, 814, 512)
        room = restore(room, empty, front, Image.new('L', (front[2] - front[0], front[3] - front[1]), 255))
    elif item == 'bib':
        bib = prop('bib', 58)
        room = cast(room, bib, 828, 444, dx=2, dy=3, blur=2, strength=.3)
        room = paste(room, bib, 828, 444)
    elif item == 'rope':
        rope = prop('rope', 56)
        room = cast(room, rope, 905, 443, dx=2, dy=3, blur=2, strength=.3)
        room = paste(room, rope, 905, 443)
    elif item == 'hoop':
        hoop = prop('hoop', 108)
        room = cast(room, hoop, 1026, 447, dx=7, dy=7, blur=3, strength=.3)
        room = paste(room, hoop, 1026, 447)
        # The front of the cradle hook stays in front of the hoop.
        cradle = (1040, 532, 1122, 562)
        hsv = empty.crop(cradle).convert('RGB').convert('HSV')
        dark = hsv.getchannel('V').point(lambda v: 255 if v < 120 else 0).filter(ImageFilter.GaussianBlur(.5))
        room = restore(room, empty, cradle, dark)
    elif item == 'racket':
        racket = prop('racket', 150, rotate=37)
        racket = racket.resize((round(racket.width * 118 / racket.height), 118), Image.LANCZOS)
        left = 1258 - racket.width // 2
        room = cast(room, racket, left, 428, dx=6, dy=6, blur=3, strength=.3)
        room = paste(room, racket, left, 428)
        hook = (1248, 398, 1272, 444)
        hsv = empty.crop(hook).convert('RGB').convert('HSV')
        dark = hsv.getchannel('V').point(lambda v: 255 if v < 105 else 0).filter(ImageFilter.GaussianBlur(.5))
        room = restore(room, empty, hook, dark)
    elif item == 'mat':
        room = stack_mat(room, empty)
    return room


def stack_mat(room, empty):
    """A second mat on the middle of the platform, copied from the mat below it."""
    lift, base = 17, 679
    top = [(1240, 634), (1352, 634), (1421, 666), (1299, 666)]
    front = [(1299, 666), (1421, 666), (1421, base), (1299, base)]
    # Draw the outline four times larger so the slanted edges come out smooth.
    big = Image.new('L', (empty.width * 4, empty.height * 4), 0)
    draw = ImageDraw.Draw(big)
    for shape in (top, front):
        draw.polygon([(x * 4, y * 4) for x, y in shape], fill=255)
    mask = big.resize(empty.size, Image.LANCZOS)
    lifted = Image.new('RGBA', empty.size, (0, 0, 0, 0))
    moved = empty.transform(empty.size, Image.AFFINE, (1, 0, 0, 0, 1, lift))
    moved.putalpha(mask.transform(mask.size, Image.AFFINE, (1, 0, 0, 0, 1, lift)))
    lifted.alpha_composite(moved)
    # Shadow on the mats underneath, then the visible left side of the new mat.
    shade = Image.new('RGBA', empty.size, (0, 0, 0, 0))
    ImageDraw.Draw(shade).polygon([(1230, 628), (1300, 664), (1428, 664), (1428, 672), (1292, 672), (1222, 634)], fill=(16, 26, 60, 110))
    room = Image.alpha_composite(room, shade.filter(ImageFilter.GaussianBlur(3)))
    room = Image.alpha_composite(room, lifted)
    side = [(1240, 634 - lift), (1299, 666 - lift), (1299, base - lift), (1240, base - 32 - lift)]
    layer = Image.new('RGBA', empty.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.polygon(side, fill=(38, 58, 112, 255))
    draw.line(side + [side[0]], fill=(22, 30, 62, 255), width=2)
    draw.line([(1240, 634 - lift), (1352, 634 - lift), (1421, 666 - lift), (1421, base - lift)], fill=(22, 30, 62, 255), width=2)
    draw.line([(1299, 666 - lift), (1421, 666 - lift)], fill=(22, 30, 62, 200), width=1)
    draw.line([(1299, base - lift), (1421, base - lift)], fill=(22, 30, 62, 255), width=2)
    return Image.alpha_composite(room, layer.filter(ImageFilter.GaussianBlur(.4)))


ITEMS = ['softball', 'basketball', 'football', 'cone', 'beanbag', 'bib', 'rope', 'hoop', 'racket', 'mat']
# With --from-tidy, each part is cut from a repainted store-tidy.webp using these boxes.
BOXES = {'softball': (384, 604, 452, 680), 'basketball': (326, 602, 406, 686), 'football': (428, 606, 504, 686),
         'cone': (566, 438, 630, 506), 'beanbag': (748, 438, 814, 476), 'bib': (822, 438, 892, 508),
         'rope': (898, 436, 968, 508), 'hoop': (1018, 440, 1148, 566), 'racket': (1226, 420, 1298, 560),
         'mat': (1212, 606, 1436, 690)}


def changed_part(room, empty, pad=3):
    diff = ImageChops.difference(room.convert('RGB'), empty.convert('RGB')).convert('L')
    alpha = diff.point(lambda v: 255 if v > 5 else 0).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(.8))
    box = alpha.point(lambda v: 255 if v > 24 else 0).getbbox()
    box = (max(0, box[0] - pad), max(0, box[1] - pad), min(room.width, box[2] + pad), min(room.height, box[3] + pad))
    part = room.crop(box).convert('RGBA')
    part.putalpha(alpha.crop(box))
    return part, box


def main():
    empty = Image.open(ART / 'store.webp').convert('RGBA')
    layout = {}
    if '--from-tidy' in sys.argv:
        tidy = Image.open(ART / 'store-tidy.webp').convert('RGBA').resize(empty.size, Image.LANCZOS)
        for item in ITEMS:
            box = BOXES[item]
            part = tidy.crop(box)
            edge = Image.new('L', part.size, 0)
            ImageDraw.Draw(edge).rectangle((4, 4, part.width - 5, part.height - 5), fill=255)
            part.putalpha(edge.filter(ImageFilter.GaussianBlur(3)))
            part.save(ART / f'set-{item}.webp', quality=90, method=6)
            layout[item] = box
    else:
        tidy = empty.copy()
        for item in ITEMS:
            part, box = changed_part(paint_item(item, empty), empty)
            part.save(ART / f'set-{item}.webp', quality=90, method=6)
            layout[item] = box
            layer = Image.new('RGBA', empty.size, (0, 0, 0, 0))
            layer.alpha_composite(part, box[:2])
            tidy = Image.alpha_composite(tidy, layer)
        tidy.convert('RGB').save(ART / 'store-tidy.webp', quality=88, method=6)
    width, height = empty.size
    percent = {item: [round(100 * box[0] / width, 2), round(100 * box[1] / height, 2),
                      round(100 * (box[2] - box[0]) / width, 2), round(100 * (box[3] - box[1]) / height, 2)]
               for item, box in layout.items()}
    text = ('// Generated by scripts/build-store-states.py. Left, top, width and height in % of the room picture.\n'
            'export const stored = ' + json.dumps(percent, indent=1) + ';\n')
    (ROOT / 'gimnasio' / 'store-layout.js').write_text(text, encoding='utf8')
    print('Wrote store-tidy.webp, %d parts and store-layout.js' % len(layout))


if __name__ == '__main__':
    main()
