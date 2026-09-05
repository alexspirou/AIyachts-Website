/* ============================================================
   AIyachts — site configuration & content data
   Change ORIGIN here and re-run `node build/build.mjs` to update
   every canonical URL, og:url and sitemap entry at once.
   ============================================================ */

export const SITE = {
  origin: 'https://ai-yachting.com',
  name: 'AIyachts',
  legalName: 'AIyachts',
  tagline: 'Set Sail for Unforgettable Memories',
  locale: 'en_GB',
  lang: 'en',
  themeLight: '#FFFFFF',
  themeDark: '#06232B',
  email: 'aiyachtsea@gmail.com',
  phones: ['+30 697 23 56 502', '+30 694 099 28 94', '+44 (0) 7471 137 874'],
  bases: [
    { name: 'Athens base', street: 'Alexandroupoleos 20', postal: '11527', city: 'Athens', region: 'Attica', country: 'GR', lat: 37.9838, lon: 23.7275 },
    { name: 'Lefkas base', street: 'Tsoukalades', postal: '31100', city: 'Lefkada', region: 'Lefkada', country: 'GR', lat: 38.7290, lon: 20.6390 }
  ],
  social: []
};

export const NAV = [
  { href: 'about.html',        label: 'About' },
  { href: 'destinations.html', label: 'Destinations' },
  { href: 'fleet.html',        label: 'Fleet' },
  { href: 'experiences.html',  label: 'Experiences' },
  { href: 'services.html',     label: 'Services' },
  { href: 'brokerage.html',    label: 'Brokerage' },
  { href: 'contact.html',      label: 'Contact' }
];

/* ---------------- FLEET ----------------
   specs[] are the figures supplied by AIyachts. No dimension,
   engine or price data is invented here — add it in this file
   and the fleet pages will pick it up automatically.          */
export const FLEET = [
  {
    slug: 'bavaria-33-cruiser', name: 'Bavaria 33 Cruiser', builder: 'Bavaria Yachts',
    year: '2007', cat: '2 Cabins', type: 'Monohull', cabins: 2, guests: 6, berths: 6, heads: 1,
    tag: 'Couples & small families',
    blurb: 'The most compact yacht in the fleet and the easiest to fall in love with. Two cabins, a cockpit that seats everyone comfortably, and a sail plan that one confident sailor can manage alone — ideal for a couple, or a family finding its sea legs in the sheltered Ionian.',
    highlights: ['Simple, forgiving sail plan', 'Slips into the smallest bays', 'Light on fuel and on the wallet']
  },
  {
    slug: 'bavaria-40-cruiser', name: 'Bavaria 40 Cruiser', builder: 'Bavaria Yachts',
    year: '2011', cat: '3 Cabins', type: 'Monohull', cabins: 3, guests: 7, berths: 7, heads: 2,
    tag: 'The all-rounder',
    blurb: 'Three cabins, two heads and a wide, stable hull — the yacht we recommend most often to groups of six or seven. Steady enough for a first bareboat week, lively enough to keep experienced sailors interested when the afternoon breeze fills in.',
    highlights: ['Three private cabins', 'Two heads for a full crew', 'Confidence-inspiring in a fresh breeze']
  },
  {
    slug: 'bavaria-39-cruiser', name: 'Bavaria 39 Cruiser', builder: 'Bavaria Yachts',
    year: '2007', cat: '3 Cabins', type: 'Monohull', cabins: 3, guests: 7, berths: 6, heads: 2,
    tag: 'Easy miles',
    blurb: 'A roomy deck-saloon feel below and an uncomplicated rig above. The 39 Cruiser is the yacht for crews who want to spend the day swimming and the evening in a taverna, with just enough sailing in between to feel like sailors.',
    highlights: ['Generous, shaded cockpit', 'Bright saloon and galley', 'Undemanding to handle short-handed']
  },
  {
    slug: 'jeanneau-sun-odyssey-36i', name: 'Jeanneau Sun Odyssey 36i', builder: 'Jeanneau',
    year: '2007', cat: '3 Cabins', type: 'Monohull', cabins: 3, guests: 6, berths: 6, heads: 1,
    tag: 'For the helmsman',
    blurb: 'The liveliest boat we keep. The Sun Odyssey 36i rewards a sailor who trims — light on the helm, quick to accelerate, and happiest on a reach between the islands. Three cabins keep it practical for six.',
    highlights: ['Responsive, well-balanced helm', 'Slippery in light Ionian mornings', 'Compact enough for tight quays']
  },
  {
    slug: 'elan-impression-384', name: 'Elan Impression 384', builder: 'Elan Yachts',
    year: '2009', cat: '3 Cabins', type: 'Monohull', cabins: 3, guests: 6, berths: 6, heads: 2,
    tag: 'Performance cruiser',
    blurb: 'Slovenian-built and noticeably better finished than most charter yachts of its era. The Impression 384 combines a performance-oriented hull with a genuine cruising interior — three cabins, two heads, and a cockpit built for long lunches.',
    highlights: ['Two heads across three cabins', 'Sails well off the wind', 'Solid, well-detailed build']
  },
  {
    slug: 'elan-impression-344', name: 'Elan Impression 344', builder: 'Elan Yachts',
    year: '2006', cat: '3 Cabins', type: 'Monohull', cabins: 3, guests: 6, berths: 6, heads: 1,
    tag: 'Nimble & shallow',
    blurb: 'Small, agile and easy to place — the 344 gets into the coves that bigger yachts have to admire from the entrance. A good choice for six who value anchorages over cabin space.',
    highlights: ['Manoeuvres beautifully under power', 'Reaches shallow, quiet bays', 'Simple systems, few surprises']
  },
  {
    slug: 'bavaria-42-cruiser', name: 'Bavaria 42 Cruiser', builder: 'Bavaria Yachts',
    year: '2000', cat: '4 Cabins', type: 'Monohull', cabins: 4, guests: 8, berths: 8, heads: 2,
    tag: 'Four cabins, honest value',
    blurb: 'A proven hull from a generation of Bavarias that simply keep going. Four cabins for eight guests at a price that leaves room in the budget for the tavernas — maintained by us to a standard that matters more than the model year.',
    highlights: ['Four separate cabins', 'Hard-wearing, well-sorted systems', 'The value choice for eight']
  },
  {
    slug: 'bavaria-46-cruiser', name: 'Bavaria 46 Cruiser', builder: 'Bavaria Yachts',
    year: '2010', cat: '4 Cabins', type: 'Monohull', cabins: 4, guests: 10, berths: 10, heads: 2,
    tag: 'Volume for ten',
    blurb: 'Enormous interior volume for its length, and a cockpit that comfortably seats ten around the table. The 46 is our answer for two families sailing together who refuse to compromise on personal space.',
    highlights: ['Ten berths in four cabins', 'Huge cockpit and bathing platform', 'Steady in the afternoon breeze']
  },
  {
    slug: 'jeanneau-sun-odyssey-469', name: 'Jeanneau Sun Odyssey 469', builder: 'Jeanneau',
    year: '2014', cat: '4 Cabins', type: 'Monohull', cabins: 4, guests: 9, berths: 9, heads: 4,
    tag: 'Four en-suites',
    blurb: 'Twin wheels, a walk-through transom and a head for every cabin. The 469 is the yacht for four couples who want a genuine sailing boat without asking anyone to queue for the shower.',
    highlights: ['Four cabins, four heads', 'Twin helms and open transom', 'Modern deck layout, easy sail handling']
  },
  {
    slug: 'beneteau-oceanis-50-family', name: 'Beneteau Oceanis 50 Family', builder: 'Beneteau',
    year: '2010', cat: '5 Cabins', type: 'Monohull', cabins: 5, guests: 12, berths: 12, heads: 3,
    tag: 'Big groups',
    blurb: 'Purpose-built for large crews: five cabins plus a skipper cabin, three heads, and deck space that keeps twelve people from ever feeling crowded. The obvious choice for a milestone birthday or a company week afloat.',
    highlights: ['5 + 1 cabins for twelve guests', 'Three heads and generous stowage', 'Wide side decks and a vast cockpit']
  },
  {
    slug: 'jeanneau-53', name: 'Jeanneau 53', builder: 'Jeanneau',
    year: '2011', cat: '5 Cabins', type: 'Monohull', cabins: 5, guests: 10, berths: 9, heads: 4,
    tag: 'Flagship monohull',
    blurb: 'Our largest monohull, and the one that turns heads on the quay. Five cabins, four heads and a saloon with real headroom — a yacht that feels closer to a small crewed vessel than a bareboat charter.',
    highlights: ['Five cabins, four heads', 'Saloon and galley on a grand scale', 'Ideal with one of our skippers aboard']
  },
  {
    slug: 'bavaria-51-1', name: 'Bavaria 51.1', builder: 'Bavaria Yachts',
    year: '2018', cat: '5 Cabins', type: 'Monohull', cabins: 5, guests: 12, berths: 12, heads: 3,
    tag: 'Newest monohull',
    blurb: 'The most recent monohull in the fleet, with a modern hull shape that carries its beam aft — more space below, more stability on deck. Five cabins and twelve berths, in a yacht that still feels contemporary underway.',
    highlights: ['Contemporary 2018 interior', 'Twelve berths in five cabins', 'Powerful, well-mannered under sail']
  },
  {
    slug: 'lagoon-40', name: 'Lagoon 40', builder: 'Lagoon Catamarans',
    year: '2022', cat: 'Catamaran', type: 'Catamaran', cabins: 4, guests: 10, berths: 10, heads: 4,
    tag: 'Newest yacht in the fleet',
    blurb: 'A 2022 catamaran, and the boat guests ask for by name. No heeling, a flat trampoline for the afternoons, a cockpit and saloon on one level, and a head for every cabin. Sailing made effortless for people who came for the swimming.',
    highlights: ['Level sailing — no heel', 'Four cabins, four heads', 'Shallow draft for close-in anchoring']
  },
  {
    slug: 'lagoon-450-f', name: 'Lagoon 450 F', builder: 'Lagoon Catamarans',
    year: '2019', cat: 'Catamaran', type: 'Catamaran', cabins: 4, guests: 12, berths: 12, heads: 4,
    tag: 'Flybridge catamaran',
    blurb: 'The flybridge changes everything: you steer from above the cockpit, with the whole anchorage laid out in front of you. Four en-suite cabins, twelve berths and an aft deck made for long dinners at anchor.',
    highlights: ['Flybridge helm and sunbed', 'Four en-suite cabins', 'The most space per guest in the fleet']
  }
];

/* ---------------- GALLERY OF EXPERIENCES ----------------
   cat  — filter group
   cs / rs — desktop column & row span in the 6-column mosaic  */
export const GALLERY = [
  { slug:'olive-framed-cove', type:'photo', cat:'coves', cs:4, rs:3, w:1600, h:900,
    title:'Anchored in an olive-framed cove',
    alt:'Sailing yacht at anchor in a turquoise Ionian cove framed by olive trees, on an AIyachts bareboat charter in Greece' },
  { slug:'pastel-dawn-anchorage', type:'photo', cat:'golden', cs:2, rs:3, w:1528, h:1528,
    title:'Pastel dawn',
    alt:'Pastel pink and blue dawn over yachts anchored in a calm Ionian bay' },
  { slug:'dawn-tender-run', type:'photo', cat:'golden', cs:2, rs:4, w:1205, h:1600,
    title:'First light, tender running',
    alt:'Catamaran at anchor on a mirror-calm sea at sunrise with a tender crossing the bay, Ionian Sea, Greece' },
  { slug:'skipper-at-the-helm', type:'photo', cat:'onboard', cs:4, rs:4, w:1600, h:1200,
    title:'The helm, mid-morning',
    alt:'Skipper at the wheel of a charter yacht under the bimini on a bright morning in Greece' },
  { slug:'pebble-beach-cove', type:'photo', cat:'coves', cs:3, rs:2, w:1600, h:900,
    title:'A pebble beach to yourselves',
    alt:'Empty white pebble beach and pine-covered headland beside a clear Ionian bay reached by sailing yacht' },
  { slug:'emerald-bay-anchorage', type:'photo', cat:'coves', cs:3, rs:2, w:1600, h:900,
    title:'Emerald bay, no neighbours',
    alt:'Yacht anchored alone in an emerald green bay framed by trees on a Greek sailing holiday' },
  { slug:'sea-cave-from-the-bow', type:'photo', cat:'coves', cs:3, rs:3, w:1600, h:1200,
    title:'Into the sea cave',
    alt:'View from the bow of a charter yacht towards a limestone sea cave over bright turquoise water in the Ionian' },
  { slug:'harbour-blue-hour', type:'photo', cat:'islands', cs:3, rs:3, w:1600, h:1200,
    title:'Blue hour on the quay',
    alt:'Greek island harbour at blue hour with lit tavernas along the quay and moored boats' },
  { slug:'first-mate', type:'photo', cat:'onboard', cs:2, rs:4, w:675, h:900,
    title:'First mate',
    alt:'An English setter sitting in the cockpit of a charter yacht on a sunny day in Greece' },
  { slug:'crew-of-two', type:'photo', cat:'onboard', cs:4, rs:4, w:900, h:675,
    title:'Crew of two',
    alt:'Crew member in a yellow oilskin jacket with a dog on the deck of a sailing yacht' },
  { slug:'meganisi-anchorage', type:'photo', cat:'coves', cs:2, rs:3, w:900, h:900,
    title:'Meganisi anchorage',
    alt:'Yachts anchored off a pine-covered headland and pebble beach in the Ionian Sea, Greece' },
  { slug:'village-harbour', type:'photo', cat:'islands', cs:2, rs:3, w:900, h:900,
    title:'Village harbour',
    alt:'Colourful Greek island village above a small harbour full of moored sailing yachts' },
  { slug:'from-the-masthead', type:'photo', cat:'coves', cs:2, rs:3, w:953, h:1000,
    title:'From the masthead',
    alt:'Looking down from the masthead onto a sailing yacht moored bow-to a rocky quay over turquoise water' },
  { slug:'under-sail-with-guests', type:'photo', cat:'sailing', cs:2, rs:4, w:1200, h:1600,
    title:'Underway with guests on deck',
    alt:'Charter sailing yacht underway with guests relaxing on the side deck, mountains of the Ionian behind' },
  { slug:'sea-cave-swim-stop', type:'photo', cat:'onboard', cs:4, rs:4, w:1600, h:1200,
    title:'Everyone in the cave',
    alt:'Group of AIyachts charter guests together in a boat inside a blue-lit Ionian sea cave' },
  { slug:'hillside-harbour-view', type:'photo', cat:'islands', cs:3, rs:2, w:1600, h:900,
    title:'The harbour from above',
    alt:'View down from a hillside over a small Greek island harbour with yachts and fishing boats at anchor' },
  { slug:'aerial-turquoise-anchorage', type:'video', cat:'films', cs:3, rs:2, w:568, h:320, duration:'PT12S',
    title:'Aerial — turquoise anchorage',
    alt:'Aerial film over yachts anchored in clear turquoise water in the Ionian Sea' },
  { slug:'aerial-over-the-fleet', type:'video', cat:'films', cs:4, rs:3, w:568, h:320, duration:'PT57S',
    title:'Aerial — over the anchorage',
    alt:'Drone film flying over a busy turquoise anchorage and approaching a charter yacht with guests aboard' },
  { slug:'turquoise-from-the-bow', type:'photo', cat:'onboard', cs:2, rs:3, w:1600, h:1200,
    title:'Off the bow, before the swim',
    alt:'Looking forward over the bow of a yacht into a shallow turquoise bay before a swim stop' },
  { slug:'golden-hour-catamaran', type:'video', cat:'films', cs:2, rs:4, w:478, h:850, duration:'PT46S',
    title:'Golden hour at anchor',
    alt:'Vertical film of a catamaran at anchor on glassy water during golden hour in the Ionian Sea' },
  { slug:'island-village-waterfront', type:'photo', cat:'islands', cs:4, rs:4, w:1600, h:1200,
    title:'The village, from the water',
    alt:'Greek island village of white and terracotta houses on a green hillside seen from a sailing yacht' },
  { slug:'concierge-served', type:'photo', cat:'onboard', cs:2, rs:3, w:843, h:900,
    title:'Concierge, served',
    alt:'A guest holding an Aperol spritz on the deck of a charter yacht in a green Ionian bay' },
  { slug:'charting-the-course', type:'photo', cat:'onboard', cs:2, rs:3, w:957, h:1000,
    title:'Charting the course',
    alt:'Paper chart of the Greek islands with dividers and parallel rule on a yacht saloon table' },
  { slug:'slow-afternoons', type:'photo', cat:'onboard', cs:2, rs:3, w:675, h:900,
    title:'Slow afternoons',
    alt:'Guest relaxing in a hammock on the foredeck of a sailing yacht at anchor in Greece' },
  { slug:'dusk-under-the-boom', type:'photo', cat:'golden', cs:2, rs:4, w:1205, h:1600,
    title:'Dusk, under the boom',
    alt:'View under the boom of a yacht towards a catamaran silhouetted on a mirror-calm sea at dusk' },
  { slug:'sunset-at-anchor', type:'photo', cat:'golden', cs:4, rs:4, w:1600, h:1200,
    title:'Sunset at anchor',
    alt:'Sailing yacht silhouetted at anchor on a hazy golden sea at sunset in the Ionian Islands' }
];

/* six frames for the home-page teaser, all shown at the same size */
export const GALLERY_TEASER = ['olive-framed-cove','sea-cave-from-the-bow','pastel-dawn-anchorage','skipper-at-the-helm','harbour-blue-hour','sea-cave-swim-stop'];

export const GALLERY_FILTERS = [
  { id:'all',      label:'All' },
  { id:'coves',    label:'Hidden coves' },
  { id:'golden',   label:'Golden hour' },
  { id:'islands',  label:'Island life' },
  { id:'onboard',  label:'On board' },
  { id:'sailing',  label:'Under sail' },
  { id:'films',    label:'Films' }
];
