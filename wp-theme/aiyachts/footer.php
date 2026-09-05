<?php
/**
 * Site footer.
 *
 * Closes the <body> and <html> opened in header.php.
 *
 * The contact details, base addresses and copyright line are still literal
 * here; step 3 lifts them into an ACF options page so the client can edit a
 * phone number without touching a template. Marked with TODO(step 3) below.
 *
 * @package AIyachts
 */

defined( 'ABSPATH' ) || exit;
?>

<footer id="contact-footer">
	<img class="footer-photo" src="<?php echo esc_url( aiy_asset( 'assets/img/footer-panorama.jpg' ) ); ?>" alt="" width="1500" height="1500" loading="lazy" decoding="async">
	<div class="wrap">
		<div class="contact-grid">
			<div class="reveal">
				<h2 class="display"><?php esc_html_e( "Let's set a course.", 'aiyachts' ); ?></h2>
				<p class="lede"><?php esc_html_e( "Tell us where you'd like to sail, and one of our team will reply personally — usually within a day.", 'aiyachts' ); ?></p>

				<?php /* site.js intercepts this submit and opens a pre-filled mailto; there is no backend yet. */ ?>
				<form class="subscribe" id="subscribeForm">
					<label class="sr-only" for="subEmail"><?php esc_html_e( 'Email address', 'aiyachts' ); ?></label>
					<input id="subEmail" type="email" name="email" placeholder="captain.of.my.inbox@sea.com" autocomplete="email" required>
					<button type="submit"><?php esc_html_e( 'Hop aboard our inbox', 'aiyachts' ); ?></button>
				</form>
				<p class="subscribe-note"><?php esc_html_e( 'Occasional dispatches from the Aegean & Ionian. Unsubscribe anytime.', 'aiyachts' ); ?></p>
			</div>

			<div class="reveal">
				<?php
				/*
				 * Phone numbers, email and bases come from Theme Settings, via the
				 * same aiy_business_details() the structured data reads, so the two
				 * can never drift apart. Each block is skipped when it has nothing
				 * in it rather than printing an empty heading.
				 */
				$aiy_details = aiy_business_details();
				?>

				<?php if ( ! empty( $aiy_details['phones'] ) || ! empty( $aiy_details['email'] ) ) : ?>
					<div class="contact-col">
						<h2 class="foot-h"><?php esc_html_e( 'Speak to us', 'aiyachts' ); ?></h2>

						<?php foreach ( $aiy_details['phones'] as $aiy_phone ) : ?>
							<a href="tel:<?php echo esc_attr( aiy_tel_href( $aiy_phone ) ); ?>"><?php echo esc_html( $aiy_phone ); ?></a>
						<?php endforeach; ?>

						<?php if ( ! empty( $aiy_details['email'] ) ) : ?>
							<a href="<?php echo esc_url( 'mailto:' . $aiy_details['email'] ); ?>"><?php echo esc_html( $aiy_details['email'] ); ?></a>
						<?php endif; ?>
					</div>
				<?php endif; ?>

				<?php if ( ! empty( $aiy_details['bases'] ) ) : ?>
					<div class="contact-col">
						<h2 class="foot-h"><?php esc_html_e( 'Bases', 'aiyachts' ); ?></h2>
						<?php
						foreach ( $aiy_details['bases'] as $aiy_base ) :
							// Fall back to composing a line from the structured parts
							// if the client left the footer address line blank.
							$aiy_line = ! empty( $aiy_base['address_line'] )
								? $aiy_base['address_line']
								: trim( implode( ', ', array_filter( array( $aiy_base['street'], trim( $aiy_base['postcode'] . ' ' . $aiy_base['locality'] ) ) ) ), ', ' );

							if ( '' === $aiy_line ) {
								continue;
							}
							?>
							<p><?php echo esc_html( $aiy_line ); ?></p>
						<?php endforeach; ?>
					</div>
				<?php endif; ?>
			</div>
		</div>

		<nav class="foot-nav" aria-label="<?php esc_attr_e( 'Footer', 'aiyachts' ); ?>">
			<div class="foot-col">
				<h2 class="foot-h"><?php esc_html_e( 'Charter', 'aiyachts' ); ?></h2>
				<?php aiy_nav( 'footer_charter', aiy_default_footer_charter_items() ); ?>
			</div>
			<div class="foot-col">
				<h2 class="foot-h"><?php esc_html_e( 'Company', 'aiyachts' ); ?></h2>
				<?php aiy_nav( 'footer_company', aiy_default_footer_company_items() ); ?>
			</div>
			<div class="foot-col">
				<h2 class="foot-h"><?php esc_html_e( 'Popular yachts', 'aiyachts' ); ?></h2>
				<?php aiy_nav( 'footer_yachts', aiy_default_footer_yacht_items() ); ?>
			</div>
		</nav>

		<div class="foot-bottom">
			<span>
				<?php
				printf(
					/* translators: 1: current year, 2: site name. */
					esc_html__( '© %1$s %2$s. All rights reserved.', 'aiyachts' ),
					esc_html( wp_date( 'Y' ) ),
					esc_html( get_bloginfo( 'name' ) )
				);
				?>
			</span>
			<span class="foot-bottom-links">
				<a href="<?php echo esc_url( get_privacy_policy_url() ? get_privacy_policy_url() : aiy_url( 'privacy' ) ); ?>"><?php esc_html_e( 'Privacy Policy', 'aiyachts' ); ?></a>
			</span>
		</div>
	</div>
</footer>

<button class="totop" id="toTop" aria-label="<?php esc_attr_e( 'Back to top', 'aiyachts' ); ?>"><span aria-hidden="true">&uarr;</span></button>

<?php wp_footer(); ?>
</body>
</html>
