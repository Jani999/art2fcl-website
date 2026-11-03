"""Non-destructive, conservative alpha preparation. Requires Pillow + numpy.
Run: python scripts/clean-goddess.py
The source is never rewritten; no silhouette erosion or anatomy synthesis.
"""
from pathlib import Path
import hashlib, json
import numpy as np
from PIL import Image, ImageFilter, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'public/assets/Cybernetic Marble Lady Justice.png'
TARGET = ROOT / 'public/assets/goddess-clean.webp'
REPORT = ROOT / 'docs/v2-assets'
REPORT.mkdir(parents=True, exist_ok=True)
original = Image.open(SOURCE).convert('RGBA')
rgba = np.array(original).astype(np.float32)
rgb, raw_alpha = rgba[:, :, :3], rgba[:, :, 3]
# Exported opaque body pixels peak at 253, not 255. Restore that plateau.
alpha = np.clip(raw_alpha / 253.0, 0, 1)
alpha[raw_alpha <= 1] = 0
edge = (alpha > 0) & (alpha < .97)
# Estimate uncontaminated nearby colors from high-confidence opaque pixels.
# Only boundary RGB is repaired; the artwork and alpha silhouette stay intact.
weight = np.where(alpha > .97, alpha, 0)
blur = lambda a: np.asarray(Image.fromarray(np.uint8(np.clip(a, 0, 255))).filter(ImageFilter.GaussianBlur(1.2))).astype(np.float32)
denom = blur(weight * 255) / 255
nearby = np.stack([blur(rgb[:, :, c] * weight) / np.maximum(denom, .001) for c in range(3)], axis=2)
luma = rgb @ np.array([.2126, .7152, .0722], dtype=np.float32)
chroma = rgb.max(axis=2) - rgb.min(axis=2)
colored_fringe = edge & (chroma > 10)
rgb[colored_fringe] = .2 * rgb[colored_fringe] + .8 * luma[colored_fringe, None]
white_fringe = edge & (denom > .06) & (luma > nearby.mean(axis=2) + 24)
mix = np.minimum(.65, (1 - alpha) * .75)
rgb[white_fringe] = rgb[white_fringe] * (1 - mix[white_fringe, None]) + nearby[white_fringe] * mix[white_fringe, None]
# Keep fractional coverage: no blanket threshold/blur/erosion of chains or wires.
rgb[alpha == 0] = 0
clean = Image.fromarray(np.uint8(np.dstack([np.clip(rgb, 0, 255), alpha * 255])))
padding = 64
padded = Image.new('RGBA', (clean.width + 2 * padding, clean.height + 2 * padding))
padded.paste(clean, (padding, padding))
padded.save(TARGET, 'WEBP', lossless=True, method=6, exact=True)
comparison = Image.new('RGB', (1120, 900), '#242424')
draw = ImageDraw.Draw(comparison)
for column, (label, im) in enumerate([('BEFORE / ORIGINAL ALPHA', original), ('AFTER / CLEANED + PADDING', padded)]):
    for row, bg in enumerate(['#090909', '#e7e4de']):
        thumb = im.copy(); thumb.thumbnail((500, 390), Image.Resampling.LANCZOS)
        tile = Image.new('RGBA', (540, 410), bg)
        tile.alpha_composite(thumb, ((540-thumb.width)//2, (410-thumb.height)//2))
        x, y = column * 560, row * 450 + 35
        comparison.paste(tile.convert('RGB'), (x, y))
        draw.text((x+12, y-25), label + ' / ' + bg, fill='#e7e4de')
comparison.save(REPORT / 'alpha-comparison.jpg', quality=94)
mask = raw_alpha > 32
report = {'source':str(SOURCE.relative_to(ROOT)), 'source_sha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(), 'source_size':original.size, 'output_size':padded.size, 'padding_px':padding, 'source_alpha_max':int(raw_alpha.max()), 'transparent_source_pixels':int((raw_alpha==0).sum()), 'edge_color_pixels_repaired':int((colored_fringe|white_fringe).sum()), 'source_boundary_occupied_pixels':{'left':int(mask[:,0].sum()),'right':int(mask[:,-1].sum()),'top':int(mask[0].sum()),'bottom':int(mask[-1].sum())}, 'notes':'Original preserved byte-for-byte. No geometry reconstruction. Existing cropped details cannot be recovered. Alpha fractional coverage retained.'}
(REPORT / 'alpha-report.json').write_text(json.dumps(report, indent=2)+'\n', encoding='utf-8')
print(json.dumps(report, indent=2))
