# AIyachts — website

Static, multipage site with yacht content managed in Sanity. The Node generator
reads published, visible yachts from Sanity and writes the current website to
`dist/`. Shared templates keep the header, footer, SEO tags and structured data
consistent. The older HTML files in the repository root are an archived snapshot;
use `dist/` for the connected website.

See [Sanity setup and editing](docs/SANITY.md) for the local editor, yacht fields,
and publishing workflow. Requires Node.js 22.12 or later.

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
npm install
npm run build
npm run preview
```

Open `http://localhost:8080/fleet.html`. The build generates the main pages, one
page per published active yacht, plus `sitemap.xml`, `robots.txt` and
`site.webmanifest`. Yacht pages removed from Sanity are removed from the next
build. An empty fleet displays an availability message. Failed Sanity requests
stop the build and preserve the previous successful preview.

| Edit this | To change |
|---|---|
| Sanity Studio | yacht names, photos, galleries, specifications, descriptions, bases, charter options, visibility and display order |
| `sanity.config.json` | Sanity project ID and dataset |
| `build/site.mjs` | domain, phone numbers, email, addresses, the experiences gallery list and its filters |
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
npm test
npm run build
npm run studio:build
```

`build/tests/` checks the Sanity loader and generated yacht content, including
empty fleets and removing outdated pages. The optional `build/check.py` verifies
that every local `href`/`src`/`srcset` resolves, that
titles and descriptions are unique and the right length, that each page has
exactly one `<h1>`, that every `<img>` has an `alt`, and that all JSON-LD parses.

## Media

`build/media.py` regenerates the gallery derivatives (800px and 1600px, WebP +
JPEG) and the inline blur placeholders in `build/lqip.mjs` from the originals.
Videos were encoded with ffmpeg (H.264, faststart, no audio).

## Deploying

Upload only the contents of `dist/`. Any static host works. If your host supports
it, map unknown paths to `404.html`. Rebuild and deploy after publishing changes
in Sanity. Once a host is chosen, a Sanity webhook can trigger its build hook.

## Things worth filling in later

- **Yacht specifications.** Add technical details and units under Additional
  specifications in Sanity Studio. Publish and rebuild to update the spec tables.
- **Forms.** The enquiry and newsletter forms open a pre-filled email to
  `aiyachtsea@gmail.com`; there is no backend. Swap in a form endpoint when one
  exists.
- **Social links.** `SITE.social` is empty; add the Instagram and Facebook URLs
  and they will appear in the organisation structured data.
