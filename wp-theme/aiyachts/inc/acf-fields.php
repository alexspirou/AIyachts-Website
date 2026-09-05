<?php
/**
 * ACF field registration.
 *
 * Field groups are declared in code rather than drawn in the admin UI so the
 * definitions live in version control, travel with the theme, and cannot be
 * lost when a database is refreshed from another environment.
 *
 * Two groups are registered:
 *
 *   group_aiy_company     — global company data on a Theme Settings options
 *                           page. Read by footer.php and inc/schema.php.
 *   group_aiy_front_page  — every editable region of the home page, split
 *                           into tabs that mirror the sections of
 *                           front-page.php. Bound to the template in step 4.
 *
 * Everything degrades: acf_add_local_field_group() and acf_add_options_page()
 * are guarded by function_exists(), and every read goes through aiy_field() /
 * aiy_option(), which return the original static copy when a field is empty.
 *
 * Requires ACF Pro — repeaters and options pages are Pro features.
 *
 * @package AIyachts
 */

defined( 'ABSPATH' ) || exit;

/* -------------------------------------------------------------------------
 * 1. Options page
 * ---------------------------------------------------------------------- */

/**
 * Register the Theme Settings options page.
 *
 * One top-level page holds the data that appears on every page of the site —
 * the numbers, the email and the two bases. It is deliberately not a child of
 * Settings: the client edits it often and should not have to hunt for it.
 */
function aiy_register_options_page() {
	if ( ! function_exists( 'acf_add_options_page' ) ) {
		return;
	}

	acf_add_options_page(
		array(
			'page_title'      => __( 'Theme Settings', 'aiyachts' ),
			'menu_title'      => __( 'Theme Settings', 'aiyachts' ),
			'menu_slug'       => 'aiy-theme-settings',
			'capability'      => 'edit_theme_options',
			'position'        => 59,
			'icon_url'        => 'dashicons-sos',
			'redirect'        => false,
			'update_button'   => __( 'Save settings', 'aiyachts' ),
			'updated_message' => __( 'Theme settings saved.', 'aiyachts' ),
		)
	);
}
add_action( 'acf/init', 'aiy_register_options_page' );


/* -------------------------------------------------------------------------
 * 2. Company info — the Theme Settings fields
 * ---------------------------------------------------------------------- */

/**
 * Register the global company field group.
 */
function aiy_register_company_fields() {
	if ( ! function_exists( 'acf_add_local_field_group' ) ) {
		return;
	}

	acf_add_local_field_group(
		array(
			'key'                   => 'group_aiy_company',
			'title'                 => __( 'Company information', 'aiyachts' ),
			'menu_order'            => 0,
			'position'              => 'normal',
			'style'                 => 'default',
			'label_placement'       => 'top',
			'active'                => true,
			'description'           => __( 'Shown in the site footer and in the structured data search engines read.', 'aiyachts' ),
			'location'              => array(
				array(
					array(
						'param'    => 'options_page',
						'operator' => '==',
						'value'    => 'aiy-theme-settings',
					),
				),
			),
			'fields'                => array(

				/* ----------------------------------------- Tab: Contact */
				array(
					'key'       => 'field_aiy_tab_contact',
					'label'     => __( 'Contact', 'aiyachts' ),
					'name'      => '',
					'type'      => 'tab',
					'placement' => 'top',
				),
				array(
					'key'           => 'field_aiy_company_email',
					'label'         => __( 'Email address', 'aiyachts' ),
					'name'          => 'company_email',
					'type'          => 'email',
					'instructions'  => __( 'The public enquiry address. Used in the footer, in the enquiry form and in structured data.', 'aiyachts' ),
					'required'      => 0,
					'default_value' => 'aiyachtsea@gmail.com',
				),
				array(
					'key'          => 'field_aiy_phones',
					'label'        => __( 'Phone numbers', 'aiyachts' ),
					'name'         => 'phones',
					'type'         => 'repeater',
					'instructions' => __( 'Listed in the footer in this order. The first number is the one search engines treat as primary. Type the number as you want it displayed — the dialling link is generated automatically.', 'aiyachts' ),
					'layout'       => 'table',
					'min'          => 0,
					'button_label' => __( 'Add phone number', 'aiyachts' ),
					'sub_fields'   => array(
						array(
							'key'         => 'field_aiy_phone_number',
							'label'       => __( 'Number', 'aiyachts' ),
							'name'        => 'number',
							'type'        => 'text',
							'placeholder' => '+30 697 23 56 502',
							'required'    => 1,
						),
					),
				),

				/* ------------------------------------------- Tab: Bases */
				array(
					'key'       => 'field_aiy_tab_bases',
					'label'     => __( 'Bases', 'aiyachts' ),
					'name'      => '',
					'type'      => 'tab',
					'placement' => 'top',
				),
				array(
					'key'          => 'field_aiy_bases',
					'label'        => __( 'Operating bases', 'aiyachts' ),
					'name'         => 'bases',
					'type'         => 'repeater',
					'instructions' => __( 'Each base becomes a LocalBusiness entry in the structured data, which is how Google shows the pin on a map. The address line is what appears in the footer.', 'aiyachts' ),
					'layout'       => 'row',
					'min'          => 0,
					'button_label' => __( 'Add base', 'aiyachts' ),
					'sub_fields'   => array(
						array(
							'key'         => 'field_aiy_base_name',
							'label'       => __( 'Base name', 'aiyachts' ),
							'name'        => 'name',
							'type'        => 'text',
							'placeholder' => 'Athens base',
							'required'    => 1,
							'wrapper'     => array( 'width' => '50' ),
						),
						array(
							'key'          => 'field_aiy_base_address_line',
							'label'        => __( 'Address line (footer)', 'aiyachts' ),
							'name'         => 'address_line',
							'type'         => 'text',
							'instructions' => __( 'One line, as printed in the footer.', 'aiyachts' ),
							'placeholder'  => 'Alexandroupoleos 20, 11527 Athens',
							'wrapper'      => array( 'width' => '50' ),
						),
						array(
							'key'          => 'field_aiy_base_street',
							'label'        => __( 'Street address', 'aiyachts' ),
							'name'         => 'street',
							'type'         => 'text',
							'instructions' => __( 'Structured data only.', 'aiyachts' ),
							'wrapper'      => array( 'width' => '40' ),
						),
						array(
							'key'     => 'field_aiy_base_postcode',
							'label'   => __( 'Postcode', 'aiyachts' ),
							'name'    => 'postcode',
							'type'    => 'text',
							'wrapper' => array( 'width' => '20' ),
						),
						array(
							'key'     => 'field_aiy_base_locality',
							'label'   => __( 'Town or city', 'aiyachts' ),
							'name'    => 'locality',
							'type'    => 'text',
							'wrapper' => array( 'width' => '20' ),
						),
						array(
							'key'     => 'field_aiy_base_region',
							'label'   => __( 'Region', 'aiyachts' ),
							'name'    => 'region',
							'type'    => 'text',
							'wrapper' => array( 'width' => '20' ),
						),
						array(
							'key'           => 'field_aiy_base_country',
							'label'         => __( 'Country code', 'aiyachts' ),
							'name'          => 'country',
							'type'          => 'text',
							'default_value' => 'GR',
							'maxlength'     => 2,
							'wrapper'       => array( 'width' => '20' ),
						),
						array(
							'key'          => 'field_aiy_base_lat',
							'label'        => __( 'Latitude', 'aiyachts' ),
							'name'         => 'latitude',
							'type'         => 'number',
							'instructions' => __( 'Optional. Copy from Google Maps.', 'aiyachts' ),
							'step'         => 'any',
							'wrapper'      => array( 'width' => '40' ),
						),
						array(
							'key'     => 'field_aiy_base_lng',
							'label'   => __( 'Longitude', 'aiyachts' ),
							'name'    => 'longitude',
							'type'    => 'number',
							'step'    => 'any',
							'wrapper' => array( 'width' => '40' ),
						),
					),
				),

				/* ------------------------------------------ Tab: Social */
				array(
					'key'       => 'field_aiy_tab_social',
					'label'     => __( 'Social', 'aiyachts' ),
					'name'      => '',
					'type'      => 'tab',
					'placement' => 'top',
				),
				array(
					'key'          => 'field_aiy_social',
					'label'        => __( 'Social profiles', 'aiyachts' ),
					'name'         => 'social_links',
					'type'         => 'repeater',
					'instructions' => __( 'Added to the organisation structured data as sameAs, which is how search engines connect the website to the Instagram and Facebook accounts. The static site never had these — adding them here is a genuine improvement.', 'aiyachts' ),
					'layout'       => 'table',
					'min'          => 0,
					'button_label' => __( 'Add profile', 'aiyachts' ),
					'sub_fields'   => array(
						array(
							'key'         => 'field_aiy_social_label',
							'label'       => __( 'Network', 'aiyachts' ),
							'name'        => 'label',
							'type'        => 'text',
							'placeholder' => 'Instagram',
						),
						array(
							'key'         => 'field_aiy_social_url',
							'label'       => __( 'Profile URL', 'aiyachts' ),
							'name'        => 'url',
							'type'        => 'url',
							'placeholder' => 'https://instagram.com/…',
							'required'    => 1,
						),
					),
				),
			),
		)
	);
}
add_action( 'acf/init', 'aiy_register_company_fields' );


/* -------------------------------------------------------------------------
 * 3. Front page
 *
 * One tab per section of front-page.php, in the order they appear on screen,
 * so the edit screen reads top-to-bottom like the page does.
 *
 * The group is attached by page type rather than by template name: WordPress
 * assigns front-page.php automatically to whichever page is set as the static
 * front page, so a template-name rule would silently miss it.
 * ---------------------------------------------------------------------- */

/**
 * Register the front page field group.
 */
function aiy_register_front_page_fields() {
	if ( ! function_exists( 'acf_add_local_field_group' ) ) {
		return;
	}

	acf_add_local_field_group(
		array(
			'key'                   => 'group_aiy_front_page',
			'title'                 => __( 'Home page', 'aiyachts' ),
			'menu_order'            => 0,
			'position'              => 'normal',
			'style'                 => 'default',
			'label_placement'       => 'top',
			'active'                => true,
			'description'           => __( 'Every editable region of the home page. Leave a field empty and the section falls back to its original wording rather than breaking.', 'aiyachts' ),
			'hide_on_screen'        => array( 'the_content' ),
			'location'              => array(
				array(
					array(
						'param'    => 'page_type',
						'operator' => '==',
						'value'    => 'front_page',
					),
				),
			),
			'fields'                => array(

				/* ======================================== Tab: Hero === */
				array(
					'key'       => 'field_aiy_tab_hero',
					'label'     => __( 'Hero', 'aiyachts' ),
					'name'      => '',
					'type'      => 'tab',
					'placement' => 'top',
				),
				array(
					'key'          => 'field_aiy_hero_lines',
					'label'        => __( 'Headline', 'aiyachts' ),
					'name'         => 'hero_lines',
					'type'         => 'repeater',
					'instructions' => __( 'One row per line of the headline. Wrap a word in &lt;em&gt; to render it in the italic display face — for example: Live &lt;em&gt;unforgettable&lt;/em&gt;.', 'aiyachts' ),
					'layout'       => 'table',
					'min'          => 0,
					'max'          => 4,
					'button_label' => __( 'Add line', 'aiyachts' ),
					'sub_fields'   => array(
						array(
							'key'         => 'field_aiy_hero_line_text',
							'label'       => __( 'Line', 'aiyachts' ),
							'name'        => 'text',
							'type'        => 'text',
							'placeholder' => 'Set sail.',
							'required'    => 1,
						),
					),
				),
				array(
					'key'           => 'field_aiy_hero_lede',
					'label'         => __( 'Standfirst', 'aiyachts' ),
					'name'          => 'hero_lede',
					'type'          => 'textarea',
					'rows'          => 3,
					'new_lines'     => '',
					'default_value' => 'From the deep blues of the Aegean to the emerald bays of the Ionian — hidden coves, timeless island life, and sunsets that feel almost unreal.',
				),
				array(
					'key'           => 'field_aiy_hero_video',
					'label'         => __( 'Background film', 'aiyachts' ),
					'name'          => 'hero_video',
					'type'          => 'file',
					'instructions'  => __( 'MP4, muted, no audio track, ideally under 4 MB. Leave empty to use the film bundled with the theme.', 'aiyachts' ),
					'return_format' => 'array',
					'mime_types'    => 'mp4,webm',
				),
				array(
					'key'           => 'field_aiy_hero_poster',
					'label'         => __( 'Poster frame', 'aiyachts' ),
					'name'          => 'hero_poster',
					'type'          => 'image',
					'instructions'  => __( 'Shown while the film loads, and to anyone who has asked their device to reduce motion. This is the image the page is measured on for loading speed, so keep it well compressed.', 'aiyachts' ),
					'return_format' => 'array',
					'preview_size'  => 'medium',
				),
				array(
					'key'           => 'field_aiy_hero_cta_primary',
					'label'         => __( 'Primary button', 'aiyachts' ),
					'name'          => 'hero_cta_primary',
					'type'          => 'link',
					'instructions'  => __( 'Points at the booking bar below the hero by default. Use #booking to keep it there.', 'aiyachts' ),
					'return_format' => 'array',
					'wrapper'       => array( 'width' => '50' ),
				),
				array(
					'key'           => 'field_aiy_hero_cta_secondary',
					'label'         => __( 'Secondary link', 'aiyachts' ),
					'name'          => 'hero_cta_secondary',
					'type'          => 'link',
					'return_format' => 'array',
					'wrapper'       => array( 'width' => '50' ),
				),

				/* ===================================== Tab: Booking === */
				array(
					'key'       => 'field_aiy_tab_booking',
					'label'     => __( 'Booking bar', 'aiyachts' ),
					'name'      => '',
					'type'      => 'tab',
					'placement' => 'top',
				),
				array(
					'key'           => 'field_aiy_booking_enable',
					'label'         => __( 'Show the booking bar', 'aiyachts' ),
					'name'          => 'booking_enable',
					'type'          => 'true_false',
					'instructions'  => __( 'The quick enquiry strip that sits over the bottom of the hero.', 'aiyachts' ),
					'ui'            => 1,
					'default_value' => 1,
				),
				array(
					'key'          => 'field_aiy_booking_destinations',
					'label'        => __( 'Destination choices', 'aiyachts' ),
					'name'         => 'booking_destinations',
					'type'         => 'repeater',
					'instructions' => __( 'The options in the Destination dropdown. Passed straight through to the enquiry form on the contact page.', 'aiyachts' ),
					'layout'       => 'table',
					'min'          => 0,
					'button_label' => __( 'Add choice', 'aiyachts' ),
					'conditional_logic' => array(
						array(
							array(
								'field'    => 'field_aiy_booking_enable',
								'operator' => '==',
								'value'    => '1',
							),
						),
					),
					'sub_fields'   => array(
						array(
							'key'         => 'field_aiy_booking_destination_label',
							'label'       => __( 'Label', 'aiyachts' ),
							'name'        => 'label',
							'type'        => 'text',
							'placeholder' => 'Ionian — Lefkas base',
							'required'    => 1,
						),
					),
				),
				array(
					'key'               => 'field_aiy_booking_guests_default',
					'label'             => __( 'Default guest count', 'aiyachts' ),
					'name'              => 'booking_guests_default',
					'type'              => 'number',
					'default_value'     => 2,
					'min'               => 1,
					'max'               => 20,
					'wrapper'           => array( 'width' => '50' ),
					'conditional_logic' => array(
						array(
							array(
								'field'    => 'field_aiy_booking_enable',
								'operator' => '==',
								'value'    => '1',
							),
						),
					),
				),
				array(
					'key'               => 'field_aiy_booking_submit_label',
					'label'             => __( 'Button label', 'aiyachts' ),
					'name'              => 'booking_submit_label',
					'type'              => 'text',
					'default_value'     => 'Enquire',
					'wrapper'           => array( 'width' => '50' ),
					'conditional_logic' => array(
						array(
							array(
								'field'    => 'field_aiy_booking_enable',
								'operator' => '==',
								'value'    => '1',
							),
						),
					),
				),

				/* ======================================= Tab: About === */
				array(
					'key'       => 'field_aiy_tab_about',
					'label'     => __( 'About', 'aiyachts' ),
					'name'      => '',
					'type'      => 'tab',
					'placement' => 'top',
				),
				array(
					'key'           => 'field_aiy_about_eyebrow',
					'label'         => __( 'Eyebrow', 'aiyachts' ),
					'name'          => 'about_eyebrow',
					'type'          => 'text',
					'default_value' => 'About AIyachts',
					'wrapper'       => array( 'width' => '50' ),
				),
				array(
					'key'           => 'field_aiy_about_heading',
					'label'         => __( 'Heading', 'aiyachts' ),
					'name'          => 'about_heading',
					'type'          => 'text',
					'default_value' => 'Two seas. One philosophy.',
					'wrapper'       => array( 'width' => '50' ),
				),
				array(
					'key'          => 'field_aiy_about_body',
					'label'        => __( 'Body copy', 'aiyachts' ),
					'name'         => 'about_body',
					'type'         => 'wysiwyg',
					'tabs'         => 'visual',
					'toolbar'      => 'basic',
					'media_upload' => 0,
					'delay'        => 1,
				),
				array(
					'key'          => 'field_aiy_about_quote',
					'label'        => __( 'Pull quote', 'aiyachts' ),
					'name'         => 'about_quote',
					'type'         => 'textarea',
					'rows'         => 3,
					'new_lines'    => '',
					'instructions' => __( 'Typed without quotation marks — the design adds them.', 'aiyachts' ),
				),
				array(
					'key'     => 'field_aiy_about_quote_cite',
					'label'   => __( 'Quote attribution', 'aiyachts' ),
					'name'    => 'about_quote_cite',
					'type'    => 'text',
					'wrapper' => array( 'width' => '50' ),
				),
				array(
					'key'           => 'field_aiy_about_link',
					'label'         => __( 'Read-more link', 'aiyachts' ),
					'name'          => 'about_link',
					'type'          => 'link',
					'return_format' => 'array',
					'wrapper'       => array( 'width' => '50' ),
				),

				/* ============================== Tab: Bases & map === */
				array(
					'key'       => 'field_aiy_tab_seas',
					'label'     => __( 'Bases & map', 'aiyachts' ),
					'name'      => '',
					'type'      => 'tab',
					'placement' => 'top',
				),
				array(
					'key'           => 'field_aiy_seas_eyebrow',
					'label'         => __( 'Eyebrow', 'aiyachts' ),
					'name'          => 'seas_eyebrow',
					'type'          => 'text',
					'default_value' => 'Two Bases, Two Characters',
					'wrapper'       => array( 'width' => '50' ),
				),
				array(
					'key'           => 'field_aiy_seas_heading',
					'label'         => __( 'Heading', 'aiyachts' ),
					'name'          => 'seas_heading',
					'type'          => 'text',
					'default_value' => 'Choose your sea.',
					'wrapper'       => array( 'width' => '50' ),
				),
				array(
					'key'       => 'field_aiy_seas_intro',
					'label'     => __( 'Intro', 'aiyachts' ),
					'name'      => 'seas_intro',
					'type'      => 'textarea',
					'rows'      => 2,
					'new_lines' => '',
				),
				array(
					'key'          => 'field_aiy_sea_cards',
					'label'        => __( 'Sea cards', 'aiyachts' ),
					'name'         => 'sea_cards',
					'type'         => 'repeater',
					'instructions' => __( 'The two cards beside the map. The sea setting links a card to its half of the map, so the card lights up when that sea is selected — keep one Ionian and one Aegean.', 'aiyachts' ),
					'layout'       => 'row',
					'min'          => 0,
					'max'          => 2,
					'button_label' => __( 'Add sea card', 'aiyachts' ),
					'sub_fields'   => array(
						array(
							'key'           => 'field_aiy_sea_card_sea',
							'label'         => __( 'Sea', 'aiyachts' ),
							'name'          => 'sea',
							'type'          => 'select',
							'choices'       => array(
								'ionian' => __( 'Ionian', 'aiyachts' ),
								'aegean' => __( 'Aegean', 'aiyachts' ),
							),
							'default_value' => 'ionian',
							'return_format' => 'value',
							'wrapper'       => array( 'width' => '25' ),
						),
						array(
							'key'         => 'field_aiy_sea_card_eyebrow',
							'label'       => __( 'Eyebrow', 'aiyachts' ),
							'name'        => 'eyebrow',
							'type'        => 'text',
							'placeholder' => 'Destination · Ionian Sea',
							'wrapper'     => array( 'width' => '35' ),
						),
						array(
							'key'         => 'field_aiy_sea_card_title',
							'label'       => __( 'Title', 'aiyachts' ),
							'name'        => 'title',
							'type'        => 'text',
							'placeholder' => 'Lefkas Base',
							'wrapper'     => array( 'width' => '40' ),
						),
						array(
							'key'       => 'field_aiy_sea_card_text',
							'label'     => __( 'Description', 'aiyachts' ),
							'name'      => 'text',
							'type'      => 'textarea',
							'rows'      => 3,
							'new_lines' => '',
						),
						array(
							'key'         => 'field_aiy_sea_card_cta',
							'label'       => __( 'Link label', 'aiyachts' ),
							'name'        => 'cta_label',
							'type'        => 'text',
							'placeholder' => 'Sail the Ionian',
							'wrapper'     => array( 'width' => '50' ),
						),
						array(
							'key'           => 'field_aiy_sea_card_link',
							'label'         => __( 'Links to', 'aiyachts' ),
							'name'          => 'link',
							'type'          => 'page_link',
							'post_type'     => array( 'page' ),
							'allow_null'    => 1,
							'allow_archives' => 0,
							'multiple'      => 0,
							'wrapper'       => array( 'width' => '50' ),
						),
					),
				),
				array(
					'key'           => 'field_aiy_seas_foot_link',
					'label'         => __( 'Closing link', 'aiyachts' ),
					'name'          => 'seas_foot_link',
					'type'          => 'link',
					'return_format' => 'array',
				),
				array(
					'key'     => 'field_aiy_seas_map_note',
					'label'   => __( 'A note on the map', 'aiyachts' ),
					'name'    => '',
					'type'    => 'message',
					'message' => __( 'The interactive map of Greece is drawn from three artwork files bundled with the theme, aligned to a fixed coordinate grid. It is not editable here on purpose — swapping the artwork would pull the island overlays and the sea labels out of register. Ask your developer if the map itself needs to change.', 'aiyachts' ),
					'esc_html' => 0,
					'new_lines' => 'wpautop',
				),

				/* ======================================= Tab: Fleet === */
				array(
					'key'       => 'field_aiy_tab_fleet',
					'label'     => __( 'Fleet', 'aiyachts' ),
					'name'      => '',
					'type'      => 'tab',
					'placement' => 'top',
				),
				array(
					'key'           => 'field_aiy_fleet_eyebrow',
					'label'         => __( 'Eyebrow', 'aiyachts' ),
					'name'          => 'fleet_eyebrow',
					'type'          => 'text',
					'default_value' => 'Bareboat & Skippered Charters',
					'wrapper'       => array( 'width' => '50' ),
				),
				array(
					'key'           => 'field_aiy_fleet_heading',
					'label'         => __( 'Heading', 'aiyachts' ),
					'name'          => 'fleet_heading',
					'type'          => 'text',
					'default_value' => 'Our fleet',
					'wrapper'       => array( 'width' => '50' ),
				),
				array(
					'key'       => 'field_aiy_fleet_intro',
					'label'     => __( 'Intro', 'aiyachts' ),
					'name'      => 'fleet_intro',
					'type'      => 'textarea',
					'rows'      => 2,
					'new_lines' => '',
				),
				array(
					'key'           => 'field_aiy_fleet_band_image',
					'label'         => __( 'Banner image', 'aiyachts' ),
					'name'          => 'fleet_band_image',
					'type'          => 'image',
					'instructions'  => __( 'The full-width photograph between the heading and the yacht cards.', 'aiyachts' ),
					'return_format' => 'array',
					'preview_size'  => 'medium',
					'wrapper'       => array( 'width' => '50' ),
				),
				array(
					'key'           => 'field_aiy_fleet_band_caption',
					'label'         => __( 'Banner caption', 'aiyachts' ),
					'name'          => 'fleet_band_caption',
					'type'          => 'text',
					'default_value' => 'Our own boats, in our own waters',
					'wrapper'       => array( 'width' => '50' ),
				),
				array(
					'key'          => 'field_aiy_fleet_yachts',
					'label'        => __( 'Featured yachts', 'aiyachts' ),
					'name'         => 'fleet_yachts',
					'type'         => 'repeater',
					'instructions' => __( 'The cards shown on the home page — a selection, not the whole fleet. Six sits neatly in the grid.', 'aiyachts' ),
					'layout'       => 'block',
					'min'          => 0,
					'button_label' => __( 'Add yacht', 'aiyachts' ),
					'sub_fields'   => array(
						array(
							'key'           => 'field_aiy_yacht_image',
							'label'         => __( 'Photograph', 'aiyachts' ),
							'name'          => 'image',
							'type'          => 'image',
							'instructions'  => __( 'Landscape, roughly 640 × 380. The alt text you set in the media library is what screen readers and search engines read, so write it there.', 'aiyachts' ),
							'return_format' => 'array',
							'preview_size'  => 'thumbnail',
							'wrapper'       => array( 'width' => '30' ),
						),
						array(
							'key'         => 'field_aiy_yacht_title',
							'label'       => __( 'Yacht name', 'aiyachts' ),
							'name'        => 'title',
							'type'        => 'text',
							'placeholder' => 'Bavaria 40 Cruiser',
							'required'    => 1,
							'wrapper'     => array( 'width' => '40' ),
						),
						array(
							'key'           => 'field_aiy_yacht_flag',
							'label'         => __( 'Hull badge', 'aiyachts' ),
							'name'          => 'flag',
							'type'          => 'text',
							'instructions'  => __( 'The tag over the photograph.', 'aiyachts' ),
							'default_value' => 'Monohull',
							'wrapper'       => array( 'width' => '30' ),
						),
						array(
							'key'          => 'field_aiy_yacht_meta',
							'label'        => __( 'Cabins and year', 'aiyachts' ),
							'name'         => 'meta',
							'type'         => 'text',
							'instructions' => __( 'The small line above the name.', 'aiyachts' ),
							'placeholder'  => '3 Cabins · 2011',
							'wrapper'      => array( 'width' => '35' ),
						),
						array(
							'key'          => 'field_aiy_yacht_specs',
							'label'        => __( 'Specifications', 'aiyachts' ),
							'name'         => 'specs',
							'type'         => 'repeater',
							'instructions' => __( 'The chips under the name — guests, berths, heads. Three fits the card.', 'aiyachts' ),
							'layout'       => 'table',
							'min'          => 0,
							'max'          => 4,
							'button_label' => __( 'Add spec', 'aiyachts' ),
							'wrapper'      => array( 'width' => '65' ),
							'sub_fields'   => array(
								array(
									'key'         => 'field_aiy_yacht_spec_text',
									'label'       => __( 'Spec', 'aiyachts' ),
									'name'        => 'text',
									'type'        => 'text',
									'placeholder' => '7 guests',
									'required'    => 1,
								),
							),
						),
						array(
							'key'            => 'field_aiy_yacht_link',
							'label'          => __( 'Yacht page', 'aiyachts' ),
							'name'           => 'link',
							'type'           => 'page_link',
							'post_type'      => array( 'page' ),
							'allow_null'     => 1,
							'allow_archives' => 0,
							'multiple'       => 0,
							'wrapper'        => array( 'width' => '60' ),
						),
						array(
							'key'           => 'field_aiy_yacht_cta',
							'label'         => __( 'Link label', 'aiyachts' ),
							'name'          => 'cta_label',
							'type'          => 'text',
							'default_value' => 'View yacht',
							'wrapper'       => array( 'width' => '40' ),
						),
					),
				),
				array(
					'key'           => 'field_aiy_fleet_cta',
					'label'         => __( 'Button below the grid', 'aiyachts' ),
					'name'          => 'fleet_cta',
					'type'          => 'link',
					'return_format' => 'array',
				),

				/* ================================= Tab: Experiences === */
				array(
					'key'       => 'field_aiy_tab_experiences',
					'label'     => __( 'Experiences', 'aiyachts' ),
					'name'      => '',
					'type'      => 'tab',
					'placement' => 'top',
				),
				array(
					'key'           => 'field_aiy_exp_eyebrow',
					'label'         => __( 'Eyebrow', 'aiyachts' ),
					'name'          => 'exp_eyebrow',
					'type'          => 'text',
					'default_value' => 'Gallery of Experiences',
					'wrapper'       => array( 'width' => '50' ),
				),
				array(
					'key'           => 'field_aiy_exp_heading',
					'label'         => __( 'Heading', 'aiyachts' ),
					'name'          => 'exp_heading',
					'type'          => 'text',
					'default_value' => 'Life aboard.',
					'wrapper'       => array( 'width' => '50' ),
				),
				array(
					'key'       => 'field_aiy_exp_intro',
					'label'     => __( 'Intro', 'aiyachts' ),
					'name'      => 'exp_intro',
					'type'      => 'textarea',
					'rows'      => 2,
					'new_lines' => '',
				),
				array(
					'key'          => 'field_aiy_gallery_items',
					'label'        => __( 'Gallery tiles', 'aiyachts' ),
					'name'         => 'gallery_items',
					'type'         => 'repeater',
					'instructions' => __( 'The teaser grid on the home page. Six fills it. Clicking a tile opens the full gallery page. Set each photograph\'s alt text in the media library.', 'aiyachts' ),
					'layout'       => 'block',
					'min'          => 0,
					'button_label' => __( 'Add tile', 'aiyachts' ),
					'sub_fields'   => array(
						array(
							'key'           => 'field_aiy_gallery_image',
							'label'         => __( 'Photograph', 'aiyachts' ),
							'name'          => 'image',
							'type'          => 'image',
							'instructions'  => __( 'Upload the largest version you have — WordPress generates the smaller sizes and serves whichever fits the visitor\'s screen.', 'aiyachts' ),
							'return_format' => 'array',
							'preview_size'  => 'thumbnail',
							'required'      => 1,
							'wrapper'       => array( 'width' => '30' ),
						),
						array(
							'key'         => 'field_aiy_gallery_title',
							'label'       => __( 'Caption', 'aiyachts' ),
							'name'        => 'title',
							'type'        => 'text',
							'placeholder' => 'Anchored in an olive-framed cove',
							'required'    => 1,
							'wrapper'     => array( 'width' => '40' ),
						),
						array(
							'key'           => 'field_aiy_gallery_cat',
							'label'         => __( 'Category', 'aiyachts' ),
							'name'          => 'category',
							'type'          => 'select',
							'instructions'  => __( 'Used by the filters on the full gallery page.', 'aiyachts' ),
							'choices'       => array(
								'coves'   => __( 'Coves & anchorages', 'aiyachts' ),
								'onboard' => __( 'On board', 'aiyachts' ),
								'islands' => __( 'Islands & harbours', 'aiyachts' ),
								'golden'  => __( 'Golden hour', 'aiyachts' ),
							),
							'default_value' => 'coves',
							'return_format' => 'value',
							'wrapper'       => array( 'width' => '30' ),
						),
						array(
							'key'           => 'field_aiy_gallery_cols',
							'label'         => __( 'Columns spanned', 'aiyachts' ),
							'name'          => 'col_span',
							'type'          => 'number',
							'instructions'  => __( 'How wide the tile sits in the mosaic.', 'aiyachts' ),
							'default_value' => 2,
							'min'           => 1,
							'max'           => 6,
							'wrapper'       => array( 'width' => '25' ),
						),
						array(
							'key'           => 'field_aiy_gallery_rows',
							'label'         => __( 'Rows spanned', 'aiyachts' ),
							'name'          => 'row_span',
							'type'          => 'number',
							'default_value' => 3,
							'min'           => 1,
							'max'           => 6,
							'wrapper'       => array( 'width' => '25' ),
						),
						array(
							'key'          => 'field_aiy_gallery_lqip',
							'label'        => __( 'Blur placeholder', 'aiyachts' ),
							'name'         => 'lqip',
							'type'         => 'text',
							'instructions' => __( 'Optional, developer-supplied. A tiny base64 image shown while the photograph loads. Leave empty and the tile simply fades in instead.', 'aiyachts' ),
							'wrapper'      => array( 'width' => '50' ),
						),
					),
				),
				array(
					'key'           => 'field_aiy_exp_cta',
					'label'         => __( 'Button below the grid', 'aiyachts' ),
					'name'          => 'exp_cta',
					'type'          => 'link',
					'return_format' => 'array',
				),

				/* ==================================== Tab: Services === */
				array(
					'key'       => 'field_aiy_tab_services',
					'label'     => __( 'Services', 'aiyachts' ),
					'name'      => '',
					'type'      => 'tab',
					'placement' => 'top',
				),
				array(
					'key'           => 'field_aiy_services_eyebrow',
					'label'         => __( 'Eyebrow', 'aiyachts' ),
					'name'          => 'services_eyebrow',
					'type'          => 'text',
					'default_value' => 'Guest Services',
					'wrapper'       => array( 'width' => '50' ),
				),
				array(
					'key'           => 'field_aiy_services_heading',
					'label'         => __( 'Heading', 'aiyachts' ),
					'name'          => 'services_heading',
					'type'          => 'text',
					'default_value' => 'Experience, co-created.',
					'wrapper'       => array( 'width' => '50' ),
				),
				array(
					'key'       => 'field_aiy_services_intro',
					'label'     => __( 'Intro', 'aiyachts' ),
					'name'      => 'services_intro',
					'type'      => 'textarea',
					'rows'      => 2,
					'new_lines' => '',
				),
				array(
					'key'          => 'field_aiy_services',
					'label'        => __( 'Service cards', 'aiyachts' ),
					'name'         => 'services',
					'type'         => 'repeater',
					'instructions' => __( 'Three cards fit the row.', 'aiyachts' ),
					'layout'       => 'block',
					'min'          => 0,
					'button_label' => __( 'Add service', 'aiyachts' ),
					'sub_fields'   => array(
						array(
							'key'           => 'field_aiy_service_icon',
							'label'         => __( 'Icon', 'aiyachts' ),
							'name'          => 'icon',
							'type'          => 'select',
							'instructions'  => __( 'Line drawings that ship with the theme.', 'aiyachts' ),
							'choices'       => array(
								'concierge'  => __( 'Concierge — single figure', 'aiyachts' ),
								'provisions' => __( 'Provisions — provisions crate', 'aiyachts' ),
								'crew'       => __( 'Crew — two figures', 'aiyachts' ),
								'none'       => __( 'No icon', 'aiyachts' ),
							),
							'default_value' => 'concierge',
							'return_format' => 'value',
							'wrapper'       => array( 'width' => '30' ),
						),
						array(
							'key'         => 'field_aiy_service_title',
							'label'       => __( 'Title', 'aiyachts' ),
							'name'        => 'title',
							'type'        => 'text',
							'placeholder' => 'Concierge',
							'required'    => 1,
							'wrapper'     => array( 'width' => '70' ),
						),
						array(
							'key'       => 'field_aiy_service_text',
							'label'     => __( 'Description', 'aiyachts' ),
							'name'      => 'text',
							'type'      => 'textarea',
							'rows'      => 3,
							'new_lines' => '',
						),
					),
				),
				array(
					'key'           => 'field_aiy_services_foot_link',
					'label'         => __( 'Closing link', 'aiyachts' ),
					'name'          => 'services_foot_link',
					'type'          => 'link',
					'return_format' => 'array',
				),

				/* =================================== Tab: Brokerage === */
				array(
					'key'       => 'field_aiy_tab_brokerage',
					'label'     => __( 'Brokerage', 'aiyachts' ),
					'name'      => '',
					'type'      => 'tab',
					'placement' => 'top',
				),
				array(
					'key'           => 'field_aiy_brokerage_eyebrow',
					'label'         => __( 'Eyebrow', 'aiyachts' ),
					'name'          => 'brokerage_eyebrow',
					'type'          => 'text',
					'default_value' => 'Brokerage & Management',
					'wrapper'       => array( 'width' => '50' ),
				),
				array(
					'key'           => 'field_aiy_brokerage_heading',
					'label'         => __( 'Heading', 'aiyachts' ),
					'name'          => 'brokerage_heading',
					'type'          => 'text',
					'default_value' => 'For owners & investors.',
					'wrapper'       => array( 'width' => '50' ),
				),
				array(
					'key'          => 'field_aiy_brokerage_panels',
					'label'        => __( 'Panels', 'aiyachts' ),
					'name'         => 'brokerage_panels',
					'type'         => 'repeater',
					'instructions' => __( 'Two panels sit side by side — one aimed at private buyers, one at charter companies and owners.', 'aiyachts' ),
					'layout'       => 'block',
					'min'          => 0,
					'max'          => 2,
					'button_label' => __( 'Add panel', 'aiyachts' ),
					'sub_fields'   => array(
						array(
							'key'         => 'field_aiy_brokerage_panel_eyebrow',
							'label'       => __( 'Eyebrow', 'aiyachts' ),
							'name'        => 'eyebrow',
							'type'        => 'text',
							'placeholder' => 'B2C · Private buyers & sellers',
							'wrapper'     => array( 'width' => '50' ),
						),
						array(
							'key'         => 'field_aiy_brokerage_panel_title',
							'label'       => __( 'Title', 'aiyachts' ),
							'name'        => 'title',
							'type'        => 'text',
							'placeholder' => 'Investment & Brokerage',
							'required'    => 1,
							'wrapper'     => array( 'width' => '50' ),
						),
						array(
							'key'       => 'field_aiy_brokerage_panel_text',
							'label'     => __( 'Description', 'aiyachts' ),
							'name'      => 'text',
							'type'      => 'textarea',
							'rows'      => 3,
							'new_lines' => '',
						),
						array(
							'key'          => 'field_aiy_brokerage_panel_list',
							'label'        => __( 'Bullet list', 'aiyachts' ),
							'name'         => 'list',
							'type'         => 'repeater',
							'instructions' => __( 'Each row prints the label in bold with the note beside it.', 'aiyachts' ),
							'layout'       => 'table',
							'min'          => 0,
							'button_label' => __( 'Add row', 'aiyachts' ),
							'sub_fields'   => array(
								array(
									'key'         => 'field_aiy_brokerage_list_label',
									'label'       => __( 'Label', 'aiyachts' ),
									'name'        => 'label',
									'type'        => 'text',
									'placeholder' => 'Yachts for sale',
									'required'    => 1,
								),
								array(
									'key'         => 'field_aiy_brokerage_list_note',
									'label'       => __( 'Note', 'aiyachts' ),
									'name'        => 'note',
									'type'        => 'text',
									'placeholder' => 'Curated listings',
								),
							),
						),
						array(
							'key'           => 'field_aiy_brokerage_panel_cta',
							'label'         => __( 'Button', 'aiyachts' ),
							'name'          => 'cta',
							'type'          => 'link',
							'return_format' => 'array',
						),
					),
				),

				/* ================================= Tab: Closing CTA === */
				array(
					'key'       => 'field_aiy_tab_cta',
					'label'     => __( 'Closing call to action', 'aiyachts' ),
					'name'      => '',
					'type'      => 'tab',
					'placement' => 'top',
				),
				array(
					'key'           => 'field_aiy_cta_eyebrow',
					'label'         => __( 'Eyebrow', 'aiyachts' ),
					'name'          => 'cta_eyebrow',
					'type'          => 'text',
					'default_value' => 'Ready when you are',
					'wrapper'       => array( 'width' => '50' ),
				),
				array(
					'key'           => 'field_aiy_cta_heading',
					'label'         => __( 'Heading', 'aiyachts' ),
					'name'          => 'cta_heading',
					'type'          => 'text',
					'default_value' => 'Tell us where you\'d like to wake up.',
					'wrapper'       => array( 'width' => '50' ),
				),
				array(
					'key'       => 'field_aiy_cta_text',
					'label'     => __( 'Body copy', 'aiyachts' ),
					'name'      => 'cta_text',
					'type'      => 'textarea',
					'rows'      => 3,
					'new_lines' => '',
				),
				array(
					'key'           => 'field_aiy_cta_primary',
					'label'         => __( 'Primary button', 'aiyachts' ),
					'name'          => 'cta_primary',
					'type'          => 'link',
					'return_format' => 'array',
					'wrapper'       => array( 'width' => '50' ),
				),
				array(
					'key'           => 'field_aiy_cta_secondary',
					'label'         => __( 'Secondary button', 'aiyachts' ),
					'name'          => 'cta_secondary',
					'type'          => 'link',
					'return_format' => 'array',
					'wrapper'       => array( 'width' => '50' ),
				),
			),
		)
	);
}
add_action( 'acf/init', 'aiy_register_front_page_fields' );
