import assert from 'node:assert/strict';
import test from 'node:test';
import {FLEET_QUERY, SANITY, loadFleet, normalizeYachts} from '../sanity.mjs';
import {yachtDocument} from './fixtures.mjs';

test('normalizes published yacht content, ordering, image assets and arbitrary cabin counts', () => {
  const [first, second] = normalizeYachts([
    yachtDocument({slug: {current: 'sirius-seven'}, sortOrder: 20}),
    yachtDocument({_id: 'other-yacht', slug: 'blue-cat', name: 'Blue Cat', type: 'Catamaran', sortOrder: 5}),
  ]);
  assert.equal(first.slug, 'blue-cat');
  assert.equal(first.cat, 'Catamaran');
  assert.equal(second.cat, '7 Cabins');
  assert.equal(second.year, '2024');
  assert.equal(second.cabins, 7);
  assert.equal(second.featured, true);
  assert.deepEqual(second.charterModes, ['Skippered']);
  assert.deepEqual(second.bases, ['Volos']);
  assert.deepEqual(second.specs, [{label: 'Length overall', value: '21.5 m'}]);
  assert.equal(second.imageAlt, 'Sirius under sail');
  const image = new URL(second.imageUrl);
  assert.equal(image.origin, 'https://cdn.sanity.io');
  assert.ok(image.pathname.startsWith(`/images/${SANITY.projectId}/${SANITY.dataset}/`));
  assert.equal(image.searchParams.get('w'), '1280');
  assert.equal(image.searchParams.get('h'), '760');
  assert.equal(image.searchParams.get('auto'), 'format');
  assert.equal(second.gallery[0].alt, 'Sirius cockpit');
  assert.equal(new URL(second.gallery[0].url).searchParams.get('w'), '1600');
});

test('omits inactive yachts, drafts and release versions before validating their content', () => {
  const fleet = normalizeYachts([
    yachtDocument(),
    {_id: 'unpublished-boat', active: false},
    {_id: 'drafts.draft-boat'},
    {_id: 'versions.release-boat'},
    null,
  ]);
  assert.deepEqual(fleet.map(yacht => yacht.slug), ['sirius-seven']);
  assert.deepEqual(normalizeYachts([]), []);
});

test('rejects duplicate and unsafe page addresses', () => {
  assert.throws(() => normalizeYachts([yachtDocument(), yachtDocument({_id: 'duplicate'})]), /unique address/);
  for (const slug of ['../contact', '..\\contact', '/contact', 'nested/boat', 'UPPER', 'a'.repeat(97)]) {
    assert.throws(() => normalizeYachts([yachtDocument({slug})]), /page address/, slug);
  }
});

test('rejects incomplete content and invalid images instead of inventing yacht details', () => {
  for (const overrides of [
    {name: ''}, {cabins: 0}, {guests: 2.5}, {year: 1800},
    {type: 'Spaceship'}, {charterModes: ['Crewed']}, {bases: []},
    {mainImage: {alt: 'Missing asset'}},
    {mainImage: {asset: {_id: 'not-an-image'}, alt: 'Invalid asset'}},
    {gallery: 'not-an-array'}, {specs: [{label: 'Length'}]},
  ]) {
    assert.throws(() => normalizeYachts([yachtDocument(overrides)]), /Yacht /);
  }
  assert.throws(() => normalizeYachts({result: []}), /fleet list/);
});

test('loads the configured dataset with the published perspective', async () => {
  let requested = false;
  const fleet = await loadFleet({fetchImpl: async (endpoint, options) => {
    requested = true;
    const url = new URL(endpoint);
    assert.equal(url.hostname, `${SANITY.projectId}.api.sanity.io`);
    assert.equal(url.pathname, `/v${SANITY.apiVersion}/data/query/${SANITY.dataset}`);
    assert.equal(url.searchParams.get('perspective'), 'published');
    assert.equal(url.searchParams.get('query'), FLEET_QUERY);
    assert.ok(options.signal instanceof AbortSignal);
    return {ok: true, json: async () => ({result: [yachtDocument()]})};
  }});
  assert.equal(requested, true);
  assert.equal(fleet[0].name, 'Sirius Seven');
});

test('surfaces network, HTTP, query and malformed-result failures without a local fallback', async () => {
  await assert.rejects(loadFleet({fetchImpl: async () => { throw new Error('offline'); }}), /Could not read Sanity/);
  await assert.rejects(loadFleet({fetchImpl: async () => ({ok: false, status: 403})}), /HTTP 403/);
  await assert.rejects(loadFleet({fetchImpl: async () => ({ok: true, json: async () => ({error: {description: 'Bad query'}})})}), /rejected the fleet query/);
  await assert.rejects(loadFleet({fetchImpl: async () => ({ok: true, json: async () => ({result: null})})}), /fleet list/);
});
