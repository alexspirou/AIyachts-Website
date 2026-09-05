export const assetId = `image-${'a'.repeat(40)}-1600x900-jpg`;

export function yachtDocument(overrides = {}) {
  return {
    _id: 'yacht-sirius',
    _type: 'yacht',
    name: 'Sirius Seven',
    slug: 'sirius-seven',
    builder: 'Test Shipyard',
    year: 2024,
    type: 'Monohull',
    cabins: 7,
    guests: 14,
    berths: 15,
    heads: 4,
    tag: 'Space for the whole crew',
    blurb: 'A spacious yacht for a sailing holiday.',
    highlights: ['A sheltered cockpit', 'Seven comfortable cabins'],
    active: true,
    featured: true,
    sortOrder: 10,
    charterModes: ['Skippered'],
    bases: ['Volos'],
    specs: [{label: 'Length overall', value: '21.5 m'}],
    mainImage: {_type: 'image', asset: {_id: assetId}, alt: 'Sirius under sail'},
    gallery: [{
      _type: 'image',
      asset: {_id: `image-${'b'.repeat(40)}-1600x900-jpg`},
      alt: 'Sirius cockpit',
    }],
    ...overrides,
  };
}
