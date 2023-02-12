<?php

/**
 * Plugin Name: Simplified Menu
 * Description: This is a plugin adding menu sections and block functionality to the Gutenberg Editor.
 * Version: 1.0
 * Author: iSimplifyMe
 */

defined( 'ABSPATH' ) || exit;

/**
 * Load all translations for our plugin from the MO file.
*/
add_action( 'init', 'gutenberg_menu_manager_load_textdomain' );

function gutenberg_menu_manager_load_textdomain() {
	load_plugin_textdomain( 'simplified-menu', false, basename( __DIR__ ) . '/languages' );
}

/**
 * Registers all block assets so that they can be enqueued through Gutenberg in
 * the corresponding context.
 */
function gutenberg_menu_section_register_block() {

	if ( ! function_exists( 'register_block_type' ) ) {
		// Gutenberg is not active.
		return;
	}

	wp_register_script(
		'simplified-menu-section',
		plugins_url( 'section.js', __FILE__ ),
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-block-editor', 'underscore' ),
		filemtime( plugin_dir_path( __FILE__ ) . 'section.js' )
	);

	wp_register_style(
		'simplified-menu-section-editor',
		plugins_url( 'editor.css', __FILE__ ),
		array( 'wp-edit-blocks' ),
		filemtime( plugin_dir_path( __FILE__ ) . 'editor.css' )
	);

	wp_register_style(
		'simplified-menu-section',
		plugins_url( 'style.css', __FILE__ ),
		array( ),
		filemtime( plugin_dir_path( __FILE__ ) . 'style.css' )
	);

	register_block_type( 'gutenberg/menu-section', array(
		'editor_style' => 'simplified-menu-section-editor',
		'editor_script' => 'simplified-menu-section',
	) );

  if ( function_exists( 'wp_set_script_translations' ) ) {
    /**
     * May be extended to wp_set_script_translations( 'my-handle', 'my-domain',
     * plugin_dir_path( MY_PLUGIN ) . 'languages' ) ). For details see
     * https://make.wordpress.org/core/2018/11/09/new-javascript-i18n-support-in-wordpress/
     */
    wp_set_script_translations( 'simplified-menu-section', 'simplified-menu' );
  }

}
add_action( 'init', 'gutenberg_menu_section_register_block' );

/**
 * Registers all block assets so that they can be enqueued through Gutenberg in
 * the corresponding context.
 *
 * Passes translations to JavaScript.
 */
function gutenberg_menu_item_register_block() {

	if ( ! function_exists( 'register_block_type' ) ) {
		// Gutenberg is not active.
		return;
	}

	wp_register_script(
		'simplified-menu-item',
		plugins_url( 'item.js', __FILE__ ),
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-block-editor', 'underscore' ),
		filemtime( plugin_dir_path( __FILE__ ) . 'item.js' )
	);

	wp_register_script(
		'simplified-menu-item-2',
		plugins_url( 'item-2.js', __FILE__ ),
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-block-editor', 'underscore' ),
		filemtime( plugin_dir_path( __FILE__ ) . 'item-2.js' )
	);

	wp_register_style(
		'simplified-menu-items-editor',
		plugins_url( 'editor.css', __FILE__ ),
		array( 'wp-edit-blocks' ),
		filemtime( plugin_dir_path( __FILE__ ) . 'editor.css' )
	);

	wp_register_style(
		'simplified-menu-item',
		plugins_url( 'style.css', __FILE__ ),
		array( ),
		filemtime( plugin_dir_path( __FILE__ ) . 'style.css' )
	);

	register_block_type( 'gutenberg/menu-item', array(
		'editor_style' => 'simplified-menu-item-editor',
		'editor_script' => 'simplified-menu-item',
	) );

	register_block_type( 'gutenberg/menu-item-2', array(
		'editor_style' => 'simplified-menu-item-editor',
		'editor_script' => 'simplified-menu-item-2',
	) );

  if ( function_exists( 'wp_set_script_translations' ) ) {
    /**
     * May be extended to wp_set_script_translations( 'my-handle', 'my-domain',
     * plugin_dir_path( MY_PLUGIN ) . 'languages' ) ). For details see
     * https://make.wordpress.org/core/2018/11/09/new-javascript-i18n-support-in-wordpress/
     */
    wp_set_script_translations( 'simplified-menu-item', 'simplified-menu' );
  }

}
add_action( 'init', 'gutenberg_menu_item_register_block' );

add_action( 'wp_enqueue_scripts', 'simplified_menu_styles_init' );
    
/**
 * Register our stylesheet.
 */
function simplified_menu_styles_init() {
    wp_register_style( 'simplified-menu-styles', plugins_url( 'style.css', __FILE__ ) );
    wp_enqueue_style( 'simplified-menu-styles' );
}
