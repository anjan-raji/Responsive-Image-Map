// page init
jQuery(function(){
	initImageMaps();
	initResponsiveImageMap();
});

// responsive image map init
function initResponsiveImageMap() {
	jQuery('img[usemap]').rwdImageMaps();
}

// create imagemaps
function initImageMaps() {
	var imageList = document.getElementsByTagName('img');
	for(var i = 0; i < imageList.length; i++) {
		if(imageList[i].getAttribute('usemap')) {
			new ImageMap({
				image: imageList[i]
			})
		}
	}
}

// image map module
function ImageMap(opt) {
	this.options = {
		delay: 50,
		image: null,
		hoverClass:'activestate'
	}
	for(var p in opt) {
		if(opt.hasOwnProperty(p)) {
			this.options[p] = opt[p];
		}
	}
	this.init();
}
ImageMap.prototype = {
	init: function() {
		if(typeof this.options.image === 'object') {
			this.getElements();
			this.addHandlers();
		}
	},
	getElements: function() {
		this.mapId = this.options.image.getAttribute('usemap');
		this.mapId = this.mapId.substring(1);
		this.map = document.getElementById(this.mapId);
		if(this.map) {
			this.areas = this.map.getElementsByTagName('area');
		}
	},
	addHandlers: function() {
		if(this.areas) {
			for(var i = 0; i < this.areas.length; i++) {
				(function(inst){
					var timer;
					var area = inst.areas[i];
					var node = document.getElementById(inst.areas[i].alt);
					if(node) {
						area.onmouseover = function() {
							clearTimeout(timer);
							timer = setTimeout(function(){
								inst.addClass(node, inst.options.hoverClass);
							},inst.options.delay)
						}
						area.onmouseout = function() {
							clearTimeout(timer);
							timer = setTimeout(function(){
								inst.removeClass(node, inst.options.hoverClass);
							},inst.options.delay)
						}
						node.onmouseover = function() {
							clearTimeout(timer);
						}
						node.onmouseout = function() {
							clearTimeout(timer);
							timer = setTimeout(function(){
								inst.removeClass(node, inst.options.hoverClass);
							},inst.options.delay)
						}
					}
				})(this);
			}
		}
	},
	hasClass: function(el,cls) {
		return el.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
	},
	addClass: function(el,cls) {
		if (!this.hasClass(el,cls)) el.className += " "+cls;
	},
	removeClass: function(el,cls) {
		if (this.hasClass(el,cls)) {el.className=el.className.replace(new RegExp('(\\s|^)'+cls+'(\\s|$)'),' ');}
	}
}

if (window.addEventListener) window.addEventListener("load", initImageMaps, false);
else if (window.attachEvent) window.attachEvent("onload", initImageMaps);

/*
* rwdImageMaps jQuery plugin v1.5
*
* Allows image maps to be used in a responsive design by recalculating the area coordinates to match the actual image size on load and window.resize
*
* Copyright (c) 2013 Matt Stow
* https://github.com/stowball/jQuery-rwdImageMaps
* http://mattstow.com
* Licensed under the MIT license
*/
;(function($) {
	$.fn.rwdImageMaps = function() {
		var $img = this;
		
		var rwdImageMap = function() {
			$img.each(function() {
				if (typeof($(this).attr('usemap')) == 'undefined')
					return;
				
				var that = this,
					$that = $(that);
				
				// Since WebKit doesn't know the height until after the image has loaded, perform everything in an onload copy
				$('<img />').load(function() {
					var attrW = 'width',
						attrH = 'height',
						w = $that.attr(attrW),
						h = $that.attr(attrH);
					
					if (!w || !h) {
						var temp = new Image();
						temp.src = $that.attr('src');
						if (!w)
							w = temp.width;
						if (!h)
							h = temp.height;
					}
					
					var wPercent = $that.width()/100,
						hPercent = $that.height()/100,
						map = $that.attr('usemap').replace('#', ''),
						c = 'coords';
					
					$('map[name="' + map + '"]').find('area').each(function() {
						var $this = $(this);
						if (!$this.data(c))
							$this.data(c, $this.attr(c));
						
						var coords = $this.data(c).split(','),
							coordsPercent = new Array(coords.length);
						
						for (var i = 0; i < coordsPercent.length; ++i) {
							if (i % 2 === 0)
								coordsPercent[i] = parseInt(((coords[i]/w)*100)*wPercent);
							else
								coordsPercent[i] = parseInt(((coords[i]/h)*100)*hPercent);
						}
						$this.attr(c, coordsPercent.toString());
					});
				}).attr('src', $that.attr('src'));
			});
		};
		$(window).resize(rwdImageMap).trigger('resize');
		
		return this;
	};
})(jQuery);