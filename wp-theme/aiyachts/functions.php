<?php
/**
 * AIyachts theme bootstrap.
 *
 * @package AIyachts
 */

defined( 'ABSPATH' ) || exit;

/* -------------------------------------------------------------------------
 * 1. Constants
 * ---------------------------------------------------------------------- */

/**
 * Theme version. Used as a fallback asset version when filemtime() is
 * unavailable (some hosts disable stat calls on network mounts).
 */
define( 'AIY_VERSION', '1.0.0' );

/** Absolute path to the theme directory, no trailing slash. */
define( 'AIY_DIR', get_template_directory() );

/** Public URL of the theme directory, no trailing slash. */
define( 'AIY_URI', get_template_directory_uri() );


/* -------------------------------------------------------------------------
 * 2. Asset helpers
 *
 * Every template and every enqueue goes through these two functions, so the
 * theme never hard-codes a path to wp-content/themes/aiyachts.
 * ---------------------------------------------------------------------- */

/**
 * Absolute URL for a file inside the theme.
 *
 * @param string $relative Path relative to the theme root, e.g. 'assets/logo.png'.
 * @return string
 */
function aiy_asset( $relative ) {
	return AIY_URI . '/' . ltrim( $relative, '/' );
}

/**
 * Cache-busting version string for a theme file.
 *
 * Uses the file's modification time so a changed stylesheet or script is
 * picked up immediately, without touching AIY_VERSION on every edit.
 *
 * @param string $relative Path relative to the theme root.
 * @return string
 */
function aiy_asset_version( $relative ) {
	$path = AIY_DIR . '/' . ltrim( $relative, '/' );
	$time = file_exists( $path ) ? filemtime( $path ) : false;

	return $time ? (string) $time : AIY_VERSION;
}


/* -------------------------------------------------------------------------
 * 3. Theme setup
 * ---------------------------------------------------------------------- */

/**
 * Register theme supports and navigation menus.
 */
function aiy_setup() {
	load_theme_textdomain( 'aiyachts', AIY_DIR . '/languages' );

	// WordPress renders <title>; the static <title> tag is dropped from header.php.
	add_theme_support( 'title-tag' );

	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support(
		'html5',
		array( 'search-form', 'gallery', 'caption', 'style', 'script', 'navigation-widgets' )
	);

	// The brand mark in the header; falls back to assets/favicon-192.png.
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 30,
			'width'       => 30,
			'flex-height' => true,
			'flex-width'  => true,
		)
	);

	/*
	 * The static site has one primary nav (repeated in the mobile drawer) and
	 * three footer columns. Each gets its own menu location so the client can
	 * reorder them from Appearance → Menus.
	 */
	register_nav_menus(
		array(
			'primary'        => __( 'Primary navigation', 'aiyachts' ),
			'footer_charter' => __( 'Footer — Charter', 'aiyachts' ),
			'footer_company' => __( 'Footer — Company', 'aiyachts' ),
			'footer_yachts'  => __( 'Footer — Popular yachts', 'aiyachts' ),
		)
	);
}
add_action( 'after_setup_theme', 'aiy_setup' );

/**
 * Content width, in pixels. Matches the `.wrap` container in site.css.
 */
function aiy_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'aiy_content_width', 1280 );
}
add_action( 'after_setup_theme', 'aiy_content_width', 0 );


/* -------------------------------------------------------------------------
 * 4. Styles and scripts
 *
 * The static site loads exactly two files — assets/css/site.css and
 * assets/js/site.js — plus five self-hosted woff2 faces that site.css
 * declares with @font-face. Because the fonts are referenced relatively
 * (`url(../fonts/…)`) and the assets/ folder was copied into the theme
 * with its structure intact, no path rewriting inside the CSS is needed.
 * ---------------------------------------------------------------------- */

/**
 * Enqueue the front-end stylesheet and script.
 */
function aiy_enqueue_assets() {
	// Single design-system stylesheet: tokens, layout, components, motion.
	wp_enqueue_style(
		'aiyachts-site',
		aiy_asset( 'assets/css/site.css' ),
		array(),
		aiy_asset_version( 'assets/css/site.css' )
	);

	// The theme header stylesheet — WordPress corrections only, loaded after.
	wp_enqueue_style(
		'aiyachts-style',
		get_stylesheet_uri(),
		array( 'aiyachts-site' ),
		aiy_asset_version( 'style.css' )
	);

	/*
	 * Single dependency-free behaviour script: sticky header, mobile drawer,
	 * reveal-on-scroll, booking stepper, sea-switch map, fleet filters,
	 * gallery lightbox, enquiry + newsletter mailto handlers, back-to-top.
	 * The static markup loaded it with `defer`; mirror that exactly.
	 */
	wp_enqueue_script(
		'aiyachts-site',
		aiy_asset( 'assets/js/site.js' ),
		array(),
		aiy_asset_version( 'assets/js/site.js' ),
		array(
			'in_footer' => true,
			'strategy'  => 'defer',
		)
	);

	// Threaded comments, only where a template actually shows comments.
	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'aiy_enqueue_assets' );

/**
 * Font preloads and the resources that must appear before the stylesheet.
 *
 * Hooked at priority 1 so this lands ahead of wp_print_styles (priority 8):
 * the three faces used above the fold start downloading in parallel with
 * site.css instead of waiting for it to parse.
 */
function aiy_head_preloads() {
	$fonts = array(
		'assets/fonts/familjen-grotesk.woff2',
		'assets/fonts/franklin-var.woff2',
		'assets/fonts/plex-mono-400.woff2',
	);

	foreach ( $fonts as $font ) {
		printf(
			'<link rel="preload" as="font" type="font/woff2" href="%s" crossorigin>' . "\n",
			esc_url( aiy_asset( $font ) )
		);
	}

	// The home page opens on a full-bleed video with a poster frame; the
	// poster is the LCP candidate, so it is preloaded on the front page only.
	if ( is_front_page() ) {
		printf(
			'<link rel="preload" as="image" href="%s" fetchpriority="high">' . "\n",
			esc_url( aiy_hero_poster_url() )
		);
	}
}
add_action( 'wp_head', 'aiy_head_preloads', 1 );

/**
 * Icons, manifest, theme colour and the intro-splash guard.
 *
 * The inline script is the one piece of JavaScript that has to run before
 * paint: it flags <html data-intro="done"> on repeat visits within a session
 * so the logo splash only plays once. Keeping it inline in <head> is
 * deliberate — deferring it would cause a flash of the splash.
 */
function aiy_head_meta() {
	?>
<meta name="author" content="<?php bloginfo( 'name' ); ?>">
<meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#06232B" media="(prefers-color-scheme: dark)">
<meta name="format-detection" content="telephone=yes">
<link rel="icon" href="<?php echo esc_url( aiy_asset( 'assets/favicon-32.png' ) ); ?>" sizes="32x32" type="image/png">
<link rel="icon" href="<?php echo esc_url( aiy_asset( 'assets/favicon-192.png' ) ); ?>" sizes="192x192" type="image/png">
<link rel="apple-touch-icon" href="<?php echo esc_url( aiy_asset( 'assets/apple-touch-icon.png' ) ); ?>">
<link rel="manifest" href="<?php echo esc_url( aiy_asset( 'assets/site.webmanifest' ) ); ?>">
<script>try{if(sessionStorage.getItem('aiy-intro')){document.documentElement.setAttribute('data-intro','done');}else{sessionStorage.setItem('aiy-intro','1');}}catch(e){}</script>
	<?php
}
add_action( 'wp_head', 'aiy_head_meta', 2 );

/**
 * URL of the hero poster frame.
 *
 * Wrapped in a function because the front-page hero becomes an ACF image
 * field in step 4; the preload above and the <video> tag in the template
 * then stay in agreement without duplicating the fallback.
 *
 * @return string
 */
function aiy_hero_poster_url() {
	$default = aiy_asset( 'assets/hero-poster.jpg' );
	$poster  = aiy_get_field( 'hero_poster', null, get_queried_object_id() );

	if ( is_array( $poster ) && ! empty( $poster['url'] ) ) {
		$default = $poster['url'];
	}

	return apply_filters( 'aiy_hero_poster_url', $default );
}


/* -------------------------------------------------------------------------
 * 5. Keeping it lightweight
 * ---------------------------------------------------------------------- */

/**
 * Drop front-end payload this theme has no use for.
 *
 * The design is a hand-written stylesheet with no block content, so the
 * block library CSS, the generated global-styles sheet and the emoji
 * detection script are pure overhead — roughly 90KB before compression.
 *
 * If block content is ever added to a page, return false from the
 * `aiy_trim_default_assets` filter to put the block styles back.
 */
function aiy_trim_default_assets() {
	if ( is_admin() || ! apply_filters( 'aiy_trim_default_assets', true ) ) {
		return;
	}

	wp_dequeue_style( 'wp-block-library' );
	wp_dequeue_style( 'wp-block-library-theme' );
	wp_dequeue_style( 'global-styles' );
	wp_dequeue_style( 'classic-theme-styles' );
}
add_action( 'wp_enqueue_scripts', 'aiy_trim_default_assets', 100 );

/**
 * Remove the emoji detection script and its DNS prefetch.
 */
function aiy_disable_emojis() {
	if ( ! apply_filters( 'aiy_trim_default_assets', true ) ) {
		return;
	}

	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );
	remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
	remove_action( 'admin_print_styles', 'print_emoji_styles' );
	remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
	remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
	remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
	add_filter( 'emoji_svg_url', '__return_false' );
}
add_action( 'init', 'aiy_disable_emojis' );

/**
 * Strip the version query string WordPress appends to the generator meta and
 * to core asset URLs — it leaks the WordPress version. Theme assets keep
 * their own filemtime version, which is set explicitly above.
 */
remove_action( 'wp_head', 'wp_generator' );

/**
 * Body classes the stylesheet keys off.
 *
 * `home` + `intro-lock` drive the logo splash on the front page; `has-gallery`
 * switches on the lightbox styles. WordPress already adds `home`, so only the
 * two site-specific flags are added here.
 *
 * @param string[] $classes Existing body classes.
 * @return string[]
 */
function aiy_body_classes( $classes ) {
	if ( is_front_page() ) {
		$classes[] = 'intro-lock';
	}

	return $classes;
}
add_filter( 'body_class', 'aiy_body_classes' );


/* -------------------------------------------------------------------------
 * 6. ACF accessors
 *
 * Every read of an ACF value in this theme goes through aiy_get_field() or
 * aiy_option() rather than calling get_field() directly. They do two jobs:
 *
 *   1. Survive ACF being absent. get_field() is defined by the plugin, so a
 *      deactivated or not-yet-installed ACF would fatal every template. These
 *      return the fallback instead, and the site renders its original copy.
 *
 *   2. Survive an empty field. A client who clears a text box gets the
 *      original wording back, not a blank hole in the layout. This is what
 *      makes the home page identical to the static site on the day the theme
 *      is switched on, before anyone has typed anything into the admin.
 *
 * `false` is deliberately treated as a real value, not as empty, so a
 * true/false field set to "no" is respected.
 * ---------------------------------------------------------------------- */

/**
 * Is an ACF return value effectively empty?
 *
 * @param mixed $value Value returned by get_field().
 * @return bool
 */
function aiy_is_blank( $value ) {
	return ( null === $value || '' === $value || array() === $value );
}

/**
 * Read an ACF field, falling back to the original static content.
 *
 * @param string $field_name Field name.
 * @param mixed  $fallback   Returned when ACF is unavailable or the field is empty.
 * @param mixed  $post_id    Optional ACF post ID. Defaults to the current post;
 *                           pass 'option' to read the Theme Settings page.
 * @return mixed
 */
function aiy_get_field( $field_name, $fallback = null, $post_id = false ) {
	if ( ! function_exists( 'get_field' ) ) {
		return $fallback;
	}

	$value = get_field( $field_name, $post_id );

	return aiy_is_blank( $value ) ? $fallback : $value;
}

/**
 * Read a field from the Theme Settings options page, with a fallback.
 *
 * @param string $field_name Field name.
 * @param mixed  $fallback   Returned when ACF is unavailable or the field is empty.
 * @return mixed
 */
function aiy_option( $field_name, $fallback = null ) {
	return aiy_get_field( $field_name, $fallback, 'option' );
}

/**
 * Does a repeater have rows to loop over?
 *
 * Wraps have_rows() so a template can ask the question on a site where ACF is
 * not active without fataling.
 *
 * @param string $field_name Repeater field name.
 * @param mixed  $post_id    Optional ACF post ID.
 * @return bool
 */
function aiy_has_rows( $field_name, $post_id = false ) {
	return function_exists( 'have_rows' ) && have_rows( $field_name, $post_id );
}

/**
 * Turn a human-readable phone number into a tel: href value.
 *
 * "+44 (0) 7471 137 874" becomes "+4407471137874", matching the hrefs the
 * static site used, so the client only ever types the number once.
 *
 * @param string $number Display number.
 * @return string
 */
function aiy_tel_href( $number ) {
	return preg_replace( '/[^0-9+]/', '', (string) $number );
}


/* -------------------------------------------------------------------------
 * 7. Includes
 * ---------------------------------------------------------------------- */

/** Flat <a>-only navigation walker; see the class file for why. */
require_once AIY_DIR . '/inc/class-aiy-walker-nav-menu.php';

/** aiy_url(), aiy_nav() and the static navigation fallbacks. */
require_once AIY_DIR . '/inc/template-tags.php';

/** Site-wide Organization / WebSite JSON-LD carried over from the static head. */
require_once AIY_DIR . '/inc/schema.php';

/** Front page card renderers and the original content they fall back to. */
require_once AIY_DIR . '/inc/front-page-parts.php';

/*
 * ACF field groups are registered in code (step 3) so the field definitions
 * live in version control rather than in the database. Guarded so the theme
 * still activates on a site where ACF is not installed yet.
 */
if ( file_exists( AIY_DIR . '/inc/acf-fields.php' ) ) {
	require_once AIY_DIR . '/inc/acf-fields.php';
}
