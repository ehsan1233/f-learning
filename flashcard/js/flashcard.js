var fPage = (function() {

	var $fcontainer = $( '#fcontainer' ),
		$fmenu = $(".fbb-custom-wrapper"),
		$fbookBlock = $( '#fbb-bookblock' ),
		$fitems = $fbookBlock.children(),
		fitemsCount = $fitems.length,
		current = 0,
		fbb = $( '#fbb-bookblock' ).fbookblock( {
			speed : 1000,
			perspective : 2000,
			shadowSides	: 0.9,
			shadowFlip	: 0.3,
			onEndFlip : function(old, page, isLimit) {
				
				current = page;
				// update TOC current
				updateTOC();
				// updateNavigation
				updateNavigation( isLimit );
				// initialize jScrollPane on the content div for the new item
				setJSP( 'init' );
				// destroy jScrollPane on the content div for the old item
				setJSP( 'destroy', old );

			}
		} ),
		$fnavNext = $( '#fbb-nav-next' ),
		$fnavPrev = $( '#fbb-nav-prev' ).hide(),
		$fmenuItems = $fcontainer.find( 'ul.fmenu-toc > li' ),
		$ftblcontents = $( '#ftblcontents' ),
		transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'msTransition': 'MSTransitionEnd',
			'transition': 'transitionend'
		},
		transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
		supportTransitions = Modernizr.csstransitions;

	function init() {

		// initialize jScrollPane on the content div of the first item
		setJSP( 'init' );
		initEvents();

	}
	
	function initEvents() {

		// add navigation events
		$fnavNext.on( 'click', function() {
			fbb.next();
			return false;
		} );

		$fnavPrev.on( 'click', function() {
			fbb.prev();
			return false;
		} );
		
		// add swipe events
		$fitems.on( {
			'swipeleft'		: function( event ) {
				if( $fcontainer.data( 'opened' ) ) {
					return false;
				}
				fbb.next();
				return false;
			},
			'swiperight'	: function( event ) {
				if( $fcontainer.data( 'opened' ) ) {
					return false;
				}
				fbb.prev();
				return false;
			}
		} );

		// show table of contents
		$ftblcontents.on( 'click', toggleTOC );

		// click a menu item
		$fmenuItems.on( 'click', function() {

			var $el = $( this ),
				idx = $el.index(),
				jump = function() {
					fbb.jump( idx + 1 );
				};
			
			current !== idx ? closeTOC( jump ) : closeTOC();

			return false;
			
		} );


		// reinit jScrollPane on window resize
		$( window ).on( 'debouncedresize', function() {
			// reinitialise jScrollPane on the content div
			setJSP( 'reinit' );
		} );

	}

	function setJSP( action, idx ) {
		
		var idx = idx === undefined ? current : idx,
			$fcontent = $fitems.eq( idx ).children( 'div.fcontent' ),
			apiJSP = $fcontent.data( 'jsp' );
		
		if( action === 'init' && apiJSP === undefined ) {
			$fcontent.jScrollPane({verticalGutter : 0, hideFocus : true });
		}
		else if( action === 'reinit' && apiJSP !== undefined ) {
			apiJSP.reinitialise();
		}
		else if( action === 'destroy' && apiJSP !== undefined ) {
			apiJSP.destroy();
		}

	}

	function updateTOC() {
		$fmenuItems.removeClass( 'fmenu-toc-current' ).eq( current ).addClass( 'fmenu-toc-current' );
	}

	function updateNavigation( isLastPage ) {
		
		if( current === 0 ) {
			$fnavNext.show();
			$fnavPrev.hide();
		}
		else if( isLastPage ) {
			$fnavNext.hide();
			$fnavPrev.show();
		}
		else {
			$fnavNext.show();
			$fnavPrev.show();
		}

	}

	function toggleTOC() {
		var opened = $fmenu.data( 'opened' );
		opened ? closeTOC() : openTOC();
	}

	function openTOC() {
		$fnavNext.hide();
		$fnavPrev.hide();
		$fmenu.addClass( 'fslideRight' ).data( 'opened', true );
	}

	function closeTOC( callback ) {

		updateNavigation( current === fitemsCount - 1 );
		$fmenu.removeClass( 'fslideRight' ).data( 'opened', false );
		if( callback ) {
			if( supportTransitions ) {
				$fmenu.on( transEndEventName, function() {
					$( this ).off( transEndEventName );
					callback.call();
				} );
			}
			else {
				callback.call();
			}
		}

	}

	return { init : init };

})();