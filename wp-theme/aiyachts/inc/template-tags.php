<?php
/**
 * Template tags: internal links and navigation.
 *
 * @package AIyachts
 */

defined( 'ABSPATH' ) || exit;

/* -------------------------------------------------------------------------
 * Internal links
 *
 * The static site linked between flat files — about.html, fleet.html,
 * fleet/lagoon-40.html. In WordPress those become pages, so every internal
 * link in the templates goes through aiy_url() with the intended slug path.
 *
 * If the page exists, its real permalink is used, so the client can move a
 * page, change a slug or nest it and the links follow. If it does not exist
 * yet, a sensible /slug/ URL is returned, so a half-built site still renders
 * without fatal errors or empty href="".
 * ---------------------------------------------------------------------- */

/**
 * Resolve an internal slug path to a permalink.
 *
 * @param string $path Slug path without leading or trailing slashes,
 *                     e.g. 'about', 'destinations/ionian-sailing'.
 *                     An empty string returns the home URL.
 * @return string
 */
function aiy_url( $path = '' ) {
	static $cache = array();

	$path = trim( (string) $path, '/' );

	if ( '' === $path || 'index' === $path ) {
		return home_url( '/' );
	}

	if ( isset( $cache[ $path ] ) ) {
		return $cache[ $path ];
	}

	$page = get_page_by_path( $path );
	$url  = ( $page instanceof WP_Post ) ? get_permalink( $page ) : home_url( '/' . $path . '/' );

	/**
	 * Filter a resolved internal URL.
	 *
	 * @param string $url  The resolved URL.
	 * @param string $path The requested slug path.
	 */
	$cache[ $path ] = apply_filters( 'aiy_url', $url, $path );

	return $cache[ $path ];
}

/**
 * Echo an escaped internal URL.
 *
 * @param string $path Slug path. See aiy_url().
 */
function aiy_the_url( $path = '' ) {
	echo esc_url( aiy_url( $path ) );
}


/* -------------------------------------------------------------------------
 * Navigation
 * ---------------------------------------------------------------------- */

/**
 * Render a nav menu location, falling back to the original static links.
 *
 * The fallback matters: on a fresh install no menus are assigned yet, and a
 * header with no navigation reads as a broken theme. The static list keeps
 * the site usable until the client builds the menus in Appearance → Menus,
 * at which point the assigned menu takes over automatically.
 *
 * @param string   $location Registered nav menu location.
 * @param string[] $fallback Map of slug path => link label.
 */
function aiy_nav( $location, $fallback = array() ) {
	if ( has_nav_menu( $location ) ) {
		wp_nav_menu(
			array(
				'theme_location' => $location,
				'container'      => false,
				'items_wrap'     => '%3$s',
				'depth'          => 1,
				'walker'         => new AIY_Walker_Nav_Menu(),
				'fallback_cb'    => false,
			)
		);

		return;
	}

	foreach ( $fallback as $path => $label ) {
		$url     = aiy_url( $path );
		$current = untrailingslashit( $url ) === untrailingslashit( aiy_current_url() );

		printf(
			'<a href="%s"%s>%s</a>' . "\n",
			esc_url( $url ),
			$current ? ' aria-current="page"' : '',
			esc_html( $label )
		);
	}
}

/**
 * URL of the request being rendered, used to mark the active fallback link.
 *
 * @return string
 */
function aiy_current_url() {
	if ( is_front_page() ) {
		return home_url( '/' );
	}

	$id = get_queried_object_id();

	return $id ? (string) get_permalink( $id ) : home_url( '/' );
}

/**
 * The primary navigation, as it stands in the static site.
 *
 * @return string[] Map of slug path => label.
 */
function aiy_default_primary_items() {
	return array(
		'about'        => __( 'About', 'aiyachts' ),
		'destinations' => __( 'Destinations', 'aiyachts' ),
		'fleet'        => __( 'Fleet', 'aiyachts' ),
		'experiences'  => __( 'Experiences', 'aiyachts' ),
		'services'     => __( 'Services', 'aiyachts' ),
		'brokerage'    => __( 'Brokerage', 'aiyachts' ),
		'contact'      => __( 'Contact', 'aiyachts' ),
	);
}

/**
 * The mobile drawer, which additionally links Home.
 *
 * @return string[] Map of slug path => label.
 */
function aiy_default_mobile_items() {
	return array( '' => __( 'Home', 'aiyachts' ) ) + aiy_default_primary_items();
}

/**
 * Footer column one — Charter.
 *
 * @return string[] Map of slug path => label.
 */
function aiy_default_footer_charter_items() {
	return array(
		'fleet'                          => __( 'Our fleet', 'aiyachts' ),
		'destinations'                   => __( 'Destinations', 'aiyachts' ),
		'destinations/ionian-sailing'    => __( 'Sailing the Ionian', 'aiyachts' ),
		'destinations/aegean-sailing'    => __( 'Sailing the Aegean', 'aiyachts' ),
		'services'                       => __( 'Guest services', 'aiyachts' ),
	);
}

/**
 * Footer column two — Company.
 *
 * @return string[] Map of slug path => label.
 */
function aiy_default_footer_company_items() {
	return array(
		'about'       => __( 'About AIyachts', 'aiyachts' ),
		'experiences' => __( 'Gallery of experiences', 'aiyachts' ),
		'brokerage'   => __( 'Brokerage & management', 'aiyachts' ),
		'contact'     => __( 'Contact & enquiries', 'aiyachts' ),
	);
}

/**
 * Footer column three — Popular yachts.
 *
 * @return string[] Map of slug path => label.
 */
function aiy_default_footer_yacht_items() {
	return array(
		'fleet/lagoon-40'                   => __( 'Lagoon 40', 'aiyachts' ),
		'fleet/lagoon-450-f'                => __( 'Lagoon 450 F', 'aiyachts' ),
		'fleet/bavaria-51-1'                => __( 'Bavaria 51.1', 'aiyachts' ),
		'fleet/jeanneau-sun-odyssey-469'    => __( 'Jeanneau Sun Odyssey 469', 'aiyachts' ),
		'fleet/beneteau-oceanis-50-family'  => __( 'Beneteau Oceanis 50 Family', 'aiyachts' ),
	);
}

/**
 * The brand mark shown in the site header.
 *
 * Uses the Customizer logo when one is set, otherwise the bundled icon.
 *
 * @return string URL.
 */
function aiy_brand_mark_url() {
	$logo_id = (int) get_theme_mod( 'custom_logo' );

	if ( $logo_id ) {
		$src = wp_get_attachment_image_url( $logo_id, 'full' );
		if ( $src ) {
			return $src;
		}
	}

	return aiy_asset( 'assets/favicon-192.png' );
}

