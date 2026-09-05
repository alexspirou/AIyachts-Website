<?php
/**
 * Front page.
 *
 * Section for section, in the order they appear on screen:
 *
 *   1. hero          — full-bleed looping video, headline, two calls to action
 *   2. booking       — quick enquiry bar that hands off to the contact page
 *   3. about         — two-sea positioning statement and pull quote
 *   4. bases         — interactive Greece map, Ionian / Aegean switch
 *   5. fleet         — banner image and the featured yachts
 *   6. experiences   — gallery teaser
 *   7. services      — guest-service cards
 *   8. brokerage     — two-panel B2C / B2B split
 *   9. cta-band      — closing call to action
 *
 * Content comes from ACF. Every simple field is read through aiy_get_field(),
 * which returns the original static wording when the field is empty; every
 * repeater is looped with have_rows() and falls back to an aiy_default_*()
 * array through the same renderer. The effect is that this page is identical
 * to the static site until the client edits something, and never breaks when
 * they clear a field.
 *
 * The renderers and the fallback content live in inc/front-page-parts.php.
 *
 * @package AIyachts
 */

defined( 'ABSPATH' ) || exit;

get_header();

/** Inline emphasis the client may use in headlines. */
$aiy_inline_tags = array(
	'em'     => array(),
	'i'      => array(),
	'strong' => array(),
	'b'      => array(),
	'br'     => array(),
);
?>

<main id="main">

	<?php /* ------------------------------------------------------ 1. hero */ ?>
	<section class="hero">
		<div class="hero-photo-wrap">
			<?php
			$aiy_hero_video = aiy_get_field( 'hero_video' );
			$aiy_video_url  = is_array( $aiy_hero_video ) && ! empty( $aiy_hero_video['url'] )
				? $aiy_hero_video['url']
				: aiy_asset( 'assets/hero-video.mp4' );
			$aiy_video_mime = is_array( $aiy_hero_video ) && ! empty( $aiy_hero_video['mime_type'] )
				? $aiy_hero_video['mime_type']
				: 'video/mp4';
			?>
			<video class="hero-photo" autoplay muted loop playsinline poster="<?php echo esc_url( aiy_hero_poster_url() ); ?>" aria-hidden="true">
				<source src="<?php echo esc_url( $aiy_video_url ); ?>" type="<?php echo esc_attr( $aiy_video_mime ); ?>">
			</video>
		</div>
		<div class="hero-body">
			<div class="hero-inner wrap">
				<h1 class="hero-h1">
					<?php
					if ( aiy_has_rows( 'hero_lines' ) ) :
						while ( have_rows( 'hero_lines' ) ) :
							the_row();
							$aiy_line = (string) get_sub_field( 'text' );
							if ( '' === $aiy_line ) {
								continue;
							}
							?>
							<span class="line"><?php echo wp_kses( $aiy_line, $aiy_inline_tags ); ?></span>
							<?php
						endwhile;
					else :
						foreach ( aiy_default_hero_lines() as $aiy_row ) :
							?>
							<span class="line"><?php echo wp_kses( $aiy_row['text'], $aiy_inline_tags ); ?></span>
							<?php
						endforeach;
					endif;
					?>
				</h1>

				<?php $aiy_lede = aiy_get_field( 'hero_lede', 'From the deep blues of the Aegean to the emerald bays of the Ionian — hidden coves, timeless island life, and sunsets that feel almost unreal.' ); ?>
				<?php if ( $aiy_lede ) : ?>
					<p class="lede"><?php echo esc_html( $aiy_lede ); ?></p>
				<?php endif; ?>

				<?php
				$aiy_cta_1 = aiy_link_parts( aiy_get_field( 'hero_cta_primary' ), '#booking', __( 'Plan your voyage', 'aiyachts' ) );
				$aiy_cta_2 = aiy_link_parts( aiy_get_field( 'hero_cta_secondary' ), aiy_url( 'fleet' ), __( 'See the fleet', 'aiyachts' ) );
				?>
				<?php if ( $aiy_cta_1['url'] || $aiy_cta_2['url'] ) : ?>
					<div class="hero-actions">
						<?php if ( $aiy_cta_1['url'] ) : ?>
							<a href="<?php echo esc_url( $aiy_cta_1['url'] ); ?>" class="btn pill"<?php aiy_target_attr( $aiy_cta_1['target'] ); ?>><?php echo esc_html( $aiy_cta_1['label'] ); ?> <span class="arrow" aria-hidden="true">&rarr;</span></a>
						<?php endif; ?>
						<?php if ( $aiy_cta_2['url'] ) : ?>
							<a href="<?php echo esc_url( $aiy_cta_2['url'] ); ?>" class="hero-link"<?php aiy_target_attr( $aiy_cta_2['target'] ); ?>><?php echo esc_html( $aiy_cta_2['label'] ); ?> <span class="arrow" aria-hidden="true">&rarr;</span></a>
						<?php endif; ?>
					</div>
				<?php endif; ?>
			</div>
		</div>
	</section>

	<?php /* --------------------------------------------------- 2. booking */ ?>
	<?php if ( false !== aiy_get_field( 'booking_enable', true ) ) : ?>
		<div class="wrap" id="booking">
			<form class="booking" id="bookingForm" action="<?php aiy_the_url( 'contact' ); ?>" method="get" aria-label="<?php esc_attr_e( 'Charter enquiry', 'aiyachts' ); ?>">
				<div class="b-field">
					<label for="destination"><?php esc_html_e( 'Destination', 'aiyachts' ); ?></label>
					<select id="destination" name="destination">
						<?php
						if ( aiy_has_rows( 'booking_destinations' ) ) :
							while ( have_rows( 'booking_destinations' ) ) :
								the_row();
								$aiy_choice = (string) get_sub_field( 'label' );
								if ( '' === $aiy_choice ) {
									continue;
								}
								?>
								<option><?php echo esc_html( $aiy_choice ); ?></option>
								<?php
							endwhile;
						else :
							foreach ( aiy_default_booking_destinations() as $aiy_row ) :
								?>
								<option><?php echo esc_html( $aiy_row['label'] ); ?></option>
								<?php
							endforeach;
						endif;
						?>
					</select>
				</div>
				<div class="b-field">
					<label for="dateStart"><?php esc_html_e( 'Dates', 'aiyachts' ); ?></label>
					<div class="b-dates">
						<input type="date" id="dateStart" name="start" aria-label="<?php esc_attr_e( 'Start date', 'aiyachts' ); ?>">
						<input type="date" id="dateEnd" name="end" aria-label="<?php esc_attr_e( 'End date', 'aiyachts' ); ?>">
					</div>
				</div>
				<div class="b-field">
					<?php $aiy_guests = (int) aiy_get_field( 'booking_guests_default', 2 ); ?>
					<label for="guestCount"><?php esc_html_e( 'Guests', 'aiyachts' ); ?></label>
					<div class="b-guests">
						<div class="stepper">
							<button type="button" id="guestMinus" aria-label="<?php esc_attr_e( 'Decrease guests', 'aiyachts' ); ?>">&minus;</button>
							<output id="guestCount" name="guests" for="guestMinus guestPlus"><?php echo esc_html( $aiy_guests ); ?></output>
							<input type="hidden" name="guests" id="guestsField" value="<?php echo esc_attr( $aiy_guests ); ?>">
							<button type="button" id="guestPlus" aria-label="<?php esc_attr_e( 'Increase guests', 'aiyachts' ); ?>">+</button>
						</div>
					</div>
				</div>
				<div class="b-submit" id="bSubmit">
					<button type="submit"><?php echo esc_html( aiy_get_field( 'booking_submit_label', __( 'Enquire', 'aiyachts' ) ) ); ?></button>
				</div>
			</form>
		</div>
	<?php endif; ?>

	<?php /* ----------------------------------------------------- 3. about */ ?>
	<section id="about">
		<div class="wrap">
			<div class="section-head reveal">
				<?php $aiy_v = aiy_get_field( 'about_eyebrow', 'About AIyachts' ); ?>
				<?php if ( $aiy_v ) : ?>
					<p class="eyebrow"><?php echo esc_html( $aiy_v ); ?></p>
				<?php endif; ?>

				<?php $aiy_v = aiy_get_field( 'about_heading', 'Two seas. One philosophy.' ); ?>
				<?php if ( $aiy_v ) : ?>
					<h2 class="display"><?php echo wp_kses( $aiy_v, $aiy_inline_tags ); ?></h2>
				<?php endif; ?>
			</div>
			<div class="about-grid">
				<div class="about-copy reveal">
					<?php
					$aiy_body = aiy_get_field(
						'about_body',
						'<p>AIyachts brings together the spirit of the Aegean and Ionian seas with a modern, guest-centred approach to sailing. We operate across Greece — from Athens and Lefkas to Corfu and Paros — offering seamless chartering, brokerage and yacht-management services supported by a network of trusted local partners.</p>'
						. '<p>What sets us apart is the blend of decades of hands-on maritime experience with academic expertise in tourism and customer experience — a company culture that is professional, warm, and deeply committed to the craft of sailing.</p>'
					);
					?>
					<?php if ( $aiy_body ) : ?>
						<?php echo wp_kses_post( $aiy_body ); ?>
					<?php endif; ?>

					<?php
					$aiy_quote = aiy_get_field( 'about_quote', 'Our mission is simple: to make every connection — guest, partner, or owner — feel valued, supported, and inspired by our love for the sea.' );
					$aiy_cite  = aiy_get_field( 'about_quote_cite', 'AIyachts, founding principle' );
					?>
					<?php if ( $aiy_quote ) : ?>
						<div class="quote-block">
							<?php /* The curly quotes are added here, so the client types the sentence alone. */ ?>
							<p>&ldquo;<?php echo esc_html( $aiy_quote ); ?>&rdquo;</p>
							<?php if ( $aiy_cite ) : ?>
								<cite><?php echo esc_html( $aiy_cite ); ?></cite>
							<?php endif; ?>
						</div>
					<?php endif; ?>

					<?php $aiy_link = aiy_link_parts( aiy_get_field( 'about_link' ), aiy_url( 'about' ), __( 'More about who we are', 'aiyachts' ) ); ?>
					<?php if ( $aiy_link['url'] ) : ?>
						<p class="about-more"><a class="inline-link" href="<?php echo esc_url( $aiy_link['url'] ); ?>"<?php aiy_target_attr( $aiy_link['target'] ); ?>><?php echo esc_html( $aiy_link['label'] ); ?> <span class="arrow" aria-hidden="true">&rarr;</span></a></p>
					<?php endif; ?>
				</div>
			</div>
		</div>
	</section>

	<?php /* ------------------------------------------- 4. bases and map */ ?>
	<section id="bases" class="band-raised">
		<div class="wrap reveal">
			<div class="section-head">
				<?php $aiy_v = aiy_get_field( 'seas_eyebrow', 'Two Bases, Two Characters' ); ?>
				<?php if ( $aiy_v ) : ?>
					<p class="eyebrow"><?php echo esc_html( $aiy_v ); ?></p>
				<?php endif; ?>

				<?php $aiy_v = aiy_get_field( 'seas_heading', 'Choose your sea.' ); ?>
				<?php if ( $aiy_v ) : ?>
					<h2 class="display"><?php echo wp_kses( $aiy_v, $aiy_inline_tags ); ?></h2>
				<?php endif; ?>

				<?php $aiy_v = aiy_get_field( 'seas_intro', 'Two very different sailing grounds, ninety minutes apart by road. Switch the map to explore where we sail — then open the sea that suits your crew.' ); ?>
				<?php if ( $aiy_v ) : ?>
					<p><?php echo esc_html( $aiy_v ); ?></p>
				<?php endif; ?>
			</div>

			<div class="greece-map-wrap reveal" id="greeceMap" data-active="ionian">
				<?php
				/*
				 * The map is intentionally not editable. Its three artwork layers are
				 * aligned to a fixed 990 × 980 grid shared with the island overlays and
				 * the sea labels; swapping any one of them would pull the rest out of
				 * register. See the note on the Bases & map tab in the admin.
				 */
				?>
				<div class="sea-switch" role="group" aria-label="<?php esc_attr_e( 'Choose a sea to highlight on the map', 'aiyachts' ); ?>">
					<span class="sea-switch-thumb" aria-hidden="true"></span>
					<button type="button" class="sea-switch-opt" data-sea="ionian" aria-pressed="true"><?php esc_html_e( 'Ionian', 'aiyachts' ); ?></button>
					<button type="button" class="sea-switch-opt" data-sea="aegean" aria-pressed="false"><?php esc_html_e( 'Aegean', 'aiyachts' ); ?></button>
				</div>
				<svg class="greece-map" viewBox="0 0 990 980" role="img" aria-label="<?php esc_attr_e( 'Map of Greece showing the Ionian and Aegean sailing regions served by AIyachts', 'aiyachts' ); ?>">
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
					<rect class="sea-zone ionian" data-sea="ionian" x="0" y="0" width="430" height="980" fill="url(#ionianGrad)" tabindex="0" role="button" aria-label="<?php esc_attr_e( 'Highlight the Ionian Sea', 'aiyachts' ); ?>"/>
					<rect class="sea-zone aegean" data-sea="aegean" x="430" y="0" width="560" height="980" fill="url(#aegeanGrad)" tabindex="0" role="button" aria-label="<?php esc_attr_e( 'Highlight the Aegean Sea', 'aiyachts' ); ?>"/>
					<image class="landmass-img" href="<?php echo esc_url( aiy_asset( 'assets/greece-map.webp' ) ); ?>" x="0" y="0" width="990" height="980" preserveAspectRatio="xMidYMid meet" pointer-events="none"/>
					<image class="island-overlay ionian" href="<?php echo esc_url( aiy_asset( 'assets/greece-map-ionian.webp' ) ); ?>" x="0" y="0" width="990" height="980" preserveAspectRatio="xMidYMid meet" pointer-events="none"/>
					<image class="island-overlay aegean" href="<?php echo esc_url( aiy_asset( 'assets/greece-map-aegean.webp' ) ); ?>" x="0" y="0" width="990" height="980" preserveAspectRatio="xMidYMid meet" pointer-events="none"/>
					<g class="sea-label ionian-label" aria-hidden="true"><text x="55" y="46">IONIAN</text></g>
					<g class="sea-label aegean-label" aria-hidden="true"><text x="55" y="46">AEGEAN</text></g>
				</svg>

				<?php
				if ( aiy_has_rows( 'sea_cards' ) ) :
					while ( have_rows( 'sea_cards' ) ) :
						the_row();
						aiy_render_sea_card(
							array(
								'sea'       => get_sub_field( 'sea' ),
								'eyebrow'   => get_sub_field( 'eyebrow' ),
								'title'     => get_sub_field( 'title' ),
								'text'      => get_sub_field( 'text' ),
								'cta_label' => get_sub_field( 'cta_label' ),
								'url'       => get_sub_field( 'link' ),
							)
						);
					endwhile;
				else :
					foreach ( aiy_default_sea_cards() as $aiy_card ) :
						aiy_render_sea_card( $aiy_card );
					endforeach;
				endif;
				?>
			</div>

			<?php $aiy_link = aiy_link_parts( aiy_get_field( 'seas_foot_link' ), aiy_url( 'destinations' ), __( 'Compare both destinations in detail', 'aiyachts' ) ); ?>
			<?php if ( $aiy_link['url'] ) : ?>
				<p class="section-foot"><a class="inline-link" href="<?php echo esc_url( $aiy_link['url'] ); ?>"<?php aiy_target_attr( $aiy_link['target'] ); ?>><?php echo esc_html( $aiy_link['label'] ); ?> <span class="arrow" aria-hidden="true">&rarr;</span></a></p>
			<?php endif; ?>
		</div>
	</section>

	<?php /* ----------------------------------------------------- 5. fleet */ ?>
	<section id="fleet">
		<div class="wrap">
			<div class="section-head reveal">
				<?php $aiy_v = aiy_get_field( 'fleet_eyebrow', 'Bareboat & Skippered Charters' ); ?>
				<?php if ( $aiy_v ) : ?>
					<p class="eyebrow"><?php echo esc_html( $aiy_v ); ?></p>
				<?php endif; ?>

				<?php $aiy_v = aiy_get_field( 'fleet_heading', 'Our fleet' ); ?>
				<?php if ( $aiy_v ) : ?>
					<h2 class="display"><?php echo wp_kses( $aiy_v, $aiy_inline_tags ); ?></h2>
				<?php endif; ?>

				<?php $aiy_v = aiy_get_field( 'fleet_intro', 'From nimble two-cabin cruisers to spacious catamarans — every yacht is maintained to a standard worth trusting with your holiday.' ); ?>
				<?php if ( $aiy_v ) : ?>
					<p><?php echo esc_html( $aiy_v ); ?></p>
				<?php endif; ?>
			</div>
		</div>

		<?php
		$aiy_band = aiy_get_field(
			'fleet_band_image',
			array(
				'src'    => 'assets/img/fleet-band.jpg',
				'alt'    => 'AIyachts charter yachts moored stern-to on a Greek island quay',
				'width'  => 1500,
				'height' => 1500,
			)
		);
		$aiy_band_cap = aiy_get_field( 'fleet_band_caption', 'Our own boats, in our own waters' );
		?>
		<?php if ( $aiy_band ) : ?>
			<div class="fleet-band reveal">
				<?php aiy_render_image( $aiy_band, 'full' ); ?>
				<?php if ( $aiy_band_cap ) : ?>
					<p class="fleet-band-cap"><?php echo esc_html( $aiy_band_cap ); ?></p>
				<?php endif; ?>
			</div>
		<?php endif; ?>

		<div class="wrap">
			<div class="fleet-grid reveal-stagger">
				<?php
				if ( aiy_has_rows( 'fleet_yachts' ) ) :
					while ( have_rows( 'fleet_yachts' ) ) :
						the_row();
						aiy_render_yacht_card(
							array(
								'image'     => get_sub_field( 'image' ),
								'flag'      => get_sub_field( 'flag' ),
								'meta'      => get_sub_field( 'meta' ),
								'title'     => get_sub_field( 'title' ),
								'specs'     => get_sub_field( 'specs' ),
								'cta_label' => get_sub_field( 'cta_label' ),
								'url'       => get_sub_field( 'link' ),
							)
						);
					endwhile;
				else :
					foreach ( aiy_default_fleet_yachts() as $aiy_card ) :
						aiy_render_yacht_card( $aiy_card );
					endforeach;
				endif;
				?>
			</div>

			<?php $aiy_link = aiy_link_parts( aiy_get_field( 'fleet_cta' ), aiy_url( 'fleet' ), __( 'View all 14 yachts', 'aiyachts' ) ); ?>
			<?php if ( $aiy_link['url'] ) : ?>
				<div class="fleet-cta">
					<a href="<?php echo esc_url( $aiy_link['url'] ); ?>" class="btn"<?php aiy_target_attr( $aiy_link['target'] ); ?>><?php echo esc_html( $aiy_link['label'] ); ?> <span class="arrow" aria-hidden="true">&rarr;</span></a>
				</div>
			<?php endif; ?>
		</div>
	</section>

	<?php /* ----------------------------------------------- 6. experiences */ ?>
	<section id="experiences" class="band-raised xg-section">
		<div class="wrap">
			<div class="section-head reveal">
				<?php $aiy_v = aiy_get_field( 'exp_eyebrow', 'Gallery of Experiences' ); ?>
				<?php if ( $aiy_v ) : ?>
					<p class="eyebrow"><?php echo esc_html( $aiy_v ); ?></p>
				<?php endif; ?>

				<?php $aiy_v = aiy_get_field( 'exp_heading', 'Life aboard.' ); ?>
				<?php if ( $aiy_v ) : ?>
					<h2 class="display"><?php echo wp_kses( $aiy_v, $aiy_inline_tags ); ?></h2>
				<?php endif; ?>

				<?php $aiy_v = aiy_get_field( 'exp_intro', 'Unfiltered moments from real charters — the coves, the crew, and the guests who came back for more.' ); ?>
				<?php if ( $aiy_v ) : ?>
					<p><?php echo esc_html( $aiy_v ); ?></p>
				<?php endif; ?>
			</div>

			<div class="xg-grid xg-teaser reveal-stagger" data-fallback="<?php aiy_the_url( 'experiences' ); ?>">
				<?php
				$aiy_i = 0;
				if ( aiy_has_rows( 'gallery_items' ) ) :
					while ( have_rows( 'gallery_items' ) ) :
						the_row();
						aiy_render_gallery_tile(
							array(
								'image'    => get_sub_field( 'image' ),
								'title'    => get_sub_field( 'title' ),
								'alt'      => '',
								'category' => get_sub_field( 'category' ),
								'col_span' => get_sub_field( 'col_span' ),
								'row_span' => get_sub_field( 'row_span' ),
								'lqip'     => get_sub_field( 'lqip' ),
							),
							$aiy_i
						);
						$aiy_i++;
					endwhile;
				else :
					foreach ( aiy_default_gallery_items() as $aiy_tile ) :
						aiy_render_gallery_tile( $aiy_tile, $aiy_i );
						$aiy_i++;
					endforeach;
				endif;
				?>
			</div>

			<?php $aiy_link = aiy_link_parts( aiy_get_field( 'exp_cta' ), aiy_url( 'experiences' ), __( 'Open the full gallery', 'aiyachts' ) ); ?>
			<?php if ( $aiy_link['url'] ) : ?>
				<div class="fleet-cta">
					<a href="<?php echo esc_url( $aiy_link['url'] ); ?>" class="btn"<?php aiy_target_attr( $aiy_link['target'] ); ?>><?php echo esc_html( $aiy_link['label'] ); ?> <span class="arrow" aria-hidden="true">&rarr;</span></a>
				</div>
			<?php endif; ?>
		</div>
	</section>

	<?php /* -------------------------------------------------- 7. services */ ?>
	<section id="services">
		<div class="wrap">
			<div class="section-head reveal">
				<?php $aiy_v = aiy_get_field( 'services_eyebrow', 'Guest Services' ); ?>
				<?php if ( $aiy_v ) : ?>
					<p class="eyebrow"><?php echo esc_html( $aiy_v ); ?></p>
				<?php endif; ?>

				<?php $aiy_v = aiy_get_field( 'services_heading', 'Experience, co-created.' ); ?>
				<?php if ( $aiy_v ) : ?>
					<h2 class="display"><?php echo wp_kses( $aiy_v, $aiy_inline_tags ); ?></h2>
				<?php endif; ?>

				<?php $aiy_v = aiy_get_field( 'services_intro', 'For private charter guests — every detail curated so your time on board feels effortless and personal.' ); ?>
				<?php if ( $aiy_v ) : ?>
					<p><?php echo esc_html( $aiy_v ); ?></p>
				<?php endif; ?>
			</div>

			<div class="service-grid reveal-stagger">
				<?php
				if ( aiy_has_rows( 'services' ) ) :
					while ( have_rows( 'services' ) ) :
						the_row();
						aiy_render_service_card(
							array(
								'icon'  => get_sub_field( 'icon' ),
								'title' => get_sub_field( 'title' ),
								'text'  => get_sub_field( 'text' ),
							)
						);
					endwhile;
				else :
					foreach ( aiy_default_services() as $aiy_card ) :
						aiy_render_service_card( $aiy_card );
					endforeach;
				endif;
				?>
			</div>

			<?php $aiy_link = aiy_link_parts( aiy_get_field( 'services_foot_link' ), aiy_url( 'services' ), __( 'How we build your week', 'aiyachts' ) ); ?>
			<?php if ( $aiy_link['url'] ) : ?>
				<p class="section-foot"><a class="inline-link" href="<?php echo esc_url( $aiy_link['url'] ); ?>"<?php aiy_target_attr( $aiy_link['target'] ); ?>><?php echo esc_html( $aiy_link['label'] ); ?> <span class="arrow" aria-hidden="true">&rarr;</span></a></p>
			<?php endif; ?>
		</div>
	</section>

	<?php /* ------------------------------------------------- 8. brokerage */ ?>
	<section id="brokerage" class="band-raised">
		<div class="wrap">
			<div class="section-head reveal">
				<?php $aiy_v = aiy_get_field( 'brokerage_eyebrow', 'Brokerage & Management' ); ?>
				<?php if ( $aiy_v ) : ?>
					<p class="eyebrow"><?php echo esc_html( $aiy_v ); ?></p>
				<?php endif; ?>

				<?php $aiy_v = aiy_get_field( 'brokerage_heading', 'For owners & investors.' ); ?>
				<?php if ( $aiy_v ) : ?>
					<h2 class="display"><?php echo wp_kses( $aiy_v, $aiy_inline_tags ); ?></h2>
				<?php endif; ?>
			</div>

			<div class="split reveal">
				<?php
				if ( aiy_has_rows( 'brokerage_panels' ) ) :
					while ( have_rows( 'brokerage_panels' ) ) :
						the_row();
						aiy_render_brokerage_panel(
							array(
								'eyebrow' => get_sub_field( 'eyebrow' ),
								'title'   => get_sub_field( 'title' ),
								'text'    => get_sub_field( 'text' ),
								'list'    => get_sub_field( 'list' ),
								'cta'     => get_sub_field( 'cta' ),
							)
						);
					endwhile;
				else :
					foreach ( aiy_default_brokerage_panels() as $aiy_panel ) :
						aiy_render_brokerage_panel( $aiy_panel );
					endforeach;
				endif;
				?>
			</div>
		</div>
	</section>

	<?php /* ------------------------------------------------- 9. cta band */ ?>
	<section class="cta-band">
		<div class="wrap reveal">
			<?php $aiy_v = aiy_get_field( 'cta_eyebrow', 'Ready when you are' ); ?>
			<?php if ( $aiy_v ) : ?>
				<p class="eyebrow"><?php echo esc_html( $aiy_v ); ?></p>
			<?php endif; ?>

			<?php $aiy_v = aiy_get_field( 'cta_heading', 'Tell us where you’d like to wake up.' ); ?>
			<?php if ( $aiy_v ) : ?>
				<h2 class="display"><?php echo wp_kses( $aiy_v, $aiy_inline_tags ); ?></h2>
			<?php endif; ?>

			<?php $aiy_v = aiy_get_field( 'cta_text', 'Send us your dates and the size of your crew. We will come back with the yachts that fit, the route we would sail, and an honest price.' ); ?>
			<?php if ( $aiy_v ) : ?>
				<p><?php echo esc_html( $aiy_v ); ?></p>
			<?php endif; ?>

			<?php
			$aiy_cta_1 = aiy_link_parts( aiy_get_field( 'cta_primary' ), aiy_url( 'contact' ), __( 'Start an enquiry', 'aiyachts' ) );
			$aiy_cta_2 = aiy_link_parts( aiy_get_field( 'cta_secondary' ), aiy_url( 'fleet' ), __( 'Browse the fleet', 'aiyachts' ) );
			?>
			<?php if ( $aiy_cta_1['url'] || $aiy_cta_2['url'] ) : ?>
				<div class="cta-actions">
					<?php if ( $aiy_cta_1['url'] ) : ?>
						<a class="btn" href="<?php echo esc_url( $aiy_cta_1['url'] ); ?>"<?php aiy_target_attr( $aiy_cta_1['target'] ); ?>><?php echo esc_html( $aiy_cta_1['label'] ); ?> <span class="arrow" aria-hidden="true">&rarr;</span></a>
					<?php endif; ?>
					<?php if ( $aiy_cta_2['url'] ) : ?>
						<a class="btn ghost dark" href="<?php echo esc_url( $aiy_cta_2['url'] ); ?>"<?php aiy_target_attr( $aiy_cta_2['target'] ); ?>><?php echo esc_html( $aiy_cta_2['label'] ); ?></a>
					<?php endif; ?>
				</div>
			<?php endif; ?>
		</div>
	</section>

</main>

<?php
get_footer();
