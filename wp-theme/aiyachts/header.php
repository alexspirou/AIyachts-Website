<?php
/**
 * Document head, site header and mobile drawer.
 *
 * Opens <html> and <body>; footer.php closes them.
 *
 * Everything the static <head> carried beyond charset and viewport is now
 * printed through wp_head(): the stylesheet and script, the font preloads,
 * the icons and manifest, the theme colour and the intro-splash guard are all
 * registered in functions.php, and <title> comes from add_theme_support(
 * 'title-tag' ). That keeps this file to markup.
 *
 * @package AIyachts
 */

defined( 'ABSPATH' ) || exit;
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width,initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<?php if ( is_front_page() ) : ?>
	<?php /* The logo splash plays once per session; the guard script in wp_head sets data-intro="done" on repeat visits. */ ?>
	<div id="introSplash" aria-hidden="true">
		<img class="intro-logo" src="<?php echo esc_url( aiy_asset( 'assets/logo.png' ) ); ?>" alt="" width="560" height="442" fetchpriority="high">
	</div>
<?php endif; ?>

<a class="skip-link" href="#main"><?php esc_html_e( 'Skip to content', 'aiyachts' ); ?></a>

<header id="siteHeader">
	<a href="<?php aiy_the_url(); ?>" class="brand" aria-label="<?php echo esc_attr( sprintf( /* translators: %s: site name. */ __( '%s — home', 'aiyachts' ), get_bloginfo( 'name' ) ) ); ?>">
		<img src="<?php echo esc_url( aiy_brand_mark_url() ); ?>" alt="" width="30" height="30" class="brand-mark">
		<span><?php bloginfo( 'name' ); ?></span>
	</a>

	<nav class="primary" aria-label="<?php esc_attr_e( 'Primary', 'aiyachts' ); ?>">
		<?php aiy_nav( 'primary', aiy_default_primary_items() ); ?>
	</nav>

	<a href="<?php aiy_the_url( 'contact' ); ?>" class="nav-cta"><?php esc_html_e( 'Enquire', 'aiyachts' ); ?> <span class="arrow" aria-hidden="true">&rarr;</span></a>

	<button class="menu-btn" id="menuBtn" aria-label="<?php esc_attr_e( 'Open menu', 'aiyachts' ); ?>" aria-expanded="false" aria-controls="mobile-menu">
		<span></span><span></span>
	</button>
</header>

<div id="mobile-menu">
	<?php aiy_nav( 'primary', aiy_default_mobile_items() ); ?>
</div>
