<?php
/**
 * Fallback template.
 *
 * WordPress requires index.php for a theme to be valid; it also catches any
 * request no more specific template answers. Filled out properly in step 2.
 *
 * @package AIyachts
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>

<main id="main">
	<div class="wrap">
		<?php
		if ( have_posts() ) :
			while ( have_posts() ) :
				the_post();
				?>
				<article <?php post_class(); ?>>
					<h1 class="display"><?php the_title(); ?></h1>
					<?php the_content(); ?>
				</article>
				<?php
			endwhile;

			the_posts_pagination();
		else :
			?>
			<h1 class="display"><?php esc_html_e( 'Nothing here yet', 'aiyachts' ); ?></h1>
			<p><?php esc_html_e( 'That page could not be found.', 'aiyachts' ); ?></p>
			<?php
		endif;
		?>
	</div>
</main>

<?php
get_footer();
