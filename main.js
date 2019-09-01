(function(){TouchMouseEvent={DOWN:"touchmousedown",UP:"touchmouseup",MOVE:"touchmousemove"};var e=function(e){var t;switch(e.type){case"mousedown":t=TouchMouseEvent.DOWN;break;case"mouseup":t=TouchMouseEvent.UP;break;case"mousemove":t=TouchMouseEvent.MOVE;break;default:return}var r=n(t,e,e.pageX,e.pageY);$(e.target).trigger(r)};var t=function(e){var t;switch(e.type){case"touchstart":t=TouchMouseEvent.DOWN;break;case"touchend":t=TouchMouseEvent.UP;break;case"touchmove":t=TouchMouseEvent.MOVE;break;default:return}var r=e.originalEvent.touches[0];var i;if(t==TouchMouseEvent.UP)i=n(t,e,null,null);else i=n(t,e,r.pageX,r.pageY);$(e.target).trigger(i)};var n=function(e,t,n,r){return $.Event(e,{pageX:n,pageY:r,originalEvent:t})};var r=$(document);if("ontouchstart"in window){r.on("touchstart",t);r.on("touchmove",t);r.on("touchend",t)}else{r.on("mousedown",e);r.on("mouseup",e);r.on("mousemove",e)}})()

function Slideshow(slideshow_options) {
	//default settings
	var settings = {
		align: 'left',
		mode: 'default', //thumb_nails
		autoplay: true,
		autoplay_start_delay : 0,
		callback: null,
		displayTime: 5000,
		easing: 'swing',
		id: 'vty-slider',
		startingSlideNumber: 1,
		visibleSlidesCount: 1,
		slideTab_has_value: false,
		transition_delay: 500,
		preload_images: false,
		loop: true,
		variableHeight: false,
		multiple_slides: false,
		slide_margin_right : 0, //percent only used when multiple slides are displayed and slideshow has variable width
		align_buttons: function() {
			//center align buttons
			var btn_h = $slideshow.find('.next').height();
			$slideshow.find('.prev, .next').css('top', (slideHeight() - btn_h)/2);
		}
	};

	var options = $.extend(true, settings, slideshow_options);

	//private properties
	var slideshow = this,
		id = '#' + options.id,
		$slideshow = $(id),
		$prev, $next, $slides,
		slideNum = options.startingSlideNumber,
		slideTimer, autoplay_timeout,
		previousSlidenum = 0,
		slide = {},
		slides_width = 0,
		tallest_slide_height = 0,
		jsonUri = options.json || $slideshow.data('json');
		templateUri = options.template || $slideshow.data('template');

	//public properties and methods
	this.isInitialized = false;
	this.width = 0;

	this.slideNumber = function(num) {
		if (num) {
			slideNum = num;
			updateUI();
			moveToSlide(options.loop ? slideNum : slideNum-1);
		} else {
			return slideNum;
		}
	};

	this.getSlideCount = function() {
		return slide.count;
	};

	//generate slideshow markup from json
	if (jsonUri) {
		generateMarkupFromJson(preloadImages);
	} else {
		preloadImages();
	}

	function generateMarkupFromJson(callback) {
		var templateIsReady = false;
		var jsonIsReady = false;
		var context = {};
		var template;

		$.getJSON(jsonUri, function(data) {
			jsonIsReady = true;
			context.slides = data;

			if (templateIsReady) {
				insertMarkup();
			}
		}).error(function(jqXHR, textStatus, errorThrown) {
			console.warn(textStatus, errorThrown);
		});

		$.ajax({
			url: templateUri,
			dataType: 'html',
			success: function(data) {
				var templateIsReady = true;

				template = Handlebars.compile(data);

				if (jsonIsReady) {
					insertMarkup();
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.warn(textStatus, errorThrown);
			}
		});

		function insertMarkup() {
			var markup = template(context);
			$slideshow.html(markup);
			callback();
		}
	}

	function preloadImages() {
		//cache DOM references
		$prev = $slideshow.find('.prev');
		$next = $slideshow.find('.next');
		$slides = $slideshow.find('.slides');

		//check if markup exists
		if ($slides.length === 0) {
			console.warn('slideshow has no markup');
			return;
		}

		//check if css is loaded
		if ($slides.css('position') !== 'relative') {
			console.warn('slideshow styles are not loaded!');
			return;
		}

		$slideshow.addClass('loading');

		if (options.preload_images && $slides.find('img').length) {
			if (typeof jQuery.fn.imagesLoaded !== 'function') {
				init();
				return;
			}
			$slides.imagesLoaded(function() {
				init()
			});
		} else {
			init();
		}
	}

	function init() {
		if (window.MutationObserver && !$slideshow.is(":visible")) {
			var observer = new MutationObserver(function(mutations) {
			  mutations.forEach(function(mutation) {
				if ($slideshow.is(":visible")) {
					observer.disconnect();
					initSlideshow();
				}
			  });
			});

			var config = { attributes: true, subtree: true};
			observer.observe($('body').get(0), config);
		} else {
			initSlideshow();
		}
	}

	function initSlideshow() {
		$slideshow.removeClass('loading');
		if (options.autoplay) enable_autoplay();

		if (options.loop) {
			adjust_dom_for_looping();
		}

		setClickHandlersForSlideshowButtons();

		slide.div = $slides.find('.slide');
		slide.count = slide.div.length; //takes fake slides into account

		if ($slideshow.has('.slideTabs')) {
			create_slideTabs();
		}

		add_drag_handlers();

		$(window).on('resize.slideshow', windowResizeHandler);

		windowResizeHandler();

		slideshow.isInitialized = true;
	}

	function enable_autoplay() {
		options.loop = true;
		autoplay_timeout = window.setTimeout(function() {
			slideTimer = window.setInterval(function() {
				navigate('next');
			}, options.displayTime);
		}, options.autoplay_start_delay);
	}

	function disable_autoplay() {
		if (options.autoplay) {
			options.autoplay = false;
			window.clearInterval(slideTimer);
			window.clearTimeout(autoplay_timeout);
		}
	}

	function create_slideTabs() {
		var $tabs = $slideshow.find('.slideTabs');

		//generate tab labels if markup is empty
		if ($tabs.children().length === 0) {
			var count = options.loop ? slide.count-2 : slide.count / options.visibleSlidesCount;
			for (var i=0; i < count; i++) {
				$tabs.append('<a href="#"></a>');
			}
		}

		$tabs.on('click', 'a', function(e) {
			e.preventDefault();
			disable_autoplay();

			if (options.visibleSlidesCount > 1) {
				slideNum = $(this).index() * options.visibleSlidesCount + 1;
			} else {
				slideNum = $(this).index() + 1;
			}

			moveToSlide(options.loop ? slideNum : slideNum-1);
		});
	}

	function windowResizeHandler(e) {
		if (window.MutationObserver && !$slideshow.is(":visible")) {
			$(window).off('resize.slideshow');

			var observer = new MutationObserver(function(mutations) {
			  mutations.forEach(function(mutation) {
				if ($slideshow.is(":visible")) {
					observer.disconnect();
					$(window).on('resize.slideshow', windowResizeHandler);
					resizeSlideshow();
				}
			  });
			});

			var config = { attributes: true, subtree: true};
			observer.observe($('body').get(0), config);
		} else {
			resizeSlideshow();
		}
	}

	function resizeSlideshow() {
		var $wrapper = $slideshow.find('> .wrapper');

		//before getting slideshow's width, we set height of wrapper to 0 because
		//as long as slideshow is not properly initizalied images wrap below each
		//other and this can cause browser show scrollbar during width calculationg
		//hence giving us a wrong width for slideshow when its width is set in css to a percentage.
		$wrapper.addClass('calculating');
		slideshow.width = $wrapper.width();
		$wrapper.removeClass('calculating');

		if (options.multiple_slides) {
			if (options.visibleSlidesCount > 1) { //so it doesn't kick in thumbnail sample. bad code!
				slide.div.width(setSlideSize());
			}
		} else {
			slide.div.width(slideshow.width);
		}

		positionSlides();
		moveToSlide(options.loop ? slideNum : slideNum-1, 0);

		if (options.variableHeight) {
			setSlideHeight();
		}
	}

	function setSlideSize() {
		var count = options.visibleSlidesCount;
		var total_width = $slideshow.find('.wrapper').width();
		var total_margins = (count - 1) * options.slide_margin_right;
		var slide_width = (100 - total_margins) / count;
		var slide_width_pixel = parseInt(total_width * slide_width / 100);
		var marginRight = parseInt(total_width * options.slide_margin_right / 100);

		$slideshow.find('.slide').width(slide_width_pixel).css('margin-right', marginRight);
		return slide_width_pixel;
	}

	function setClickHandlersForSlideshowButtons() {
		$slideshow.on('click', '.prev, .next', function(e) {
			e.preventDefault();
			if ($(this).hasClass('disabled')) return;

			disable_autoplay();
			var direction = $(this).hasClass('next') ? 'next' : 'previous';
			navigate(direction);
		});
	}

	function adjust_dom_for_looping() {
		//we insert a clone of first slide after the last slide and a clone of last
		//slide before the first. These fake slides are required for endless looping.
		var clone1 = $slides.find('.slide').first().clone().addClass('fake post_last');
		var clone2 = $slides.find('.slide').last().clone().addClass('fake pre_first');
		$slides.append(clone1).prepend(clone2);
	}

	function navigate(direction) {
		var VScount = options.visibleSlidesCount;

		if (direction == 'next') {
			if (options.loop) {
				if (slideNum < slide.count - 1 ) {
					slideNum++;
				} else {
					//jump to first slide which is same as last (current) slide
					$slides.css( {
						'left' : - slide.div.eq(1).position().left
					});
					slideNum = 2;
				}
			} else {
				if (slideNum < slide.count ) {
					//slideNum++
					slideNum = slideNum + VScount;
				}
			}
		} else {
			if (options.loop) {
				if (slideNum > 0) {
					slideNum--;
				} else {
					//jump to last slide which is same as first (current) slide
					$slides.css( {
						'left' : - slide.div.eq(slide.count-2).position().left
					});
					slideNum = slide.count - 3;
				}
			} else {
				if (slideNum > VScount) {
					slideNum = slideNum - VScount;
				}
			}
		}

		moveToSlide(options.loop ? slideNum : slideNum - 1);
	}

	function positionSlides() {
		var left = 0;
		var marginRight = parseInt(slide.div.css('margin-right')) || 0;

		//we set width of div.slides to a very large value so that content of div.slide will not wrap due to slideshows fixed width value. This is important when slide divs's width is not
		//fixed and is calculated on the fly by javascript. After all slides are positioned we update width of div.slides to the correct value (even though there is no need for that).
		//remove this hack later when you find a better solution to avoid wrapping of div.slide content.
		$slides.width(50000);

		for (var i = 0; i < slide.count; i++) {
			//slide.div.eq(i).css('left', left+'px');
			left = left + slide.div.eq(i).outerWidth() + marginRight;
			//+ ( (i != slide.count-1) ? marginRight : 0 );
			slides_width = left;
		}

		$slides.width(slides_width);
	}

	function moveToSlide(num, delay) {
		var _delay = (delay === undefined) ? options.transition_delay : delay;
		var currentSlide = slide.div.eq(num);
		var slide_left = currentSlide.position().left;
		var slide_center = currentSlide.position().left + currentSlide.width()/2;
		var slideshow_center = slideshow.width/2;


		if (options.multiple_slides && options.align === 'center') {
			if (slide_center > slideshow_center) {
				if (slide_center < slides_width - slideshow_center) {
					slide_left = slide_left - (slideshow.width - currentSlide.width())/2;
				} else {
					slide_left = slides_width - slideshow.width;
				}
			} else {
				slide_left = 0;
			}
		}

		updateUI();
		previousSlidenum = num-1;

		slide.div.removeClass('currentSlide');
		currentSlide.addClass('currentSlide');

		//stop()'s jumpToEnd should be false else loop animation will be buggy when next/prev btns are clicked fast
		$slides
			.stop(true, false)
			.animate( { 'left' : - slide_left}, _delay, options.easing, function() {
				if (options.variableHeight) {
					//addImageErrorLoadHandlers();
					if (tallest_slide_height == 0) {
						setSlideHeight();
					}
				}
				if (options.callback) options.callback(slideshow);
		}	);
	}

	function add_drag_handlers() {
		var startX, endX;
		var slides = slide.div;

		slides.bind(TouchMouseEvent.DOWN, function(e) {
			e.preventDefault();
			startX = e.pageX;
			endX = startX;
		});

		slides.bind(TouchMouseEvent.MOVE, function(e) {
			e.preventDefault();
			endX = e.pageX;
		});

		slides.bind(TouchMouseEvent.UP, function(e) {
			e.preventDefault();
			var slideIndex = slides.index($(this));

			//disable autoplay when user clicks next/prev buttons
			if (options.autoplay) {
				disable_autoplay();
			}

			if (endX < startX) {
				if (!$next.hasClass('disabled')) navigate('next');
			} else if ( endX > startX) {
				if (!$prev.hasClass('disabled')) navigate('previous');
			} else {
				if (options.mode === 'thumb_nails') {
					if ( slideIndex != slideNum ) {
						//user clicked a side slide
						slideNum = slideIndex;
						positionSlides();
					}
				}
			}
		});
	}

	function setSlideHeight() {
		$(id + ' .wrapper').css('height', slideHeight());

		options.align_buttons();
	}

	function slideHeight() {
		var index = options.loop ? slideNum : slideNum-1;

		var temp;
		if (options.visibleSlidesCount === 1) {
			temp = $(id + ' .slide').eq(index).outerHeight();
		} else {
			temp = (function() { //find highest slide's height
				var h = 0;
				$slideshow.find('.slide').each(function() {
					var temp = $(this).outerHeight();
					if (temp > h) h = temp;
				});
				tallest_slide_height = h;
				return h;
			})();
		}

		return temp;
	}

	//replace code with one from below:
	// http://stackoverflow.com/questions/4857896/jquery-callback-after-all-images-in-dom-are-loaded
	function addImageErrorLoadHandlers() {
		var images = $(id + ' .slide:eq(' + (slideNum) + ') img');
		for (var i = 0; i<images.length; i++ ) {
			images[i].onload = function(evt) {
				setSlideHeight();
			}
			images[i].onerror = function(evt) {
				this.src = "images/image_not_found.jpg";
			}
		}
	}

	function updateUI() {
		//var count = slide.count - options.visibleSlidesCount + 1;
		if (slide.count == 0) slideNum = 0;

		//update slide number
		if (slideNum == slide.count - 1 && options.loop) {
			$(id + ' .slideNumber').text('1');
		} else if (slideNum == 0 && options.loop) {
			$(id + ' .slideNumber').text(slide.count - 2);
		} else {
			$(id + ' .slideNumber').text(slideNum);
		}

		if ($slideshow.has('.slideTabs')) update_tab_state();
		if (!options.loop) update_nav_state();

		//update total sildes
		$(id + ' .slidesCount').text(options.loop ? slide.count-2 : slide.count);
	}

	function update_tab_state() {
		var tabs = $(id + ' .slideTabs a');
		tabs.removeClass('selected');

		if (options.loop) {
			if (slideNum == slide.count - 1) {
				tabs.eq(0).addClass('selected');
			} else if (slideNum == 0) {
				tabs.eq(slide.count - 3).addClass('selected');
			} else {
				tabs.eq(slideNum-1).addClass('selected');
			}
		} else {
			tabs.eq(Math.ceil(slideNum/options.visibleSlidesCount)-1).addClass('selected');
		}
	}

	function update_nav_state() {
		if (options.visibleSlidesCount == 1) {
			if ( (slideNum == slide.count) && (slideNum == 1) ) { //there is only one slide
				$prev.addClass('disabled');
				$next.addClass('disabled');
			} else if (slideNum == slide.count) { // last slide
				$prev.removeClass('disabled');
				$next.addClass('disabled');
			} else if (slideNum == 1) { // first slide
				$prev.addClass('disabled');
				$next.removeClass('disabled');
			} else { // other slides
				$prev.removeClass('disabled');
				$next.removeClass('disabled');
			}
		} else {
			if (slideNum > slide.count - options.visibleSlidesCount) {
				$prev.removeClass('disabled');
				$next.addClass('disabled');
			} else if (slideNum < options.visibleSlidesCount) {
				$prev.addClass('disabled');
				$next.removeClass('disabled');
			} else {
				$prev.removeClass('disabled');
				$next.removeClass('disabled');
			}
		}
	}

}
var yall=function(){"use strict";return function(e){var n=(e=e||{}).lazyClass||"lazy",t=e.lazyBackgroundClass||"lazy-bg",o="idleLoadTimeout"in e?e.idleLoadTimeout:200,i=e.observeChanges||!1,r=e.events||{},a=window,s="requestIdleCallback",u="IntersectionObserver",c=["srcset","src","poster"],d=[],l=function(e,o){return d.slice.call((o||document).querySelectorAll(e||"img."+n+",video."+n+",iframe."+n+",."+t))},f=function(n){var o,i=n.parentNode;"PICTURE"==i.nodeName&&(o=i),"VIDEO"==n.nodeName&&(o=n),g(l("source",o),b),b(n),n.autoplay&&n.load();var r=n.classList;r.contains(t)&&(r.remove(t),r.add(e.lazyBackgroundLoaded||"lazy-bg-loaded"))},v=function(e){for(var n in r)e.addEventListener(n,r[n].listener||r[n],r[n].options||void 0)},b=function(e){var n=function(n){c[n]in e.dataset&&a.requestAnimationFrame(function(){e.setAttribute(c[n],e.dataset[c[n]])})};for(var t in c)n(t)},g=function(e,n){for(var t in e)n instanceof a[u]?n.observe(e[t]):n(e[t])},m=function(e){if(e.isIntersecting||e.intersectionRatio){var t=e.target;s in a&&o?a[s](function(){f(t)},{timeout:o}):f(t),t.classList.remove(n),p.unobserve(t),(h=h.filter(function(e){return e!=t})).length||i||p.disconnect()}},y=function(e){h.indexOf(e)<0&&(h.push(e),v(e),p.observe(e))},h=l();if(/baidu|(?:google|bing|yandex|duckduck)bot/i.test(navigator.userAgent))g(h,f);else if(u in a&&u+"Entry"in a){var p=new a[u](function(e){g(e,m)},{rootMargin:("threshold"in e?e.threshold:200)+"px 0%"});g(h,v),g(h,p),i&&g(l(e.observeRootSelector||"body"),function(n){new MutationObserver(function(){g(l(),y)}).observe(n,e.mutationObserverOptions||{childList:!0,subtree:!0})})}}}();











































//zoom product
/*!-----------------------------------------------------
 * xZoom v1.0.14
 * (c) 2013 by Azat Ahmedov & Elman Guseynov
 * https://github.com/payalord
 * https://dribbble.com/elmanvebs
 * Apache License 2.0
 *------------------------------------------------------*/
;window.requestAnimFrame=(function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(a,20)}})();function detect_old_ie(){if(/MSIE (\d+\.\d+);/.test(navigator.userAgent)){var a=new Number(RegExp.$1);if(a>=9){return false}else{if(a>=8){return true}else{if(a>=7){return true}else{if(a>=6){return true}else{if(a>=5){return true}}}}}}else{return false}}(function(b){b.fn.xon=b.fn.on||b.fn.bind;b.fn.xoff=b.fn.off||b.fn.bind;function a(ax,aG){this.xzoom=true;var E=this;var M;var aD={};var ad,ak,aa,aj,ac,ai,am,R,aF,x,ao,Z,X;var ay,o,P,T,S,ab,p=new Array();var F=new Array(),aC=0,y=0;var I,Q,l,k;var aq,aB,aw,au,O,n,aL,aJ,aA,az,W,U,ap,al=0;var h,ah;var aK,B=0,z=0,ag=0,ae=0,s=0,r=0,at=0,ar=0,H=0,G=0;var D=detect_old_ie(),A=/MSIE (\d+\.\d+);/.test(navigator.userAgent),Y,V;var K,j="",J,t;var aI,f,m,q,g,i,an,d;this.adaptive=function(){if(m==0||q==0){ax.css("width","");ax.css("height","");m=ax.width();q=ax.height()}aH();aI=b(window).width();f=b(window).height();g=ax.width();i=ax.height();var u=false;if(m>aI||q>f){u=true}if(g>m){g=m}if(i>q){i=q}if(u){ax.width("100%")}else{if(m!=0){ax.width(m)}}if(an!="fullscreen"){if(aE()){E.options.position=an}else{E.options.position=E.options.mposition}}if(!E.options.lensReverse){d=E.options.adaptiveReverse&&E.options.position==E.options.mposition}};function av(){var aM=document.documentElement;var v=(window.pageXOffset||aM.scrollLeft)-(aM.clientLeft||0);var u=(window.pageYOffset||aM.scrollTop)-(aM.clientTop||0);return{left:v,top:u}}function aE(){var u=ax.offset();if(E.options.zoomWidth=="auto"){aa=g}else{aa=E.options.zoomWidth}if(E.options.zoomHeight=="auto"){aj=i}else{aj=E.options.zoomHeight}if(E.options.position.substr(0,1)=="#"){aD=b(E.options.position)}else{aD.length=0}if(aD.length!=0){return true}switch(an){case"lens":case"inside":return true;break;case"top":ai=u.top;am=u.left;R=ai-aj;aF=am;break;case"left":ai=u.top;am=u.left;R=ai;aF=am-aa;break;case"bottom":ai=u.top;am=u.left;R=ai+i;aF=am;break;case"right":default:ai=u.top;am=u.left;R=ai;aF=am+g}if(aF+aa>aI||aF<0){return false}return true}this.xscroll=function(v){Z=v.pageX||v.originalEvent.pageX;X=v.pageY||v.originalEvent.pageY;v.preventDefault();if(v.xscale){al=v.xscale;L(Z,X)}else{var aN=-v.originalEvent.detail||v.originalEvent.wheelDelta||v.xdelta;var u=Z;var aM=X;if(D){u=Y;aM=V}if(aN>0){aN=-0.05}else{aN=0.05}al+=aN;L(u,aM)}};function w(){if(E.options.lensShape=="circle"&&E.options.position=="lens"){aq=aB=Math.max(aq,aB);var u=(aq+Math.max(n,O)*2)/2;l.css({"-moz-border-radius":u,"-webkit-border-radius":u,"border-radius":u})}}function C(u,aN,aM,v){if(E.options.position=="lens"){Q.css({top:-(aN-ai)*az+(aB/2),left:-(u-am)*aA+(aq/2)});if(E.options.bg){l.css({"background-image":"url("+Q.attr("src")+")","background-repeat":"no-repeat","background-position":(-(u-am)*aA+(aq/2))+"px "+(-(aN-ai)*az+(aB/2))+"px"});if(aM&&v){l.css({"background-size":aM+"px "+v+"px"})}}}else{Q.css({top:-au*az,left:-aw*aA})}}function L(u,aO){if(al<-1){al=-1}if(al>1){al=1}var aN,v,aM;if(W<U){aN=W-(W-1)*al;v=aa*aN;aM=v/ap}else{aN=U-(U-1)*al;aM=aj*aN;v=aM*ap}if(aK){B=u;z=aO;ag=v;ae=aM}else{if(!aK){s=ag=v;r=ae=aM}aA=v/ad;az=aM/ak;aq=aa/aA;aB=aj/az;w();e(u,aO);Q.width(v);Q.height(aM);l.width(aq);l.height(aB);l.css({top:au-n,left:aw-O});k.css({top:-au,left:-aw});C(u,aO,v,aM)}}function c(){var u=at;var aP=ar;var v=H;var aM=G;var aO=s;var aN=r;u+=(B-u)/E.options.smoothLensMove;aP+=(z-aP)/E.options.smoothLensMove;v+=(B-v)/E.options.smoothZoomMove;aM+=(z-aM)/E.options.smoothZoomMove;aO+=(ag-aO)/E.options.smoothScale;aN+=(ae-aN)/E.options.smoothScale;aA=aO/ad;az=aN/ak;aq=aa/aA;aB=aj/az;w();e(u,aP);Q.width(aO);Q.height(aN);l.width(aq);l.height(aB);l.css({top:au-n,left:aw-O});k.css({top:-au,left:-aw});e(v,aM);C(u,aP,aO,aN);at=u;ar=aP;H=v;G=aM;s=aO;r=aN;if(aK){requestAnimFrame(c)}}function e(u,v){u-=am;v-=ai;aw=u-(aq/2);au=v-(aB/2);if(E.options.position!="lens"&&E.options.lensCollision){if(aw<0){aw=0}if(ad>=aq&&aw>ad-aq){aw=ad-aq}if(ad<aq){aw=ad/2-aq/2}if(au<0){au=0}if(ak>=aB&&au>ak-aB){au=ak-aB}if(ak<aB){au=ak/2-aB/2}}}function aH(){if(typeof ay!="undefined"){ay.remove()}if(typeof P!="undefined"){P.remove()}if(typeof t!="undefined"){t.remove()}}function N(u,aM){if(E.options.position=="fullscreen"){ad=b(window).width();ak=b(window).height()}else{ad=ax.width();ak=ax.height()}T.css({top:ak/2-T.height()/2,left:ad/2-T.width()/2});if(E.options.rootOutput||E.options.position=="fullscreen"){ac=ax.offset()}else{ac=ax.position()}ac.top=Math.round(ac.top);ac.left=Math.round(ac.left);switch(E.options.position){case"fullscreen":ai=av().top;am=av().left;R=0;aF=0;break;case"inside":ai=ac.top;am=ac.left;R=0;aF=0;break;case"top":ai=ac.top;am=ac.left;R=ai-aj;aF=am;break;case"left":ai=ac.top;am=ac.left;R=ai;aF=am-aa;break;case"bottom":ai=ac.top;am=ac.left;R=ai+ak;aF=am;break;case"right":default:ai=ac.top;am=ac.left;R=ai;aF=am+ad}ai-=ay.outerHeight()/2;am-=ay.outerWidth()/2;if(E.options.position.substr(0,1)=="#"){aD=b(E.options.position)}else{aD.length=0}if(aD.length==0&&E.options.position!="inside"&&E.options.position!="fullscreen"){if(!E.options.adaptive||!m||!q){m=ad;q=ak}if(E.options.zoomWidth=="auto"){aa=ad}else{aa=E.options.zoomWidth}if(E.options.zoomHeight=="auto"){aj=ak}else{aj=E.options.zoomHeight}R+=E.options.Yoffset;aF+=E.options.Xoffset;P.css({width:aa+"px",height:aj+"px",top:R,left:aF});if(E.options.position!="lens"){M.append(P)}}else{if(E.options.position=="inside"||E.options.position=="fullscreen"){aa=ad;aj=ak;P.css({width:aa+"px",height:aj+"px"});ay.append(P)}else{aa=aD.width();aj=aD.height();if(E.options.rootOutput){R=aD.offset().top;aF=aD.offset().left;M.append(P)}else{R=aD.position().top;aF=aD.position().left;aD.parent().append(P)}R+=(aD.outerHeight()-aj-P.outerHeight())/2;aF+=(aD.outerWidth()-aa-P.outerWidth())/2;P.css({width:aa+"px",height:aj+"px",top:R,left:aF})}}if(E.options.title&&j!=""){if(E.options.position=="inside"||E.options.position=="lens"||E.options.position=="fullscreen"){x=R;ao=aF;ay.append(t)}else{x=R+(P.outerHeight()-aj)/2;ao=aF+(P.outerWidth()-aa)/2;M.append(t)}t.css({width:aa+"px",height:aj+"px",top:x,left:ao})}ay.css({width:ad+"px",height:ak+"px",top:ai,left:am});o.css({width:ad+"px",height:ak+"px"});if(E.options.tint&&(E.options.position!="inside"&&E.options.position!="fullscreen")){o.css("background-color",E.options.tint)}else{if(D){o.css({"background-image":"url("+ax.attr("src")+")","background-color":"#fff"})}}I=new Image();var v="";if(A){v="?r="+(new Date()).getTime()}I.src=ax.attr("xoriginal")+v;Q=b(I);Q.css("position","absolute");I=new Image();I.src=ax.attr("src");k=b(I);k.css("position","absolute");k.width(ad);switch(E.options.position){case"fullscreen":case"inside":P.append(Q);break;case"lens":l.append(Q);if(E.options.bg){Q.css({display:"none"})}break;default:P.append(Q);l.append(k)}}this.openzoom=function(u){Z=u.pageX;X=u.pageY;if(E.options.adaptive){E.adaptive()}al=E.options.defaultScale;aK=false;ay=b("<div></div>");if(E.options.sourceClass!=""){ay.addClass(E.options.sourceClass)}ay.css("position","absolute");T=b("<div></div>");if(E.options.loadingClass!=""){T.addClass(E.options.loadingClass)}T.css("position","absolute");o=b('<div style="position: absolute; top: 0; left: 0;"></div>');ay.append(T);P=b("<div></div>");if(E.options.zoomClass!=""&&E.options.position!="fullscreen"){P.addClass(E.options.zoomClass)}P.css({position:"absolute",overflow:"hidden",opacity:1});if(E.options.title&&j!=""){t=b("<div></div>");J=b("<div></div>");t.css({position:"absolute",opacity:1});if(E.options.titleClass){J.addClass(E.options.titleClass)}J.html("<span>"+j+"</span>");t.append(J);if(E.options.fadeIn){t.css({opacity:0})}}l=b("<div></div>");if(E.options.lensClass!=""){l.addClass(E.options.lensClass)}l.css({position:"absolute",overflow:"hidden"});if(E.options.lens){lenstint=b("<div></div>");lenstint.css({position:"absolute",background:E.options.lens,opacity:E.options.lensOpacity,width:"100%",height:"100%",top:0,left:0,"z-index":9999});l.append(lenstint)}N(Z,X);if(E.options.position!="inside"&&E.options.position!="fullscreen"){if(E.options.tint||D){ay.append(o)}if(E.options.fadeIn){o.css({opacity:0});l.css({opacity:0});P.css({opacity:0})}M.append(ay)}else{if(E.options.fadeIn){P.css({opacity:0})}M.append(ay)}E.eventmove(ay);E.eventleave(ay);switch(E.options.position){case"inside":R-=(P.outerHeight()-P.height())/2;aF-=(P.outerWidth()-P.width())/2;break;case"top":R-=P.outerHeight()-P.height();aF-=(P.outerWidth()-P.width())/2;break;case"left":R-=(P.outerHeight()-P.height())/2;aF-=P.outerWidth()-P.width();break;case"bottom":aF-=(P.outerWidth()-P.width())/2;break;case"right":R-=(P.outerHeight()-P.height())/2}P.css({top:R,left:aF});Q.xon("load",function(aN){T.remove();if(!E.options.openOnSmall&&(Q.width()<aa||Q.height()<aj)){E.closezoom();aN.preventDefault();return false}if(E.options.scroll){E.eventscroll(ay)}if(E.options.position!="inside"&&E.options.position!="fullscreen"){ay.append(l);if(E.options.fadeIn){o.fadeTo(300,E.options.tintOpacity);l.fadeTo(300,1);P.fadeTo(300,1)}else{o.css({opacity:E.options.tintOpacity});l.css({opacity:1});P.css({opacity:1})}}else{if(E.options.fadeIn){P.fadeTo(300,1)}else{P.css({opacity:1})}}if(E.options.title&&j!=""){if(E.options.fadeIn){t.fadeTo(300,1)}else{t.css({opacity:1})}}h=Q.width();ah=Q.height();if(E.options.adaptive){if(ad<m||ak<q){k.width(ad);k.height(ak);h=ad/m*h;ah=ak/q*ah;Q.width(h);Q.height(ah)}}s=ag=h;r=ae=ah;ap=h/ah;W=h/aa;U=ah/aj;var aM,aO=["padding-","border-"];n=O=0;for(var v=0;v<aO.length;v++){aM=parseFloat(l.css(aO[v]+"top-width"));n+=aM!==aM?0:aM;aM=parseFloat(l.css(aO[v]+"bottom-width"));n+=aM!==aM?0:aM;aM=parseFloat(l.css(aO[v]+"left-width"));O+=aM!==aM?0:aM;aM=parseFloat(l.css(aO[v]+"right-width"));O+=aM!==aM?0:aM}n/=2;O/=2;H=at=B=Z;G=ar=z=X;L(Z,X);if(E.options.smooth){aK=true;requestAnimFrame(c)}E.eventclick(ay)})};this.movezoom=function(v){Z=v.pageX;X=v.pageY;if(D){Y=Z;V=X}var u=Z-am;var aM=X-ai;if(d){v.pageX-=(u-ad/2)*2;v.pageY-=(aM-ak/2)*2}if(u<0||u>ad||aM<0||aM>ak){ay.trigger("mouseleave")}if(E.options.smooth){B=v.pageX;z=v.pageY}else{w();e(v.pageX,v.pageY);l.css({top:au-n,left:aw-O});k.css({top:-au,left:-aw});C(v.pageX,v.pageY,0,0)}};this.eventdefault=function(){E.eventopen=function(u){u.xon("mouseenter",E.openzoom)};E.eventleave=function(u){u.xon("mouseleave",E.closezoom)};E.eventmove=function(u){u.xon("mousemove",E.movezoom)};E.eventscroll=function(u){u.xon("mousewheel DOMMouseScroll",E.xscroll)};E.eventclick=function(u){u.xon("click",function(v){ax.trigger("click")})}};this.eventunbind=function(){ax.xoff("mouseenter");E.eventopen=function(u){};E.eventleave=function(u){};E.eventmove=function(u){};E.eventscroll=function(u){};E.eventclick=function(u){}};this.init=function(u){E.options=b.extend({},b.fn.xzoom.defaults,u);if(E.options.rootOutput){M=b("body")}else{M=ax.parent()}an=E.options.position;d=E.options.lensReverse&&E.options.position=="inside";if(E.options.smoothZoomMove<1){E.options.smoothZoomMove=1}if(E.options.smoothLensMove<1){E.options.smoothLensMove=1}if(E.options.smoothScale<1){E.options.smoothScale=1}if(E.options.adaptive){b(window).xon("load",function(){m=ax.width();q=ax.height();E.adaptive();b(window).resize(E.adaptive)})}E.eventdefault();E.eventopen(ax)};this.destroy=function(){E.eventunbind()};this.closezoom=function(){aK=false;if(E.options.fadeOut){if(E.options.title&&j!=""){t.fadeOut(299)}if(E.options.position!="inside"||E.options.position!="fullscreen"){P.fadeOut(299);ay.fadeOut(300,function(){aH()})}else{ay.fadeOut(300,function(){aH()})}}else{aH()}};this.gallery=function(){var aM=new Array();var v,u=0;for(v=y;v<F.length;v++){aM[u]=F[v];u++}for(v=0;v<y;v++){aM[u]=F[v];u++}return{index:y,ogallery:F,cgallery:aM}};function af(u){var aM=u.attr("title");var v=u.attr("xtitle");if(v){return v}else{if(aM){return aM}else{return""}}}this.xappend=function(u){var v=u.parent();F[aC]=v.attr("href");v.data("xindex",aC);if(aC==0&&E.options.activeClass){K=u;K.addClass(E.options.activeClass)}if(aC==0&&E.options.title){j=af(u)}aC++;function aM(aO){aH();aO.preventDefault();if(E.options.activeClass){K.removeClass(E.options.activeClass);K=u;K.addClass(E.options.activeClass)}y=b(this).data("xindex");if(E.options.fadeTrans){ab=new Image();ab.src=ax.attr("src");S=b(ab);S.css({position:"absolute",top:ax.offset().top,left:ax.offset().left,width:ax.width(),height:ax.height()});b(document.body).append(S);S.fadeOut(200,function(){S.remove()})}var aP=v.attr("href");var aN=u.attr("xpreview")||u.attr("src");j=af(u);if(u.attr("title")){ax.attr("title",u.attr("title"))}ax.attr("xoriginal",aP);ax.removeAttr("style");ax.attr("src",aN);if(E.options.adaptive){m=ax.width();q=ax.height()}}if(E.options.hover){v.xon("mouseenter",v,aM)}v.xon("click",v,aM)};this.init(aG)}b.fn.xzoom=function(e){var c;var d;if(this.selector){var g=this.selector.split(",");for(var f in g){g[f]=b.trim(g[f])}this.each(function(h){if(g.length==1){if(h==0){c=b(this);if(typeof(c.data("xzoom"))!=="undefined"){return c.data("xzoom")}c.x=new a(c,e)}else{if(typeof(c.x)!=="undefined"){d=b(this);c.x.xappend(d)}}}else{if(b(this).is(g[0])&&h==0){c=b(this);if(typeof(c.data("xzoom"))!=="undefined"){return c.data("xzoom")}c.x=new a(c,e)}else{if(typeof(c.x)!=="undefined"&&!b(this).is(g[0])){d=b(this);c.x.xappend(d)}}}})}else{this.each(function(h){if(h==0){c=b(this);if(typeof(c.data("xzoom"))!=="undefined"){return c.data("xzoom")}c.x=new a(c,e)}else{if(typeof(c.x)!=="undefined"){d=b(this);c.x.xappend(d)}}})}if(typeof(c)==="undefined"){return false}c.data("xzoom",c.x);b(c).trigger("xzoom_ready");return c.x};b.fn.xzoom.defaults={position:"right",mposition:"inside",rootOutput:true,Xoffset:0,Yoffset:0,fadeIn:true,fadeTrans:true,fadeOut:false,smooth:true,smoothZoomMove:3,smoothLensMove:1,smoothScale:6,defaultScale:0,scroll:true,tint:false,tintOpacity:0.5,lens:false,lensOpacity:0.5,lensShape:"box",lensCollision:true,lensReverse:false,openOnSmall:true,zoomWidth:"auto",zoomHeight:"auto",sourceClass:"xzoom-source",loadingClass:"xzoom-loading",lensClass:"xzoom-lens",zoomClass:"xzoom-preview",activeClass:"xactive",hover:false,adaptive:true,adaptiveReverse:false,title:false,titleClass:"xzoom-caption",bg:false}})(jQuery);/*!-----------------------------------------------------
 * xZoom v1.0.14
 * (c) 2013 by Azat Ahmedov & Elman Guseynov
 * https://github.com/payalord
 * https://dribbble.com/elmanvebs
 * Apache License 2.0
 *------------------------------------------------------*/
;window.requestAnimFrame=(function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(a,20)}})();function detect_old_ie(){if(/MSIE (\d+\.\d+);/.test(navigator.userAgent)){var a=new Number(RegExp.$1);if(a>=9){return false}else{if(a>=8){return true}else{if(a>=7){return true}else{if(a>=6){return true}else{if(a>=5){return true}}}}}}else{return false}}(function(b){b.fn.xon=b.fn.on||b.fn.bind;b.fn.xoff=b.fn.off||b.fn.bind;function a(ax,aG){this.xzoom=true;var E=this;var M;var aD={};var ad,ak,aa,aj,ac,ai,am,R,aF,x,ao,Z,X;var ay,o,P,T,S,ab,p=new Array();var F=new Array(),aC=0,y=0;var I,Q,l,k;var aq,aB,aw,au,O,n,aL,aJ,aA,az,W,U,ap,al=0;var h,ah;var aK,B=0,z=0,ag=0,ae=0,s=0,r=0,at=0,ar=0,H=0,G=0;var D=detect_old_ie(),A=/MSIE (\d+\.\d+);/.test(navigator.userAgent),Y,V;var K,j="",J,t;var aI,f,m,q,g,i,an,d;this.adaptive=function(){if(m==0||q==0){ax.css("width","");ax.css("height","");m=ax.width();q=ax.height()}aH();aI=b(window).width();f=b(window).height();g=ax.width();i=ax.height();var u=false;if(m>aI||q>f){u=true}if(g>m){g=m}if(i>q){i=q}if(u){ax.width("100%")}else{if(m!=0){ax.width(m)}}if(an!="fullscreen"){if(aE()){E.options.position=an}else{E.options.position=E.options.mposition}}if(!E.options.lensReverse){d=E.options.adaptiveReverse&&E.options.position==E.options.mposition}};function av(){var aM=document.documentElement;var v=(window.pageXOffset||aM.scrollLeft)-(aM.clientLeft||0);var u=(window.pageYOffset||aM.scrollTop)-(aM.clientTop||0);return{left:v,top:u}}function aE(){var u=ax.offset();if(E.options.zoomWidth=="auto"){aa=g}else{aa=E.options.zoomWidth}if(E.options.zoomHeight=="auto"){aj=i}else{aj=E.options.zoomHeight}if(E.options.position.substr(0,1)=="#"){aD=b(E.options.position)}else{aD.length=0}if(aD.length!=0){return true}switch(an){case"lens":case"inside":return true;break;case"top":ai=u.top;am=u.left;R=ai-aj;aF=am;break;case"left":ai=u.top;am=u.left;R=ai;aF=am-aa;break;case"bottom":ai=u.top;am=u.left;R=ai+i;aF=am;break;case"right":default:ai=u.top;am=u.left;R=ai;aF=am+g}if(aF+aa>aI||aF<0){return false}return true}this.xscroll=function(v){Z=v.pageX||v.originalEvent.pageX;X=v.pageY||v.originalEvent.pageY;v.preventDefault();if(v.xscale){al=v.xscale;L(Z,X)}else{var aN=-v.originalEvent.detail||v.originalEvent.wheelDelta||v.xdelta;var u=Z;var aM=X;if(D){u=Y;aM=V}if(aN>0){aN=-0.05}else{aN=0.05}al+=aN;L(u,aM)}};function w(){if(E.options.lensShape=="circle"&&E.options.position=="lens"){aq=aB=Math.max(aq,aB);var u=(aq+Math.max(n,O)*2)/2;l.css({"-moz-border-radius":u,"-webkit-border-radius":u,"border-radius":u})}}function C(u,aN,aM,v){if(E.options.position=="lens"){Q.css({top:-(aN-ai)*az+(aB/2),left:-(u-am)*aA+(aq/2)});if(E.options.bg){l.css({"background-image":"url("+Q.attr("src")+")","background-repeat":"no-repeat","background-position":(-(u-am)*aA+(aq/2))+"px "+(-(aN-ai)*az+(aB/2))+"px"});if(aM&&v){l.css({"background-size":aM+"px "+v+"px"})}}}else{Q.css({top:-au*az,left:-aw*aA})}}function L(u,aO){if(al<-1){al=-1}if(al>1){al=1}var aN,v,aM;if(W<U){aN=W-(W-1)*al;v=aa*aN;aM=v/ap}else{aN=U-(U-1)*al;aM=aj*aN;v=aM*ap}if(aK){B=u;z=aO;ag=v;ae=aM}else{if(!aK){s=ag=v;r=ae=aM}aA=v/ad;az=aM/ak;aq=aa/aA;aB=aj/az;w();e(u,aO);Q.width(v);Q.height(aM);l.width(aq);l.height(aB);l.css({top:au-n,left:aw-O});k.css({top:-au,left:-aw});C(u,aO,v,aM)}}function c(){var u=at;var aP=ar;var v=H;var aM=G;var aO=s;var aN=r;u+=(B-u)/E.options.smoothLensMove;aP+=(z-aP)/E.options.smoothLensMove;v+=(B-v)/E.options.smoothZoomMove;aM+=(z-aM)/E.options.smoothZoomMove;aO+=(ag-aO)/E.options.smoothScale;aN+=(ae-aN)/E.options.smoothScale;aA=aO/ad;az=aN/ak;aq=aa/aA;aB=aj/az;w();e(u,aP);Q.width(aO);Q.height(aN);l.width(aq);l.height(aB);l.css({top:au-n,left:aw-O});k.css({top:-au,left:-aw});e(v,aM);C(u,aP,aO,aN);at=u;ar=aP;H=v;G=aM;s=aO;r=aN;if(aK){requestAnimFrame(c)}}function e(u,v){u-=am;v-=ai;aw=u-(aq/2);au=v-(aB/2);if(E.options.position!="lens"&&E.options.lensCollision){if(aw<0){aw=0}if(ad>=aq&&aw>ad-aq){aw=ad-aq}if(ad<aq){aw=ad/2-aq/2}if(au<0){au=0}if(ak>=aB&&au>ak-aB){au=ak-aB}if(ak<aB){au=ak/2-aB/2}}}function aH(){if(typeof ay!="undefined"){ay.remove()}if(typeof P!="undefined"){P.remove()}if(typeof t!="undefined"){t.remove()}}function N(u,aM){if(E.options.position=="fullscreen"){ad=b(window).width();ak=b(window).height()}else{ad=ax.width();ak=ax.height()}T.css({top:ak/2-T.height()/2,left:ad/2-T.width()/2});if(E.options.rootOutput||E.options.position=="fullscreen"){ac=ax.offset()}else{ac=ax.position()}ac.top=Math.round(ac.top);ac.left=Math.round(ac.left);switch(E.options.position){case"fullscreen":ai=av().top;am=av().left;R=0;aF=0;break;case"inside":ai=ac.top;am=ac.left;R=0;aF=0;break;case"top":ai=ac.top;am=ac.left;R=ai-aj;aF=am;break;case"left":ai=ac.top;am=ac.left;R=ai;aF=am-aa;break;case"bottom":ai=ac.top;am=ac.left;R=ai+ak;aF=am;break;case"right":default:ai=ac.top;am=ac.left;R=ai;aF=am+ad}ai-=ay.outerHeight()/2;am-=ay.outerWidth()/2;if(E.options.position.substr(0,1)=="#"){aD=b(E.options.position)}else{aD.length=0}if(aD.length==0&&E.options.position!="inside"&&E.options.position!="fullscreen"){if(!E.options.adaptive||!m||!q){m=ad;q=ak}if(E.options.zoomWidth=="auto"){aa=ad}else{aa=E.options.zoomWidth}if(E.options.zoomHeight=="auto"){aj=ak}else{aj=E.options.zoomHeight}R+=E.options.Yoffset;aF+=E.options.Xoffset;P.css({width:aa+"px",height:aj+"px",top:R,left:aF});if(E.options.position!="lens"){M.append(P)}}else{if(E.options.position=="inside"||E.options.position=="fullscreen"){aa=ad;aj=ak;P.css({width:aa+"px",height:aj+"px"});ay.append(P)}else{aa=aD.width();aj=aD.height();if(E.options.rootOutput){R=aD.offset().top;aF=aD.offset().left;M.append(P)}else{R=aD.position().top;aF=aD.position().left;aD.parent().append(P)}R+=(aD.outerHeight()-aj-P.outerHeight())/2;aF+=(aD.outerWidth()-aa-P.outerWidth())/2;P.css({width:aa+"px",height:aj+"px",top:R,left:aF})}}if(E.options.title&&j!=""){if(E.options.position=="inside"||E.options.position=="lens"||E.options.position=="fullscreen"){x=R;ao=aF;ay.append(t)}else{x=R+(P.outerHeight()-aj)/2;ao=aF+(P.outerWidth()-aa)/2;M.append(t)}t.css({width:aa+"px",height:aj+"px",top:x,left:ao})}ay.css({width:ad+"px",height:ak+"px",top:ai,left:am});o.css({width:ad+"px",height:ak+"px"});if(E.options.tint&&(E.options.position!="inside"&&E.options.position!="fullscreen")){o.css("background-color",E.options.tint)}else{if(D){o.css({"background-image":"url("+ax.attr("src")+")","background-color":"#fff"})}}I=new Image();var v="";if(A){v="?r="+(new Date()).getTime()}I.src=ax.attr("xoriginal")+v;Q=b(I);Q.css("position","absolute");I=new Image();I.src=ax.attr("src");k=b(I);k.css("position","absolute");k.width(ad);switch(E.options.position){case"fullscreen":case"inside":P.append(Q);break;case"lens":l.append(Q);if(E.options.bg){Q.css({display:"none"})}break;default:P.append(Q);l.append(k)}}this.openzoom=function(u){Z=u.pageX;X=u.pageY;if(E.options.adaptive){E.adaptive()}al=E.options.defaultScale;aK=false;ay=b("<div></div>");if(E.options.sourceClass!=""){ay.addClass(E.options.sourceClass)}ay.css("position","absolute");T=b("<div></div>");if(E.options.loadingClass!=""){T.addClass(E.options.loadingClass)}T.css("position","absolute");o=b('<div style="position: absolute; top: 0; left: 0;"></div>');ay.append(T);P=b("<div></div>");if(E.options.zoomClass!=""&&E.options.position!="fullscreen"){P.addClass(E.options.zoomClass)}P.css({position:"absolute",overflow:"hidden",opacity:1});if(E.options.title&&j!=""){t=b("<div></div>");J=b("<div></div>");t.css({position:"absolute",opacity:1});if(E.options.titleClass){J.addClass(E.options.titleClass)}J.html("<span>"+j+"</span>");t.append(J);if(E.options.fadeIn){t.css({opacity:0})}}l=b("<div></div>");if(E.options.lensClass!=""){l.addClass(E.options.lensClass)}l.css({position:"absolute",overflow:"hidden"});if(E.options.lens){lenstint=b("<div></div>");lenstint.css({position:"absolute",background:E.options.lens,opacity:E.options.lensOpacity,width:"100%",height:"100%",top:0,left:0,"z-index":9999});l.append(lenstint)}N(Z,X);if(E.options.position!="inside"&&E.options.position!="fullscreen"){if(E.options.tint||D){ay.append(o)}if(E.options.fadeIn){o.css({opacity:0});l.css({opacity:0});P.css({opacity:0})}M.append(ay)}else{if(E.options.fadeIn){P.css({opacity:0})}M.append(ay)}E.eventmove(ay);E.eventleave(ay);switch(E.options.position){case"inside":R-=(P.outerHeight()-P.height())/2;aF-=(P.outerWidth()-P.width())/2;break;case"top":R-=P.outerHeight()-P.height();aF-=(P.outerWidth()-P.width())/2;break;case"left":R-=(P.outerHeight()-P.height())/2;aF-=P.outerWidth()-P.width();break;case"bottom":aF-=(P.outerWidth()-P.width())/2;break;case"right":R-=(P.outerHeight()-P.height())/2}P.css({top:R,left:aF});Q.xon("load",function(aN){T.remove();if(!E.options.openOnSmall&&(Q.width()<aa||Q.height()<aj)){E.closezoom();aN.preventDefault();return false}if(E.options.scroll){E.eventscroll(ay)}if(E.options.position!="inside"&&E.options.position!="fullscreen"){ay.append(l);if(E.options.fadeIn){o.fadeTo(300,E.options.tintOpacity);l.fadeTo(300,1);P.fadeTo(300,1)}else{o.css({opacity:E.options.tintOpacity});l.css({opacity:1});P.css({opacity:1})}}else{if(E.options.fadeIn){P.fadeTo(300,1)}else{P.css({opacity:1})}}if(E.options.title&&j!=""){if(E.options.fadeIn){t.fadeTo(300,1)}else{t.css({opacity:1})}}h=Q.width();ah=Q.height();if(E.options.adaptive){if(ad<m||ak<q){k.width(ad);k.height(ak);h=ad/m*h;ah=ak/q*ah;Q.width(h);Q.height(ah)}}s=ag=h;r=ae=ah;ap=h/ah;W=h/aa;U=ah/aj;var aM,aO=["padding-","border-"];n=O=0;for(var v=0;v<aO.length;v++){aM=parseFloat(l.css(aO[v]+"top-width"));n+=aM!==aM?0:aM;aM=parseFloat(l.css(aO[v]+"bottom-width"));n+=aM!==aM?0:aM;aM=parseFloat(l.css(aO[v]+"left-width"));O+=aM!==aM?0:aM;aM=parseFloat(l.css(aO[v]+"right-width"));O+=aM!==aM?0:aM}n/=2;O/=2;H=at=B=Z;G=ar=z=X;L(Z,X);if(E.options.smooth){aK=true;requestAnimFrame(c)}E.eventclick(ay)})};this.movezoom=function(v){Z=v.pageX;X=v.pageY;if(D){Y=Z;V=X}var u=Z-am;var aM=X-ai;if(d){v.pageX-=(u-ad/2)*2;v.pageY-=(aM-ak/2)*2}if(u<0||u>ad||aM<0||aM>ak){ay.trigger("mouseleave")}if(E.options.smooth){B=v.pageX;z=v.pageY}else{w();e(v.pageX,v.pageY);l.css({top:au-n,left:aw-O});k.css({top:-au,left:-aw});C(v.pageX,v.pageY,0,0)}};this.eventdefault=function(){E.eventopen=function(u){u.xon("mouseenter",E.openzoom)};E.eventleave=function(u){u.xon("mouseleave",E.closezoom)};E.eventmove=function(u){u.xon("mousemove",E.movezoom)};E.eventscroll=function(u){u.xon("mousewheel DOMMouseScroll",E.xscroll)};E.eventclick=function(u){u.xon("click",function(v){ax.trigger("click")})}};this.eventunbind=function(){ax.xoff("mouseenter");E.eventopen=function(u){};E.eventleave=function(u){};E.eventmove=function(u){};E.eventscroll=function(u){};E.eventclick=function(u){}};this.init=function(u){E.options=b.extend({},b.fn.xzoom.defaults,u);if(E.options.rootOutput){M=b("body")}else{M=ax.parent()}an=E.options.position;d=E.options.lensReverse&&E.options.position=="inside";if(E.options.smoothZoomMove<1){E.options.smoothZoomMove=1}if(E.options.smoothLensMove<1){E.options.smoothLensMove=1}if(E.options.smoothScale<1){E.options.smoothScale=1}if(E.options.adaptive){b(window).xon("load",function(){m=ax.width();q=ax.height();E.adaptive();b(window).resize(E.adaptive)})}E.eventdefault();E.eventopen(ax)};this.destroy=function(){E.eventunbind()};this.closezoom=function(){aK=false;if(E.options.fadeOut){if(E.options.title&&j!=""){t.fadeOut(299)}if(E.options.position!="inside"||E.options.position!="fullscreen"){P.fadeOut(299);ay.fadeOut(300,function(){aH()})}else{ay.fadeOut(300,function(){aH()})}}else{aH()}};this.gallery=function(){var aM=new Array();var v,u=0;for(v=y;v<F.length;v++){aM[u]=F[v];u++}for(v=0;v<y;v++){aM[u]=F[v];u++}return{index:y,ogallery:F,cgallery:aM}};function af(u){var aM=u.attr("title");var v=u.attr("xtitle");if(v){return v}else{if(aM){return aM}else{return""}}}this.xappend=function(u){var v=u.parent();F[aC]=v.attr("href");v.data("xindex",aC);if(aC==0&&E.options.activeClass){K=u;K.addClass(E.options.activeClass)}if(aC==0&&E.options.title){j=af(u)}aC++;function aM(aO){aH();aO.preventDefault();if(E.options.activeClass){K.removeClass(E.options.activeClass);K=u;K.addClass(E.options.activeClass)}y=b(this).data("xindex");if(E.options.fadeTrans){ab=new Image();ab.src=ax.attr("src");S=b(ab);S.css({position:"absolute",top:ax.offset().top,left:ax.offset().left,width:ax.width(),height:ax.height()});b(document.body).append(S);S.fadeOut(200,function(){S.remove()})}var aP=v.attr("href");var aN=u.attr("xpreview")||u.attr("src");j=af(u);if(u.attr("title")){ax.attr("title",u.attr("title"))}ax.attr("xoriginal",aP);ax.removeAttr("style");ax.attr("src",aN);if(E.options.adaptive){m=ax.width();q=ax.height()}}if(E.options.hover){v.xon("mouseenter",v,aM)}v.xon("click",v,aM)};this.init(aG)}b.fn.xzoom=function(e){var c;var d;if(this.selector){var g=this.selector.split(",");for(var f in g){g[f]=b.trim(g[f])}this.each(function(h){if(g.length==1){if(h==0){c=b(this);if(typeof(c.data("xzoom"))!=="undefined"){return c.data("xzoom")}c.x=new a(c,e)}else{if(typeof(c.x)!=="undefined"){d=b(this);c.x.xappend(d)}}}else{if(b(this).is(g[0])&&h==0){c=b(this);if(typeof(c.data("xzoom"))!=="undefined"){return c.data("xzoom")}c.x=new a(c,e)}else{if(typeof(c.x)!=="undefined"&&!b(this).is(g[0])){d=b(this);c.x.xappend(d)}}}})}else{this.each(function(h){if(h==0){c=b(this);if(typeof(c.data("xzoom"))!=="undefined"){return c.data("xzoom")}c.x=new a(c,e)}else{if(typeof(c.x)!=="undefined"){d=b(this);c.x.xappend(d)}}})}if(typeof(c)==="undefined"){return false}c.data("xzoom",c.x);b(c).trigger("xzoom_ready");return c.x};b.fn.xzoom.defaults={position:"right",mposition:"inside",rootOutput:true,Xoffset:0,Yoffset:0,fadeIn:true,fadeTrans:true,fadeOut:false,smooth:true,smoothZoomMove:3,smoothLensMove:1,smoothScale:6,defaultScale:0,scroll:true,tint:false,tintOpacity:0.5,lens:false,lensOpacity:0.5,lensShape:"box",lensCollision:true,lensReverse:false,openOnSmall:true,zoomWidth:"auto",zoomHeight:"auto",sourceClass:"xzoom-source",loadingClass:"xzoom-loading",lensClass:"xzoom-lens",zoomClass:"xzoom-preview",activeClass:"xactive",hover:false,adaptive:true,adaptiveReverse:false,title:false,titleClass:"xzoom-caption",bg:false}})(jQuery);