import fs from 'node:fs';
import {createImageUrlBuilder} from '@sanity/image-url';

export const SANITY = JSON.parse(fs.readFileSync(new URL('../sanity.config.json', import.meta.url), 'utf8'));
export const FLEET_QUERY = `*[_type == "yacht" && coalesce(active, true) == true]
  | order(sortOrder asc, name asc) {
    _id, name, "slug": slug.current, builder, year, type,
    cabins, guests, berths, heads, tag, blurb, highlights,
    active, featured, sortOrder, charterModes, bases, specs,
    mainImage { ..., asset->{_id} },
    gallery[] { ..., asset->{_id} }
  }`;

const imageBuilder = createImageUrlBuilder(SANITY);
const text = (value, field, yacht) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Yacht ${yacht}: add ${field} in Sanity and publish it.`);
  }
  return value.trim();
};
const integer = (value, field, yacht, min = 1, max = Number.MAX_SAFE_INTEGER) => {
  if (!Number.isSafeInteger(value) || value < min || value > max) {
    throw new Error(`Yacht ${yacht}: ${field} must be a whole number between ${min} and ${max}.`);
  }
  return value;
};
const strings = (value, field, yacht) => {
  if (!Array.isArray(value) || !value.length) throw new Error(`Yacht ${yacht}: add at least one ${field}.`);
  return value.map(item => text(item, field, yacht));
};
function photo(image, yacht, {hero = false} = {}) {
  const alt = text(image?.alt, 'image description', yacht);
  if (!image?.asset?._id && !image?.asset?._ref) throw new Error(`Yacht ${yacht}: upload a photo in Sanity.`);
  try {
    let url = imageBuilder.image(image).width(hero ? 1280 : 1600).auto('format').quality(85);
    if (hero) url = url.height(760).fit('crop');
    return {url: url.url(), alt};
  } catch {
    throw new Error(`Yacht ${yacht}: the image reference is invalid. Select the photo again in Sanity.`);
  }
}

// Validate at the build boundary too: API imports can bypass Studio validation.
export function normalizeYachts(documents) {
  if (!Array.isArray(documents)) throw new Error('Sanity did not return a fleet list.');
  const slugs = new Set();
  return documents.filter(document => document && document.active !== false &&
    !/^(drafts|versions)\./.test(document._id || '')).map(document => {
    const name = text(document.name, 'name', document._id || '(new yacht)');
    const slug = text(typeof document.slug === 'object' ? document.slug?.current : document.slug, 'page address', name);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 96) {
      throw new Error(`Yacht ${name}: generate a page address using lowercase letters, numbers and hyphens.`);
    }
    if (slugs.has(slug)) throw new Error(`More than one yacht has the page address "${slug}". Give each yacht a unique address.`);
    slugs.add(slug);
    if (!['Monohull', 'Catamaran'].includes(document.type)) throw new Error(`Yacht ${name}: choose Monohull or Catamaran.`);
    const main = photo(document.mainImage, name, {hero: true});
    const cabins = integer(document.cabins, 'cabins', name);
    const charterModes = strings(document.charterModes, 'charter option', name);
    if (charterModes.some(mode => !['Bareboat', 'Skippered'].includes(mode))) throw new Error(`Yacht ${name}: choose Bareboat or Skippered for charter options.`);
    if (document.gallery != null && !Array.isArray(document.gallery)) throw new Error(`Yacht ${name}: gallery must be an image list.`);
    if (document.specs != null && !Array.isArray(document.specs)) throw new Error(`Yacht ${name}: specifications must be a list.`);
    return {
      slug, name, type: document.type, cabins,
      builder: text(document.builder, 'builder', name),
      year: String(integer(document.year, 'build year', name, 1900, 2100)),
      cat: document.type === 'Catamaran' ? 'Catamaran' : `${cabins} ${cabins === 1 ? 'Cabin' : 'Cabins'}`,
      guests: integer(document.guests, 'guests', name),
      berths: integer(document.berths, 'berths', name),
      heads: integer(document.heads, 'heads', name),
      tag: text(document.tag, 'short tagline', name),
      blurb: text(document.blurb, 'description', name),
      highlights: strings(document.highlights, 'highlight', name),
      charterModes, bases: strings(document.bases, 'departure base', name),
      featured: document.featured === true,
      sortOrder: document.sortOrder == null ? 100 : integer(document.sortOrder, 'display order', name, 0),
      imageUrl: main.url, imageAlt: main.alt,
      gallery: (document.gallery || []).map(image => photo(image, name)),
      specs: (document.specs || []).map(spec => ({label: text(spec?.label, 'specification label', name), value: text(spec?.value, 'specification value', name)})),
    };
  }).sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}

export async function loadFleet({fetchImpl = globalThis.fetch} = {}) {
  if (!/^[a-z0-9]+$/.test(SANITY.projectId) || !/^[a-z0-9][a-z0-9_-]*$/.test(SANITY.dataset)) {
    throw new Error('Check the project ID and dataset in sanity.config.json.');
  }
  const endpoint = new URL(`https://${SANITY.projectId}.api.sanity.io/v${SANITY.apiVersion}/data/query/${SANITY.dataset}`);
  endpoint.searchParams.set('query', FLEET_QUERY);
  endpoint.searchParams.set('perspective', 'published');
  let response;
  try {
    response = await fetchImpl(endpoint, {signal: AbortSignal.timeout(15000)});
  } catch (error) {
    throw new Error(`Could not read Sanity (${SANITY.projectId}/${SANITY.dataset}). Check your connection and try the build again.`, {cause: error});
  }
  if (!response.ok) throw new Error(`Sanity returned HTTP ${response.status}. Check the project ID, dataset name and public visibility.`);
  const data = await response.json();
  if (data.error) throw new Error('Sanity rejected the fleet query. Check the yacht schema and query.');
  return normalizeYachts(data.result);
}
