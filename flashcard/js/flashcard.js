var fPage = (function() {
	var initContainers = function(idx, fcontainer) {
	 
		var $fcontainer = $(fcontainer);
		var $fmenu = $fcontainer.find(".fbb-custom-wrapper");
		var $fbookBlock = $fcontainer.find( '.fbb-bookblock' );
		var $fitems = $fbookBlock.children();
		var fitemsCount = $fitems.length;
		var current = 0;
		var fbb = $fcontainer.find( '.fbb-bookblock' ).fbookblock( {
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
			}
		} );

		var $fnavNext = $fcontainer.find( '.fbb-nav-next' );
		var $fnavPrev = $fcontainer.find( '.fbb-nav-prev' ).hide();
		var $fmenuItems = $fcontainer.find( 'ul.fmenu-toc > li' );
		var $ftblcontents = $fcontainer.find( '.ftblcontents' );
		var transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'msTransition': 'MSTransitionEnd',
			'transition': 'transitionend'
		};
		transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
		supportTransitions = Modernizr.csstransitions;

		var toggleTOC = function() {
			var opened = $fmenu.data( 'opened' );
			opened ? closeTOC() : openTOC();
		};

		var initEvents = function() {
		
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
				$ftblcontents.click( toggleTOC );
		
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

		}
		
		initEvents();

		var updateTOC = function() {
			$fmenuItems.removeClass( 'fmenu-toc-current' ).eq( current ).addClass( 'fmenu-toc-current' );
		}
	
		var updateNavigation= function ( isLastPage ) {
			
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

	
		var openTOC = function() {
			$fnavNext.hide();
			$fnavPrev.hide();
			$fmenu.addClass( 'fslideRight' ).data( 'opened', true );
		}
	
		var closeTOC = function( callback ) {
	
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
		
	};

	var init = function() {


		$( '.fcontainer' ).each(initContainers);

	}
return { init : init };
})();