<?php
/**
 * Front page: shared helpers, the original content, and the card renderers.
 *
 * HOW THE FALLBACKS WORK
 *
 * Every repeating region of the home page is drawn by one renderer function.
 * front-page.php calls it twice:
 *
 *     if ( aiy_has_rows( 'fleet_yachts' ) ) :
 *         while ( have_rows( 'fleet_yachts' ) ) : the_row();
 *             aiy_render_yacht_card( array( 'title' => get_sub_field( 'title' ), … ) );
 *         endwhile;
 *     else :
 *         foreach ( aiy_default_fleet_yachts() as $card ) :
 *             aiy_render_yacht_card( $card );
 *         endforeach;
 *     endif;
 *
 * Both branches feed the same renderer, so an empty repeater reproduces the
 * static page exactly — not because two copies of the markup happen to agree
 * today, but because there is only one copy. A design change to a yacht card
 * cannot leave the fallback behind, and the fallback path is exercised by the
 * same code the live path uses.
 *
 * Renderers take a plain array. The ACF branch assembles it from
 * get_sub_field(); the fallback branch passes one of the aiy_default_*()
 * arrays below, which hold the original wording, images and links verbatim.
 *
 * @package AIyachts
 */

defined( 'ABSPATH' ) || exit;

/* -------------------------------------------------------------------------
 * 1. Shared helpers
 * ---------------------------------------------------------------------- */

/**
 * Echo an <img> for either an ACF image or a bundled theme asset.
 *
 * ACF image fields in this theme return arrays, so an uploaded image arrives
 * with an attachment ID and is rendered through wp_get_attachment_image() —
 * that is what produces the srcset and sizes attributes, and it reads the alt
 * text from the media library, which is where a client is told to set it.
 *
 * A bundled asset has no attachment behind it, so it falls through to a plain
 * tag with the dimensions recorded in the defaults.
 *
 * @param mixed  $image Image: an ACF array, an attachment ID, a theme-relative
 *                      path, or an array of src/alt/width/height.
 * @param string $size  Registered image size used for uploads.
 * @param array  $attrs Extra attributes.
 */
function aiy_render_image( $image, $size = 'large', $attrs = array() ) {
	$attrs = wp_parse_args( $attrs, array( 'loading' => 'lazy', 'decoding' => 'async' ) );

	// An upload: let WordPress build the responsive markup.
	$attachment_id = 0;
	if ( is_array( $image ) && ! empty( $image['ID'] ) ) {
		$attachment_id = (int) $image['ID'];
		if ( ! empty( $image['alt'] ) ) {
			$attrs['alt'] = $image['alt'];
		}
	} elseif ( is_numeric( $image ) ) {
		$attachment_id = (int) $image;
	}

	if ( $attachment_id ) {
		echo wp_get_attachment_image( $attachment_id, $size, false, $attrs ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- core escapes.
		return;
	}

	// A bundled theme asset.
	if ( is_string( $image ) && '' !== $image ) {
		$image = array( 'src' => $image );
	}

	if ( ! is_array( $image ) || empty( $image['src'] ) ) {
		return;
	}

	$src = $image['src'];
	if ( 0 !== strpos( $src, 'http' ) && 0 !== strpos( $src, '//' ) ) {
		$src = aiy_asset( $src );
	}

	$attrs['src'] = $src;
	$attrs['alt'] = isset( $attrs['alt'] ) ? $attrs['alt'] : ( isset( $image['alt'] ) ? $image['alt'] : '' );

	if ( ! empty( $image['width'] ) ) {
		$attrs['width'] = $image['width'];
	}
	if ( ! empty( $image['height'] ) ) {
		$attrs['height'] = $image['height'];
	}

	$out = '';
	foreach ( $attrs as $name => $value ) {
		if ( null === $value || false === $value ) {
			continue;
		}
		$value = ( 'src' === $name ) ? esc_url( $value ) : esc_attr( $value );
		$out  .= ' ' . $name . '="' . $value . '"';
	}

	echo '<img' . $out . '>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- assembled and escaped above.
}

/**
 * Normalise an ACF link field into a url / label / target triple.
 *
 * Accepts what ACF's Link field returns (an array), what its Page Link field
 * returns (a URL string), or nothing at all, and always hands back something
 * a template can print without checking.
 *
 * @param mixed  $link           ACF link array, URL string, or null.
 * @param string $fallback_url   URL used when the field is empty.
 * @param string $fallback_label Label used when the field carries none.
 * @return array{url:string,label:string,target:string}
 */
function aiy_link_parts( $link, $fallback_url = '', $fallback_label = '' ) {
	$url    = '';
	$label  = '';
	$target = '';

	if ( is_array( $link ) ) {
		$url    = isset( $link['url'] ) ? $link['url'] : '';
		$label  = isset( $link['title'] ) ? $link['title'] : '';
		$target = isset( $link['target'] ) ? $link['target'] : '';
	} elseif ( is_string( $link ) ) {
		$url = $link;
	}

	return array(
		'url'    => '' !== $url ? $url : $fallback_url,
		'label'  => '' !== $label ? $label : $fallback_label,
		'target' => $target,
	);
}

/**
 * Print the target/rel pair for a link that may open in a new tab.
 *
 * @param string $target Link target.
 */
function aiy_target_attr( $target ) {
	if ( '_blank' !== $target ) {
		return;
	}

	echo ' target="_blank" rel="noopener"';
}


/* -------------------------------------------------------------------------
 * 2. The original content
 *
 * Verbatim from the static index.html. Used whenever a repeater is empty, so
 * the home page is complete and correct the moment the theme is activated.
 * ---------------------------------------------------------------------- */

/**
 * The headline of the static hero, one entry per line.
 *
 * @return array
 */
function aiy_default_hero_lines() {
	return array(
		array(
			'text' => 'Set sail.',
		),
		array(
			'text' => 'Live <em>unforgettable</em>.',
		),
	);
}

/**
 * The choices in the booking bar's destination dropdown.
 *
 * @return array
 */
function aiy_default_booking_destinations() {
	return array(
		array(
			'label' => 'Either sea',
		),
		array(
			'label' => 'Ionian — Lefkas base',
		),
		array(
			'label' => 'Aegean — Athens base',
		),
	);
}

/**
 * The two cards beside the map of Greece.
 *
 * @return array
 */
function aiy_default_sea_cards() {
	return array(
		array(
			'sea'       => 'ionian',
			'eyebrow'   => 'Destination · Ionian Sea',
			'title'     => 'Lefkas Base',
			'text'      => 'Calm waters, gentle afternoon winds and short, easy distances — ideal for first-time sailors and families. Emerald bays, sheltered anchorages and the quiet charm of Meganisi, Kalamos and Paxos.',
			'cta_label' => 'Sail the Ionian',
			'slug'      => 'destinations/ionian-sailing',
		),
		array(
			'sea'       => 'aegean',
			'eyebrow'   => 'Destination · Aegean Sea',
			'title'     => 'Athens Base',
			'text'      => 'Bright white villages, dramatic coastlines and stronger winds for confident sailors. From the Saronic Gulf to the iconic Cyclades — a route through Greece\'s most recognisable imagery.',
			'cta_label' => 'Sail the Aegean',
			'slug'      => 'destinations/aegean-sailing',
		),
	);
}

/**
 * The six yachts featured on the static home page.
 *
 * @return array
 */
function aiy_default_fleet_yachts() {
	return array(
		array(
			'image'     => array(
				'src'    => 'assets/fleet/bavaria-40-cruiser.jpg',
				'alt'    => 'Bavaria 40 Cruiser — 3 cabins sailing yacht for charter in Greece',
				'width'  => 640,
				'height' => 380,
			),
			'flag'      => 'Monohull',
			'meta'      => '3 Cabins · 2011',
			'title'     => 'Bavaria 40 Cruiser',
			'specs'     => array(
				'7 guests',
				'7 berths',
				'2 heads',
			),
			'slug'      => 'fleet/bavaria-40-cruiser',
			'cta_label' => 'View yacht',
		),
		array(
			'image'     => array(
				'src'    => 'assets/fleet/jeanneau-sun-odyssey-469.jpg',
				'alt'    => 'Jeanneau Sun Odyssey 469 — 4 cabins sailing yacht for charter in Greece',
				'width'  => 640,
				'height' => 380,
			),
			'flag'      => 'Monohull',
			'meta'      => '4 Cabins · 2014',
			'title'     => 'Jeanneau Sun Odyssey 469',
			'specs'     => array(
				'9 guests',
				'9 berths',
				'4 heads',
			),
			'slug'      => 'fleet/jeanneau-sun-odyssey-469',
			'cta_label' => 'View yacht',
		),
		array(
			'image'     => array(
				'src'    => 'assets/fleet/beneteau-oceanis-50-family.jpg',
				'alt'    => 'Beneteau Oceanis 50 Family — 5 cabins sailing yacht for charter in Greece',
				'width'  => 640,
				'height' => 380,
			),
			'flag'      => 'Monohull',
			'meta'      => '5 Cabins · 2010',
			'title'     => 'Beneteau Oceanis 50 Family',
			'specs'     => array(
				'12 guests',
				'12 berths',
				'3 heads',
			),
			'slug'      => 'fleet/beneteau-oceanis-50-family',
			'cta_label' => 'View yacht',
		),
		array(
			'image'     => array(
				'src'    => 'assets/fleet/bavaria-51-1.jpg',
				'alt'    => 'Bavaria 51.1 — 5 cabins sailing yacht for charter in Greece',
				'width'  => 640,
				'height' => 380,
			),
			'flag'      => 'Monohull',
			'meta'      => '5 Cabins · 2018',
			'title'     => 'Bavaria 51.1',
			'specs'     => array(
				'12 guests',
				'12 berths',
				'3 heads',
			),
			'slug'      => 'fleet/bavaria-51-1',
			'cta_label' => 'View yacht',
		),
		array(
			'image'     => array(
				'src'    => 'assets/fleet/lagoon-40.jpg',
				'alt'    => 'Lagoon 40 — catamaran sailing yacht for charter in Greece',
				'width'  => 640,
				'height' => 380,
			),
			'flag'      => 'Catamaran',
			'meta'      => 'Catamaran · 2022',
			'title'     => 'Lagoon 40',
			'specs'     => array(
				'10 guests',
				'10 berths',
				'4 heads',
			),
			'slug'      => 'fleet/lagoon-40',
			'cta_label' => 'View yacht',
		),
		array(
			'image'     => array(
				'src'    => 'assets/fleet/lagoon-450-f.jpg',
				'alt'    => 'Lagoon 450 F — catamaran sailing yacht for charter in Greece',
				'width'  => 640,
				'height' => 380,
			),
			'flag'      => 'Catamaran',
			'meta'      => 'Catamaran · 2019',
			'title'     => 'Lagoon 450 F',
			'specs'     => array(
				'12 guests',
				'12 berths',
				'4 heads',
			),
			'slug'      => 'fleet/lagoon-450-f',
			'cta_label' => 'View yacht',
		),
	);
}

/**
 * The six tiles of the gallery teaser, with their hand-made WebP derivatives
 * and inline blur placeholders. Uploads through ACF have neither, so the
 * renderer switches markup accordingly.
 *
 * @return array
 */
function aiy_default_gallery_items() {
	return array(
		array(
			'title'     => 'Anchored in an olive-framed cove',
			'alt'       => 'Sailing yacht at anchor in a turquoise Ionian cove framed by olive trees, on an AIyachts bareboat charter in Greece',
			'category'  => 'coves',
			'col_span'  => 2,
			'row_span'  => 3,
			'lqip'      => 'data:image/webp;base64,UklGRnwAAABXRUJQVlA4IHAAAABwBACdASoUAAsAPt1apkyopSOiMAgBEBuJbACdL1yB7//XA2J9M0pozvUVgAD+ikRdrf263zBtXRaM75sguPDjVMYkSJ4EOG9HLjeEXdMjRgY10azMM1Ggj0r6aZrELN2G8ZZxKJW0/vz3/GYObIAA',
			'image'     => array(
				'src'    => 'assets/gallery/olive-framed-cove-800.jpg',
				'alt'    => 'Sailing yacht at anchor in a turquoise Ionian cove framed by olive trees, on an AIyachts bareboat charter in Greece',
				'width'  => 1600,
				'height' => 900,
			),
			'webp_800'  => 'assets/gallery/olive-framed-cove-800.webp',
			'webp_1600' => 'assets/gallery/olive-framed-cove-1600.webp',
			'full'      => 'assets/gallery/olive-framed-cove-1600.jpg',
		),
		array(
			'title'     => 'Into the sea cave',
			'alt'       => 'View from the bow of a charter yacht towards a limestone sea cave over bright turquoise water in the Ionian',
			'category'  => 'coves',
			'col_span'  => 2,
			'row_span'  => 3,
			'lqip'      => 'data:image/webp;base64,UklGRpAAAABXRUJQVlA4IIQAAACwAwCdASoUAA8APt1apkyopSOiMAgBEBuJaACAAAc/9qvPuhmCAAD3NsvrvnSSWbSSGB5W0SdrMQmK9E0fRecaoupkPhSCZXqV8aIhILQ/wUkOgeaSPwUNQBw/whOWc+Yeqb3J9240qF0jvAUgQYhcRLSkGKyCHtQgIKbeHkgUp14AAAA=',
			'image'     => array(
				'src'    => 'assets/gallery/sea-cave-from-the-bow-800.jpg',
				'alt'    => 'View from the bow of a charter yacht towards a limestone sea cave over bright turquoise water in the Ionian',
				'width'  => 1600,
				'height' => 1200,
			),
			'webp_800'  => 'assets/gallery/sea-cave-from-the-bow-800.webp',
			'webp_1600' => 'assets/gallery/sea-cave-from-the-bow-1600.webp',
			'full'      => 'assets/gallery/sea-cave-from-the-bow-1600.jpg',
		),
		array(
			'title'     => 'Pastel dawn',
			'alt'       => 'Pastel pink and blue dawn over yachts anchored in a calm Ionian bay',
			'category'  => 'golden',
			'col_span'  => 2,
			'row_span'  => 3,
			'lqip'      => 'data:image/webp;base64,UklGRn4AAABXRUJQVlA4IHIAAADwBACdASoUABQAPt1UqUyopCQisBgMARAbiWUAvzgQ1St+0ya05Fb1KDhEJ9ykzJAA/uc1HeVxnTG572zTQWeRYP/caguCrs3FTtZksm5cxzrSG6LmllID5RQlkxgiwF3hQNtKgtVrzhie3K6TOZ/AAAA=',
			'image'     => array(
				'src'    => 'assets/gallery/pastel-dawn-anchorage-800.jpg',
				'alt'    => 'Pastel pink and blue dawn over yachts anchored in a calm Ionian bay',
				'width'  => 1528,
				'height' => 1528,
			),
			'webp_800'  => 'assets/gallery/pastel-dawn-anchorage-800.webp',
			'webp_1600' => 'assets/gallery/pastel-dawn-anchorage-1600.webp',
			'full'      => 'assets/gallery/pastel-dawn-anchorage-1600.jpg',
		),
		array(
			'title'     => 'The helm, mid-morning',
			'alt'       => 'Skipper at the wheel of a charter yacht under the bimini on a bright morning in Greece',
			'category'  => 'onboard',
			'col_span'  => 2,
			'row_span'  => 3,
			'lqip'      => 'data:image/webp;base64,UklGRowAAABXRUJQVlA4IIAAAAAwBACdASoUAA8APt1apkyopSOiMAgBEBuJaACdMoRwABxCw+mV+ImMrWAA3//GOaJs9aD4q9XYX1K2p6s7NB1+T6iQzSFnlQXy6Ogzm7Tpu1twEz94w8ZtHvexeTg3LZdgahg5fpgIElBHAjfzd+VNOW+AOnP0DAD4PvHo0UAAAA==',
			'image'     => array(
				'src'    => 'assets/gallery/skipper-at-the-helm-800.jpg',
				'alt'    => 'Skipper at the wheel of a charter yacht under the bimini on a bright morning in Greece',
				'width'  => 1600,
				'height' => 1200,
			),
			'webp_800'  => 'assets/gallery/skipper-at-the-helm-800.webp',
			'webp_1600' => 'assets/gallery/skipper-at-the-helm-1600.webp',
			'full'      => 'assets/gallery/skipper-at-the-helm-1600.jpg',
		),
		array(
			'title'     => 'Blue hour on the quay',
			'alt'       => 'Greek island harbour at blue hour with lit tavernas along the quay and moored boats',
			'category'  => 'islands',
			'col_span'  => 2,
			'row_span'  => 3,
			'lqip'      => 'data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAADQAwCdASoUAA8APt1cpkyopSOiMAgBEBuJYwCdACHfrHoMglg5OvAA/vKob83XQh8Hwk3wlhJPkgkh5BBKLpB2yLx0koHMNGn3bXwDDqZuxMN7xRSP1e/aeUBaf9HxgocUtpacxXvqDQv4AAA=',
			'image'     => array(
				'src'    => 'assets/gallery/harbour-blue-hour-800.jpg',
				'alt'    => 'Greek island harbour at blue hour with lit tavernas along the quay and moored boats',
				'width'  => 1600,
				'height' => 1200,
			),
			'webp_800'  => 'assets/gallery/harbour-blue-hour-800.webp',
			'webp_1600' => 'assets/gallery/harbour-blue-hour-1600.webp',
			'full'      => 'assets/gallery/harbour-blue-hour-1600.jpg',
		),
		array(
			'title'     => 'Everyone in the cave',
			'alt'       => 'Group of AIyachts charter guests together in a boat inside a blue-lit Ionian sea cave',
			'category'  => 'onboard',
			'col_span'  => 2,
			'row_span'  => 3,
			'lqip'      => 'data:image/webp;base64,UklGRrgAAABXRUJQVlA4IKwAAABwBACdASoUAA8APt1apkyopSOiMAgBEBuJaAC1GoAC/BZa7oZJBeds4svSAAD2NrKDYGGY+oRTyOXOWOwZ5X/1FksOg7MzNrs95lMJSCJFdtO6Ukdnjr+0gr2MvHrqK/GT6b20Q6iwC3XxY9D1yFUcb4pKsyuyAOmc2pU64daY5JZNtkSayYCNCaRSq13mUyVzqyVHV9KtloM84UQeagxhkkLKOjIIUwHAAAAA',
			'image'     => array(
				'src'    => 'assets/gallery/sea-cave-swim-stop-800.jpg',
				'alt'    => 'Group of AIyachts charter guests together in a boat inside a blue-lit Ionian sea cave',
				'width'  => 1600,
				'height' => 1200,
			),
			'webp_800'  => 'assets/gallery/sea-cave-swim-stop-800.webp',
			'webp_1600' => 'assets/gallery/sea-cave-swim-stop-1600.webp',
			'full'      => 'assets/gallery/sea-cave-swim-stop-1600.jpg',
		),
	);
}

/**
 * The three guest-service cards.
 *
 * @return array
 */
function aiy_default_services() {
	return array(
		array(
			'icon'  => 'concierge',
			'title' => 'Concierge',
			'text'  => 'Reservations, local insight and seamless logistics — curated so your sailing experience feels effortless and personal.',
		),
		array(
			'icon'  => 'provisions',
			'title' => 'Provisions',
			'text'  => 'Fresh, thoughtful provisions inspired by local flavours, tailored to your preferences before you step aboard.',
		),
		array(
			'icon'  => 'crew',
			'title' => 'Crew offers',
			'text'  => 'Trusted skippers and hostesses bringing skill and hospitality — elevating your charter into something memorable.',
		),
	);
}

/**
 * The two brokerage panels.
 *
 * @return array
 */
function aiy_default_brokerage_panels() {
	return array(
		array(
			'eyebrow'   => 'B2C · Private buyers & sellers',
			'title'     => 'Investment & Brokerage',
			'text'      => 'A curated selection of well-maintained sailing and motor yachts, handpicked through trusted owner relationships.',
			'list'      => array(
				array(
					'label' => 'Yachts for sale',
					'note'  => 'Curated listings',
				),
				array(
					'label' => 'Buyer support',
					'note'  => 'Selection to paperwork',
				),
				array(
					'label' => 'Seller representation',
					'note'  => 'Listing to close',
				),
			),
			'cta_label' => 'Explore brokerage',
			'cta_slug'  => 'brokerage',
		),
		array(
			'eyebrow'   => 'B2B · Charter companies & owners',
			'title'     => 'Yacht Management',
			'text'      => 'Year-round support for owners — from berthing and on-season operations to winterisation and deliveries.',
			'list'      => array(
				array(
					'label' => 'Pontoon berthing',
					'note'  => 'Private, managed',
				),
				array(
					'label' => 'Operational support',
					'note'  => 'On-season',
				),
				array(
					'label' => 'Yacht deliveries',
					'note'  => 'Greece & Mediterranean',
				),
				array(
					'label' => 'Winterisation',
					'note'  => 'Off-season care',
				),
			),
			'cta_label' => 'Partner with us',
			'cta_slug'  => 'brokerage',
		),
	);
}

/**
 * Inner markup of the three line-drawn service icons, keyed by the value of
 * the icon select field. Theme constants, not user input.
 *
 * @return array
 */
function aiy_service_icon_paths() {
	return array(
		'concierge'  => '<circle cx="20" cy="14" r="7"/><path d="M8 34c0-8 5-13 12-13s12 5 12 13"/>',
		'provisions' => '<path d="M12 8h16l-2 24H14L12 8Z"/><path d="M12 16h16"/>',
		'crew'       => '<circle cx="14" cy="13" r="5"/><circle cx="27" cy="13" r="5"/><path d="M5 34c0-7 4-11 9-11s9 4 9 11M18 34c0-7 4-11 9-11s9 4 9 11"/>',
	);
}


/* -------------------------------------------------------------------------
 * 3. Card renderers
 *
 * One per repeating element. Both the ACF branch and the fallback branch in
 * front-page.php call these, which is what guarantees the two render alike.
 * ---------------------------------------------------------------------- */

/**
 * One of the two cards beside the map of Greece.
 *
 * The `sea` value is what ties the card to its half of the map — site.js
 * matches `data-sea` on the card to `data-sea` on the map zones — so it is
 * printed as a class and a data attribute, exactly as the static markup did.
 *
 * @param array $card Keys: sea, eyebrow, title, text, cta_label, url|slug.
 */
function aiy_render_sea_card( $card ) {
	$sea = ! empty( $card['sea'] ) ? $card['sea'] : 'ionian';
	$url = ! empty( $card['url'] ) ? $card['url'] : ( ! empty( $card['slug'] ) ? aiy_url( $card['slug'] ) : '' );
	?>
	<a class="sea-card <?php echo esc_attr( $sea ); ?>" data-sea="<?php echo esc_attr( $sea ); ?>" href="<?php echo esc_url( $url ); ?>">
		<?php if ( ! empty( $card['eyebrow'] ) ) : ?>
			<p class="eyebrow"><?php echo esc_html( $card['eyebrow'] ); ?></p>
		<?php endif; ?>

		<?php if ( ! empty( $card['title'] ) ) : ?>
			<h3 class="display"><?php echo esc_html( $card['title'] ); ?></h3>
		<?php endif; ?>

		<?php if ( ! empty( $card['text'] ) ) : ?>
			<p><?php echo esc_html( $card['text'] ); ?></p>
		<?php endif; ?>

		<?php if ( ! empty( $card['cta_label'] ) ) : ?>
			<span class="sea-card-cta"><?php echo esc_html( $card['cta_label'] ); ?> <span class="arrow" aria-hidden="true">&rarr;</span></span>
		<?php endif; ?>
	</a>
	<?php
}

/**
 * One yacht card in the fleet grid.
 *
 * @param array $card Keys: image, flag, meta, title, specs, cta_label, url|slug.
 */
function aiy_render_yacht_card( $card ) {
	$url   = ! empty( $card['url'] ) ? $card['url'] : ( ! empty( $card['slug'] ) ? aiy_url( $card['slug'] ) : '' );
	$specs = ! empty( $card['specs'] ) && is_array( $card['specs'] ) ? $card['specs'] : array();
	?>
	<article class="yacht-card">
		<a class="yacht-link" href="<?php echo esc_url( $url ); ?>">
			<div class="yacht-art">
				<?php aiy_render_image( isset( $card['image'] ) ? $card['image'] : null, 'medium_large' ); ?>
				<?php if ( ! empty( $card['flag'] ) ) : ?>
					<span class="yacht-flag"><?php echo esc_html( $card['flag'] ); ?></span>
				<?php endif; ?>
			</div>
			<div class="yacht-body">
				<?php if ( ! empty( $card['meta'] ) ) : ?>
					<p class="yacht-cat"><?php echo esc_html( $card['meta'] ); ?></p>
				<?php endif; ?>

				<?php if ( ! empty( $card['title'] ) ) : ?>
					<h3 class="display"><?php echo esc_html( $card['title'] ); ?></h3>
				<?php endif; ?>

				<?php if ( $specs ) : ?>
					<div class="yacht-specs">
						<?php
						foreach ( $specs as $spec ) :
							// ACF hands back rows; the defaults hand back plain strings.
							$text = is_array( $spec ) ? ( isset( $spec['text'] ) ? $spec['text'] : '' ) : $spec;
							if ( '' === $text ) {
								continue;
							}
							?>
							<span><?php echo esc_html( $text ); ?></span>
						<?php endforeach; ?>
					</div>
				<?php endif; ?>

				<?php if ( ! empty( $card['cta_label'] ) ) : ?>
					<span class="yacht-more"><?php echo esc_html( $card['cta_label'] ); ?> <span class="arrow" aria-hidden="true">&rarr;</span></span>
				<?php endif; ?>
			</div>
		</a>
	</article>
	<?php
}

/**
 * One tile of the gallery teaser.
 *
 * Bundled tiles ship with hand-made WebP derivatives and an inline blur
 * placeholder, so they render as a <picture>. An image uploaded through ACF
 * has neither — WordPress does not generate WebP by default — so it renders
 * as a plain <img> and relies on the srcset core builds instead. Both satisfy
 * what site.js looks for, which is any <img> inside .xg-tile.
 *
 * @param array $tile  Keys: image, title, alt, category, col_span, row_span, lqip, webp_800, webp_1600, full.
 * @param int   $index Zero-based position, used for the stagger delay and the numbering.
 */
function aiy_render_gallery_tile( $tile, $index = 0 ) {
	$image = isset( $tile['image'] ) ? $tile['image'] : null;
	$cols  = ! empty( $tile['col_span'] ) ? (int) $tile['col_span'] : 2;
	$rows  = ! empty( $tile['row_span'] ) ? (int) $tile['row_span'] : 3;
	$title = ! empty( $tile['title'] ) ? $tile['title'] : '';

	// The alt text of an upload lives in the media library.
	$alt = ! empty( $tile['alt'] ) ? $tile['alt'] : '';
	if ( '' === $alt && is_array( $image ) && ! empty( $image['alt'] ) ) {
		$alt = $image['alt'];
	}

	// Full-size URL for a lightbox, if one is ever added to this grid.
	$full = '';
	if ( ! empty( $tile['full'] ) ) {
		$full = aiy_asset( $tile['full'] );
	} elseif ( is_array( $image ) && ! empty( $image['ID'] ) ) {
		$full = (string) wp_get_attachment_image_url( $image['ID'], 'full' );
	}

	// 45ms between tiles, matching the static stagger.
	$style = sprintf( '--cs:%d;--rs:%d;--d:%.3fs;', $cols, $rows, $index * 0.045 );
	if ( ! empty( $tile['lqip'] ) ) {
		$style .= '--lqip:url(' . $tile['lqip'] . ');';
	}
	?>
	<figure class="xg-tile" style="<?php echo esc_attr( $style ); ?>" data-cat="<?php echo esc_attr( ! empty( $tile['category'] ) ? $tile['category'] : '' ); ?>" data-i="<?php echo esc_attr( $index ); ?>" data-title="<?php echo esc_attr( $title ); ?>" data-alt="<?php echo esc_attr( $alt ); ?>"<?php echo $full ? ' data-full="' . esc_url( $full ) . '"' : ''; ?>>
		<button class="xg-open" type="button" aria-label="<?php echo esc_attr( sprintf( /* translators: %s: photograph caption. */ __( 'Open: %s', 'aiyachts' ), $title ) ); ?>" data-open="<?php echo esc_attr( $index ); ?>">
			<span class="xg-frame" aria-hidden="true"></span>
			<?php if ( ! empty( $tile['webp_800'] ) && ! empty( $tile['webp_1600'] ) ) : ?>
				<picture>
					<source type="image/webp" srcset="<?php echo esc_url( aiy_asset( $tile['webp_800'] ) ); ?> 800w, <?php echo esc_url( aiy_asset( $tile['webp_1600'] ) ); ?> 1600w" sizes="(max-width:700px) 50vw, 33vw">
					<?php aiy_render_image( $image, 'large', array( 'alt' => $alt ) ); ?>
				</picture>
			<?php else : ?>
				<?php aiy_render_image( $image, 'large', array( 'alt' => $alt, 'sizes' => '(max-width:700px) 50vw, 33vw' ) ); ?>
			<?php endif; ?>

			<figcaption class="xg-cap">
				<span class="xg-num" aria-hidden="true"><?php echo esc_html( sprintf( '%02d', $index + 1 ) ); ?></span>
				<span class="xg-title"><?php echo esc_html( $title ); ?></span>
			</figcaption>
		</button>
	</figure>
	<?php
}

/**
 * One guest-service card.
 *
 * @param array $card Keys: icon (key into aiy_service_icon_paths) or icon_paths, title, text.
 */
function aiy_render_service_card( $card ) {
	$icons = aiy_service_icon_paths();
	$paths = '';

	if ( ! empty( $card['icon_paths'] ) ) {
		$paths = $card['icon_paths'];
	} elseif ( ! empty( $card['icon'] ) && isset( $icons[ $card['icon'] ] ) ) {
		$paths = $icons[ $card['icon'] ];
	}
	?>
	<div class="service-card">
		<?php if ( $paths ) : ?>
			<svg class="service-icon" viewBox="0 0 40 40" aria-hidden="true"><?php echo $paths; ?></svg><?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- theme constant, see aiy_service_icon_paths(). ?>
		<?php endif; ?>

		<?php if ( ! empty( $card['title'] ) ) : ?>
			<h3><?php echo esc_html( $card['title'] ); ?></h3>
		<?php endif; ?>

		<?php if ( ! empty( $card['text'] ) ) : ?>
			<p><?php echo esc_html( $card['text'] ); ?></p>
		<?php endif; ?>
	</div>
	<?php
}

/**
 * One brokerage panel.
 *
 * @param array $panel Keys: eyebrow, title, text, list, cta_label, cta_url|cta_slug, cta.
 */
function aiy_render_brokerage_panel( $panel ) {
	$rows = ! empty( $panel['list'] ) && is_array( $panel['list'] ) ? $panel['list'] : array();

	$cta = aiy_link_parts(
		isset( $panel['cta'] ) ? $panel['cta'] : null,
		! empty( $panel['cta_slug'] ) ? aiy_url( $panel['cta_slug'] ) : '',
		! empty( $panel['cta_label'] ) ? $panel['cta_label'] : ''
	);
	?>
	<div class="split-panel">
		<?php if ( ! empty( $panel['eyebrow'] ) ) : ?>
			<p class="eyebrow"><?php echo esc_html( $panel['eyebrow'] ); ?></p>
		<?php endif; ?>

		<?php if ( ! empty( $panel['title'] ) ) : ?>
			<h3 class="display"><?php echo esc_html( $panel['title'] ); ?></h3>
		<?php endif; ?>

		<?php if ( ! empty( $panel['text'] ) ) : ?>
			<p><?php echo esc_html( $panel['text'] ); ?></p>
		<?php endif; ?>

		<?php if ( $rows ) : ?>
			<ul class="split-list">
				<?php foreach ( $rows as $row ) : ?>
					<?php if ( empty( $row['label'] ) ) { continue; } ?>
					<li><b><?php echo esc_html( $row['label'] ); ?></b><span><?php echo esc_html( isset( $row['note'] ) ? $row['note'] : '' ); ?></span></li>
				<?php endforeach; ?>
			</ul>
		<?php endif; ?>

		<?php if ( $cta['url'] && $cta['label'] ) : ?>
			<a href="<?php echo esc_url( $cta['url'] ); ?>" class="btn ghost dark"<?php aiy_target_attr( $cta['target'] ); ?>><?php echo esc_html( $cta['label'] ); ?></a>
		<?php endif; ?>
	</div>
	<?php
}
