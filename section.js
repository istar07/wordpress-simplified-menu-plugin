( function( blocks, i18n, element, components, blockEditor, _ ) {
	var __ = i18n.__;
	var el = element.createElement;
	var RichText = blockEditor.RichText;
	var InnerBlocks = blockEditor.InnerBlocks;
	var MediaUpload = blockEditor.MediaUpload;
	var AlignmentToolbar = blockEditor.AlignmentToolbar;
	var BlockControls = blockEditor.BlockControls;
	const MY_TEMPLATE = [[ 'gutenberg/menu-item', {} ]];
	
	blocks.registerBlockType( 'gutenberg/menu-section', {
		title: __( 'Menu Section', 'simplified-menu' ),
		icon: 'welcome-widgets-menus',
		category: 'layout',
		attributes: {
			mediaID: {
				type: 'number',
			},
			mediaURL: {
				type: 'string',
				source: 'attribute',
				selector: 'img',
				attribute: 'src',
			},
			title: {
				type: 'string',
				source: 'html',
				selector: 'h2',
			},
			description: {
				type: 'string',
				source: 'html',
				selector: '.section_descrip',
			},
			alignment: {
				type: 'string',
				default: '',
			},
			align: {
				type: 'string',
				default: 'menu',
			}
		},
		supports: {
			anchor: true
		},

		getEditWrapperProps() {
			return {
				'data-align': 'full',
			};
		},
		
		// Register block styles.
		styles: [
			// Mark style as default.
			{
				name: 'default',
				label: __( 'Single Column' ),
				isDefault: true
			},
			{
				name: 'two-col-menu',
				label: __( 'Two Columns' ),
			},
			{
				name: 'three-col-menu',
				label: __( 'Three Columns' )
			},
			{
				name: 'four-col-menu',
				label: __( 'Four Columns' )
			},
		],
				
		example: {
			attributes: {
				mediaURL:
					'https://upload.wikimedia.org/wikipedia/commons/2/22/Cheeseburger_and_Fries.jpg',
				title: __( 'Burgers', 'simplified-menu' ),
				alignment: 'center',
			},
		},

		edit: function( props ) {
			var attributes = props.attributes;
			var alignment = props.attributes.alignment;

			var onSelectImage = function( media ) {
				return props.setAttributes( {
					mediaURL: media.url,
					mediaID: media.id
				} );
			};

			var onRemoveImage = function( ) {
				return props.setAttributes( {
					mediaURL: '',
					mediaID: ''
				} );
			};
						
			function onChangeAlignment( newAlignment ) {
				props.setAttributes( {
					alignment:
						newAlignment === undefined ? '' : newAlignment,
				} );
			}

			return [
					el(
						BlockControls,
						{ key: 'controls' },
						el( AlignmentToolbar, {
							value: alignment,
							onChange: onChangeAlignment,
						} )
					),
					el(
					'div',
					{ className: props.className + ' ' + props.attributes.alignment },
					el(
						'div',
						{ className: 'menu-section-image-banner' },
						el( MediaUpload, {
							onSelect: onSelectImage,
							allowedTypes: 'image',
							value: attributes.mediaID,
							render: function( obj ) {
								return el(
									components.Button,
									{
										className: attributes.mediaID
											? 'image-button'
											: 'button button-large',
										onClick: obj.open,
									},
									! attributes.mediaID
										? __( 'Manage Optional Image Banner', 'simplified-menu' )
										: el( 'img', { src: attributes.mediaURL } )
								);
							},
						} ),
						attributes.mediaURL &&
						el( components.Button,
						   {
							className: 'button button-large remove-section-image',
							onClick: onRemoveImage,
							value: 'Remove Image'
							},
						   'Remove Image'
						)
					),
					el( RichText, {
						tagName: 'h2',
						inline: true,
						placeholder: __(
							'Enter the section item title…',
							'simplified-menu'
						),
						value: attributes.title,
						onChange: function( value ) {
							props.setAttributes( { title: value } );
						},
					} ),
					el( RichText, {
						tagName: 'div',
						inline: false,
						placeholder: i18n.__(
							'Enter an optional description…',
							'simplified-menu'
						),
						value: attributes.description,
						className: 'section_descrip',
						onChange: function( value ) {
							props.setAttributes( { description: value } );
						},
					} ),
					el(
						'div',
						{ className: 'menu-section-items' },
						el( InnerBlocks,
						{
							allowedBlocks: [ 'gutenberg/menu-item','gutenberg/menu-item-2' ],
						} )
					)
				)
			]
		},
		save: function( props ) {
			var attributes = props.attributes;

			return el(
				'div',
				{ className: props.attributes.alignment },
				
				attributes.mediaURL &&
				el(
					'div',
					{ className: 'menu-section-image-banner' },
					el( 'img', { src: attributes.mediaURL } )
				),
				el( RichText.Content, {
					tagName: 'h2',
					value: attributes.title,
				} ),
				attributes.description &&
				el( RichText.Content, {
					tagName: 'div',
					className: 'section_descrip',
					value: attributes.description,
				} ),
				el(
					'div',
					{ className: 'menu-section-items' },
					el( InnerBlocks.Content )
				)
			);
		},
	} );
} )(
	window.wp.blocks,
	window.wp.i18n,
	window.wp.element,
	window.wp.components,
	window.wp.blockEditor,
	window._
);
