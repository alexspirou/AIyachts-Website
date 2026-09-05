import { SITE, NAV, FLEET, GALLERY, GALLERY_FILTERS } from './site.mjs';
import { LQIP } from './lqip.mjs';

export const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
export const abs = p => SITE.origin + '/' + String(p).replace(/^\//,'');
/* relative prefix for a page that lives `depth` folders deep */
export const up = depth => '../'.repeat(depth || 0);

/* ---------------------------------------------------------- HEAD */
export function head(page){
  const r = up(page.depth);
  const url = abs(page.slug);
  const ogImg = abs(page.ogImage || 'assets/img/og-cover.jpg');
  const type = page.ogType || 'website';
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="${page.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'}">
<meta name="author" content="${SITE.name}">
<meta name="theme-color" content="${SITE.themeLight}" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="${SITE.themeDark}" media="(prefers-color-scheme: dark)">
<meta name="format-detection" content="telephone=yes">

<meta property="og:type" content="${type}">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:locale" content="${SITE.locale}">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(page.ogTitle || page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:image" content="${ogImg}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(page.ogAlt || page.h1 || SITE.name)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.ogTitle || page.title)}">
<meta name="twitter:description" content="${esc(page.description)}">
<meta name="twitter:image" content="${ogImg}">

<link rel="icon" href="${r}assets/favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="${r}assets/favicon-192.png" sizes="192x192" type="image/png">
<link rel="apple-touch-icon" href="${r}assets/apple-touch-icon.png">
<link rel="manifest" href="${r}site.webmanifest">

<link rel="preload" as="font" type="font/woff2" href="${r}assets/fonts/familjen-grotesk.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="${r}assets/fonts/franklin-var.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="${r}assets/fonts/plex-mono-400.woff2" crossorigin>
<link rel="stylesheet" href="${r}assets/css/site.css">
${(page.extraHead || '').trim()}`;
}

/* ---------------------------------------------------------- HEADER */
export function header(page){
  const r = up(page.depth);
  const link = (item) => {
    const active = page.nav === item.href;
    return `<a href="${r}${item.href}"${active ? ' aria-current="page"' : ''}>${item.label}</a>`;
  };
  return `<a class="skip-link" href="#main">Skip to content</a>
<header id="siteHeader">
  <a href="${r}index.html" class="brand" aria-label="${SITE.name} — home">
    <img src="${r}assets/favicon-192.png" alt="" width="30" height="30" class="brand-mark">
    <span>AIyachts</span>
  </a>
  <nav class="primary" aria-label="Primary">
    ${NAV.map(link).join('\n    ')}
  </nav>
  <a href="${r}contact.html" class="nav-cta">Enquire <span class="arrow" aria-hidden="true">→</span></a>
  <button class="menu-btn" id="menuBtn" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
    <span></span><span></span>
  </button>
</header>

<div id="mobile-menu">
  <a href="${r}index.html"${page.nav === 'index.html' ? ' aria-current="page"' : ''}>Home</a>
  ${NAV.map(link).join('\n  ')}
</div>`;
}

/* ---------------------------------------------------------- BREADCRUMBS */
export function crumbs(page){
  if(!page.crumbs || !page.crumbs.length) return '';
  const r = up(page.depth);
  const items = [{label:'Home', href:'index.html'}, ...page.crumbs];
  return `<nav class="crumbs" aria-label="Breadcrumb"><div class="wrap"><ol>
${items.map((c,i) => {
  const last = i === items.length - 1;
  return `    <li>${last ? `<span aria-current="page">${esc(c.label)}</span>` : `<a href="${r}${c.href}">${esc(c.label)}</a>`}</li>`;
}).join('\n')}
</ol></div></nav>`;
}

/* ---------------------------------------------------------- PAGE HERO */
export function pageHero(page){
  if(!page.hero) return '';
  const h = page.hero;
  const r = up(page.depth);
  return `<section class="page-hero${h.compact ? ' compact' : ''}">
  <div class="page-hero-media" aria-hidden="true">
    <picture>
      <source type="image/webp" srcset="${r}${h.img}-800.webp 800w, ${r}${h.img}-1600.webp 1600w" sizes="100vw">
      <img src="${r}${h.img}-1600.jpg" alt="" width="1600" height="900" fetchpriority="high" decoding="async">
    </picture>
  </div>
  <div class="wrap page-hero-body">
    <p class="eyebrow">${esc(h.eyebrow)}</p>
    <h1 class="display">${h.h1}</h1>
    ${h.lede ? `<p class="lede">${h.lede}</p>` : ''}
    ${h.actions || ''}
  </div>
  <div class="page-hero-scan" aria-hidden="true"></div>
</section>`;
}

/* ---------------------------------------------------------- FOOTER */
export function footer(page){
  const r = up(page.depth);
  const tel = p => 'tel:' + p.replace(/[^\d+]/g,'');
  return `<footer id="contact-footer">
  <img class="footer-photo" src="${r}assets/img/footer-panorama.jpg" alt="" width="1500" height="1500" loading="lazy" decoding="async">
  <div class="wrap">
    <div class="contact-grid">
      <div class="reveal">
        <h2 class="display">Let's set a course.</h2>
        <p class="lede">Tell us where you'd like to sail, and one of our team will reply personally — usually within a day.</p>
        <form class="subscribe" id="subscribeForm">
          <label class="sr-only" for="subEmail">Email address</label>
          <input id="subEmail" type="email" name="email" placeholder="captain.of.my.inbox@sea.com" autocomplete="email" required>
          <button type="submit">Hop aboard our inbox</button>
        </form>
        <p class="subscribe-note">Occasional dispatches from the Aegean &amp; Ionian. Unsubscribe anytime.</p>
      </div>
      <div class="reveal">
        <div class="contact-col">
          <h2 class="foot-h">Speak to us</h2>
          ${SITE.phones.map(p => `<a href="${tel(p)}">${p}</a>`).join('\n          ')}
          <a href="mailto:${SITE.email}">${SITE.email}</a>
        </div>
        <div class="contact-col">
          <h2 class="foot-h">Bases</h2>
          <p>Alexandroupoleos 20, 11527 Athens</p>
          <p>Tsoukalades, 31100 Lefkas Island</p>
        </div>
      </div>
    </div>

    <nav class="foot-nav" aria-label="Footer">
      <div class="foot-col">
        <h2 class="foot-h">Charter</h2>
        <a href="${r}fleet.html">Our fleet</a>
        <a href="${r}destinations.html">Destinations</a>
        <a href="${r}destinations/ionian-sailing.html">Sailing the Ionian</a>
        <a href="${r}destinations/aegean-sailing.html">Sailing the Aegean</a>
        <a href="${r}services.html">Guest services</a>
      </div>
      <div class="foot-col">
        <h2 class="foot-h">Company</h2>
        <a href="${r}about.html">About AIyachts</a>
        <a href="${r}experiences.html">Gallery of experiences</a>
        <a href="${r}brokerage.html">Brokerage &amp; management</a>
        <a href="${r}contact.html">Contact &amp; enquiries</a>
      </div>
      <div class="foot-col">
        <h2 class="foot-h">Popular yachts</h2>
        ${['lagoon-40','lagoon-450-f','bavaria-51-1','jeanneau-sun-odyssey-469','beneteau-oceanis-50-family']
          .map(s => { const y = FLEET.find(f=>f.slug===s); return `<a href="${r}fleet/${s}.html">${esc(y.name)}</a>`; }).join('\n        ')}
      </div>
    </nav>

    <div class="foot-bottom">
      <span>© ${new Date().getFullYear()} ${SITE.name}. All rights reserved.</span>
      <span class="foot-bottom-links"><a href="${r}privacy.html">Privacy Policy</a></span>
    </div>
  </div>
</footer>

<button class="totop" id="toTop" aria-label="Back to top"><span aria-hidden="true">↑</span></button>`;
}

/* ---------------------------------------------------------- FLEET CARDS */
export function fleetCards(list, depth, {scroller=false} = {}){
  const r = up(depth);
  return list.map(y => `<article class="yacht-card">
      <a class="yacht-link" href="${r}fleet/${y.slug}.html">
        <div class="yacht-art">
          <img src="${r}assets/fleet/${y.slug}.jpg" alt="${esc(y.name)} — ${esc(y.cat.toLowerCase())} sailing yacht for charter in Greece" width="640" height="380" loading="lazy" decoding="async">
          <span class="yacht-flag">${esc(y.type)}</span>
        </div>
        <div class="yacht-body">
          <p class="yacht-cat">${esc(y.cat)} · ${y.year}</p>
          <h3 class="display">${esc(y.name)}</h3>
          <div class="yacht-specs"><span>${y.guests} guests</span><span>${y.berths} berths</span><span>${y.heads} ${y.heads>1?'heads':'head'}</span></div>
          <span class="yacht-more">View yacht <span class="arrow" aria-hidden="true">→</span></span>
        </div>
      </a>
    </article>`).join('\n    ');
}

/* ---------------------------------------------------------- GALLERY */
export function galleryTiles(items, depth, {spans=null} = {}){
  const r = up(depth);
  return items.map((g, i) => {
    const base = g.type === 'video' ? `${g.slug}-poster` : g.slug;
    const n = String(i + 1).padStart(2,'0');
    const isVid = g.type === 'video';
    return `<figure class="xg-tile${isVid ? ' is-video' : ''}" style="--cs:${spans ? spans.cs : g.cs};--rs:${spans ? spans.rs : g.rs};--d:${(i*0.045).toFixed(3)}s;--lqip:url(${LQIP[g.slug]})" data-cat="${g.cat}" data-i="${i}" data-title="${esc(g.title)}" data-alt="${esc(g.alt)}" data-full="${r}assets/gallery/${base}-1600.jpg" data-full-webp="${r}assets/gallery/${base}-1600.webp"${isVid ? ` data-video="${r}assets/gallery/${g.slug}.mp4" data-poster="${r}assets/gallery/${base}-1600.jpg"` : ''}>
      <button class="xg-open" type="button" aria-label="Open: ${esc(g.title)}" data-open="${i}">
        <span class="xg-frame" aria-hidden="true"></span>
        <picture>
          <source type="image/webp" srcset="${r}assets/gallery/${base}-800.webp 800w, ${r}assets/gallery/${base}-1600.webp 1600w" sizes="(max-width:700px) 50vw, ${Math.round((spans ? spans.cs : g.cs)/6*100)}vw">
          <img src="${r}assets/gallery/${base}-800.jpg" alt="${esc(g.alt)}" width="${g.w}" height="${g.h}" loading="lazy" decoding="async">
        </picture>
        ${isVid ? `<span class="xg-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg></span>` : ''}
        <figcaption class="xg-cap">
          <span class="xg-num" aria-hidden="true">${n}</span>
          <span class="xg-title">${esc(g.title)}</span>
        </figcaption>
      </button>
    </figure>`;
  }).join('\n    ');
}

export function galleryFilters(){
  return `<div class="xg-filters" role="group" aria-label="Filter the gallery">
      ${GALLERY_FILTERS.map((f,i) => `<button type="button" class="xg-chip" data-filter="${f.id}" aria-pressed="${i===0}">${f.label}</button>`).join('\n      ')}
    </div>`;
}

export function lightbox(){
  return `<div class="xg-lightbox" id="xgLightbox" role="dialog" aria-modal="true" aria-label="Gallery viewer" hidden>
  <div class="xg-lb-backdrop" data-close></div>
  <div class="xg-lb-shell">
    <div class="xg-lb-bar">
      <span class="xg-lb-count" id="xgCount">01 / ${String(GALLERY.length).padStart(2,'0')}</span>
      <button class="xg-lb-close" type="button" data-close aria-label="Close viewer">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <div class="xg-lb-stage" id="xgStage"></div>
    <div class="xg-lb-foot">
      <button class="xg-lb-nav" type="button" data-prev aria-label="Previous"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
      <p class="xg-lb-cap" id="xgCap"></p>
      <button class="xg-lb-nav" type="button" data-next aria-label="Next"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>
    </div>
  </div>
</div>`;
}

/* ---------------------------------------------------------- JSON-LD */
const orgId = SITE.origin + '/#organization';
const siteId = SITE.origin + '/#website';

export function baseGraph(){
  return [
    {
      '@type': ['Organization','TravelAgency'],
      '@id': orgId,
      name: SITE.name,
      alternateName: 'AI Yachts',
      slogan: SITE.tagline,
      url: SITE.origin + '/',
      logo: { '@type':'ImageObject', url: abs('assets/logo.png'), width: 560, height: 442 },
      image: abs('assets/img/og-cover.jpg'),
      email: SITE.email,
      telephone: SITE.phones[0],
      description: 'AIyachts is a Greek yacht charter, brokerage and yacht-management company sailing the Ionian and Aegean seas from bases in Lefkas and Athens.',
      areaServed: [{'@type':'Country', name:'Greece'}],
      knowsLanguage: ['en','el'],
      address: SITE.bases.map(b => ({
        '@type':'PostalAddress', streetAddress: b.street, postalCode: b.postal,
        addressLocality: b.city, addressRegion: b.region, addressCountry: b.country
      })),
      contactPoint: SITE.phones.map(p => ({
        '@type':'ContactPoint', telephone: p, contactType:'reservations',
        email: SITE.email, availableLanguage:['English','Greek']
      })),
      department: SITE.bases.map(b => ({
        '@type':'LocalBusiness',
        '@id': `${SITE.origin}/#${b.city.toLowerCase()}-base`,
        name: `${SITE.name} — ${b.name}`,
        address: {'@type':'PostalAddress', streetAddress:b.street, postalCode:b.postal, addressLocality:b.city, addressRegion:b.region, addressCountry:b.country},
        geo: {'@type':'GeoCoordinates', latitude:b.lat, longitude:b.lon},
        telephone: SITE.phones[0], email: SITE.email, url: SITE.origin + '/destinations.html',
        priceRange: '€€€'
      }))
    },
    {
      '@type':'WebSite', '@id': siteId, url: SITE.origin + '/', name: SITE.name,
      inLanguage: 'en', publisher: {'@id': orgId}
    }
  ];
}

export function pageGraph(page){
  const url = abs(page.slug);
  const items = [{label:'Home', href:'index.html'}, ...(page.crumbs || [])];
  const nodes = [
    {
      '@type':'WebPage', '@id': url + '#webpage', url, name: page.title,
      description: page.description, isPartOf: {'@id': siteId},
      about: {'@id': orgId}, inLanguage: 'en',
      primaryImageOfPage: abs(page.ogImage || 'assets/img/og-cover.jpg'),
      breadcrumb: {'@id': url + '#breadcrumb'}
    },
    {
      '@type':'BreadcrumbList', '@id': url + '#breadcrumb',
      itemListElement: items.map((c,i) => ({
        '@type':'ListItem', position: i+1, name: c.label,
        item: abs(c.href === 'index.html' ? '' : c.href)
      }))
    }
  ];
  return nodes.concat(page.schema || []);
}

export function jsonLd(page){
  const graph = baseGraph().concat(pageGraph(page));
  const data = { '@context':'https://schema.org', '@graph': graph };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}
