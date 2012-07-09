/*global $:false, document: false, console:false*/
/*jslint nomen: true, plusplus: true, vars: true, white: true */
var imageFun = imageFun || {};
imageFun.ui = imageFun.ui || {};
( function() {"use strict";
		imageFun.ui.rgbFilter = {};
		var utils = imageFun.utils;
		//imageFun.ui.rgbFilter.prototype = imageFun.ui.uiCore;

		var me = imageFun.ui.rgbFilter;

		var base = {
			_zValue : 128,
			_$colorPreview: null,
			_createColorPreview:function(){
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
			_getRedPixelValue : function(x, y, z) {
				return z;
			},
			_getGreenPixelValue : function(x, y, z) {
				return 255 - x;
			},
			_getBluePixelValue : function(x, y, z) {
				return 255 - y;
			},
			_getAlphaPixelValue : function(x, y, z) {
				return 255;
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
				console.log("intX: " + intX + " intY:" + intY + " " + r + " " + g + " " + b);
				var settings = {
					centerR : r,

					centerG : g,

					centerB : b
				};
				me._$colorPreview.css({'background-color': 'rgb('+r+', '+g+', '+ b +")"});
				imageFun.fx.rgbFilter.changeSettings(settings);
			},
			_canvas : null,
			_addEventToCanvas : function() {
				$(me._canvas).bind({
					click : me._canvasEvFunction
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
						/*
						 pixels[pixelIndex] = me._getRedPixelValue(x, y, me._zValue);
						 pixels[pixelIndex + 1] = me._getGreenPixelValue(x, y, me._zValue);
						 pixels[pixelIndex + 2] = me._getBluePixelValue(x, y, me._zValue);
						 pixels[pixelIndex + 3] = me._getAlphaPixelValue(x, y, me._zValue);
						 */

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
			render : function(root) {
				root = $(root);
				me._colorCanvas();
				me._addEventToCanvas();
				var uiWrapper = $('<div class="filter-ui-wrapper"></div>');
				uiWrapper.append(me._canvas);
				me._createSlider();
				uiWrapper.append(me._slider);

				root.append(uiWrapper);
				me._slider.ready(function() {
					me._colorSliderCanvas(me._sliderCanvas, me._slider);
				});
				
				me._createColorPreview();
				uiWrapper.append(me._$colorPreview);
			}
		};

		$.extend(imageFun.ui.rgbFilter, base);
		me._init();
	}()
);
