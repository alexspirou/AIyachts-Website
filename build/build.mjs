/* ============================================================
   AIyachts static site builder
   Usage:  node build/build.mjs        (run from the project root)
   ============================================================ */
import fs from 'node:fs';
import path from 'node:path';
import { SITE } from './site.mjs';
import { ALL_PAGES } from './pages.mjs';
import { head, header, footer, crumbs, pageHero, jsonLd, up } from './components.mjs';

const ROOT = process.cwd();
const write = (file, content) => {
  const full = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  return content.length;
};

function render(page){
  const r = up(page.depth);
  const scripts = [`${r}assets/js/site.js`].concat(page.scripts || []);
  return `<!doctype html>
<html lang="${SITE.lang}">
<head>
${head(page)}
${jsonLd(page)}
</head>
<body${page.bodyClass ? ` class="${page.bodyClass}"` : ''}>
${page.preBody || ''}
${header(page)}
<main id="main">
${crumbs(page)}
${pageHero(page)}
${page.body(r)}
</main>
${footer(page)}
${scripts.map(s => `<script src="${s}" defer></script>`).join('\n')}
</body>
</html>
`;
}

/* ------------------------------------------------------- pages */
let total = 0;
for(const page of ALL_PAGES){
  const bytes = write(page.file, render(page));
  total += bytes;
  console.log(String(Math.round(bytes/1024)).padStart(5) + ' KB  ' + page.file);
}

/* ------------------------------------------------------- sitemap */
const today = new Date().toISOString().slice(0,10);
const priority = (p) => p.slug === 'index.html' ? '1.0'
  : ['fleet.html','destinations.html','experiences.html','contact.html'].includes(p.slug) ? '0.9'
  : p.slug.startsWith('destinations/') ? '0.8'
  : p.slug.startsWith('fleet/') ? '0.7'
  : p.slug === 'privacy.html' ? '0.2' : '0.6';

const urls = ALL_PAGES.filter(p => !p.noindex).map(p => {
  const loc = SITE.origin + '/' + (p.slug === 'index.html' ? '' : p.slug);
  const imgs = [p.ogImage || 'assets/img/og-cover.jpg'];
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.slug === 'index.html' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${priority(p)}</priority>
${imgs.map(i => `    <image:image><image:loc>${SITE.origin}/${i}</image:loc></image:image>`).join('\n')}
  </url>`;
}).join('\n');

write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`);

/* ------------------------------------------------------- robots */
write('robots.txt', `# ${SITE.name}
User-agent: *
Allow: /
Disallow: /404.html

Sitemap: ${SITE.origin}/sitemap.xml
`);

/* ------------------------------------------------------- manifest */
write('site.webmanifest', JSON.stringify({
  name: SITE.name + ' — ' + SITE.tagline,
  short_name: SITE.name,
  description: 'Yacht charter, brokerage and yacht management in Greece.',
  start_url: '/',
  display: 'standalone',
  background_color: SITE.themeLight,
  theme_color: SITE.themeDark,
  icons: [
    { src: '/assets/favicon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/assets/favicon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/assets/favicon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
  ]
}, null, 2) + '\n');

console.log(`\n${ALL_PAGES.length} pages · ${Math.round(total/1024)} KB of HTML · sitemap, robots.txt and manifest written.`);
