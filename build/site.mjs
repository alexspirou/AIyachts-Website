import {loadFleet} from './sanity.mjs';

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

// Published, active yachts come from the Sanity fleet dataset.
// Await this before page definitions create yacht pages and metadata.
export const FLEET = await loadFleet();

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
