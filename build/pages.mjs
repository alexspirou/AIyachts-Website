import { SITE, FLEET, GALLERY, GALLERY_TEASER } from './site.mjs';
import { fleetCards, featuredFleet, emptyFleetMessage, galleryTiles, galleryFilters, lightbox, abs, esc } from './components.mjs';

const fleetCount = `${FLEET.length} yacht${FLEET.length === 1 ? '' : 's'}`;
const fleetDescription = FLEET.length
  ? `${fleetCount} available for charter in Greece. Explore the fleet and find the yacht that suits your crew.`
  : emptyFleetMessage;
const charterModes = [...new Set(FLEET.flatMap(y => y.charterModes))];
const fleetCharters = charterModes.length ? `${charterModes.join(' & ')} Charters` : 'Yacht Charters';

const enquire = (subject) =>
  `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`;

/* =======================================================================
   SHARED BLOCKS
   ======================================================================= */
const greeceMap = (r) => `<div class="greece-map-wrap reveal" id="greeceMap" data-active="ionian">
        <div class="sea-switch" role="group" aria-label="Choose a sea to highlight on the map">
          <span class="sea-switch-thumb" aria-hidden="true"></span>
          <button type="button" class="sea-switch-opt" data-sea="ionian" aria-pressed="true">Ionian</button>
          <button type="button" class="sea-switch-opt" data-sea="aegean" aria-pressed="false">Aegean</button>
        </div>
        <svg class="greece-map" viewBox="0 0 990 980" role="img" aria-label="Map of Greece showing the Ionian and Aegean sailing regions served by AIyachts">
          <defs>
            <radialGradient id="ionianGrad" cx="18%" cy="42%" r="62%">
              <stop offset="0%" stop-color="var(--teal-2)" stop-opacity=".55"/>
              <stop offset="100%" stop-color="var(--teal-2)" stop-opacity="0"/>
            </radialGradient>
            <radialGradient id="aegeanGrad" cx="78%" cy="62%" r="68%">
              <stop offset="0%" stop-color="var(--brass)" stop-opacity=".45"/>
              <stop offset="100%" stop-color="var(--brass)" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <rect class="sea-zone ionian" data-sea="ionian" x="0" y="0" width="430" height="980" fill="url(#ionianGrad)" tabindex="0" role="button" aria-label="Highlight the Ionian Sea"/>
          <rect class="sea-zone aegean" data-sea="aegean" x="430" y="0" width="560" height="980" fill="url(#aegeanGrad)" tabindex="0" role="button" aria-label="Highlight the Aegean Sea"/>
          <image class="landmass-img" href="${r}assets/greece-map.webp" x="0" y="0" width="990" height="980" preserveAspectRatio="xMidYMid meet" pointer-events="none"/>
          <image class="island-overlay ionian" href="${r}assets/greece-map-ionian.webp" x="0" y="0" width="990" height="980" preserveAspectRatio="xMidYMid meet" pointer-events="none"/>
          <image class="island-overlay aegean" href="${r}assets/greece-map-aegean.webp" x="0" y="0" width="990" height="980" preserveAspectRatio="xMidYMid meet" pointer-events="none"/>
          <g class="sea-label ionian-label" aria-hidden="true"><text x="55" y="46">IONIAN</text></g>
          <g class="sea-label aegean-label" aria-hidden="true"><text x="55" y="46">AEGEAN</text></g>
        </svg>

        <a class="sea-card ionian" data-sea="ionian" href="${r}destinations/ionian-sailing.html">
          <p class="eyebrow">Destination · Ionian Sea</p>
          <h3 class="display">Lefkas Base</h3>
          <p>Calm waters, gentle afternoon winds and short, easy distances — ideal for first-time sailors and families. Emerald bays, sheltered anchorages and the quiet charm of Meganisi, Kalamos and Paxos.</p>
          <span class="sea-card-cta">Sail the Ionian <span class="arrow" aria-hidden="true">→</span></span>
        </a>

        <a class="sea-card aegean" data-sea="aegean" href="${r}destinations/aegean-sailing.html">
          <p class="eyebrow">Destination · Aegean Sea</p>
          <h3 class="display">Athens Base</h3>
          <p>Bright white villages, dramatic coastlines and stronger winds for confident sailors. From the Saronic Gulf to the iconic Cyclades — a route through Greece's most recognisable imagery.</p>
          <span class="sea-card-cta">Sail the Aegean <span class="arrow" aria-hidden="true">→</span></span>
        </a>
      </div>`;

const bookingBar = (r) => `<div class="wrap" id="booking">
    <form class="booking" id="bookingForm" action="${r}contact.html" method="get" aria-label="Charter enquiry">
      <div class="b-field">
        <label for="destination">Destination</label>
        <select id="destination" name="destination">
          <option>Either sea</option>
          <option>Ionian — Lefkas base</option>
          <option>Aegean — Athens base</option>
        </select>
      </div>
      <div class="b-field">
        <label for="dateStart">Dates</label>
        <div class="b-dates">
          <input type="date" id="dateStart" name="start" aria-label="Start date">
          <input type="date" id="dateEnd" name="end" aria-label="End date">
        </div>
      </div>
      <div class="b-field">
        <label for="guestCount">Guests</label>
        <div class="b-guests">
          <div class="stepper">
            <button type="button" id="guestMinus" aria-label="Decrease guests">−</button>
            <output id="guestCount" name="guests" for="guestMinus guestPlus">2</output>
            <input type="hidden" name="guests" id="guestsField" value="2">
            <button type="button" id="guestPlus" aria-label="Increase guests">+</button>
          </div>
        </div>
      </div>
      <div class="b-submit" id="bSubmit">
        <button type="submit">Enquire</button>
      </div>
    </form>
  </div>`;

const ctaBand = (r, {eyebrow, title, text, primary, primaryHref, secondary, secondaryHref}) =>
`<section class="cta-band">
    <div class="wrap reveal">
      <p class="eyebrow">${eyebrow}</p>
      <h2 class="display">${title}</h2>
      <p>${text}</p>
      <div class="cta-actions">
        <a class="btn" href="${r}${primaryHref}">${primary} <span class="arrow" aria-hidden="true">→</span></a>
        ${secondary ? `<a class="btn ghost dark" href="${r}${secondaryHref}">${secondary}</a>` : ''}
      </div>
    </div>
  </section>`;

/* =======================================================================
   HOME
   ======================================================================= */
const home = {
  slug: 'index.html', depth: 0, nav: 'index.html', file: 'index.html',
  title: 'AIyachts | Yacht Charter in Greece — Ionian & Aegean Sailing',
  description: 'Bareboat and skippered yacht charter in Greece — sailing yachts and catamarans from our Lefkas and Athens bases across the Ionian and Aegean seas.',
  ogImage: 'assets/img/og-cover.jpg',
  ogAlt: 'Sailing yacht anchored in a turquoise Ionian cove',
  h1: 'Set sail. Live unforgettable.',
  bodyClass: 'home intro-lock',
  extraHead: `<link rel="preload" as="image" href="assets/hero-poster.jpg" fetchpriority="high">
<script>try{if(sessionStorage.getItem('aiy-intro')){document.documentElement.setAttribute('data-intro','done');}else{sessionStorage.setItem('aiy-intro','1');}}catch(e){}</script>`,
  preBody: `<div id="introSplash" aria-hidden="true">
  <img class="intro-logo" src="assets/logo.png" alt="" width="560" height="442" fetchpriority="high">
</div>`,
  schema: [{
    '@type':'ItemList', name:'AIyachts services', itemListElement:[
      {'@type':'ListItem', position:1, name:'Bareboat & skippered yacht charter', url: abs('fleet.html')},
      {'@type':'ListItem', position:2, name:'Guest services & concierge', url: abs('services.html')},
      {'@type':'ListItem', position:3, name:'Yacht brokerage & management', url: abs('brokerage.html')}
    ]
  }],
  body: (r) => `
  <section class="hero">
    <div class="hero-photo-wrap">
      <video class="hero-photo" autoplay muted loop playsinline poster="${r}assets/hero-poster.jpg" aria-hidden="true">
        <source src="${r}assets/hero-video.mp4" type="video/mp4">
      </video>
    </div>
    <div class="hero-body">
      <div class="hero-inner wrap">
        <h1 class="hero-h1">
          <span class="line">Set sail.</span>
          <span class="line">Live <em>unforgettable</em>.</span>
        </h1>
        <p class="lede">From the deep blues of the Aegean to the emerald bays of the Ionian — hidden coves, timeless island life, and sunsets that feel almost unreal.</p>
        <div class="hero-actions">
          <a href="#booking" class="btn pill">Plan your voyage <span class="arrow" aria-hidden="true">→</span></a>
          <a href="${r}fleet.html" class="hero-link">See the fleet <span class="arrow" aria-hidden="true">→</span></a>
        </div>
      </div>
    </div>
  </section>

  ${bookingBar(r)}

  <section id="about">
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">About AIyachts</p>
        <h2 class="display">Two seas. One philosophy.</h2>
      </div>
      <div class="about-grid">
        <div class="about-copy reveal">
          <p>AIyachts brings together the spirit of the Aegean and Ionian seas with a modern, guest-centred approach to sailing. We operate across Greece — from Athens and Lefkas to Corfu and Paros — offering seamless chartering, brokerage and yacht-management services supported by a network of trusted local partners.</p>
          <p>What sets us apart is the blend of decades of hands-on maritime experience with academic expertise in tourism and customer experience — a company culture that is professional, warm, and deeply committed to the craft of sailing.</p>
          <div class="quote-block">
            <p>“Our mission is simple: to make every connection — guest, partner, or owner — feel valued, supported, and inspired by our love for the sea.”</p>
            <cite>AIyachts, founding principle</cite>
          </div>
          <p class="about-more"><a class="inline-link" href="${r}about.html">More about who we are <span class="arrow" aria-hidden="true">→</span></a></p>
        </div>
      </div>
    </div>
  </section>

  <section id="bases" class="band-raised">
    <div class="wrap reveal">
      <div class="section-head">
        <p class="eyebrow">Two Bases, Two Characters</p>
        <h2 class="display">Choose your sea.</h2>
        <p>Two very different sailing grounds, ninety minutes apart by road. Switch the map to explore where we sail — then open the sea that suits your crew.</p>
      </div>
      ${greeceMap(r)}
      <p class="section-foot"><a class="inline-link" href="${r}destinations.html">Compare both destinations in detail <span class="arrow" aria-hidden="true">→</span></a></p>
    </div>
  </section>

  <section id="fleet">
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">${esc(fleetCharters)}</p>
        <h2 class="display">Our fleet</h2>
        <p>${esc(fleetDescription)}</p>
      </div>
    </div>
    ${FLEET.length ? `<div class="fleet-band reveal">
      <img src="${esc(featuredFleet(1)[0].imageUrl)}" alt="${esc(featuredFleet(1)[0].imageAlt)}" width="1500" height="1500" loading="lazy" decoding="async">
      <p class="fleet-band-cap">${esc(featuredFleet(1)[0].name)}</p>
    </div>` : ''}
    <div class="wrap">
      <div class="fleet-grid reveal-stagger">
        ${fleetCards(featuredFleet(6), 0)}
      </div>
      <div class="fleet-cta">
        <a href="${r}fleet.html" class="btn">${FLEET.length ? `View all ${fleetCount}` : 'View the fleet'} <span class="arrow" aria-hidden="true">→</span></a>
      </div>
    </div>
  </section>

  <section id="experiences" class="band-raised xg-section">
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">Gallery of Experiences</p>
        <h2 class="display">Life aboard.</h2>
        <p>Unfiltered moments from real charters — the coves, the crew, and the guests who came back for more.</p>
      </div>
      <div class="xg-grid xg-teaser reveal-stagger" data-fallback="experiences.html">
        ${galleryTiles(GALLERY_TEASER.map(s => GALLERY.find(g => g.slug === s)), 0, {spans:{cs:2,rs:3}})}
      </div>
      <div class="fleet-cta">
        <a href="${r}experiences.html" class="btn">Open the full gallery <span class="arrow" aria-hidden="true">→</span></a>
      </div>
    </div>
  </section>

  <section id="services">
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">Guest Services</p>
        <h2 class="display">Experience, co-created.</h2>
        <p>For private charter guests — every detail curated so your time on board feels effortless and personal.</p>
      </div>
      <div class="service-grid reveal-stagger">
        <div class="service-card">
          <svg class="service-icon" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="14" r="7"/><path d="M8 34c0-8 5-13 12-13s12 5 12 13"/></svg>
          <h3>Concierge</h3>
          <p>Reservations, local insight and seamless logistics — curated so your sailing experience feels effortless and personal.</p>
        </div>
        <div class="service-card">
          <svg class="service-icon" viewBox="0 0 40 40" aria-hidden="true"><path d="M12 8h16l-2 24H14L12 8Z"/><path d="M12 16h16"/></svg>
          <h3>Provisions</h3>
          <p>Fresh, thoughtful provisions inspired by local flavours, tailored to your preferences before you step aboard.</p>
        </div>
        <div class="service-card">
          <svg class="service-icon" viewBox="0 0 40 40" aria-hidden="true"><circle cx="14" cy="13" r="5"/><circle cx="27" cy="13" r="5"/><path d="M5 34c0-7 4-11 9-11s9 4 9 11M18 34c0-7 4-11 9-11s9 4 9 11"/></svg>
          <h3>Crew offers</h3>
          <p>Trusted skippers and hostesses bringing skill and hospitality — elevating your charter into something memorable.</p>
        </div>
      </div>
      <p class="section-foot"><a class="inline-link" href="${r}services.html">How we build your week <span class="arrow" aria-hidden="true">→</span></a></p>
    </div>
  </section>

  <section id="brokerage" class="band-raised">
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">Brokerage &amp; Management</p>
        <h2 class="display">For owners &amp; investors.</h2>
      </div>
      <div class="split reveal">
        <div class="split-panel">
          <p class="eyebrow">B2C · Private buyers &amp; sellers</p>
          <h3 class="display">Investment &amp; Brokerage</h3>
          <p>A curated selection of well-maintained sailing and motor yachts, handpicked through trusted owner relationships.</p>
          <ul class="split-list">
            <li><b>Yachts for sale</b><span>Curated listings</span></li>
            <li><b>Buyer support</b><span>Selection to paperwork</span></li>
            <li><b>Seller representation</b><span>Listing to close</span></li>
          </ul>
          <a href="${r}brokerage.html" class="btn ghost dark">Explore brokerage</a>
        </div>
        <div class="split-panel">
          <p class="eyebrow">B2B · Charter companies &amp; owners</p>
          <h3 class="display">Yacht Management</h3>
          <p>Year-round support for owners — from berthing and on-season operations to winterisation and deliveries.</p>
          <ul class="split-list">
            <li><b>Pontoon berthing</b><span>Private, managed</span></li>
            <li><b>Operational support</b><span>On-season</span></li>
            <li><b>Yacht deliveries</b><span>Greece &amp; Mediterranean</span></li>
            <li><b>Winterisation</b><span>Off-season care</span></li>
          </ul>
          <a href="${r}brokerage.html" class="btn ghost dark">Partner with us</a>
        </div>
      </div>
    </div>
  </section>

  ${ctaBand(r, {
    eyebrow:'Ready when you are',
    title:'Tell us where you’d like to wake up.',
    text:'Send us your dates and the size of your crew. We will come back with the yachts that fit, the route we would sail, and an honest price.',
    primary:'Start an enquiry', primaryHref:'contact.html',
    secondary:'Browse the fleet', secondaryHref:'fleet.html'
  })}
`
};


/* =======================================================================
   ABOUT
   ======================================================================= */
const about = {
  slug: 'about.html', depth: 0, nav: 'about.html', file: 'about.html',
  title: 'About AIyachts | Greek Yacht Charter, Brokerage & Management',
  description: 'AIyachts combines decades of hands-on maritime experience with academic expertise in tourism — a guest-centred approach to sailing the Ionian and Aegean.',
  ogImage: 'assets/img/og-about.jpg',
  crumbs: [{label:'About', href:'about.html'}],
  h1: 'Two seas. One philosophy.',
  hero: {
    img: 'assets/gallery/under-sail-with-guests',
    eyebrow: 'About AIyachts',
    h1: 'Two seas.<br>One philosophy.',
    lede: 'A Greek company built by people who sail — chartering, brokerage and yacht management, delivered with the care of a small crew rather than the distance of a big fleet.'
  },
  schema: [{
    '@type':'AboutPage', '@id': abs('about.html') + '#aboutpage',
    name: 'About AIyachts', mainEntity: { '@id': SITE.origin + '/#organization' }
  }],
  body: (r) => `
  <section class="prose-section">
    <div class="wrap">
      <div class="prose reveal">
        <p class="lead">AIyachts brings together the spirit of the Aegean and Ionian seas with a modern, guest-centred approach to sailing. We operate across Greece — from Athens and Lefkas to Corfu and Paros — offering seamless chartering, brokerage and yacht-management services supported by a network of trusted local partners.</p>
        <p>What sets us apart is the blend of decades of hands-on maritime experience with academic expertise in tourism and customer experience. That combination shapes everything: how a yacht is prepared before you arrive, how a briefing is given, how quickly a phone is answered when you are three islands away from base. It is a company culture that is professional, warm, and deeply committed to the craft of sailing.</p>
        <div class="quote-block">
          <p>“Our mission is simple: to make every connection — guest, partner, or owner — feel valued, supported, and inspired by our love for the sea.”</p>
          <cite>AIyachts, founding principle</cite>
        </div>
      </div>
    </div>
  </section>

  <section class="band-raised">
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">What we do</p>
        <h2 class="display">Three ways we work with the sea.</h2>
        <p>Charter, brokerage and management are three sides of the same business. The yachts we manage are the yachts we charter, and the standard is the same either way.</p>
      </div>
      <div class="pillar-grid reveal-stagger">
        <article class="pillar">
          <span class="pillar-num" aria-hidden="true">01</span>
          <h3 class="display">Charter</h3>
          <p>${esc(fleetDescription)}</p>
          <a class="inline-link" href="${r}fleet.html">See the fleet <span class="arrow" aria-hidden="true">→</span></a>
        </article>
        <article class="pillar">
          <span class="pillar-num" aria-hidden="true">02</span>
          <h3 class="display">Guest experience</h3>
          <p>Concierge, provisioning and crew — the parts of a holiday that are easy to get wrong from a distance. We plan them with you before you arrive and stay reachable while you are out there.</p>
          <a class="inline-link" href="${r}services.html">Guest services <span class="arrow" aria-hidden="true">→</span></a>
        </article>
        <article class="pillar">
          <span class="pillar-num" aria-hidden="true">03</span>
          <h3 class="display">Ownership</h3>
          <p>Brokerage for private buyers and sellers, and year-round management for owners and charter companies: berthing, on-season operations, deliveries across Greece and the Mediterranean, and winterisation.</p>
          <a class="inline-link" href="${r}brokerage.html">Brokerage &amp; management <span class="arrow" aria-hidden="true">→</span></a>
        </article>
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="feature-split reveal">
        <div class="feature-media">
          <picture>
            <source type="image/webp" srcset="${r}assets/gallery/skipper-at-the-helm-800.webp 800w, ${r}assets/gallery/skipper-at-the-helm-1600.webp 1600w" sizes="(max-width:900px) 100vw, 50vw">
            <img src="${r}assets/gallery/skipper-at-the-helm-800.jpg" alt="AIyachts skipper at the wheel of a charter yacht under the bimini" width="1600" height="1200" loading="lazy" decoding="async">
          </picture>
        </div>
        <div class="feature-copy">
          <p class="eyebrow">The difference</p>
          <h2 class="display">Small enough to know your name.</h2>
          <p>Large fleets run on scripts. We run on relationships — with the guests who come back, with the owners who trust us with their boats, and with the local partners who make a week ashore as good as the week afloat.</p>
          <ul class="tick-list">
            <li>Yachts maintained by the same people who charter them</li>
            <li>Honest advice about which sea and which boat suits your crew</li>
            <li>A briefing that respects your experience, whatever level it is</li>
            <li>Someone reachable while you are out there, not just before you book</li>
            <li>A network of trusted partners across the Ionian and the Aegean</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  ${ctaBand(r, {
    eyebrow:'Say hello',
    title:'Come and sail with us.',
    text:'Tell us your dates and your crew, and we will tell you honestly which of our yachts — and which of our seas — will make the best week.',
    primary:'Contact the team', primaryHref:'contact.html',
    secondary:'Where we sail', secondaryHref:'destinations.html'
  })}
`
};

/* =======================================================================
   DESTINATIONS (hub)
   ======================================================================= */
const destinations = {
  slug: 'destinations.html', depth: 0, nav: 'destinations.html', file: 'destinations.html',
  title: 'Sailing Destinations in Greece | Ionian & Aegean Charter Bases',
  description: 'Sail the Ionian from Lefkas or the Aegean from Athens. Compare the winds, the distances and the islands on each route, and pick the base that suits your crew.',
  ogImage: 'assets/img/og-destinations.jpg',
  crumbs: [{label:'Destinations', href:'destinations.html'}],
  h1: 'Choose your sea.',
  hero: {
    img: 'assets/gallery/hillside-harbour-view',
    eyebrow: 'Two Bases, Two Characters',
    h1: 'Choose your sea.',
    lede: 'Two very different sailing grounds, ninety minutes apart by road. One is sheltered, green and forgiving. The other is bright, open and windy. Both are Greece at its best.'
  },
  schema: [{
    '@type':'FAQPage', '@id': abs('destinations.html') + '#faq',
    mainEntity: [
      {'@type':'Question', name:'Is the Ionian or the Aegean better for a first bareboat charter?',
       acceptedAnswer:{'@type':'Answer', text:'The Ionian. Distances between anchorages are short, the islands shelter you from open sea, and the afternoon breeze is usually a comfortable force 3–5 that dies away in the evening. The Aegean rewards crews who already have miles behind them.'}},
      {'@type':'Question', name:'When is the best time to sail in Greece?',
       acceptedAnswer:{'@type':'Answer', text:'May, June, September and early October give warm water, lighter winds and quieter anchorages. July and August are hottest and busiest, and in the Aegean bring the meltemi — a strong, steady north wind that can blow for days.'}},
      {'@type':'Question', name:'How far do you sail in a typical day?',
       acceptedAnswer:{'@type':'Answer', text:'In the Ionian, two to four hours of sailing is normal — often 10 to 20 nautical miles between anchorages. In the Aegean, passages between island groups are longer, typically 25 to 40 nautical miles.'}},
      {'@type':'Question', name:'Do I need a sailing licence to charter a yacht in Greece?',
       acceptedAnswer:{'@type':'Answer', text:'For a bareboat charter Greek regulations require a recognised skipper qualification and a second competent crew member. If you do not hold a licence, or simply prefer not to be responsible for the boat, we can provide a professional skipper.'}}
    ]
  }],
  body: (r) => `
  <section>
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">The map</p>
        <h2 class="display">Where we sail.</h2>
        <p>Switch the map between the two seas, then open the region that fits your week. Both bases are supported by the same team, the same fleet standards and the same local network.</p>
      </div>
      ${greeceMap(r)}
    </div>
  </section>

  <section class="band-raised">
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">Side by side</p>
        <h2 class="display">Ionian or Aegean?</h2>
        <p>The honest comparison we give on the phone, written down.</p>
      </div>
      <div class="compare reveal">
        <table class="compare-table">
          <caption class="sr-only">Comparison of sailing conditions in the Ionian and Aegean seas</caption>
          <thead>
            <tr><th scope="col">&nbsp;</th><th scope="col">Ionian · from Lefkas</th><th scope="col">Aegean · from Athens</th></tr>
          </thead>
          <tbody>
            <tr><th scope="row">Wind</th><td>Afternoon sea breeze, typically force 3–5, calm mornings and evenings</td><td>Meltemi from the north in high summer, force 4–7 for days at a time</td></tr>
            <tr><th scope="row">Distances</th><td>Short hops, 10–20 nautical miles between anchorages</td><td>Longer passages, 25–40 nautical miles between island groups</td></tr>
            <tr><th scope="row">Landscape</th><td>Green hills, cypress and olive, white pebble coves</td><td>Bare rock, white cubic villages, dazzling light</td></tr>
            <tr><th scope="row">Water</th><td>Emerald and turquoise, often glassy in the morning</td><td>Deep cobalt blue, livelier surface</td></tr>
            <tr><th scope="row">Best for</th><td>First-timers, families with children, relaxed crews</td><td>Experienced sailors, crews who want miles and iconic islands</td></tr>
            <tr><th scope="row">Season</th><td>May to October, gentle through the shoulder months</td><td>May to October, windiest in July and August</td></tr>
          </tbody>
        </table>
      </div>
      <div class="dest-cards reveal-stagger">
        <a class="dest-card" href="${r}destinations/ionian-sailing.html">
          <picture>
            <source type="image/webp" srcset="${r}assets/gallery/emerald-bay-anchorage-800.webp 800w, ${r}assets/gallery/emerald-bay-anchorage-1600.webp 1600w" sizes="(max-width:820px) 100vw, 50vw">
            <img src="${r}assets/gallery/emerald-bay-anchorage-800.jpg" alt="Yacht anchored in an emerald Ionian bay framed by trees" width="1600" height="900" loading="lazy" decoding="async">
          </picture>
          <div class="dest-card-body">
            <p class="eyebrow">Lefkas base</p>
            <h3 class="display">Sailing the Ionian</h3>
            <p>Meganisi, Kalamos, Kastos, Ithaca, Kefalonia, Paxos — sheltered water, short distances and a taverna quay at the end of every day.</p>
            <span class="sea-card-cta">Open the Ionian guide <span class="arrow" aria-hidden="true">→</span></span>
          </div>
        </a>
        <a class="dest-card" href="${r}destinations/aegean-sailing.html">
          <picture>
            <source type="image/webp" srcset="${r}assets/gallery/pastel-dawn-anchorage-800.webp 800w, ${r}assets/gallery/pastel-dawn-anchorage-1600.webp 1600w" sizes="(max-width:820px) 100vw, 50vw">
            <img src="${r}assets/gallery/pastel-dawn-anchorage-800.jpg" alt="Yachts at anchor at dawn in a calm Greek bay" width="1528" height="1528" loading="lazy" decoding="async">
          </picture>
          <div class="dest-card-body">
            <p class="eyebrow">Athens base</p>
            <h3 class="display">Sailing the Aegean</h3>
            <p>The Saronic Gulf for a gentle first week, the Cyclades for the Greece of the postcards — Hydra, Serifos, Sifnos, Paros, Naxos.</p>
            <span class="sea-card-cta">Open the Aegean guide <span class="arrow" aria-hidden="true">→</span></span>
          </div>
        </a>
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">Before you book</p>
        <h2 class="display">Questions we are asked every week.</h2>
      </div>
      <div class="faq reveal">
        <details><summary>Is the Ionian or the Aegean better for a first bareboat charter?</summary><p>The Ionian. Distances between anchorages are short, the islands shelter you from open sea, and the afternoon breeze is usually a comfortable force 3–5 that dies away in the evening. The Aegean rewards crews who already have miles behind them.</p></details>
        <details><summary>When is the best time to sail in Greece?</summary><p>May, June, September and early October give warm water, lighter winds and quieter anchorages. July and August are hottest and busiest, and in the Aegean bring the meltemi — a strong, steady north wind that can blow for days.</p></details>
        <details><summary>How far do you sail in a typical day?</summary><p>In the Ionian, two to four hours of sailing is normal — often 10 to 20 nautical miles between anchorages. In the Aegean, passages between island groups are longer, typically 25 to 40 nautical miles, so the days have more sailing in them.</p></details>
        <details><summary>Do I need a sailing licence to charter a yacht in Greece?</summary><p>For a bareboat charter Greek regulations require a recognised skipper qualification and a second competent crew member. If you do not hold a licence, or simply prefer not to be responsible for the boat, we can provide a professional skipper — many of our guests do exactly that on their first week.</p></details>
        <details><summary>Can we sail one way, from one base to the other?</summary><p>Ask us. One-way itineraries between sailing areas are possible on some yachts and some dates, and we will tell you straight away whether it works for the week you have in mind.</p></details>
      </div>
    </div>
  </section>

  ${ctaBand(r, {
    eyebrow:'Not sure yet?',
    title:'Tell us your crew, we’ll tell you the sea.',
    text:'Send us the dates, the number of people and how much sailing you actually want to do. We will recommend the base, the yacht and the route.',
    primary:'Ask for a recommendation', primaryHref:'contact.html',
    secondary:'See the fleet', secondaryHref:'fleet.html'
  })}
`
};

/* =======================================================================
   FLEET (hub)
   ======================================================================= */
const fleetFilters = [
  { id:'all',       label:'All yachts' },
  ...(FLEET.some(y => y.type === 'Catamaran') ? [{ id:'catamaran', label:'Catamarans' }] : []),
  ...[...new Set(FLEET.filter(y => y.type !== 'Catamaran').map(y => y.cabins))]
    .sort((a,b) => a-b)
    .map(cabins => ({ id:`cabin-${cabins}`, label:`${cabins} cabin${cabins === 1 ? '' : 's'} · Monohulls` }))
];
const fleetGroup = y => y.type === 'Catamaran' ? 'catamaran' : `cabin-${y.cabins}`;

const fleet = {
  slug: 'fleet.html', depth: 0, nav: 'fleet.html', file: 'fleet.html',
  title: 'Yacht Charter Fleet in Greece | Sailing Yachts & Catamarans',
  description: fleetDescription,
  ogImage: FLEET[0]?.imageUrl || 'assets/img/og-fleet.jpg',
  ogAlt: FLEET[0]?.imageAlt || 'AIyachts charter fleet',
  crumbs: [{label:'Fleet', href:'fleet.html'}],
  h1: 'Our fleet',
  hero: {
    img: 'assets/gallery/olive-framed-cove',
    eyebrow: fleetCharters,
    h1: 'Our fleet.',
    lede: esc(fleetDescription)
  },
  schema: [{
    '@type':'ItemList', '@id': abs('fleet.html') + '#fleet',
    name: 'AIyachts charter fleet', numberOfItems: FLEET.length,
    itemListElement: FLEET.map((y,i) => ({
      '@type':'ListItem', position: i+1, name: y.name, url: abs('fleet/' + y.slug + '.html')
    }))
  }],
  body: (r) => `
  <section>
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">The boats</p>
        <h2 class="display">Choose the yacht, then the sea.</h2>
        <p>${FLEET.length ? 'Explore the yachts below, or tell us your crew size and we will help you choose.' : emptyFleetMessage}</p>
      </div>
      <div class="xg-filters fleet-filters reveal" role="group" aria-label="Filter the fleet" id="fleetFilters"${FLEET.length ? '' : ' hidden'}>
        ${fleetFilters.map((f,i) => `<button type="button" class="xg-chip" data-filter="${f.id}" aria-pressed="${i===0}">${f.label}</button>`).join('\n        ')}
      </div>
      <div class="fleet-grid full reveal-stagger" id="fleetGrid">
        ${FLEET.map(y => `<article class="yacht-card" data-cat="${fleetGroup(y)}">
      <a class="yacht-link" href="${r}fleet/${y.slug}.html">
        <div class="yacht-art">
          <img src="${esc(y.imageUrl)}" alt="${esc(y.imageAlt)}" width="640" height="380" loading="lazy" decoding="async">
          <span class="yacht-flag">${esc(y.type)}</span>
        </div>
        <div class="yacht-body">
          <p class="yacht-cat">${esc(y.cat)} · ${esc(y.year)}</p>
          <h3 class="display">${esc(y.name)}</h3>
          <p class="yacht-tag">${esc(y.tag)}</p>
          <div class="yacht-specs"><span>${y.guests} guests</span><span>${y.berths} berths</span><span>${y.heads} ${y.heads>1?'heads':'head'}</span></div>
          <span class="yacht-more">View yacht <span class="arrow" aria-hidden="true">→</span></span>
        </div>
      </a>
    </article>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="band-raised">
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">How chartering works</p>
        <h2 class="display">From enquiry to cast-off.</h2>
      </div>
      <ol class="steps reveal-stagger">
        <li><span class="step-num">01</span><h3>Tell us your week</h3><p>Dates, crew size, experience level and whether you want to sail hard or swim a lot. We answer with the yachts that genuinely fit — not the one we most want to fill.</p></li>
        <li><span class="step-num">02</span><h3>Choose bareboat or skippered</h3><p>Bareboat if you hold a recognised licence and a competent second. Skippered if you would rather learn, relax, or hand the responsibility to someone who knows every bay.</p></li>
        <li><span class="step-num">03</span><h3>Plan the extras</h3><p>Provisioning, transfers, a hostess, a route worth following. We agree it all before you fly, so the first day is spent swimming rather than shopping.</p></li>
        <li><span class="step-num">04</span><h3>Board and go</h3><p>A proper handover at the base, a briefing pitched at your experience, and a number that a real person answers for the whole week you are away.</p></li>
      </ol>
    </div>
  </section>

  ${ctaBand(r, {
    eyebrow:'Availability',
    title:'Ask us what is free on your dates.',
    text:'Send the dates and the number of guests. We will come back with the yachts still available, the difference between them, and what each one costs.',
    primary:'Check availability', primaryHref:'contact.html',
    secondary:'Where we sail', secondaryHref:'destinations.html'
  })}
`
};

/* =======================================================================
   EXPERIENCES — the gallery
   ======================================================================= */
const experiences = {
  slug: 'experiences.html', depth: 0, nav: 'experiences.html', file: 'experiences.html',
  title: 'Gallery of Experiences | Sailing the Ionian with AIyachts',
  description: 'Photographs and films from real AIyachts charters — hidden coves and sea caves, island harbours at blue hour, and long golden-hour evenings at anchor.',
  ogImage: 'assets/img/og-gallery.jpg',
  crumbs: [{label:'Experiences', href:'experiences.html'}],
  h1: 'Life aboard.',
  bodyClass: 'has-gallery',
  hero: {
    img: 'assets/gallery/sea-cave-from-the-bow',
    eyebrow: 'Gallery of Experiences',
    h1: 'Life aboard.',
    lede: 'No stock photography. Every frame below was taken on one of our charters — by our crews, our skippers and our guests.'
  },
  schema: [
    {
      '@type':'ImageGallery', '@id': abs('experiences.html') + '#gallery',
      name: 'AIyachts gallery of experiences',
      description: 'Photographs and films from AIyachts sailing charters in the Ionian Sea, Greece.',
      associatedMedia: GALLERY.filter(g => g.type === 'photo').map(g => ({
        '@type':'ImageObject',
        contentUrl: abs('assets/gallery/' + g.slug + '-1600.jpg'),
        thumbnailUrl: abs('assets/gallery/' + g.slug + '-800.jpg'),
        name: g.title, caption: g.alt, description: g.alt,
        width: g.w, height: g.h, creditText: SITE.name,
        copyrightNotice: '© ' + SITE.name, acquireLicensePage: abs('contact.html')
      }))
    },
    ...GALLERY.filter(g => g.type === 'video').map(g => ({
      '@type':'VideoObject',
      name: g.title + ' — AIyachts, Ionian Sea',
      description: g.alt,
      thumbnailUrl: [abs('assets/gallery/' + g.slug + '-poster-1600.jpg')],
      contentUrl: abs('assets/gallery/' + g.slug + '.mp4'),
      uploadDate: '2026-08-12',
      duration: g.duration,
      publisher: { '@id': SITE.origin + '/#organization' }
    }))
  ],
  body: (r) => `
  <section class="xg-section">
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">${GALLERY.length} frames · Ionian Sea</p>
        <h2 class="display">Real charters, real weather, real people.</h2>
        <p>Filter the wall, or open any frame full screen. Films play in the viewer.</p>
      </div>
      ${galleryFilters()}
      <div class="xg-grid reveal-stagger" id="xgGrid">
        ${galleryTiles(GALLERY, 0)}
      </div>
      <p class="xg-empty" id="xgEmpty" hidden>Nothing in this category yet.</p>
    </div>
  </section>

  <section class="band-raised">
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">What you are looking at</p>
        <h2 class="display">A week, roughly.</h2>
        <p>Most of these frames come from the same stretch of the southern Ionian — the water between Lefkas, Meganisi, Kalamos and Ithaca, where the coves are deep, the sea caves are cool, and the villages light up at dusk.</p>
      </div>
      <div class="pillar-grid reveal-stagger">
        <article class="pillar">
          <span class="pillar-num" aria-hidden="true">01</span>
          <h3 class="display">Mornings are glass</h3>
          <p>The wind sleeps until noon. That is when you swim off the stern, run the tender ashore for bread, and motor a couple of miles to the next bay before anyone else wakes up.</p>
        </article>
        <article class="pillar">
          <span class="pillar-num" aria-hidden="true">02</span>
          <h3 class="display">Afternoons are sailing</h3>
          <p>The sea breeze arrives around one o'clock and builds through the afternoon — enough to switch the engine off, sheet in, and cover the distance to the evening's anchorage properly under sail.</p>
        </article>
        <article class="pillar">
          <span class="pillar-num" aria-hidden="true">03</span>
          <h3 class="display">Evenings are ashore</h3>
          <p>Stern-to on a village quay, or anchored alone with a line to a tree. Either way the light goes gold, then pink, and the day ends at a table twenty metres from the boat.</p>
        </article>
      </div>
    </div>
  </section>

  ${ctaBand(r, {
    eyebrow:'Your turn',
    title:'This could be your photo roll.',
    text:'Pick a week, pick a yacht, and we will handle everything between the airport and the anchorage.',
    primary:'Plan your charter', primaryHref:'contact.html',
    secondary:'Browse the fleet', secondaryHref:'fleet.html'
  })}

  ${lightbox()}
`
};

/* =======================================================================
   SERVICES
   ======================================================================= */
const services = {
  slug: 'services.html', depth: 0, nav: 'services.html', file: 'services.html',
  title: 'Guest Services | Concierge, Provisioning & Crew — AIyachts',
  description: 'Concierge, provisioning and professional crew for private charter guests in Greece — the details planned before you fly, so your week afloat runs itself.',
  ogImage: 'assets/img/og-services.jpg',
  crumbs: [{label:'Services', href:'services.html'}],
  h1: 'Experience, co-created.',
  hero: {
    img: 'assets/gallery/turquoise-from-the-bow',
    eyebrow: 'Guest Services',
    h1: 'Experience,<br>co-created.',
    lede: 'A charter is a week of small decisions. We make most of them with you before you arrive — and quietly handle the rest while you are aboard.'
  },
  schema: [
    {'@type':'Service', name:'Yacht charter concierge', serviceType:'Concierge',
     provider:{'@id': SITE.origin + '/#organization'}, areaServed:{'@type':'Country', name:'Greece'},
     description:'Reservations, local insight and logistics for private charter guests sailing the Ionian and Aegean.'},
    {'@type':'Service', name:'Yacht provisioning', serviceType:'Provisioning',
     provider:{'@id': SITE.origin + '/#organization'}, areaServed:{'@type':'Country', name:'Greece'},
     description:'Fresh provisioning tailored to guest preferences and delivered aboard before embarkation.'},
    {'@type':'Service', name:'Professional skippers and hostesses', serviceType:'Crew',
     provider:{'@id': SITE.origin + '/#organization'}, areaServed:{'@type':'Country', name:'Greece'},
     description:'Experienced skippers, hostesses and cooks available for bareboat and crewed charters in Greece.'}
  ],
  body: (r) => `
  <section>
    <div class="wrap">
      <div class="service-detail reveal" id="concierge">
        <div class="service-detail-head">
          <svg class="service-icon big" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="14" r="7"/><path d="M8 34c0-8 5-13 12-13s12 5 12 13"/></svg>
          <div>
            <p class="eyebrow">01 · Concierge</p>
            <h2 class="display">Someone who knows the islands, on your side.</h2>
          </div>
        </div>
        <p>Reservations, local insight and seamless logistics — curated so your sailing experience feels effortless and personal. We know which quay fills up first in August, which taverna is worth the walk, and which bay is unbearable in a northerly.</p>
        <ul class="tick-list">
          <li>Airport and port transfers arranged around your flight, not ours</li>
          <li>Restaurant and berth reservations along your route</li>
          <li>Route planning built around your crew, the forecast and your pace</li>
          <li>Special occasions handled discreetly — birthdays, proposals, anniversaries</li>
          <li>A number you can call from the boat, answered by someone who knows your booking</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="band-raised">
    <div class="wrap">
      <div class="service-detail reveal" id="provisions">
        <div class="service-detail-head">
          <svg class="service-icon big" viewBox="0 0 40 40" aria-hidden="true"><path d="M12 8h16l-2 24H14L12 8Z"/><path d="M12 16h16"/></svg>
          <div>
            <p class="eyebrow">02 · Provisions</p>
            <h2 class="display">Aboard before you are.</h2>
          </div>
        </div>
        <p>Fresh, thoughtful provisions inspired by local flavours and tailored to your preferences before you step aboard. Tell us how you eat and we will stock the boat accordingly — including the things people forget until the first evening at anchor.</p>
        <ul class="tick-list">
          <li>Full provisioning, starter packs, or drinks and breakfast only</li>
          <li>Local produce, bakery bread, island cheese, Greek wine</li>
          <li>Allergies, vegetarian, vegan and children's preferences accounted for</li>
          <li>Ice, water and soft drinks stowed and cold for your arrival</li>
          <li>Mid-week top-ups arranged at a village along your route</li>
        </ul>
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="service-detail reveal" id="crew">
        <div class="service-detail-head">
          <svg class="service-icon big" viewBox="0 0 40 40" aria-hidden="true"><circle cx="14" cy="13" r="5"/><circle cx="27" cy="13" r="5"/><path d="M5 34c0-7 4-11 9-11s9 4 9 11M18 34c0-7 4-11 9-11s9 4 9 11"/></svg>
          <div>
            <p class="eyebrow">03 · Crew</p>
            <h2 class="display">Skill and hospitality, aboard.</h2>
          </div>
        </div>
        <p>Trusted skippers and hostesses bringing skill and hospitality — elevating your charter into something memorable. Our skippers sail these waters all season; they know the anchorages that stay calm when the breeze swings, and they teach if you want to learn.</p>
        <ul class="tick-list">
          <li>Professional skippers for the full week or the first day only</li>
          <li>Hostesses and cooks for crews who would rather not do the dishes</li>
          <li>Tuition aboard for sailors building towards their own licence</li>
          <li>English-speaking crew, with Greek local knowledge</li>
          <li>Discreet, unobtrusive, and genuinely good company at dinner</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="band-raised">
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">The shape of a week</p>
        <h2 class="display">What we handle, and when.</h2>
      </div>
      <ol class="steps reveal-stagger">
        <li><span class="step-num">Before</span><h3>Planning</h3><p>Yacht selection, route, provisioning list, crew, transfers, and any occasion worth marking. All agreed by email or phone before you fly.</p></li>
        <li><span class="step-num">Day 1</span><h3>Embarkation</h3><p>Transfer to the base, a proper handover and safety briefing, provisions already stowed, and a route plan built around the week's forecast.</p></li>
        <li><span class="step-num">Aboard</span><h3>The week</h3><p>Reservations along the way, technical support if anything needs attention, and honest advice on where to be when the wind changes.</p></li>
        <li><span class="step-num">After</span><h3>Disembarkation</h3><p>An unhurried morning, transfer to the airport, and — if the week worked — a conversation about next year before you have landed.</p></li>
      </ol>
    </div>
  </section>

  ${ctaBand(r, {
    eyebrow:'Tell us how you travel',
    title:'The details are the holiday.',
    text:'Send us your dates and the things that matter to your crew. We will build the week around them.',
    primary:'Start planning', primaryHref:'contact.html',
    secondary:'See the fleet', secondaryHref:'fleet.html'
  })}
`
};

/* =======================================================================
   BROKERAGE
   ======================================================================= */
const brokerage = {
  slug: 'brokerage.html', depth: 0, nav: 'brokerage.html', file: 'brokerage.html',
  title: 'Yacht Brokerage & Yacht Management in Greece | AIyachts',
  description: 'Buying, selling or owning a yacht in Greece — curated brokerage for private buyers and sellers, plus berthing, operations, deliveries and winterisation for owners.',
  ogImage: 'assets/img/og-brokerage.jpg',
  crumbs: [{label:'Brokerage', href:'brokerage.html'}],
  h1: 'For owners & investors.',
  hero: {
    img: 'assets/gallery/pastel-dawn-anchorage',
    eyebrow: 'Brokerage & Management',
    h1: 'For owners<br>&amp; investors.',
    lede: 'The same team that prepares our charter fleet looks after privately owned yachts — and finds the right boat for people who are ready to own one.'
  },
  schema: [
    {'@type':'Service', name:'Yacht brokerage', serviceType:'Yacht brokerage',
     provider:{'@id': SITE.origin + '/#organization'}, areaServed:{'@type':'Country', name:'Greece'},
     description:'Curated brokerage of sailing and motor yachts in Greece, representing both private buyers and sellers.'},
    {'@type':'Service', name:'Yacht management', serviceType:'Yacht management',
     provider:{'@id': SITE.origin + '/#organization'}, areaServed:{'@type':'Country', name:'Greece'},
     description:'Year-round yacht management for owners and charter companies: pontoon berthing, on-season operations, deliveries across Greece and the Mediterranean, and winterisation.'}
  ],
  body: (r) => `
  <section>
    <div class="wrap">
      <div class="split reveal">
        <div class="split-panel" id="buy">
          <p class="eyebrow">B2C · Private buyers &amp; sellers</p>
          <h2 class="display">Investment &amp; Brokerage</h2>
          <p>A curated selection of well-maintained sailing and motor yachts, handpicked through trusted owner relationships. We would rather show you three boats worth seeing than thirty listings you have already scrolled past.</p>
          <ul class="split-list">
            <li><b>Yachts for sale</b><span>Curated listings</span></li>
            <li><b>Buyer support</b><span>Selection to paperwork</span></li>
            <li><b>Seller representation</b><span>Listing to close</span></li>
            <li><b>Condition guidance</b><span>Survey &amp; sea trial</span></li>
            <li><b>Charter-income advice</b><span>If the boat must earn</span></li>
          </ul>
          <a href="${enquire('Brokerage enquiry — AIyachts')}" class="btn ghost dark">Talk to a broker</a>
        </div>
        <div class="split-panel" id="manage">
          <p class="eyebrow">B2B · Charter companies &amp; owners</p>
          <h2 class="display">Yacht Management</h2>
          <p>Year-round support for owners — from berthing and on-season operations to winterisation and deliveries. Your boat is looked after by people who are on the water every day, not by a subcontractor you never meet.</p>
          <ul class="split-list">
            <li><b>Pontoon berthing</b><span>Private, managed</span></li>
            <li><b>Operational support</b><span>On-season</span></li>
            <li><b>Yacht deliveries</b><span>Greece &amp; Mediterranean</span></li>
            <li><b>Winterisation</b><span>Off-season care</span></li>
            <li><b>Guest handovers</b><span>Briefings &amp; turnarounds</span></li>
          </ul>
          <a href="${enquire('Yacht management enquiry — AIyachts')}" class="btn ghost dark">Discuss management</a>
        </div>
      </div>
    </div>
  </section>

  <section class="band-raised">
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">Buying a yacht in Greece</p>
        <h2 class="display">How a purchase actually goes.</h2>
        <p>No two boats are the same, but the path is. This is what working with us looks like from first call to first sail.</p>
      </div>
      <ol class="steps reveal-stagger">
        <li><span class="step-num">01</span><h3>Brief</h3><p>What the boat is for — family cruising, charter income, a long-term liveaboard plan — and what you actually want to spend once running costs are honest.</p></li>
        <li><span class="step-num">02</span><h3>Shortlist</h3><p>We go through the market and our owner network, and come back with the few boats worth your flight, including the ones that are not publicly listed.</p></li>
        <li><span class="step-num">03</span><h3>Inspection</h3><p>Viewings, sea trial and an independent survey. We tell you what is a negotiating point and what is a reason to walk away.</p></li>
        <li><span class="step-num">04</span><h3>Close</h3><p>Negotiation, contract, registration and flag paperwork — coordinated with the specialists who do this for a living.</p></li>
        <li><span class="step-num">05</span><h3>Afterwards</h3><p>Berthing, management, winterisation and, if you want the boat to earn, a place in a charter programme run to the same standard as our own fleet.</p></li>
      </ol>
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="feature-split reverse reveal">
        <div class="feature-media">
          <picture>
            <source type="image/webp" srcset="${r}assets/gallery/harbour-blue-hour-800.webp 800w, ${r}assets/gallery/harbour-blue-hour-1600.webp 1600w" sizes="(max-width:900px) 100vw, 50vw">
            <img src="${r}assets/gallery/harbour-blue-hour-800.jpg" alt="Greek island harbour at blue hour with moored yachts and lit tavernas" width="1600" height="1200" loading="lazy" decoding="async">
          </picture>
        </div>
        <div class="feature-copy">
          <p class="eyebrow">For owners</p>
          <h2 class="display">A boat left alone is a boat that ages twice as fast.</h2>
          <p>Greek summers are hard on yachts and Greek winters are harder on the ones nobody visits. Our management contracts exist so that your boat is checked, run, cleaned and cared for whether you are here in July or in London in February.</p>
          <ul class="tick-list">
            <li>Managed pontoon berthing at our own facilities</li>
            <li>Regular checks, engine runs and system testing off season</li>
            <li>Winterisation, antifoul, and spring recommissioning</li>
            <li>Deliveries anywhere in Greece and across the Mediterranean</li>
            <li>Guest handovers and turnarounds if the yacht charters</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  ${ctaBand(r, {
    eyebrow:'Owners & investors',
    title:'Let’s talk about the boat.',
    text:'Whether you are buying your first yacht, selling one you have loved, or looking for someone reliable to look after it — start with a conversation.',
    primary:'Contact us', primaryHref:'contact.html',
    secondary:'About AIyachts', secondaryHref:'about.html'
  })}
`
};

/* =======================================================================
   CONTACT
   ======================================================================= */
const contact = {
  slug: 'contact.html', depth: 0, nav: 'contact.html', file: 'contact.html',
  title: 'Contact AIyachts | Yacht Charter Enquiries in Greece',
  description: 'Enquire about a yacht charter in the Ionian or Aegean. Call our Athens or Lefkas team, email us, or send your dates and crew size and we will reply within a day.',
  ogImage: 'assets/img/og-contact.jpg',
  crumbs: [{label:'Contact', href:'contact.html'}],
  h1: 'Let’s set a course.',
  hero: {
    compact: true,
    img: 'assets/gallery/harbour-blue-hour',
    eyebrow: 'Contact & Enquiries',
    h1: 'Let’s set a course.',
    lede: 'Tell us where you would like to sail, and one of our team will reply personally — usually within a day.'
  },
  schema: [{
    '@type':'ContactPage', '@id': abs('contact.html') + '#contactpage',
    name: 'Contact AIyachts', mainEntity: {'@id': SITE.origin + '/#organization'}
  }],
  body: (r) => `
  <section class="contact-section">
    <div class="wrap">
      <div class="contact-layout">
        <div class="contact-form-wrap reveal">
          <p class="eyebrow">Charter enquiry</p>
          <h2 class="display">Send us the week you have in mind.</h2>
          <p class="form-note">Nothing is booked by this form — it opens an email to our team with your details filled in, so you can add anything else before you send it.</p>
          <form class="enquiry" id="enquiryForm" novalidate>
            <div class="f-row">
              <div class="f-field">
                <label for="fName">Your name</label>
                <input id="fName" name="name" type="text" autocomplete="name" required>
              </div>
              <div class="f-field">
                <label for="fEmail">Email</label>
                <input id="fEmail" name="email" type="email" autocomplete="email" required>
              </div>
            </div>
            <div class="f-row">
              <div class="f-field">
                <label for="fDestination">Destination</label>
                <select id="fDestination" name="destination">
                  <option>Either sea — advise me</option>
                  <option>Ionian — Lefkas base</option>
                  <option>Aegean — Athens base</option>
                </select>
              </div>
              <div class="f-field">
                <label for="fYacht">Yacht of interest</label>
                <select id="fYacht" name="yacht">
                  <option>No preference yet</option>
                  ${FLEET.map(y => `<option>${esc(y.name)}</option>`).join('\n                  ')}
                </select>
              </div>
            </div>
            <div class="f-row">
              <div class="f-field">
                <label for="fStart">From</label>
                <input id="fStart" name="start" type="date">
              </div>
              <div class="f-field">
                <label for="fEnd">To</label>
                <input id="fEnd" name="end" type="date">
              </div>
              <div class="f-field narrow">
                <label for="fGuests">Guests</label>
                <input id="fGuests" name="guests" type="number" min="1" max="12" value="2" inputmode="numeric">
              </div>
            </div>
            <div class="f-field">
              <label for="fCharterType">Charter type</label>
              <select id="fCharterType" name="charter">
                <option>Bareboat — we hold licences</option>
                <option>Skippered — please provide a skipper</option>
                <option>Skippered with hostess</option>
                <option>Not sure yet</option>
              </select>
            </div>
            <div class="f-field">
              <label for="fMessage">Anything else we should know?</label>
              <textarea id="fMessage" name="message" rows="4" placeholder="Sailing experience, children aboard, dietary preferences, a special occasion…"></textarea>
            </div>
            <button class="btn" type="submit">Send the enquiry <span class="arrow" aria-hidden="true">→</span></button>
            <p class="form-fallback">Or write to us directly at <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
          </form>
        </div>

        <aside class="contact-aside reveal">
          <div class="contact-block">
            <h2 class="foot-h">Speak to us</h2>
            ${SITE.phones.map(p => `<a class="contact-line" href="tel:${p.replace(/[^\d+]/g,'')}">${p}</a>`).join('\n            ')}
            <a class="contact-line" href="mailto:${SITE.email}">${SITE.email}</a>
          </div>
          <div class="contact-block">
            <h2 class="foot-h">Athens base</h2>
            <p class="contact-line">Alexandroupoleos 20<br>11527 Athens, Greece</p>
            <p class="contact-meta">Aegean departures — Saronic Gulf, Cyclades and the Dodecanese.</p>
            <a class="inline-link" href="${r}destinations/aegean-sailing.html">Sailing the Aegean <span class="arrow" aria-hidden="true">→</span></a>
          </div>
          <div class="contact-block">
            <h2 class="foot-h">Lefkas base</h2>
            <p class="contact-line">Tsoukalades<br>31100 Lefkas Island, Greece</p>
            <p class="contact-meta">Ionian departures — Meganisi, Kalamos, Ithaca, Kefalonia and Paxos.</p>
            <a class="inline-link" href="${r}destinations/ionian-sailing.html">Sailing the Ionian <span class="arrow" aria-hidden="true">→</span></a>
          </div>
          <div class="contact-block">
            <h2 class="foot-h">Response time</h2>
            <p class="contact-meta">Enquiries are answered personally, usually within one working day. In peak season we reply to availability questions first — if your dates are close, call rather than write.</p>
          </div>
        </aside>
      </div>
    </div>
  </section>
`
};

/* =======================================================================
   PRIVACY / 404
   ======================================================================= */
const privacy = {
  slug: 'privacy.html', depth: 0, nav: '', file: 'privacy.html',
  title: 'Privacy Policy | AIyachts',
  description: 'How AIyachts collects, uses and protects the personal data you share when you enquire about a yacht charter, brokerage or yacht management in Greece.',
  crumbs: [{label:'Privacy Policy', href:'privacy.html'}],
  h1: 'Privacy Policy',
  hero: { compact: true, img: 'assets/gallery/pastel-dawn-anchorage', eyebrow:'Legal', h1:'Privacy Policy',
          lede:'What we collect, why we collect it, and what you can ask us to do about it.' },
  body: (r) => `
  <section class="prose-section">
    <div class="wrap">
      <div class="prose reveal">
        <p class="lead">AIyachts respects your privacy. This page explains what personal data we handle when you contact us or use this website, and the rights you have under the EU General Data Protection Regulation (GDPR).</p>

        <h2>Who we are</h2>
        <p>AIyachts operates yacht chartering, brokerage and yacht-management services in Greece, with bases at Alexandroupoleos 20, 11527 Athens and Tsoukalades, 31100 Lefkas Island. For any privacy question, write to <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>

        <h2>What we collect</h2>
        <ul class="tick-list">
          <li><b>Enquiry details</b> — your name, email address, telephone number, dates, crew size and anything else you choose to tell us when you contact us.</li>
          <li><b>Booking information</b> — the details required to prepare a charter contract, including skipper qualifications where a bareboat charter applies.</li>
          <li><b>Correspondence</b> — the emails and messages you exchange with us.</li>
        </ul>
        <p>This website does not use advertising cookies or third-party analytics trackers. Forms on this site open an email in your own mail application; they do not transmit your details to a third-party service.</p>

        <h2>Why we use it</h2>
        <p>To answer your enquiry, prepare and perform a charter or brokerage agreement, meet our legal obligations as a Greek charter operator, and — only where you have asked for it — send occasional news about our fleet and destinations.</p>

        <h2>How long we keep it</h2>
        <p>Enquiries that do not lead to a booking are kept only as long as they are useful to the conversation. Booking and financial records are kept for as long as Greek tax and maritime law requires.</p>

        <h2>Who we share it with</h2>
        <p>Only with the partners needed to deliver your charter — for example a provisioning supplier, transfer provider or skipper — and with authorities where the law requires it. We never sell your data.</p>

        <h2>Your rights</h2>
        <p>You may ask us for a copy of the data we hold about you, ask us to correct or delete it, object to its use, or withdraw consent to marketing at any time. Write to <a href="mailto:${SITE.email}">${SITE.email}</a> and we will respond within one month. You also have the right to complain to the Hellenic Data Protection Authority.</p>

        <h2>Changes to this policy</h2>
        <p>If this policy changes we will update this page. Please check back occasionally.</p>
      </div>
    </div>
  </section>
`
};

const notFound = {
  slug: '404.html', depth: 0, nav: '', file: '404.html', noindex: true,
  title: 'Page not found | AIyachts',
  description: 'That page is not at this address. Head back to the AIyachts fleet, the Ionian and Aegean destination guides, or the gallery of experiences.',
  h1: 'Off the chart.',
  hero: { compact: true, img: 'assets/gallery/dusk-under-the-boom', eyebrow:'Error 404', h1:'Off the chart.',
          lede:'This page is not at this address — it may have been renamed, or the link that brought you here may be out of date.' },
  body: (r) => `
  <section>
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">Try one of these</p>
        <h2 class="display">Back to the water.</h2>
      </div>
      <div class="pillar-grid reveal-stagger">
        <article class="pillar"><span class="pillar-num" aria-hidden="true">01</span><h3 class="display">The fleet</h3><p>${esc(fleetDescription)}</p><a class="inline-link" href="${r}fleet.html">Open the fleet <span class="arrow" aria-hidden="true">→</span></a></article>
        <article class="pillar"><span class="pillar-num" aria-hidden="true">02</span><h3 class="display">Destinations</h3><p>The Ionian from Lefkas, the Aegean from Athens — compared honestly.</p><a class="inline-link" href="${r}destinations.html">Where we sail <span class="arrow" aria-hidden="true">→</span></a></article>
        <article class="pillar"><span class="pillar-num" aria-hidden="true">03</span><h3 class="display">Experiences</h3><p>Photographs and films from real charters in the Ionian Sea.</p><a class="inline-link" href="${r}experiences.html">Open the gallery <span class="arrow" aria-hidden="true">→</span></a></article>
      </div>
    </div>
  </section>
`
};


/* =======================================================================
   DESTINATION GUIDES (depth 1)
   ======================================================================= */
const islandList = (items) => `<div class="island-grid reveal-stagger">
        ${items.map((i,n) => `<article class="island">
          <span class="island-num" aria-hidden="true">${String(n+1).padStart(2,'0')}</span>
          <h3 class="display">${i.name}</h3>
          <p>${i.text}</p>
        </article>`).join('\n        ')}
      </div>`;

const routeList = (rows) => `<ol class="route reveal-stagger">
        ${rows.map(x => `<li><span class="route-day">${x.day}</span><div><h3>${x.leg}</h3><p>${x.text}</p></div></li>`).join('\n        ')}
      </ol>`;

const ionian = {
  slug: 'destinations/ionian-sailing.html', depth: 1, nav: 'destinations.html', file: 'destinations/ionian-sailing.html',
  title: 'Sailing the Ionian Islands | Yacht Charter from Lefkas, Greece',
  description: 'A guide to sailing the southern Ionian from our Lefkas base — Meganisi, Kalamos, Kastos, Ithaca, Kefalonia and Paxos, with winds, distances and a seven-day route.',
  ogImage: 'assets/img/og-destinations.jpg',
  crumbs: [{label:'Destinations', href:'destinations.html'}, {label:'Sailing the Ionian', href:'destinations/ionian-sailing.html'}],
  h1: 'Sailing the Ionian',
  hero: {
    img: 'assets/gallery/emerald-bay-anchorage',
    eyebrow: 'Destination · Lefkas Base',
    h1: 'Sailing the Ionian.',
    lede: 'Green islands, short distances and a breeze that arrives after lunch and leaves before dinner. The friendliest sailing ground in Greece — and the one we would put a first-time crew on every time.'
  },
  schema: [{
    '@type':'FAQPage', '@id': abs('destinations/ionian-sailing.html') + '#faq',
    mainEntity: [
      {'@type':'Question', name:'What are the winds like in the Ionian Sea?',
       acceptedAnswer:{'@type':'Answer', text:'The Ionian runs on a thermal sea breeze. Mornings are usually calm, a north-westerly fills in around one o’clock and builds to force 4–5 through the afternoon, then fades away at sunset. It is predictable enough to plan a whole week around.'}},
      {'@type':'Question', name:'How long is a typical day’s sailing in the Ionian?',
       acceptedAnswer:{'@type':'Answer', text:'Two to four hours. Most anchorages are 10 to 20 nautical miles apart, which leaves the morning free for swimming and gets you onto a village quay in good time for the evening.'}},
      {'@type':'Question', name:'Is the Ionian suitable for families with young children?',
       acceptedAnswer:{'@type':'Answer', text:'Yes — it is the sailing area we recommend most for families. The islands shelter the water, the swims are short and shallow, the passages are brief, and there is a taverna within walking distance of almost every anchorage.'}}
    ]
  }],
  body: (r) => `
  <section class="prose-section">
    <div class="wrap">
      <div class="prose reveal">
        <p class="lead">The southern Ionian is a pocket of sea about thirty miles across, ringed by islands that shelter it from everything. Within that pocket sit Lefkada, Meganisi, Kalamos, Kastos, Ithaca and Kefalonia — close enough that you can see tomorrow's anchorage from today's, and separated by water that rarely gets rough.</p>
        <p>That geography is the whole appeal. You sail in the afternoon because you want to, not because you have to cover ground. Mornings are for swimming off the stern in water so clear you can count the links of your own anchor chain. Evenings are for a village quay, a walk of two hundred metres, and dinner at a table close enough to keep an eye on the boat.</p>
      </div>
    </div>
  </section>

  <section class="band-raised">
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">Conditions</p>
        <h2 class="display">A breeze you can set your watch by.</h2>
      </div>
      <div class="stat-grid reveal-stagger">
        <div class="stat"><span class="stat-k">Wind</span><span class="stat-v">F3–5 NW</span><p>A thermal sea breeze that fills in after midday and dies at sunset. Mornings are typically flat calm.</p></div>
        <div class="stat"><span class="stat-k">Day's run</span><span class="stat-v">10–20 nm</span><p>Two to four hours between anchorages. Nothing in the southern Ionian is far from anything else.</p></div>
        <div class="stat"><span class="stat-k">Water</span><span class="stat-v">23–27 °C</span><p>Warm from June to October, and sheltered enough to stay glassy on most mornings.</p></div>
        <div class="stat"><span class="stat-k">Season</span><span class="stat-v">May–Oct</span><p>May, June, September and early October are the quiet months — same water, half the boats.</p></div>
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">The islands</p>
        <h2 class="display">Where a week actually goes.</h2>
        <p>You will not fit all of this into seven days, and you should not try. Pick five, and go slowly.</p>
      </div>
      ${islandList([
        {name:'Meganisi', text:'Three villages and a coastline of deep, narrow inlets — Spartochori on its cliff, Vathy around the corner, and the quiet fingers of Porto Atheni and Abelike where you drop anchor and take a line ashore. The great sea cave on the west coast is worth the detour.'},
        {name:'Kalamos', text:'A steep, wooded island with one small harbour on its eastern side, a handful of tavernas and very little else. Famous among Ionian sailors for the welcome on the quay and for evenings that end early and well.'},
        {name:'Kastos', text:'The smallest inhabited island in the group: one village, one quay, a windmill on the hill and a walk to a beach you will probably have to yourself. The definition of doing nothing, properly.'},
        {name:'Ithaca', text:'Odysseus’ island, and still one of the least developed. Kioni and Frikes are two of the prettiest small harbours in Greece; Vathy sits at the head of a long, protected bay that feels like an inland lake.'},
        {name:'Kefalonia', text:'The big one. Fiskardo is the smart Venetian-coloured harbour everybody wants a berth in; Assos sits below a ruined fortress on a green isthmus; Agia Efimia is calmer and easier if you want a quiet night.'},
        {name:'Lefkada', text:'Your base island. Sivota is a deep, sheltered inlet lined with tavernas; Vasiliki catches the afternoon wind and fills with windsurfers; the canal north takes you to Preveza and the vast Amvrakikos Gulf.'},
        {name:'Paxos &amp; Antipaxos', text:'A longer hop north, and a change of character: Gaios, Lakka and Loggos are Venetian and green, and Antipaxos has water so bright it looks retouched. Best on a ten-day charter or a fast week.'},
        {name:'Palairos &amp; the mainland', text:'The eastern shore is often overlooked. Palairos and Vounaki offer easy berthing and a straightforward run home, and the mountains behind them turn gold in the last hour of light.'}
      ])}
    </div>
  </section>

  <section class="band-raised">
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">Sample itinerary</p>
        <h2 class="display">Seven days from Lefkas.</h2>
        <p>A route that works for most crews in most weeks — comfortable distances, a mix of quays and quiet anchorages, and no day that eats the whole afternoon.</p>
      </div>
      ${routeList([
        {day:'Day 1', leg:'Lefkas → Sivota', text:'A short shakedown sail down the east coast of Lefkada into a natural amphitheatre of a bay. Stern-to below the tavernas, and an early night after the flight.'},
        {day:'Day 2', leg:'Sivota → Kastos or Kalamos', text:'Across to the small islands. Anchor for lunch on the way, then take the quay at Kastos or Kalamos before the fleet arrives at five.'},
        {day:'Day 3', leg:'Kalamos → Ithaca (Kioni)', text:'A proper afternoon reach south. Kioni’s three ruined windmills mark the entrance; the harbour is tiny, so arrive in good time.'},
        {day:'Day 4', leg:'Ithaca → Fiskardo', text:'A short crossing to Kefalonia’s prettiest harbour. Swim in one of the bays on the way, and book a table before you moor.'},
        {day:'Day 5', leg:'Fiskardo → Meganisi', text:'North again to the inlets of Meganisi. Drop anchor in Abelike or Porto Atheni, take a long line to a tree, and swim until dinner.'},
        {day:'Day 6', leg:'Meganisi → Palairos or Nydri', text:'An easy last full day. Provision, eat well, and watch the sunset from the mainland side of the channel.'},
        {day:'Day 7', leg:'Back to Lefkas', text:'A one-hour run to base for the morning handover — and a coffee before the transfer to the airport.'}
      ])}
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">Good to know</p>
        <h2 class="display">Ionian questions.</h2>
      </div>
      <div class="faq reveal">
        <details><summary>What are the winds like in the Ionian Sea?</summary><p>The Ionian runs on a thermal sea breeze. Mornings are usually calm, a north-westerly fills in around one o'clock and builds to force 4–5 through the afternoon, then fades away at sunset. It is predictable enough to plan a whole week around.</p></details>
        <details><summary>How long is a typical day's sailing?</summary><p>Two to four hours. Most anchorages are 10 to 20 nautical miles apart, which leaves the morning free for swimming and gets you onto a village quay in good time for the evening.</p></details>
        <details><summary>Is the Ionian suitable for families with young children?</summary><p>Yes — it is the area we recommend most for families. The islands shelter the water, the passages are brief, the swims are shallow and warm, and there is a taverna within walking distance of almost every anchorage.</p></details>
        <details><summary>Do we have to moor stern-to every night?</summary><p>Not at all. Many crews spend half the week at anchor with a long line ashore, which is quieter, cooler and free. We show you how at the briefing.</p></details>
        <details><summary>Can we reach Paxos or Corfu in a week?</summary><p>You can, but it makes the week about passages rather than places. We usually suggest Paxos and Corfu for ten days or more — or as a one-way with a Corfu finish, if the dates allow.</p></details>
      </div>
    </div>
  </section>

  ${ctaBand(r, {
    eyebrow:'Lefkas base',
    title:'Start your week in the Ionian.',
    text:'Send us your dates and crew size and we will tell you which yachts are free, and sketch a route for the forecast you are likely to get.',
    primary:'Check Ionian availability', primaryHref:'contact.html',
    secondary:'See the fleet', secondaryHref:'fleet.html'
  })}
`
};

const aegean = {
  slug: 'destinations/aegean-sailing.html', depth: 1, nav: 'destinations.html', file: 'destinations/aegean-sailing.html',
  title: 'Sailing the Aegean & Cyclades | Yacht Charter from Athens',
  description: 'A guide to sailing the Aegean from our Athens base — the sheltered Saronic Gulf, the Cyclades, the meltemi wind, distances and two sample routes.',
  ogImage: 'assets/img/og-destinations.jpg',
  crumbs: [{label:'Destinations', href:'destinations.html'}, {label:'Sailing the Aegean', href:'destinations/aegean-sailing.html'}],
  h1: 'Sailing the Aegean',
  hero: {
    img: 'assets/gallery/sunset-at-anchor',
    eyebrow: 'Destination · Athens Base',
    h1: 'Sailing the Aegean.',
    lede: 'Bare rock, white villages and a hard blue sea. The Aegean asks more of a crew than the Ionian — and gives back the Greece everyone pictures.'
  },
  schema: [{
    '@type':'FAQPage', '@id': abs('destinations/aegean-sailing.html') + '#faq',
    mainEntity: [
      {'@type':'Question', name:'What is the meltemi and when does it blow?',
       acceptedAnswer:{'@type':'Answer', text:'The meltemi is a dry northerly wind that dominates the Aegean from roughly mid-June to mid-September. It can blow force 5–7 for several days at a time, sometimes more between the islands. It is a fine sailing wind for an experienced crew, and the reason we suggest the Saronic Gulf to everyone else in high summer.'}},
      {'@type':'Question', name:'Can you sail the Cyclades in one week?',
       acceptedAnswer:{'@type':'Answer', text:'You can reach the western Cyclades — Kea, Kythnos, Serifos and Sifnos — comfortably in a week from Athens. A full circuit taking in Paros, Naxos and Mykonos is better suited to ten days or more, because the meltemi can pin you in a harbour for a day.'}},
      {'@type':'Question', name:'Which Aegean route suits a first charter?',
       acceptedAnswer:{'@type':'Answer', text:'The Saronic Gulf. Aegina, Poros, Hydra, Ermioni and Spetses are close together, sheltered from the worst of the meltemi, and full of harbours — a week there is relaxed even in August.'}}
    ]
  }],
  body: (r) => `
  <section class="prose-section">
    <div class="wrap">
      <div class="prose reveal">
        <p class="lead">Leaving Athens, you have a choice to make within the first two hours. Turn south-west into the Saronic Gulf and you get a gentle, harbour-rich week among pine-covered islands an hour apart. Turn south-east and you are pointed at the Cyclades — bare, bright, windy and unforgettable.</p>
        <p>Both start from our Athens base. Both are sailed in deeper blue water than the Ionian, with longer passages, stronger wind and villages that look like the photographs. The Aegean is where you go when the sailing itself is part of the point.</p>
      </div>
    </div>
  </section>

  <section class="band-raised">
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">Conditions</p>
        <h2 class="display">The meltemi decides.</h2>
      </div>
      <div class="stat-grid reveal-stagger">
        <div class="stat"><span class="stat-k">Wind</span><span class="stat-v">F4–7 N</span><p>The meltemi blows from the north through high summer, often for days. Shoulder months are lighter and more variable.</p></div>
        <div class="stat"><span class="stat-k">Day's run</span><span class="stat-v">25–40 nm</span><p>Longer legs between island groups. Plan for real sailing days, and start early when it is blowing.</p></div>
        <div class="stat"><span class="stat-k">Saronic</span><span class="stat-v">10–20 nm</span><p>The sheltered alternative — short hops between Aegina, Poros, Hydra and Spetses.</p></div>
        <div class="stat"><span class="stat-k">Season</span><span class="stat-v">May–Oct</span><p>May, June, September and October are the kindest. July and August are the windiest and the busiest.</p></div>
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">The islands</p>
        <h2 class="display">Two very different weeks.</h2>
      </div>
      ${islandList([
        {name:'Aegina', text:'An hour and a half from base, and the easiest first night of any Aegean charter. Pistachio groves, a working town harbour, and the fishing village of Perdika on the south-west corner for a quieter evening.'},
        {name:'Poros', text:'Separated from the mainland by a channel a few hundred metres wide, with a clock tower above tiers of terracotta roofs. Sheltered whatever the wind does, and a favourite for a relaxed second night.'},
        {name:'Hydra', text:'No cars, no scooters — donkeys and stone. A perfect stone amphitheatre of a harbour that fills early in summer, so arrive at lunchtime or anchor outside and take the tender in.'},
        {name:'Spetses &amp; Ermioni', text:'The southern end of the Saronic. Spetses has grand old captains’ houses and horse-drawn carriages; Ermioni, opposite, is a quiet mainland peninsula with tavernas on both shores.'},
        {name:'Kea &amp; Kythnos', text:'The gateway to the Cyclades. Vourkari on Kea is a smart, sheltered inlet; Kythnos hides one of the best anchorages in Greece at Kolona, a sandbar with sea on both sides.'},
        {name:'Serifos &amp; Sifnos', text:'Serifos rises to a white village stacked on a cone of rock above the port. Sifnos, its neighbour, is the food island of the Cyclades — and Vathi bay on its south coast is a fine, protected night stop.'},
        {name:'Milos', text:'Volcanic and strange, with cliffs the colour of bone at Kleftiko and coloured fishing garages cut into the rock. Further south, and worth the extra day it costs you.'},
        {name:'Paros, Naxos &amp; Mykonos', text:'The heart of the Cyclades: Naoussa’s little fishing port, Naxos’ marble gate above the harbour, the ancient site of Delos, and Mykonos when you want one loud night in the middle of a quiet week.'}
      ])}
    </div>
  </section>

  <section class="band-raised">
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">Sample itinerary</p>
        <h2 class="display">Seven days in the Saronic.</h2>
        <p>The route we recommend to crews sailing the Aegean for the first time, or sailing in July and August.</p>
      </div>
      ${routeList([
        {day:'Day 1', leg:'Athens → Aegina', text:'A short first leg out of the Saronic. Perdika for a quiet quay and grilled fish, or Aegina town if you want life around you.'},
        {day:'Day 2', leg:'Aegina → Poros', text:'Down the coast to the narrow channel at Poros. Anchor in Russian Bay for a swim on the way in.'},
        {day:'Day 3', leg:'Poros → Hydra', text:'A proper sail across to the most photogenic harbour in Greece. Arrive early — the quay is small and the town does not grow.'},
        {day:'Day 4', leg:'Hydra → Spetses', text:'Further south-west, with a lunch anchorage in Dokos or the bays of the Argolic shore on the way.'},
        {day:'Day 5', leg:'Spetses → Ermioni', text:'A short hop to the mainland peninsula, with tavernas on both sides of the isthmus and a sunset walk through the pines.'},
        {day:'Day 6', leg:'Ermioni → Poros or Epidaurus', text:'North again, with a possible detour ashore to the ancient theatre at Epidaurus if the timing works.'},
        {day:'Day 7', leg:'Back to Athens', text:'An early start with the land breeze and a straightforward run back to base for the morning handover.'}
      ])}
      <p class="section-foot"><b>Ten days or more?</b> Swap the Saronic for the western Cyclades — Kea, Kythnos, Serifos, Sifnos and back — or push on to Paros and Naxos and let the meltemi push you home.</p>
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">Good to know</p>
        <h2 class="display">Aegean questions.</h2>
      </div>
      <div class="faq reveal">
        <details><summary>What is the meltemi and when does it blow?</summary><p>The meltemi is a dry northerly wind that dominates the Aegean from roughly mid-June to mid-September. It can blow force 5–7 for several days at a time, sometimes more between the islands. It is a fine sailing wind for an experienced crew, and the reason we suggest the Saronic Gulf to everyone else in high summer.</p></details>
        <details><summary>Can you sail the Cyclades in one week?</summary><p>You can reach the western Cyclades — Kea, Kythnos, Serifos and Sifnos — comfortably in a week from Athens. A full circuit taking in Paros, Naxos and Mykonos is better suited to ten days or more, because the meltemi can pin you in a harbour for a day.</p></details>
        <details><summary>Which route suits a first Aegean charter?</summary><p>The Saronic Gulf. Aegina, Poros, Hydra, Ermioni and Spetses are close together, sheltered from the worst of the meltemi, and full of harbours — a week there is relaxed even in August.</p></details>
        <details><summary>Is a catamaran a good idea in the Aegean?</summary><p>For comfort at anchor, yes — and the shallow draft opens up bays a monohull cannot use. In a strong meltemi a catamaran is more affected by windage when berthing, so we would usually put a skipper aboard for a first Aegean week.</p></details>
      </div>
    </div>
  </section>

  ${ctaBand(r, {
    eyebrow:'Athens base',
    title:'Sail out of Athens.',
    text:'Tell us your dates, your crew and how much wind you actually want. We will match you with the right yacht and the right route.',
    primary:'Check Aegean availability', primaryHref:'contact.html',
    secondary:'Compare both seas', secondaryHref:'destinations.html'
  })}
`
};

/* =======================================================================
   YACHT PAGES (depth 1, generated)
   ======================================================================= */
const yachtPage = (y) => {
  /* three companions: same type first, then topped up from the rest of the fleet */
  const sameType = FLEET.filter(f => f.slug !== y.slug && f.type === y.type);
  const rest = FLEET.filter(f => f.slug !== y.slug && f.type !== y.type)
                    .sort((a,b) => Math.abs(a.guests - y.guests) - Math.abs(b.guests - y.guests));
  const more = sameType.concat(rest).slice(0,3);
  const specifications = [
    {label:'Builder', value:y.builder},
    {label:'Model year', value:y.year},
    {label:'Type', value:y.type},
    {label:'Cabins', value:y.cabins},
    {label:'Guests', value:y.guests},
    {label:'Berths', value:y.berths},
    {label:'Heads', value:y.heads},
    {label:'Charter', value:y.charterModes.join(' or ')},
    {label:'Bases', value:y.bases.join(' · ')},
    ...y.specs
  ].filter(spec => spec.value !== '');
  return {
    slug: `fleet/${y.slug}.html`, depth: 1, nav: 'fleet.html', file: `fleet/${y.slug}.html`,
    title: `${y.name} Yacht Charter Greece | AIyachts`,
    description: `Charter the ${y.name} (${y.year}) in Greece — ${y.cabins} cabins, ${y.guests} guests, ${y.heads} ${y.heads>1?'heads':'head'}.${y.charterModes.length ? ` ${y.charterModes.join(' or ')}.` : ''}${y.bases.length ? ` Departing from ${y.bases.join(' or ')}.` : ''}`,
    ogImage: y.imageUrl,
    ogAlt: y.imageAlt,
    ogType: 'product',
    crumbs: [{label:'Fleet', href:'fleet.html'}, {label:y.name, href:`fleet/${y.slug}.html`}],
    h1: y.name,
    schema: [{
      '@type':'Product', '@id': abs(`fleet/${y.slug}.html`) + '#yacht',
      name: y.name, brand: {'@type':'Brand', name: y.builder},
      category: y.type === 'Catamaran' ? 'Catamaran charter' : 'Sailing yacht charter',
      image: [y.imageUrl, ...y.gallery.map(photo => photo.url)],
      description: y.blurb,
      productionDate: y.year,
      additionalProperty: specifications.map(spec => ({'@type':'PropertyValue', name:spec.label, value:spec.value}))
    }],
    body: (r) => `
  <section class="yacht-hero">
    <div class="wrap">
      <div class="yacht-hero-grid">
        <div class="yacht-hero-media reveal">
          <img src="${esc(y.imageUrl)}" alt="${esc(y.imageAlt)}" width="1280" height="760" fetchpriority="high" decoding="async">
          <span class="yacht-flag big">${esc(y.type)}</span>
        </div>
        <div class="yacht-hero-copy reveal">
          <p class="eyebrow">${esc(y.builder)} · ${esc(y.year)}</p>
          <h1 class="display">${esc(y.name)}</h1>
          <p class="yacht-tagline">${esc(y.tag)}</p>
          <p class="yacht-blurb">${esc(y.blurb)}</p>
          <dl class="spec-strip">
            <div><dt>Cabins</dt><dd>${y.cabins}</dd></div>
            <div><dt>Guests</dt><dd>${y.guests}</dd></div>
            <div><dt>Berths</dt><dd>${y.berths}</dd></div>
            <div><dt>Heads</dt><dd>${y.heads}</dd></div>
          </dl>
          <div class="yacht-actions">
            <a class="btn" href="${r}contact.html?yacht=${encodeURIComponent(y.name)}">Enquire about this yacht <span class="arrow" aria-hidden="true">→</span></a>
            <a class="inline-link" href="${r}fleet.html">Back to the fleet</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="band-raised">
    <div class="wrap">
      <div class="two-col reveal">
        ${y.highlights.length ? `<div>
          <p class="eyebrow">Why this one</p>
          <h2 class="display">What she is good at.</h2>
          <ul class="tick-list">
            ${y.highlights.map(h => `<li>${esc(h)}</li>`).join('\n            ')}
          </ul>
        </div>` : ''}
        <div>
          <p class="eyebrow">Specification</p>
          <h2 class="display">The numbers.</h2>
          <table class="spec-table">
            <caption class="sr-only">Specification of the ${esc(y.name)}</caption>
            <tbody>
              ${specifications.map(spec => `<tr><th scope="row">${esc(spec.label)}</th><td>${esc(spec.value)}</td></tr>`).join('\n              ')}
            </tbody>
          </table>
          <p class="spec-note">Full technical details, sail wardrobe, equipment list and pricing for your dates are sent with every quotation.</p>
        </div>
      </div>
    </div>
  </section>

  ${y.gallery.length ? `<section>
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">On board</p>
        <h2 class="display">Explore ${esc(y.name)}.</h2>
      </div>
      <div class="fleet-grid full reveal-stagger">
        ${y.gallery.map(photo => `<div class="yacht-hero-media">
          <a class="yacht-link" href="${esc(photo.url)}" aria-label="View photo: ${esc(photo.alt)}">
            <img src="${esc(photo.url)}" alt="${esc(photo.alt)}" width="1280" height="760" loading="lazy" decoding="async">
          </a>
        </div>`).join('\n        ')}
      </div>
    </div>
  </section>` : ''}

  ${more.length ? `<section>
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">Also worth seeing</p>
        <h2 class="display">Other yachts in the fleet.</h2>
      </div>
      <div class="fleet-grid reveal-stagger">
        ${fleetCards(more, 1)}
      </div>
    </div>
  </section>` : ''}

  ${ctaBand(r, {
    eyebrow:'Availability',
    title:`Is the ${esc(y.name)} free on your dates?`,
    text:'Send us the week you have in mind and the size of your crew. We will confirm availability, price it honestly, and suggest an alternative if this one is taken.',
    primary:'Enquire now', primaryHref:'contact.html',
    secondary:'See all yachts', secondaryHref:'fleet.html'
  })}
`
  };
};

export const ROOT_PAGES = [home, about, destinations, fleet, experiences, services, brokerage, contact, privacy, notFound];
export const SUB_PAGES = [ionian, aegean, ...FLEET.map(yachtPage)];
export const ALL_PAGES = [...ROOT_PAGES, ...SUB_PAGES];
