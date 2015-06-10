var Page = (function() {

	var $fcontainer = $( '#fcontainer' ),
		$fbookBlock = $( '#fbb-bookblock' ),
		$fitems = $fbookBlock.children(),
		fitemsCount = $fitems.length,
		current = 0,
		fbb = $( '#fbb-bookblock' ).bookblock( {
			speed : 2000,
			perspective : 2000,
			shadowSides	: 0.8,
			shadowFlip	: 0.4,
			onEndFlip : function(old, page, isLimit) {
				
				current = page;
				// updateNavigation
				updateNavigation( isLimit );
				// initialize jScrollPane on the content div for the new item
				setJSP( 'init' );
				// destroy jScrollPane on the content div for the old item
				setJSP( 'destroy', old );

			}
		} ),
		$navNext = $( '#fbb-nav-next' ),
		$navPrev = $( '#fbb-nav-prev' ).hide(),
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
		$navNext.on( 'click', function() {
			fbb.next();
			return false;
		} );

		$navPrev.on( 'click', function() {
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


		// reinit jScrollPane on window resize
		$( window ).on( 'debouncedresize', function() {
			// reinitialise jScrollPane on the content div
			setJSP( 'reinit' );
		} );

	}

	function setJSP( action, idx ) {
		
		var idx = idx === undefined ? current : idx,
			$content = $fitems.eq( idx ).children( 'div.fcontent' ),
			apiJSP = $content.data( 'jsp' );
		
		if( action === 'init' && apiJSP === undefined ) {
			$content.jScrollPane({verticalGutter : 0, hideFocus : true });
		}
		else if( action === 'reinit' && apiJSP !== undefined ) {
			apiJSP.reinitialise();
		}
		else if( action === 'destroy' && apiJSP !== undefined ) {
			apiJSP.destroy();
		}

	}

	function updateNavigation( isLastPage ) {
		
		if( current === 0 ) {
			$navNext.show();
			$navPrev.hide();
		}
		else if( isLastPage ) {
			$navNext.hide();
			$navPrev.show();
		}
		else {
			$navNext.show();
			$navPrev.show();
		}

	}

	function toggleTOC() {
		var opened = $fcontainer.data( 'opened' );
		opened ? closeTOC() : openTOC();
	}

	function openTOC() {
		$navNext.hide();
		$navPrev.hide();
		$fcontainer.addClass( 'slideRight' ).data( 'opened', true );
	}

	function closeTOC( callback ) {

		updateNavigation( current === fitemsCount - 1 );
		$fcontainer.removeClass( 'slideRight' ).data( 'opened', false );
		if( callback ) {
			if( supportTransitions ) {
				$fcontainer.on( transEndEventName, function() {
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