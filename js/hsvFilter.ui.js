/*global Raphael:false, $:false, document: false, console:false*/
/*jslint nomen: true, plusplus: true, vars: true, white: true */
var imageFun = imageFun || {};
imageFun.ui = imageFun.ui || {};
( function() {"use strict";
		imageFun.ui.hsvFilter = {};
		var utils = imageFun.utils;
		//imageFun.ui.hsvFilter.prototype = imageFun.ui.uiCore;

		var me = imageFun.ui.hsvFilter;

		var base = {
			_colorsArea : null,
			_svgPaper : null,
			_rectangle : null,
			_zValue : 0.5,
			_$colorPreview : null,
			_createColorPreview : function() {
				var colorPreview = $('<div class="color-picker-color-preview"></div>');
				me._$colorPreview = colorPreview;
			},

			_init : function() {
				me._canvas = me._canvas || $('<canvas class="color-picker-canvas"></canvas>')[0];
				me._ctx = me._ctx || me._canvas.getContext('2d');

			},
			_slider : null,
			_getPixelValue : function(z, x, y) {
				return utils.hsvToRgb(1 - z / 255, y / 255, x / 255);
			},
			_canvasEvFunction : function(ev) {
				var intX = parseInt(ev.pageX - $(me._canvas).offset().left, 10);
				var x = utils.clamp(intX, 255);
				var intY = parseInt(ev.pageY - $(me._canvas).offset().top, 10);
				var y = utils.clamp(intY, 255);
				var r, g, b;
				var imgData = me._ctx.getImageData(0, 0, me._canvas.width, me._canvas.height);
				var pixels = imgData.data;
				var pixelIndex = (x + y * me._canvas.width) * 4;
				r = pixels[pixelIndex];
				g = pixels[pixelIndex + 1];
				b = pixels[pixelIndex + 2];
				//console.log("intX: " + intX + " intY:" + intY + " " + r + " " + g + " " + b);
				var hsv = utils.rgbToHsv(r, g, b);
				var settings = {
					centerH : hsv.h,

					centerS : hsv.s,

					centerV : hsv.v
				};
				me._$colorPreview.css({
					'background-color' : 'rgb(' + r + ', ' + g + ', ' + b + ")"
				});
				imageFun.fx.hsvFilter.changeSettings(settings);
			},
			_canvas : null,
			_addEventToColorsArea : function() {
				
				$(me._colorsArea).bind({
					click : me._canvasEvFunction,
					mousemove : me._canvasEvFunction
				});
				
			},
			_colorCanvas : function() {
				var ctx = me._canvas.getContext('2d');
				var w = 256;
				var h = 256;
				me._canvas.width = w;
				me._canvas.height = h;
				var imgData = ctx.getImageData(0, 0, w, h);
				var pixels = imgData.data;
				var x, y, pixelIndex = 0;
				var pixelVal;
				for ( y = 0; y < h; y += 1) {
					for ( x = 0; x < w; x += 1) {
						pixelVal = me._getPixelValue(me._zValue, x, y);
						pixels[pixelIndex] = pixelVal.r;
						pixels[pixelIndex + 1] = pixelVal.g;
						pixels[pixelIndex + 2] = pixelVal.b;
						pixels[pixelIndex + 3] = 255;
						pixelIndex += 4;
					}
				}
				ctx.putImageData(imgData, 0, 0);
			},
			_getSliderRColor : function(y, totHeight) {

				y = parseInt(y / totHeight * 255, 10);
				return utils.clamp(255 - y, 255, 0);
			},
			_getSliderColor : function(y, totHeight) {
				return utils.hsvToRgb(y / totHeight, 1, 1);
			},
			_getSliderGColor : function(y, totHeight) {
				return 0;
			},
			_getSliderBColor : function(y, totHeight) {
				return 0;
			},
			_getSliderAColor : function(y, totHeight) {
				return 255;
			},
			_colorSliderCanvas : function(canvas, slider) {
				var w = slider.innerWidth();
				var h = slider.innerHeight();
				canvas.width = w;
				canvas.height = h;
				var x, y;
				var ctx = canvas.getContext('2d');
				var imgData = ctx.getImageData(0, 0, w, h);
				var data = imgData.data;
				var pixelIndex = 0;
				var pix;
				for ( y = 0; y < h; y += 1) {
					pix = me._getSliderColor(y, h);
					for ( x = 0; x < w; x += 1) {

						data[pixelIndex] = pix.r;
						data[pixelIndex + 1] = pix.g;
						data[pixelIndex + 2] = pix.b;
						data[pixelIndex + 3] = 255;
						pixelIndex += 4;
					}
				}
				ctx.putImageData(imgData, 0, 0);
			},
			_$rangeSliders : null,
			_createRangeSliders : function() {
				var holder = $('<div></div>');
				var $htxt = $('<div class="color-picker-text"></div>');
				var $stxt = $('<div class="color-picker-text"></div>');
				var $vtxt = $('<div class="color-picker-text"></div>');
				
				var $hSlider = $('<div class="color-picker-h-slider"></div>');
				var $sSlider = $('<div class="color-picker-s-slider"></div>');
				var $vSlider = $('<div class="color-picker-v-slider"></div>');
				var filterSettings = imageFun.fx.hsvFilter.settings;
				holder.append($htxt).append($hSlider).append($stxt).append($sSlider).append($vtxt).append($vSlider);
				me._$rangeSliders = holder;
				$hSlider.slider({
					range: true,
					min : 0,
					max : 1,
					
					step: 0.001,
					values : [filterSettings.rangeHdown,filterSettings.rangeHup],
					slide : function(ev, ui) {
						$htxt.html(" "+ ui.values[0]+ ", "+ui.values[1]);
						imageFun.fx.hsvFilter.changeSettings({rangeHdown:ui.values[0], rangeHup: ui.values[1]});
					}
				});
				$sSlider.slider({
					range: true,
					min : 0,
					max : 1,
										step: 0.001,

					values : [filterSettings.rangeSdown,filterSettings.rangeSup],
					slide : function(ev, ui) {
						$stxt.html(" "+ ui.values[0]+ ", "+ui.values[1]);
						imageFun.fx.hsvFilter.changeSettings({rangeSdown:ui.values[0], rangeSup: ui.values[1]});
					}
				});
				$vSlider.slider({
					range: true,
					min : 0,
					max : 1,
										step: 0.001,

					values : [filterSettings.rangeVdown,filterSettings.rangeVup],
					slide : function(ev, ui) {
						$vtxt.html(" "+ ui.values[0]+", "+ui.values[1]);
						imageFun.fx.hsvFilter.changeSettings({rangeVdown:ui.values[0], rangeVup: ui.values[1]});
					}
				});
			},

			_sliderCanvas : null,
			_createSlider : function() {
				var slider = $('<div class="color-picker-vertical"><canvas class="color-picker-slider-track"></canvas></div>');
				var canvasTrack = slider.find('canvas');
				me._sliderCanvas = slider.find('.color-picker-slider-track')[0];
				slider.slider({
					orientation : "vertical",
					min : 0,
					max : 255,
					value : me._zValue,
					slide : function(ev, ui) {
						me._zValue = ui.value;
						me._colorCanvas();
						console.log(me._zValue);
					}
				});

				me._slider = slider;
			},
			destroy : function() {

			},
			_rectResize:function(rect, changeX, changeY, useChangeX, useChangeY){
				var curW, curH, newW, newH;
				rect = $(rect);
				curH = parseInt(rect.attr('height'),10);
				curW = parseInt(rect.attr('width'),10);
				
				if(useChangeX){
					newW = imageFun.utils.clamp(curW + changeX, 256,1);
				} else {
					newW = curW;
				}
				if(useChangeY){
					newH=imageFun.utils.clamp(curH + changeY, 256,1);
				} else {
					newH = curH;
				}
				rect.attr({
					width: newW,
					height: newH
				});
			},
			render : function(root) {
				root = $(root);
				me._colorCanvas();

				var uiWrapper = $('<div class="filter-ui-wrapper"></div>');
				var colorsArea = $('<div  class="rgb-color-picker-colors-area"></div>');
				me._colorsArea = colorsArea;
				var svgHolder = $('<div id="svg-holder" class="rgb-filter-svg-holder"></div>');
				
				colorsArea.append(me._canvas);
				colorsArea.append(svgHolder);
				uiWrapper.append(colorsArea);
				me._createSlider();
				uiWrapper.append(me._slider);

				root.append(uiWrapper);
				me._slider.ready(function() {
					me._colorSliderCanvas(me._sliderCanvas, me._slider);
				});
				me._createRangeSliders();
				uiWrapper.append(me._$rangeSliders);
				me._createColorPreview();
				uiWrapper.append(me._$colorPreview);

				var _svgPaper = [
					'<svg id="svg" height="300" version="1.1" width="300" xmlns="http://www.w3.org/2000/svg"> ',
					'   <rect style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); cursor: pointer; " x="2" y="2" width="74" height="74" fill="none" stroke="#b40500" stroke-opacity="0.7" stroke-width="2" stroke-dasharray="0">',
					'	</rect>',
				    '</svg>'].join('');
				me._svgPaper = $('#svg-holder').append($(_svgPaper));
				me._rectangle = $(me._svgPaper.find('rect'));
				
				me._rectangle.bind('mousedown',function(){
					console.log('clicked rectangle!');
					var r = me._rectangle;
					var $doc = $(document);
					var pastX = null;
					var pastY = null;
					$doc.bind('mouseup',function(e){
						$doc.unbind('mousemove.movingrect');
					});
					$doc.unbind('mousemove.movingrect');
					$doc.bind('mousemove.movingrect',function(e){
						var changeX, changeY, curW, curH;
						var rectOffsetX, rectOffsetY,rectOffset;
						var inRectX, inRectY;
						console.log('moving');
						console.log(e.clientX);
						if(pastX===null){
							pastX = e.pageX;
							pastY = e.pageY;
							return;
						}
						changeX = e.pageX-pastX;
						changeY = e.pageY-pastY;
						pastX = e.pageX;
						pastY = e.pageY;
						
						curW = parseInt(me._rectangle.attr('width'),10);
						curH = parseInt(me._rectangle.attr('height'),10);
						rectOffset = me._rectangle.offset();
						rectOffsetX = rectOffset.left;
						rectOffsetY = rectOffset.top;
						
						inRectX = e.pageX - rectOffsetX;
						inRectX = inRectX/curW;
						
						inRectY = e.pageY - rectOffsetY;
						inRectY = inRectY/curH;
						
						var thresh = 0.1;
						if(inRectX < 0.1){
							if(inRectY < thresh){
								//expand uppper left corner
								me._rectResize(me._rectangle, changeX, changeY, true, true);
							} else if(inRectY>1-thresh){
								//expand upper  right corner
								me._rectResize(me._rectangle, changeX, changeY, true, true);
							} else {
								//expand left
								me._rectResize(me._rectangle, changeX, changeY, true, false);
							}
						} else if(inRectX > 1-thresh){
							if(inRectY < thresh){
								//expand uppper right corner
								me._rectResize(me._rectangle, changeX, changeY, true, true);
							} else if(inRectY>1-thresh){
								//expand lower  right corner
								me._rectResize(me._rectangle, changeX, changeY, true, true);
							} else {
								//expand right
								me._rectResize(me._rectangle, changeX, changeY, true, false);
							}
						} else {
							//in width 
							if(inRectY>1-thresh){
								//expand  top 
								me._rectResize(me._rectangle, changeX, changeY, false, true);
							} else {
								//expand bottom
								me._rectResize(me._rectangle, changeX, changeY, false, true);
							}
						}

						
					});
					
				});
				me._addEventToColorsArea();
			}
		};

		$.extend(imageFun.ui.hsvFilter, base);
		me._init();

	}()
);
