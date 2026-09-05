import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import test from 'node:test';
import {yachtDocument} from './fixtures.mjs';

const projectRoot = fileURLToPath(new URL('../../', import.meta.url));
const tempRoot = path.resolve(os.tmpdir());
const tempPrefix = 'aiyachts-sanity-tests-';
const driver = `
  import fs from 'node:fs';
  const fixture = JSON.parse(fs.readFileSync(0, 'utf8'));
  globalThis.fetch = async () => {
    if (fixture.fail) throw new Error('Simulated Sanity outage');
    return {ok: true, json: async () => ({result: fixture.documents})};
  };
  await import('./build/build.mjs');
`;
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function temporaryOutput(t) {
  const directory = fs.mkdtempSync(path.join(tempRoot, tempPrefix));
  t.after(() => {
    const resolved = path.resolve(directory);
    assert.equal(path.dirname(resolved), tempRoot, 'Only remove a direct child of the intended temporary directory');
    assert.ok(path.basename(resolved).startsWith(tempPrefix), 'Only remove this test suite\'s temporary directories');
    fs.rmSync(resolved, {recursive: true, force: true});
  });
  return directory;
}

function build(output, documents, {fail = false} = {}) {
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', driver], {
    cwd: projectRoot,
    env: {...process.env, SITE_OUTPUT_DIR: output},
    input: JSON.stringify({documents, fail}),
    encoding: 'utf8',
    timeout: 120000,
    maxBuffer: 1024 * 1024,
    windowsHide: true,
  });
  if (result.error) throw result.error;
  return result;
}

function successfulBuild(output, documents) {
  const result = build(output, documents);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
}

function checkGeneratedPages(output) {
  const htmlFiles = fs.readdirSync(output, {recursive: true})
    .filter(file => file.endsWith('.html'));
  assert.ok(htmlFiles.length >= 12, 'The complete site should be generated');
  for (const file of htmlFiles) {
    const html = fs.readFileSync(path.join(output, file), 'utf8');
    assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length, 1, `${file} should have one main heading`);
    const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    assert.equal(scripts.length, 1, `${file} should have structured data`);
    assert.doesNotThrow(() => JSON.parse(scripts[0][1]), `${file} must contain valid JSON-LD`);
    for (const image of html.matchAll(/<img\b[^>]*>/g)) {
      assert.match(image[0], /\balt="[^"]*"/, `${file}: ${image[0]}`);
    }
    const references = [...html.matchAll(/\b(?:href|src)="([^"]*)"/g)].map(match => match[1]);
    for (const set of html.matchAll(/\bsrcset="([^"]*)"/g)) {
      references.push(...set[1].split(',').map(candidate => candidate.trim().split(/\s+/)[0]));
    }
    for (const reference of references) {
      if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference)) continue;
      const pathname = reference.split(/[?#]/)[0];
      if (!pathname) continue;
      const target = pathname.startsWith('/')
        ? path.join(output, decodeURIComponent(pathname))
        : path.resolve(output, path.dirname(file), decodeURIComponent(pathname));
      assert.ok(fs.existsSync(target), `${file} references missing local file ${reference}`);
    }
  }
}

test('builds new Sanity yachts throughout the site and safely renders their content', t => {
  const output = temporaryOutput(t);
  const name = 'Sirius </script><script>alert("name")</script> & "Seven"';
  const blurb = 'A cabin tour </script><script>alert("blurb")</script> & more.';
  const imageAlt = 'Bow "view" <img src=x onerror=alert(1)> & sea';
  const primary = yachtDocument({
    name, blurb,
    mainImage: {...yachtDocument().mainImage, alt: imageAlt},
    specs: [{label: 'Length & beam', value: '21.5 m / 5.9 m'}],
    bases: ['Volos & Skiathos'],
  });
  const companion = yachtDocument({
    _id: 'yacht-blue-cat', slug: 'blue-cat', name: 'Blue Cat',
    type: 'Catamaran', cabins: 3, featured: false, sortOrder: 20,
  });
  successfulBuild(output, [
    primary, companion,
    {_id: 'hidden-yacht', active: false, name: 'Hidden Yacht'},
    {_id: 'drafts.unpublished-yacht', name: 'Draft Yacht'},
    {_id: 'versions.release-yacht', name: 'Release Yacht'},
  ]);
  const read = file => fs.readFileSync(path.join(output, file), 'utf8');
  const fleet = read('fleet.html');
  const home = read('index.html');
  const yacht = read('fleet/sirius-seven.html');
  const contact = read('contact.html');
  const sitemap = read('sitemap.xml');

  assert.match(fleet, /2 yachts available for charter/);
  assert.match(fleet, /data-filter="cabin-7"/);
  assert.match(fleet, /data-cat="cabin-7"/);
  assert.match(fleet, /7 cabins · Monohulls/);
  assert.match(fleet, /data-filter="catamaran"/);
  assert.match(home, /View all 2 yachts/);
  assert.ok(home.includes('href="fleet/sirius-seven.html"'));
  assert.ok(!home.includes('href="fleet/blue-cat.html"'), 'Only the featured yacht appears on the home page and footer');
  assert.ok(contact.includes(`<option>${escape(name)}</option>`));
  assert.ok(yacht.includes(`<h1 class="display">${escape(name)}</h1>`));
  assert.ok(yacht.includes(`alt="${escape(imageAlt)}"`));
  assert.ok(yacht.includes(escape(blurb)));
  assert.ok(yacht.includes('<th scope="row">Charter</th><td>Skippered</td>'));
  assert.ok(yacht.includes('<th scope="row">Bases</th><td>Volos &amp; Skiathos</td>'));
  assert.ok(yacht.includes('<th scope="row">Length &amp; beam</th><td>21.5 m / 5.9 m</td>'));
  assert.match(yacht, /alt="Sirius cockpit"/);
  assert.match(yacht, /href="\.\.\/fleet\/blue-cat\.html"/);

  const scriptMatch = yacht.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(scriptMatch);
  const product = JSON.parse(scriptMatch[1])['@graph'].find(node => node['@type'] === 'Product');
  assert.equal(product.name, name);
  assert.equal(product.description, blurb);
  assert.equal(product.image.length, 2);
  assert.ok(product.image.every(url => url.startsWith('https://cdn.sanity.io/images/')));
  assert.ok(product.additionalProperty.some(property => property.name === 'Length & beam' && property.value === '21.5 m / 5.9 m'));
  assert.match(yacht, /<meta property="og:image" content="https:\/\/cdn\.sanity\.io\/images\//);
  assert.match(sitemap, /<image:loc>https:\/\/cdn\.sanity\.io\/images\//);
  assert.ok(sitemap.includes('&amp;'), 'Image URL query separators are XML escaped');
  for (const html of [fleet, home, yacht, contact, read('404.html')]) {
    assert.ok(!html.includes('<script>alert('), 'CMS text must not create script elements');
    assert.ok(!html.includes('<img src=x onerror='), 'CMS text must not create image elements');
    assert.doesNotMatch(html, /href="[^"\s]*fleet\/(?:lagoon-40|lagoon-450-f|bavaria-51-1)\.html"/);
    assert.doesNotMatch(html, /Hidden Yacht|Draft Yacht|Release Yacht/);
    assert.doesNotMatch(html, /https?:\/\/[^"\s]*\/https:\/\/cdn\.sanity\.io/);
  }
  assert.ok(fs.existsSync(path.join(output, 'fleet/blue-cat.html')));
  checkGeneratedPages(output);
});

test('empty publication removes stale yacht pages and links on rebuild', t => {
  const output = temporaryOutput(t);
  successfulBuild(output, [yachtDocument()]);
  assert.ok(fs.existsSync(path.join(output, 'fleet/sirius-seven.html')));
  successfulBuild(output, []);
  assert.ok(!fs.existsSync(path.join(output, 'fleet/sirius-seven.html')));
  for (const file of ['fleet.html', 'index.html', 'contact.html', '404.html']) {
    const html = fs.readFileSync(path.join(output, file), 'utf8');
    assert.ok(!html.includes('fleet/sirius-seven.html'), file);
    assert.ok(!html.includes('View all 14 yachts'), file);
  }
  const fleet = fs.readFileSync(path.join(output, 'fleet.html'), 'utf8');
  assert.ok(fleet.includes('Our fleet is being updated. Please contact us for current availability.'));
  assert.doesNotMatch(fleet, /<article class="yacht-card"/);
  const sitemap = fs.readFileSync(path.join(output, 'sitemap.xml'), 'utf8');
  assert.ok(!sitemap.includes('fleet/sirius-seven.html'));
  checkGeneratedPages(output);
});

test('a Sanity outage fails the build and preserves the previously generated site', t => {
  const output = temporaryOutput(t);
  successfulBuild(output, [yachtDocument()]);
  const files = ['fleet.html', 'fleet/sirius-seven.html', 'sitemap.xml'];
  const previous = files.map(file => fs.readFileSync(path.join(output, file), 'utf8'));
  const failed = build(output, [], {fail: true});
  assert.notEqual(failed.status, 0);
  assert.match(failed.stderr, /Could not read Sanity/);
  files.forEach((file, index) => assert.equal(fs.readFileSync(path.join(output, file), 'utf8'), previous[index], file));
});
