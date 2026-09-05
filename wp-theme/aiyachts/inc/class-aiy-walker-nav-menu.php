<?php
/**
 * Flat navigation walker.
 *
 * The AIyachts stylesheet styles navigation as a flex container whose direct
 * children are anchors:
 *
 *     nav.primary { display:flex; }      nav.primary a { … }
 *     #mobile-menu { … }                 #mobile-menu a { … }
 *     .foot-col { display:flex; }        .foot-col a { … }
 *
 * wp_nav_menu()'s default <ul><li><a> markup would put a list between the
 * flex container and its anchors and break all four menus. This walker emits
 * bare <a> elements instead, so a WordPress-managed menu renders byte-for-byte
 * like the static markup and site.css needs no changes.
 *
 * The menus are single level by design; child items are flattened, not nested.
 *
 * @package AIyachts
 */

defined( 'ABSPATH' ) || exit;

/**
 * Renders a nav menu as a flat run of <a> tags.
 */
class AIY_Walker_Nav_Menu extends Walker_Nav_Menu {

	/**
	 * No sub-lists: these menus are flat.
	 *
	 * @param string   $output Passed by reference.
	 * @param int      $depth  Depth of the item.
	 * @param stdClass $args   Menu arguments.
	 */
	public function start_lvl( &$output, $depth = 0, $args = null ) {}

	/**
	 * No sub-lists: these menus are flat.
	 *
	 * @param string   $output Passed by reference.
	 * @param int      $depth  Depth of the item.
	 * @param stdClass $args   Menu arguments.
	 */
	public function end_lvl( &$output, $depth = 0, $args = null ) {}

	/**
	 * Output a single anchor.
	 *
	 * @param string   $output            Passed by reference.
	 * @param WP_Post  $data_object       The menu item.
	 * @param int      $depth             Depth of the item.
	 * @param stdClass $args              Menu arguments.
	 * @param int      $current_object_id Current object ID.
	 */
	public function start_el( &$output, $data_object, $depth = 0, $args = null, $current_object_id = 0 ) {
		$item = $data_object;

		$atts = array(
			'href'         => ! empty( $item->url ) ? $item->url : '',
			'title'        => ! empty( $item->attr_title ) ? $item->attr_title : '',
			'target'       => ! empty( $item->target ) ? $item->target : '',
			'rel'          => ! empty( $item->xfn ) ? $item->xfn : '',
			// site.css styles the active link off aria-current, not off a class.
			'aria-current' => ! empty( $item->current ) ? 'page' : '',
		);

		/** This filter is documented in wp-includes/class-walker-nav-menu.php */
		$atts = apply_filters( 'nav_menu_link_attributes', $atts, $item, $args, $depth );

		$attributes = '';
		foreach ( $atts as $attr => $value ) {
			if ( '' === $value || false === $value || is_null( $value ) ) {
				continue;
			}
			$value       = ( 'href' === $attr ) ? esc_url( $value ) : esc_attr( $value );
			$attributes .= ' ' . $attr . '="' . $value . '"';
		}

		/** This filter is documented in wp-includes/post-template.php */
		$title = apply_filters( 'the_title', $item->title, $item->ID );

		/** This filter is documented in wp-includes/class-walker-nav-menu.php */
		$title = apply_filters( 'nav_menu_item_title', $title, $item, $args, $depth );

		$output .= '<a' . $attributes . '>' . $title . '</a>';
	}

	/**
	 * Close the item.
	 *
	 * @param string   $output      Passed by reference.
	 * @param WP_Post  $data_object The menu item.
	 * @param int      $depth       Depth of the item.
	 * @param stdClass $args        Menu arguments.
	 */
	public function end_el( &$output, $data_object, $depth = 0, $args = null ) {
		$output .= "\n";
	}
}
