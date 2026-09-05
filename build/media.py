import os, io, json, base64
from PIL import Image, ImageOps

SRC = "/Users/apostolospollalis/Downloads/extra photos for galerie of experiences"
DST = "assets/gallery"
os.makedirs(DST, exist_ok=True)

photos = [
 ("WhatsApp Image 2026-08-12 at 10.27.51.jpeg",        "dawn-tender-run"),
 ("WhatsApp Image 2026-08-12 at 10.27.59.jpeg",        "pastel-dawn-anchorage"),
 ("WhatsApp Image 2026-08-12 at 11.11.43.jpeg",        "sea-cave-from-the-bow"),
 ("WhatsApp Image 2026-08-12 at 11.11.56 (1).jpeg",    "olive-framed-cove"),
 ("WhatsApp Image 2026-08-12 at 11.11.56.jpeg",        "pebble-beach-cove"),
 ("WhatsApp Image 2026-08-12 at 11.11.57 (1).jpeg",    "emerald-bay-anchorage"),
 ("WhatsApp Image 2026-08-12 at 11.11.57 (2).jpeg",    "under-sail-with-guests"),
 ("WhatsApp Image 2026-08-12 at 11.11.57.jpeg",        "hillside-harbour-view"),
 ("WhatsApp Image 2026-08-12 at 11.11.58 (1).jpeg",    "harbour-blue-hour"),
 ("WhatsApp Image 2026-08-12 at 11.11.58 (2).jpeg",    "island-village-waterfront"),
 ("WhatsApp Image 2026-08-12 at 11.11.58 (3).jpeg",    "sunset-at-anchor"),
 ("WhatsApp Image 2026-08-12 at 11.11.58.jpeg",        "dusk-under-the-boom"),
 ("WhatsApp Image 2026-08-12 at 11.11.59 (1).jpeg",    "turquoise-from-the-bow"),
 ("WhatsApp Image 2026-08-12 at 11.11.59 (2).jpeg",    "skipper-at-the-helm"),
 ("WhatsApp Image 2026-08-12 at 11.11.59.jpeg",        "sea-cave-swim-stop"),
]

out = []
for fname, slug in photos:
    p = os.path.join(SRC, fname)
    im = Image.open(p)
    im = ImageOps.exif_transpose(im).convert("RGB")
    w, h = im.size
    rec = {"slug": slug, "w": w, "h": h}
    for width in (1600, 800):
        if w <= width:
            r = im.copy()
        else:
            r = im.resize((width, round(h * width / w)), Image.LANCZOS)
        r.save(f"{DST}/{slug}-{width}.jpg", "JPEG", quality=82, optimize=True, progressive=True)
        r.save(f"{DST}/{slug}-{width}.webp", "WEBP", quality=80, method=6)
    # LQIP
    t = im.resize((20, max(1, round(h * 20 / w))), Image.LANCZOS)
    buf = io.BytesIO(); t.save(buf, "WEBP", quality=45, method=6)
    rec["lqip"] = "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()
    out.append(rec)
    print(slug, w, h, len(rec["lqip"]))

json.dump(out, open("/private/tmp/claude-501/-Users-apostolospollalis-Library-CloudStorage-GoogleDrive-apostolos-clinicbrain-gr-Shared-drives-BRAIN-GROUP-BRAINGROUP-ASSETS-CLIENTS-AIyachts-Website/da651acf-f6f8-4115-8055-9c41c4f18a94/scratchpad/photos.json","w"), indent=1)
