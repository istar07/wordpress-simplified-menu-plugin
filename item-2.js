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

	blocks.registerBlockType( 'gutenberg/menu-item-2', {
		title: __( 'Menu Item 2', 'simplified-menu' ),
		parent: ['gutenberg/menu-section'],
		icon: 'index-card',
		category: 'layout',
		attributes: {
			title: {
				type: 'array',
				source: 'children',
				selector: 'h3',
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
				type: 'array',
				source: 'children',
				selector: '.item_descrip',
			},
			price_list: { 
				type: 'array',
				source: 'query',
				selector: '.price_list_item',
				default: [],
				query: {
					size_label: {
						type: 'string',
						selector: 'strong.size-label',
						source: 'text',
					},
					size_price: {
						type: 'string',
						selector: 'span.size-price',
						source: 'text',
					},
					addon_label: {
						type: 'string',
						selector: 'strong.addon-label',
						source: 'text',
					},
					addon_price: {
						type: 'string',
						selector: 'span.addon-price',
						source: 'text',
					},
				},			
			},			
			alignment: {
				type: 'string',
				default: '',
			},
		},

		supports: {
			anchor: true
		},

		edit: function( props ) {
			var attributes = props.attributes,
				alignment = props.attributes.alignment,
				sizeLabelInput, sizePriceInput, addOnLabelInput, addOnPriceInput;
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
						el( RichText, {
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
					el( 'div', { className: 'item-2-pricing-outer'},
						el( 'strong', { className: 'item-2-pricing-header' }, 'Pricing' ),
						el( 'div',
							{ className: 'item-2-pricing-inputs' },
							el( PlainText, {
								tagName: 'div',
								className: 'size-label-input',
								inline: true,
								placeholder: __(
									'Enter size label',
									'simplified-menu'
								),
								value: sizeLabelInput,
								onChange: function(sizeLabel) {
									sizeLabel = sizeLabelInput;
								}
							} ),
							el( PlainText, {
								tagName: 'div',
								className: 'size-price-input',
								inline: true,
								placeholder: __(
									'Enter size price',
									'simplified-menu'
								),
								value: sizePriceInput,
								onChange: function(sizePrice) {
									sizePriceInput = sizePrice;
								}
							} ),
							el( PlainText, {
								tagName: 'div',
								className: 'addon-label-input',
								inline: true,
								placeholder: __(
									'Enter add on label',
									'simplified-menu'
								),
								value: addOnLabelInput,
								onChange: function(addOnLabel) {
									addOnLabelInput = addOnLabel;
								}
							} ),
							el( PlainText, {
								tagName: 'div',
								className: 'addon-price-input',
								inline: true,
								placeholder: __(
									'Enter add on price',
									'simplified-menu'
								),
								value: addOnPriceInput,
								onChange: function(addOnPrice) {
									addOnPriceInput = addOnPrice;
								}
							} ),
							el( components.Button,
								{
									className: 'button button-large add-price-line',
									onClick: function(sizeLabel){
										// INSERT LIST ITEM USING FORMAT BELOW AND VALUES FROM INPUTS ABOVE. CLEAR INPUTS ABOVE.
										console.log('CLICK');
										sizeLabelInput = '';
										sizePriceInput = '';
										addOnLabelInput = '';
										addOnPriceInput = '';
									},
									value: '+'
								},
								'+'
							)
						),
					   	el( 'ul', { className: 'item-2-price-list' },
						   attributes.price_list ? attributes.price_list.map(function(item){
								el( 'li', { className: 'price_list_item' },
									el( 'button', {
											className: 'item-2-price-list-drag-handle',
											type: 'button',
											draggable: true
										},
										'<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 7h2V5H8v2zm0 6h2v-2H8v2zm0 6h2v-2H8v2zm6-14v2h2V5h-2zm0 8h2v-2h-2v2zm0 6h2v-2h-2v2z"></path></svg>'
									),
								   el( 'div', { className: 'item-2-list-item-mover' },
										el( 'button', {
												className: 'item-2-price-list-mover-up',
												type: 'button'
											},
											'<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" aria-hidden="true" focusable="false"><path d="M6.5 12.4L12 8l5.5 4.4-.9 1.2L12 10l-4.5 3.6-1-1.2z"></path></svg>'
										),
										el( 'button', {
												className: 'item-2-price-list-mover-down',
												type: 'button'
											},
											'<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" aria-hidden="true" focusable="false"><path d="M17.5 11.6L12 16l-5.5-4.4.9-1.2L12 14l4.5-3.6 1 1.2z"></path></svg>'
										)
									),
									el( PlainText, {
										tagName: 'strong',
										className: 'size-label',
										inline: true,
								   		value: item.size_label,
										placeholder: __(
											'Enter size label',
											'simplified-menu'
										)
									} ),
									el( PlainText, {
										tagName: 'span',
										className: 'size-price',
										inline: true,
								   		value: item.size_price,
										placeholder: __(
											'Enter size price',
											'simplified-menu'
										)
									} ),
									el( PlainText, {
										tagName: 'strong',
										className: 'addon-label',
										inline: true,
								   		value: item.addon_label,
										placeholder: __(
											'Enter add on label',
											'simplified-menu'
										)
									} ),
									el( PlainText, {
										tagName: 'span',
										className: 'addon-price',
										inline: true,
								   		value: item.addon_price,
										placeholder: __(
											'Enter add on price',
											'simplified-menu'
										)
									} ),
									el( 'button', {
											className: 'item-2-price-list-item-delete',
											type: 'button'
										},
										'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="M12 13.06l3.712 3.713 1.061-1.06L13.061 12l3.712-3.712-1.06-1.06L12 10.938 8.288 7.227l-1.061 1.06L10.939 12l-3.712 3.712 1.06 1.061L12 13.061z"></path></svg>'
									)
								)
							}) : ''
						)
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
					{ className: 'menu-item-image' },
					el( 'img', { src: attributes.mediaURL } )
				),
				el(
					'div',
					{ className: 'menu-item-title' },
					el( RichText.Content, {
						tagName: 'h3',
						value: attributes.title,
					} )
				),
				attributes.description &&
				el( RichText.Content, {
					tagName: 'div',
					className: 'item_descrip',
					value: attributes.description,
				} ),
				attributes.price_list &&
				// REPLACE BELOW WITH PRICE LIST ABOVE. ADD ON LABEL/PRICE WILL BE OPTIONAL
				
				el( RichText.Content, {
					tagName: 'ul',
					className: 'price_list',
					value: attributes.price_list,
				} )
				
				// END REPLACEMENT SECTION
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
