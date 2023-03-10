(	
	 function( blocks, blockEditor, i18n, element, components, _ ) {
	var __ = i18n.__;
	var el = element.createElement;
	var PlainText = blockEditor.PlainText;
	var RichText = blockEditor.RichText;
	var MediaUpload = blockEditor.MediaUpload;
	var AlignmentToolbar = blockEditor.AlignmentToolbar;
	var BlockControls = blockEditor.BlockControls;
	var useBlockProps = blockEditor.useBlockProps;
	var dragID, dropID, is_drag_flag = 0;
	var editMode = 0;
	
	blocks.registerBlockType( 'gutenberg/menu-item-detailed-list', {
		title: __( 'Menu Item (Detailed List)', 'simplified-menu' ),
		parent: ['gutenberg/menu-section'],
		icon: 'index-card0',
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
				default : [{
					'size_label' : '',
					'size_price' : '',
					'addon_label' : '',
					'addon_price' : '',
				}],
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
			anchor: true,
			'align' : true,
			'alignWide' : true,
			'jsx' : true,
		},
		edit: function( props ) {
			big_element = document.getElementById('block-' + props.clientId);
			var alignment = props.attributes.alignment;

			total_cnt = props.attributes.price_list.length;
			if( big_element )
				big_element.addEventListener('click',onItemClick);

			function onItemClick(event){
				if( !event.target.classList.contains('editable')){
					return;
				}
				else if( editMode == 0){
					editMode = 1;
				}
				else if( editMode == 1)
				return;
				
				var str = event.target.id.split('_');
				var col_id = str[0], row_id = str[1];
				var input_text;
				switch( col_id ){
					case '0':
						input_text = props.attributes.price_list[row_id].size_label;
						col_id = 'size_label';
						break;
					case '1':
						input_text = props.attributes.price_list[row_id].size_price;
						col_id = 'size_price';
						break;
					case '2':
						input_text = props.attributes.price_list[row_id].addon_label;
						col_id = 'addon_label';
						break;
					case '3':
						input_text = props.attributes.price_list[row_id].addon_price;
						col_id = 'addon_price';
						break;
				}
				var element = event.target;
				element.innerHTML = `<div class='editable_div'><input type='text' class='edit_text'/></div>`;
				var edit_input = big_element.querySelector('.edit_text');
				edit_input.value = input_text;
				edit_input.focus();
				edit_input.addEventListener('focusout',onFocusOut);
				
				props.setAttributes(props.attributes.price_list);
			}
			
			function onFocusOut(event){
				var edit_input = event.target;
				var input_text = edit_input.value;
				var element = event.srcElement;
				element.innerHTML = input_text;
				editMode = 0;

				var str = event.srcElement.parentNode.parentNode.id.split('_');
				var col_id = str[0], row_id = str[1];
				switch( col_id ){
					case '0':
						props.attributes.price_list[row_id].size_label = input_text ;
						col_id = 'size_label';
						break;
					case '1':
						props.attributes.price_list[row_id].size_price = input_text;
						col_id = 'size_price';
						break;
					case '2':
						props.attributes.price_list[row_id].addon_label = input_text;
						col_id = 'addon_label';
						break;
					case '3':
						props.attributes.price_list[row_id].addon_price = input_text;
						col_id = 'addon_price';
						break;
				}
				props.setAttributes(props.attributes.price_list);

				big_element.querySelector('.add-price-line').click();
				var dbtn_id = 'btn_delete' + ( props.attributes.price_list.length - 2 );
				big_element.querySelector('#' + dbtn_id).click();
			};

			function onSelectImage( media ) {
				return props.setAttributes( {
					mediaURL: media.url,
					mediaID: media.id,
				} );
			};

			function onRemoveImage() {
				return props.setAttributes( {
					mediaURL: '',
					mediaID: '',
				} );
			};
						
			function onChangeAlignment( newAlignment ) {
				props.setAttributes( {
					alignment:
						newAlignment === undefined ? 'Left' : newAlignment,
				} );
			};
			
			function is_drag( event ){
				if( is_drag_flag == 0 )
					return;
				var target_id = 'price_list_item' + dragID;
				var target = big_element.querySelector('#' + target_id);
				if( target.className.search('is_dragging') != -1 ){
					return;
				}
				else {
					target.classList.add('is_dragging');
				}
			}

			function end_drag( event ){
				var drag_item = big_element.querySelector('#price_list_item' + dragID);
				drag_item.classList.remove('is_dragging');
				document.querySelector('body').classList.remove('is_draggingBody');
				if( is_drag_flag == 0)
					return;
				is_drag_flag = 0;

				var elements = big_element.querySelectorAll('.price_list_item');
				var item_y = new Array();
				var drop_y = event.clientY;
				elements.forEach(function( element ){
					item_y.push(element.getBoundingClientRect().y);
				});
				item_y.pop();
				dropID = -1;
				if( drop_y <= item_y[1])
					dropID = 0;
				else if( drop_y >= item_y[item_y.length - 1] )
					dropID = item_y.length - 1;
				else{
					for( var i = 2; i < item_y.length ; i++ ){
						if( item_y[i] >= drop_y ){
							dropID = i-1;
							break;
						}
					}
				}
				if( dragID != dropID){
					var temp_list = new Array();
					for( var i = 0 ; i < item_y.length ; i++ ){
						if( i == dropID){
							if(dragID > dropID){
								temp_list.push(props.attributes.price_list[dragID]);
								temp_list.push(props.attributes.price_list[dropID]);
							}
							else{
								temp_list.push(props.attributes.price_list[dropID]);
								temp_list.push(props.attributes.price_list[dragID]);
							}
						}
						else if( i == dragID)
							continue;
						else temp_list.push(props.attributes.price_list[i]);
					}
					temp_list.push(props.attributes.price_list[props.attributes.price_list.length-1]);
					for( var i = 0 ; i < temp_list.length ; i++)
						props.attributes.price_list[i] = temp_list[i];

					props.setAttributes(props.attributes.price_list);
				}
				document.removeEventListener( 'mouseup' , end_drag );
			}

			function onDeleteFunc(event){

				if( editMode == 1)
					return;
				if( event.target.nodeName == "svg")
					var index = event.target.parentNode.id.slice(10);
				else if( event.target.nodeName == "path")
					var index = event.target.parentNode.parentNode.id.slice(10);
				else var index = event.target.id.slice(10);
				var temp_list = new Array();
				for( var i = 0 ; i <= props.attributes.price_list.length ; i++ ){
					if( i != index && props.attributes.price_list[i] ){
						temp_list.push(props.attributes.price_list[i]);
					}
				}

				for(var i = 0 ; i < temp_list.length ; i++ )
					props.attributes.price_list[i] = temp_list[i];
				props.attributes.price_list.pop();

				props.setAttributes( props.attributes.price_list );
				
			}

			function onAddClickFunc(){
				if( editMode == 1)
					return;
				var arr_new = {
				'size_label' : props.attributes.sizeLabelInput,
				'size_price' : props.attributes.sizePriceInput,
				'addon_label' : props.attributes.addOnLabelInput,
				'addon_price' : props.attributes.addOnPriceInput,
				};

				props.attributes.sizeLabelInput = '';
				props.attributes.sizePriceInput = '';
				props.attributes.addOnLabelInput = '';
				props.attributes.addOnPriceInput = '';

				props.attributes.price_list.push( arr_new );
				var len = props.attributes.price_list.length;
				var temp = props.attributes.price_list[len-2];
				props.attributes.price_list[len-2] = props.attributes.price_list[len-1];
				props.attributes.price_list[len-1] = temp;

				props.setAttributes( props.attributes.price_list );
			}

			return [
					el(
						BlockControls,
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
							value: props.attributes.mediaID,
							render: function( obj ) {
								return el(
									components.Button,
									{
										className: props.attributes.mediaID
											? 'image-button'
											: 'button button-large',
										onClick: obj.open,
									},
									! props.attributes.mediaID
										? __( 'Optional Image', 'simplified-menu' )
										: el( 'img', { src: props.attributes.mediaURL } )
								);
							},
						} ),
						props.attributes.mediaURL &&
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
							value: props.attributes.title,
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
						value: props.attributes.description,
						className: 'item_descrip',
						onChange: function( value ) {
							props.setAttributes( { description: value } );
						},
					} ),
					el( 'div', { className: 'item-2-pricing-outer'},
						el( 'div',{
							className : 'item-2-pricing-header'
						},'pricing'),
						el( 'div',
							{ className: 'item-2-pricing-inputs' },
							el( PlainText, {
								tagName: 'div',
								className: 'size-label-input',
								id : 'size-label-input',
								inline: true,
								placeholder: __(
									'Enter size label',
									'simplified-menu'
								),
								value: props.attributes.sizeLabelInput,
								onChange: function(value) {
									props.setAttributes({'sizeLabelInput' : value});
								},
								
							} ),
							el( PlainText, {
								tagName: 'div',
								className: 'size-price-input',
								id : 'size-price-input',
								inline: true,
								placeholder: __(
									'Enter size price',
									'simplified-menu'
								),
								value: props.attributes.sizePriceInput,
								onChange: function(value) {
									props.setAttributes({'sizePriceInput' : value});
								}
							} ),
							el( PlainText, {
								tagName: 'div',
								className: 'addon-label-input',
								id : 'addon-label-input',
								inline: true,
								placeholder: __(
									'Enter add on label',
									'simplified-menu'
								),
								value: props.attributes.addOnLabelInput,
								onChange: function(value) {
									props.setAttributes({'addOnLabelInput' : value});
								}
							} ),
							el( PlainText, {
								tagName: 'div',
								className: 'addon-price-input',
								id : 'addon-price-input',
								inline: true,
								placeholder: __(
									'Enter add on price',
									'simplified-menu'
								),
								value: props.attributes.addOnPriceInput,
								onChange: function(value) {
									props.setAttributes({'addOnPriceInput' : value});
								}
							} ),
							el( 'button',
								{
									className: 'button button-large add-price-line' ,
									onClick: onAddClickFunc,
								},
								el('span',{}, '+')
							)
						),
						el( 'ul', {
								className: 'item-2-price-list '
								},
							 props.attributes.price_list ? props.attributes.price_list.map( function( item , index ){
								return el( 'li', { 
										className: 'price_list_item ' + (index == props.attributes.price_list.length -1 ? 'invisible_item' : ''),
										id : 'price_list_item' + index,	
										draggable: true,
										onDragStart : function (event) {
											if( editMode == 1)
												return;
											var block = event.currentTarget.id;
											dragID = block.slice(15);
											is_drag_flag = 1;

											document.querySelector('body').classList.add('is_draggingBody');

											document.addEventListener('mousemove', is_drag);
											document.addEventListener('mouseup', end_drag);
										}
									},
									el( 'button', {
											className: 'item-2-price-list-drag-handle',
											type: 'button',
										},
										el('svg',{
												width: '24',
												height: '24',
												className : 'moveHandle',
												xmlns: "http://www.w3.org/2000/svg",
												viewBox:"0 0 24 24",
												'aria-hidden': "true",
												focusable: "false",
											},
											el('path',{
												d : "M8 7h2V5H8v2zm0 6h2v-2H8v2zm0 6h2v-2H8v2zm6-14v2h2V5h-2zm0 8h2v-2h-2v2zm0 6h2v-2h-2v2z"
											})
										),
									),
									el( 'div', { className: 'item-2-list-item-mover' },
										el( 'button', {
												className: 'item-2-price-list-mover-up upbtn' ,
												type: 'button',
												onClick : function(){
													if( editMode == 1)
														return;
													if( index == 0)
														return;
													else {
														var temp_list = new Array();
														for( var i = 0 ; i < props.attributes.price_list.length ; i++ ){
															if( i != index && i != index-1 ){
																temp_list.push(props.attributes.price_list[i]);
															}
															else{
																temp_list.push(props.attributes.price_list[i+1]);
																temp_list.push(props.attributes.price_list[i]);
																i++;
															}
														}
														for( var i = 0 ; i< temp_list.length ; i++)
															props.attributes.price_list[i] = temp_list[i];
														props.setAttributes( props.attributes.price_list );
													}
												}
											},
											el('svg',{
													width: '24',
													height: '24',
													class : 'moveUpSVG' + (index == 0 ? ' first' : '') ,
													xmlns: "http://www.w3.org/2000/svg",
													viewBox:"0 0 24 24",
													'aria-hidden': "true",
													focusable: "false",
												},
												el('path',{
													d : "M6.5 12.4L12 8l5.5 4.4-.9 1.2L12 10l-4.5 3.6-1-1.2z"
												})
											)
										),
										el( 'button', {
												className: 'item-2-price-list-mover-down downbtn' ,
												type: 'button',
												onClick : function(){
													if( editMode == 1 )
														return ;
													if( index == props.attributes.price_list.length-2){
														return;
													}
													else {
														var temp_list = new Array();
														for( var i = 0 ; i < props.attributes.price_list.length ; i++ ){
															if( i != index && i != index+1 ){
																temp_list.push(props.attributes.price_list[i]);
															}
															else{
																temp_list.push(props.attributes.price_list[i+1]);
																temp_list.push(props.attributes.price_list[i]);
																i++;
															}
														}
														for( var i = 0 ; i < temp_list.length ; i++ )
														props.attributes.price_list[i] = temp_list[i];
														props.setAttributes(props.attributes.price_list );
													}
												}
											},
											el('svg',{
													width: '24',
													height: '24',
													class : 'moveDownSVG' + (index == props.attributes.price_list.length -2 ? ' last' : ''),
													xmlns: "http://www.w3.org/2000/svg",
													viewBox:"0 0 24 24",
													'aria-hidden': "true",
													focusable: "false",
												},
												el('path',{
													d : "M17.5 11.6L12 16l-5.5-4.4.9-1.2L12 14l4.5-3.6 1 1.2z"
												})
											)
										)
									),
									el( 'strong', {
										tagName: 'strong',
										className: 'size-label editable',
										inline: true,
										id : '0_' + index,
									},item.size_label),
									el( 'span', {
										tagName: 'span',
										className: 'size-price editable',
										inline: true,
										id : '1_' + index,
									},item.size_price),
									el( 'strong', {
										tagName: 'strong',
										className: 'addon-label editable',
										inline: true,
										id : '2_' + index,
									},item.addon_label),
									el( 'span', {
										tagName: 'span',
										className: 'addon-price editable',
										inline: true,
										id : '3_' + index,
									},item.addon_price),
									el( 'button', {
											className: 'btn btn-large item-2-price-list-item-delete',
											id : 'btn_delete' + index,
											onClick : onDeleteFunc,
										},
										el('svg',{
											width: '24',
											height: '24',
											xmlns: "http://www.w3.org/2000/svg",
											viewBox:"0 0 24 24",
											'aria-hidden': "true",
											focusable: "false",
											},
											el('path',{
												d : "M12 13.06l3.712 3.713 1.061-1.06L13.061 12l3.712-3.712-1.06-1.06L12 10.938 8.288 7.227l-1.061 1.06L10.939 12l-3.712 3.712 1.06 1.061L12 13.061z"
											})
										)
									)
								);
							}) : ''
						)
					)							
				)
			]
		},
		save: function( props ) {
			var blockProps = useBlockProps.save();
			return el(
				'div',
				{ className: props.attributes.alignment, blockProps },

				props.attributes.mediaURL &&
				el(
					'div',
					{ className: 'menu-item-image' },
					el( 'img', { src: props.attributes.mediaURL } )
				),
				el(
					'div',
					{ className: 'menu-item-title' },
					el( RichText.Content, {
						tagName: 'h3',
						value: props.attributes.title,
					} )
				),
				props.attributes.description &&
				el( RichText.Content, {
					tagName: 'div',
					className: 'item_descrip',
					value: props.attributes.description,
				} ),
				props.attributes.price_list &&
				el( 'div', { className: 'item-2-pricing-outer'},
					el( 'ul', { className: 'item-2-price-list' },
					props.attributes.price_list ? props.attributes.price_list.map(function( item , index ){
							return el( 'li', { 
								className: 'price_list_item' + (index == props.attributes.price_list.length -1 ? ' invisible_item' : ''),
								id : 'price_list_item' + index,
							},
							el( 'strong', {
								tagName: 'strong',
								className: 'size-label',
								inline: true,
							},item.size_label),
							el( 'span', {
								tagName: 'span',
								className: 'size-price',
								inline: true,
							},item.size_price),
							el( 'strong', {
								tagName: 'strong',
								className: 'addon-label',
								inline: true,
							},item.addon_label),
							el( 'span', {
								tagName: 'span',
								className: 'addon-price',
								inline: true,
							},item.addon_price),
						);
					}) : ''
					)
				),				
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
