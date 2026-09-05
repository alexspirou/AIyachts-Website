<?php
/**
 * Site-wide structured data.
 *
 * The static pages each carried a large JSON-LD @graph. Most of it was
 * per-page (WebPage, BreadcrumbList, AboutPage) and is better produced by an
 * SEO plugin, which also owns <title>, meta description and Open Graph tags.
 *
 * The Organization / TravelAgency and WebSite nodes are different: they are
 * identical on every page, they describe the business rather than the page,
 * and no SEO plugin knows the two bases, the three reservation numbers or the
 * geo coordinates. Dropping them in the conversion would be a real loss of
 * rich-result eligibility, so they are reproduced here.
 *
 * The values below are literal for now; step 3 lifts them onto an ACF options
 * page and step 4 reads them back through get_field().
 *
 * @package AIyachts
 */

defined( 'ABSPATH' ) || exit;

/**
 * The company details, read from the Theme Settings options page.
 *
 * The literals below are the values the static site shipped with. They are the
 * fallback, not the source of truth: as soon as the client fills in Theme
 * Settings, the options page wins. That way the site is correct on the day the
 * theme is activated and stays correct after they edit it, with no window in
 * between where the footer is blank.
 *
 * Both the footer and the structured data read this one function, so a phone
 * number can never disagree between the two.
 *
 * @return array<string,mixed>
 */
function aiy_business_details() {
	$defaults = array(
		'email'  => 'aiyachtsea@gmail.com',
		'phones' => array( '+30 697 23 56 502', '+30 694 099 28 94', '+44 (0) 7471 137 874' ),
		'bases'  => array(
			array(
				'name'         => 'Athens base',
				'address_line' => 'Alexandroupoleos 20, 11527 Athens',
				'street'       => 'Alexandroupoleos 20',
				'postcode'     => '11527',
				'locality'     => 'Athens',
				'region'       => 'Attica',
				'country'      => 'GR',
				'latitude'     => 37.9838,
				'longitude'    => 23.7275,
			),
			array(
				'name'         => 'Lefkas base',
				'address_line' => 'Tsoukalades, 31100 Lefkas Island',
				'street'       => 'Tsoukalades',
				'postcode'     => '31100',
				'locality'     => 'Lefkada',
				'region'       => 'Lefkada',
				'country'      => 'GR',
				'latitude'     => 38.729,
				'longitude'    => 20.639,
			),
		),
		'social' => array(),
	);

	$details = $defaults;

	$details['email'] = aiy_option( 'company_email', $defaults['email'] );

	// Repeaters come back as a list of rows; flatten the ones that hold a
	// single value, and keep the fallback when the client has added no rows.
	$phones = aiy_option( 'phones' );
	if ( is_array( $phones ) && $phones ) {
		$numbers = array();
		foreach ( $phones as $row ) {
			if ( ! empty( $row['number'] ) ) {
				$numbers[] = $row['number'];
			}
		}
		if ( $numbers ) {
			$details['phones'] = $numbers;
		}
	}

	$bases = aiy_option( 'bases' );
	if ( is_array( $bases ) && $bases ) {
		$rows = array();
		foreach ( $bases as $base ) {
			$rows[] = array(
				'name'         => isset( $base['name'] ) ? $base['name'] : '',
				'address_line' => isset( $base['address_line'] ) ? $base['address_line'] : '',
				'street'       => isset( $base['street'] ) ? $base['street'] : '',
				'postcode'     => isset( $base['postcode'] ) ? $base['postcode'] : '',
				'locality'     => isset( $base['locality'] ) ? $base['locality'] : '',
				'region'       => isset( $base['region'] ) ? $base['region'] : '',
				'country'      => isset( $base['country'] ) ? $base['country'] : 'GR',
				'latitude'     => isset( $base['latitude'] ) && '' !== $base['latitude'] ? (float) $base['latitude'] : null,
				'longitude'    => isset( $base['longitude'] ) && '' !== $base['longitude'] ? (float) $base['longitude'] : null,
			);
		}
		$details['bases'] = $rows;
	}

	$social = aiy_option( 'social_links' );
	if ( is_array( $social ) && $social ) {
		foreach ( $social as $row ) {
			if ( ! empty( $row['url'] ) ) {
				$details['social'][] = $row['url'];
			}
		}
	}

	return apply_filters( 'aiy_business_details', $details );
}

/**
 * Print the Organization and WebSite JSON-LD graph.
 */
function aiy_print_schema() {
	$details = aiy_business_details();
	$home    = home_url( '/' );
	$name    = get_bloginfo( 'name' );

	// Every phone row can be deleted, so never index [0] blind.
	$primary_phone = ! empty( $details['phones'] ) ? reset( $details['phones'] ) : '';

	$contact_points = array();
	foreach ( $details['phones'] as $phone ) {
		$contact_points[] = array(
			'@type'             => 'ContactPoint',
			'telephone'         => $phone,
			'contactType'       => 'reservations',
			'email'             => $details['email'],
			'availableLanguage' => array( 'English', 'Greek' ),
		);
	}

	$departments = array();
	$addresses   = array();
	foreach ( $details['bases'] as $base ) {
		// A client may fill in only some of the address parts; empty strings
		// would make the PostalAddress node invalid, so drop them.
		$address = array_filter(
			array(
				'streetAddress'   => $base['street'],
				'postalCode'      => $base['postcode'],
				'addressLocality' => $base['locality'],
				'addressRegion'   => $base['region'],
				'addressCountry'  => $base['country'],
			),
			static function ( $value ) {
				return '' !== $value && null !== $value;
			}
		);

		$address = array( '@type' => 'PostalAddress' ) + $address;

		$addresses[] = $address;

		$department = array(
			'@type'      => 'LocalBusiness',
			'@id'        => $home . '#' . sanitize_title( $base['name'] ),
			'name'       => $name . ' — ' . $base['name'],
			'address'    => $address,
			'telephone'  => $primary_phone,
			'email'      => $details['email'],
			'url'        => aiy_url( 'destinations' ),
			'priceRange' => '€€€',
		);

		// Coordinates are optional; publishing nulls would invalidate the node.
		if ( null !== $base['latitude'] && null !== $base['longitude'] ) {
			$department['geo'] = array(
				'@type'     => 'GeoCoordinates',
				'latitude'  => $base['latitude'],
				'longitude' => $base['longitude'],
			);
		}

		$departments[] = $department;
	}

	$organization = array(
		'@type'         => array( 'Organization', 'TravelAgency' ),
		'@id'           => $home . '#organization',
		'name'          => $name,
		'url'           => $home,
		'logo'          => array(
			'@type'  => 'ImageObject',
			'url'    => aiy_asset( 'assets/logo.png' ),
			'width'  => 560,
			'height' => 442,
		),
		'image'         => aiy_asset( 'assets/img/og-cover.jpg' ),
		'description'   => get_bloginfo( 'description' ),
		'email'         => $details['email'],
		'telephone'     => $primary_phone,
		'areaServed'    => array( array( '@type' => 'Country', 'name' => 'Greece' ) ),
		'knowsLanguage' => array( 'en', 'el' ),
		'address'       => $addresses,
		'contactPoint'  => $contact_points,
		'department'    => $departments,
	);

	// sameAs is how a search engine ties the site to its social profiles.
	if ( ! empty( $details['social'] ) ) {
		$organization['sameAs'] = array_values( $details['social'] );
	}

	$graph = array(
		$organization,
		array(
			'@type'      => 'WebSite',
			'@id'        => $home . '#website',
			'url'        => $home,
			'name'       => $name,
			'inLanguage' => get_bloginfo( 'language' ),
			'publisher'  => array( '@id' => $home . '#organization' ),
		),
	);

	$json = wp_json_encode(
		array(
			'@context' => 'https://schema.org',
			'@graph'   => apply_filters( 'aiy_schema_graph', $graph ),
		),
		JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
	);

	if ( $json ) {
		echo '<script type="application/ld+json">' . $json . '</script>' . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_json_encode output.
	}
}
add_action( 'wp_head', 'aiy_print_schema', 20 );
