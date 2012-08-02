/*global Raphael:false, $:false, document: false, console:false*/
/*jslint nomen: true, plusplus: true, vars: true, white: true */
var imageFun = imageFun || {};
imageFun.ui = imageFun.ui || {};
( function() {"use strict";
		imageFun.ui.hsvFilter = {};
		var utils = imageFun.utils;
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
				//imageFun.fx.hsvFilter.changeSettings(settings);
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
						pixelVal = me._getPixelValue(255*me._zValue, x, y);
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
					range : true,
					min : 0,
					max : 1,

					step : 0.001,
					values : [filterSettings.rangeHdown, filterSettings.rangeHup],
					slide : function(ev, ui) {
						$htxt.html(" " + ui.values[0] + ", " + ui.values[1]);
						imageFun.fx.hsvFilter.changeSettings({
							rangeHdown : ui.values[0],
							rangeHup : ui.values[1]
						});
					}
				});
				$sSlider.slider({
					range : true,
					min : 0,
					max : 1,
					step : 0.001,

					values : [filterSettings.rangeSdown, filterSettings.rangeSup],
					slide : function(ev, ui) {
						$stxt.html(" " + ui.values[0] + ", " + ui.values[1]);
						imageFun.fx.hsvFilter.changeSettings({
							rangeSdown : ui.values[0],
							rangeSup : ui.values[1]
						});
					}
				});
				$vSlider.slider({
					range : true,
					min : 0,
					max : 1,
					step : 0.001,

					values : [filterSettings.rangeVdown, filterSettings.rangeVup],
					slide : function(ev, ui) {
						$vtxt.html(" " + ui.values[0] + ", " + ui.values[1]);
						imageFun.fx.hsvFilter.changeSettings({
							rangeVdown : ui.values[0],
							rangeVup : ui.values[1]
						});
					}
				});
			},

			_sliderCanvas : null,
			_createSlider : function() {
				var slider = $('<div class="color-picker-vertical"><canvas class="color-picker-slider-track"></canvas></div>');
				var canvasTrack = slider.find('canvas');
				me._sliderCanvas = slider.find('.color-picker-slider-track')[0];
				slider.slider({
					range: true,
					orientation : "vertical",
					min : 0,
					max : 1,
					step: 0.001,
					values : [me._zValue*0.8, me._zValue],
					slide : function(ev, ui) {
						me._zValue = ((ui.values[0] + ui.values[1])/2);
						var range = ((ui.values[1]-ui.values[0])/2);
						me._colorCanvas();
						console.log(me._zValue + " high" + ui.values[0] + " low"+ ui.values[1]);
						me.setHtoCenterRectangle(me._rectangle.$tag);
						var settings = {
							rangeHup: range,
							rangeHdown: range
						};
						imageFun.fx.hsvFilter.changeSettings(settings);
					}
				});
				var middleDiv = $('<div class="middle-of-slider"></div>');
				slider.find('.ui-slider-range').prepend(middleDiv);
				me._slider = slider;
			},
			destroy : function() {
			},
			getHSVpixel:function(imageData, x,y){
				var r,g,b;
				var pixels = imageData.data;
				var pixelIndex = (x + y * me._canvas.width) * 4;
				r = pixels[pixelIndex];
				g = pixels[pixelIndex + 1];
				b = pixels[pixelIndex + 2];
				return utils.rgbToHsv(r, g, b);
			},
			setHtoCenterRectangle:function(rect){
				var me = this;
				rect = $(rect);
				
				var w = parseInt(rect.attr('width'),10);
				var h = parseInt(rect.attr('height'),10);
				
				var x = parseInt(rect.attr('x'),10);
				var y = parseInt(rect.attr('y'),10);
				
				var imgData = me._ctx.getImageData(0, 0, me._canvas.width, me._canvas.height);
					
				var hsv = me.getHSVpixel(imgData, Math.floor((x+x+w)/2),Math.floor((y+y+h)/2));
				var settings = {centerH: hsv.h}
				imageFun.fx.hsvFilter.changeSettings(settings);
			},
			render : function(root) {
				root = $(root);
				me._colorCanvas();
				var uiWrapper = $('<div class="filter-ui-wrapper"></div>');
				var instructions = $('<div>Resize the rectangle to change the saturation and value treshold.use the slider to change the hue range.</div>')
				var colorsArea = $('<div  class="color-picker-colors-area"></div>');
				me._colorsArea = colorsArea;
				var svgHolder = $('<div id="svg-holder" class="color-filter-svg-holder"></div>');
				
				colorsArea.append(me._canvas);
				colorsArea.append(svgHolder);
				uiWrapper.append(instructions);
				uiWrapper.append(colorsArea);
				me._createSlider();
				uiWrapper.append(me._slider);

				root.append(uiWrapper);
				me._slider.ready(function() {
					me._colorSliderCanvas(me._sliderCanvas, me._slider);
				});
				//me._createRangeSliders();
				uiWrapper.append(me._$rangeSliders);
				me._createColorPreview();
				uiWrapper.append(me._$colorPreview);
				var _svgPaper = ['<svg id="svg" height="256" version="1.1" width="256" xmlns="http://www.w3.org/2000/svg"> ', '</svg>'].join('');
				me._svgPaper = $(_svgPaper);
				$('#svg-holder').append(me._svgPaper);
				var Rect = imageFun.svg.Rect;
				var rect = new Rect({
					x : 40,
					y : 40,
					width : 30,
					height : 30
				});
				rect.mouseResizeable({minX:0, minY: 0, maxX: 256, maxY: 256, minWidth: 1, minHeight: 1});
				$(rect).bind('resize', function(e,data){
					var $tag = rect.$tag;
					var offset = $tag.offset();
					
					var w = data.width;//$tag.attr('width');
					var h = data.height;//$tag.attr('height');
					var x = data.x;//$tag.attr('x');
					var y = data.y;//$tag.attr('y');
					
					var normalizedVCenter = ((x+x+w)/2)/256;
					var upV = w/2/256;
					var downV = upV;
					me.setHtoCenterRectangle(rect.$tag);
					
					var normalizedSCenter = ((y+y+h)/2)/256;
					var upS = h/2/256;
					var downS = upS;
					
					var settings = {
						rangeSdown : downS,
						centerS : normalizedSCenter,
						rangeSup : upS,
						
						rangeVdown : downV,
						centerV : normalizedVCenter,
						rangeVup : upV
						
						
					};
					imageFun.fx.hsvFilter.changeSettings(settings);

					//var paperOffset = $(me._svgPaper).offset();					
				});
				me._svgPaper.append(rect.getMarkup());
				me._rectangle = rect;
				me._addEventToColorsArea();
			}
		};

		$.extend(imageFun.ui.hsvFilter, base);
		me._init();

	}()
);
