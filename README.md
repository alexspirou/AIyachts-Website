# AIyachts — website

Static, multipage site. No framework, no build step required to *serve* it — the
`.html` files in this folder are the site. A small Node script regenerates them
from shared templates so the header, footer, SEO tags and structured data stay
identical across every page.

```
.
├── index.html               Home
├── about.html               About AIyachts
├── destinations.html        Ionian vs Aegean hub
│   └── destinations/
│       ├── ionian-sailing.html
│       └── aegean-sailing.html
├── fleet.html               All 14 yachts
│   └── fleet/<yacht>.html   One page per yacht
├── experiences.html         Gallery of experiences (26 photos & films)
├── services.html            Concierge · provisions · crew
├── brokerage.html           Brokerage & yacht management
├── contact.html             Enquiry form
├── privacy.html · 404.html
├── sitemap.xml · robots.txt · site.webmanifest
├── assets/                  css · js · fonts · img · gallery · fleet
└── build/                   the generator (not served)
```

## Regenerating the pages

```bash
node build/build.mjs
```

Rewrites all 26 pages plus `sitemap.xml`, `robots.txt` and `site.webmanifest`.

| Edit this | To change |
|---|---|
| `build/site.mjs` | domain, phone numbers, email, addresses, the fleet list, the gallery list and its filters |
| `build/pages.mjs` | the copy of every page |
| `build/components.mjs` | header, footer, breadcrumbs, page hero, cards, structured data |
| `assets/css/site.css` | all styling (single stylesheet) |
| `assets/js/site.js` | all behaviour (single script, no dependencies) |

**Domain.** `SITE.origin` in `build/site.mjs` is `https://ai-yachting.com`. It
drives every canonical URL, `og:url` and sitemap entry. Change it there and
re-run the build — never hand-edit the HTML. Point `www.ai-yachting.com` at the
apex with a 301 so only one host is indexed.

## Checking your work

```bash
node build/build.mjs && python3 build/check.py
```

`build/check.py` verifies that every local `href`/`src`/`srcset` resolves, that
titles and descriptions are unique and the right length, that each page has
exactly one `<h1>`, that every `<img>` has an `alt`, and that all JSON-LD parses.

## Media

`build/media.py` regenerates the gallery derivatives (800px and 1600px, WebP +
JPEG) and the inline blur placeholders in `build/lqip.mjs` from the originals.
Videos were encoded with ffmpeg (H.264, faststart, no audio).

## Deploying

Upload the whole folder except `build/` and `AIyachts-Photos/`. Any static host
works. If your host supports it, map unknown paths to `404.html`.

## Things worth filling in later

- **Yacht specifications.** Only the figures AIyachts supplied are published
  (year, cabins, guests, berths, heads). Length, draft, engine, sail wardrobe and
  pricing are deliberately absent rather than guessed — add them to the fleet
  entries in `build/site.mjs` and the spec tables will pick them up.
- **Forms.** The enquiry and newsletter forms open a pre-filled email to
  `aiyachtsea@gmail.com`; there is no backend. Swap in a form endpoint when one
  exists.
- **Social links.** `SITE.social` is empty; add the Instagram and Facebook URLs
  and they will appear in the organisation structured data.
