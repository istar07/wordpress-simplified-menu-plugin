( function( blocks, blockEditor, i18n, element, components, _ ) {
	var __ = i18n.__;
	var el = element.createElement;
	var PlainText = blockEditor.PlainText;
	var RichText = blockEditor.RichText;
	var MediaUpload = blockEditor.MediaUpload;
	var AlignmentToolbar = blockEditor.AlignmentToolbar;
	var BlockControls = blockEditor.BlockControls;
	var InnerBlocks = blockEditor.InnerBlocks;
	var useBlockProps = blockEditor.useBlockProps;

	blocks.registerBlockType( 'gutenberg/menu-item', {
		title: __( 'Menu Item', 'simplified-menu' ),
		parent: ['gutenberg/menu-section'],
		icon: 'index-card',
		category: 'layout',
		attributes: {
			title: {
				type: 'string',
				source: 'html',
				selector: 'h3',
			},
			title_price: {
				type: 'string',
				selector: '.title_price',
			},
			mediaID: {
				type: 'number',
			},
			mediaURL: {
				type: 'string',
				source: 'attribute',
				selector: 'img',
				attribute: 'src',
			},
			description: {
				type: 'string',
				source: 'html',
				selector: '.item_descrip',
			},
			price_list: {
				type: 'string',
				source: 'html',
				selector: 'ul.price_list',
			},
			alignment: {
				type: 'string',
				default: '',
			},
		},

		supports: {
			anchor: true
		},

		example: {
			attributes: {
				title: __( 'Cheeseburger', 'simplified-menu' ),
				title_price: __( '$9.99', 'simplified-menu' ),
				mediaURL:
					'https://upload.wikimedia.org/wikipedia/commons/2/22/Cheeseburger_and_Fries.jpg',
				price_list: [
					__( 'double $10.99', 'simplified-menu' ),
					__( 'triple $11.99', 'simplified-menu' ),
				],
				description: [
					__( 'This is a delicious cheeseburger served with pickles &amp; onions', 'simplified-menu' ),
				],
				alignment: 'center',
			},
		},

		edit: function( props ) {
			var attributes = props.attributes;
			var alignment = props.attributes.alignment;
			var blockProps = useBlockProps();

			var onSelectImage = function( media ) {
				return props.setAttributes( {
					mediaURL: media.url,
					mediaID: media.id,
				} );
			};

			var onRemoveImage = function( ) {
				return props.setAttributes( {
					mediaURL: '',
					mediaID: '',
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
						{ className: 'menu-item-image' },
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
										? __( 'Optional Image', 'simplified-menu' )
										: el( 'img', { src: attributes.mediaURL } )
								);
							},
						} ),
						attributes.mediaURL &&
						el( components.Button,
						   {
							className: 'button button-large remove-item-image',
							onClick: onRemoveImage,
							value: 'Remove Image'
							},
						   'Remove Image'
						)
					),
					el(
						'div',
						{ className: 'menu-item-title' }, 
						el( RichText,
							Object.assign( blockProps, {
								tagName: 'h3',
								inline: true,
								placeholder: __(
									'Enter the item title…',
									'simplified-menu'
								),
								value: attributes.title,
								onChange: function( value ) {
									props.setAttributes( { title: value } );
								},
							}) 
						),
						el( PlainText, {
							tagName: 'div',
							className: 'title_price',
							inline: true,
							placeholder: __(
								'Enter the price…',
								'simplified-menu'
							),
							value: props.attributes.title_price,
							onChange: function( title_price ) {
								props.setAttributes( { title_price: title_price } );
							},
						} )
					),
					el( RichText, {
						tagName: 'div',
						inline: false,
						placeholder: i18n.__(
							'Enter the item description…',
							'simplified-menu'
						),
						value: attributes.description,
						className: 'item_descrip',
						onChange: function( value ) {
							props.setAttributes( { description: value } );
						},
					} ),
					el( 'div',
						blockProps,
						el( InnerBlocks, {
							template: [
								[ 'core/list', {
									className: 'price_list',
									placeholder: __(
										'Enter a list of price options…',
										'simplified-menu'
									)
								}]
							],
							templateLock: 'all'
						})
					)
				)
			]
		},
		save: function( props ) {
			var attributes = props.attributes;
			var blockProps = useBlockProps.save();

			return el(
				'div',
				{ className: props.attributes.alignment },

				attributes.mediaURL &&
				el(
					'div',
					{ className: 'menu-item-image' },
					el( 'img', { src: attributes.mediaURL } )
				),
				el(
					'div',
					{ className: 'menu-item-title' },
					el( RichText.Content, {
						tagName: 'h3',
						value: attributes.title,
					} ),
					
					attributes.title_price &&
					el( 'div', {
						className: 'title_price'
						},
						attributes.title_price
					 )
				),
				attributes.description &&
				el( RichText.Content, {
					tagName: 'div',
					className: 'item_descrip',
					value: attributes.description,
				} ),
				el( 'div', blockProps, el( InnerBlocks.Content ) )
			);
		},
	} );
} )(
	window.wp.blocks,
	window.wp.blockEditor,
	window.wp.i18n,
	window.wp.element,
	window.wp.components,
	window._
);