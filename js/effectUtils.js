/*global $:false, document: false*/
/*jslint nomen: true, plusplus: true, vars: true, white: true */

var imageFun = imageFun || {};
imageFun.fx = imageFun.fx || {};
( function() {"use strict";
		imageFun.utils = {
			/**
			 * goes pixel by pixesl and calls pixelEffectFn on each pixel by passing it  imageData, x, y,dataIndex object
			 * where x increases to the right if the screen and y increases to the bottom of the screen x:[0-width] y:[0-height]
			 */
			pixelByPixelIteration : function(canvas, imageFunction) {
				//var start = new Date();
				var w = canvas.width;
				var h = canvas.height;
				var ctx = canvas.getContext('2d');
				var data = ctx.getImageData(0, 0, w, h);
				var x, y;
				var dataIndex = 0;

				for ( y = 0; y < h; y += 1) {
					for ( x = 0; x < w; x += 1) {
						imageFunction(data, x, y, dataIndex);
						dataIndex += 4;
					}
				}

				ctx.putImageData(data, 0, 0);
				//console.log(new Date() - start);
			},
			/**
			 * @returns a mod b
			 */
			mod : function(a, b) {
				if (a < 0) {
					return (a % b + b) % b;
				}
				return a % b;
			},
			/*
			 * counter counts from start
			 * use with new keword to make new mod counters
			 */
			ModCounter : function(eltSetSize, start) {
				var cur, max = eltSetSize;
				if (start === undefined) {
					start = 0;
				}
				cur = imageFun.utils.mod(start, eltSetSize);
				var countingFn = function() {
					var retVal = cur;
					cur = (cur + 1) % max;
					return retVal;
				};
				this.count = countingFn;
			},
			clamp : function(val, max, min) {

				if (min === undefined) {
					min = 0;
				}
				if (min > max) {
					throw new Error('bad parameters, max:' + max + ' min:' + min);
				}
				val = val >= min ? val : min;
				return val <= max ? val : max;
			},
			/**
			 *
			 * @returns {boolean} true if var [min,max)
			 * @param {number} val
			 * @param {number} max
			 * @param {number} min
			 */
			inRange : function(val, max, min) {
				if (val >= max) {
					return false;
				}
				if (val < min) {
					return false;
				}
				return true;
			},
			/**http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript**/
			/**
			 * Converts an RGB color value to HSL. Conversion formula
			 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
			 * Assumes r, g, and b are contained in the set [0, 255] and
			 * returns h, s, and l in the set [0, 1].
			 *
			 * @param   Number  r       The red color value
			 * @param   Number  g       The green color value
			 * @param   Number  b       The blue color value
			 * @return  Object            The HSL representation
			 */
			rgbToHsl : function(r, g, b) {
				r /= 255;
				g /= 255;
				b /= 255;
				var max = Math.max(r, g, b), min = Math.min(r, g, b);
				var h, s, l = (max + min) / 2;

				if (max === min) {
					h = s = 0;
					// achromatic
				} else {
					var d = max - min;
					s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
					switch(max) {
						case r:
							h = (g - b) / d + (g < b ? 6 : 0);
							break;
						case g:
							h = (b - r) / d + 2;
							break;
						case b:
							h = (r - g) / d + 4;
							break;
					}
					h /= 6;
				}

				return {
					h : h,
					s : s,
					l : l
				};
			},
			_hue2rgb : function(p, q, t) {
				if (t < 0) {
					t += 1;
				}
				if (t > 1) {
					t -= 1;
				}
				if (t < 1 / 6) {
					return p + (q - p) * 6 * t;
				}
				if (t < 1 / 2) {
					return q;
				}
				if (t < 2 / 3) {
					return p + (q - p) * (2 / 3 - t) * 6;
				}
				return p;
			},
			/**
			 * Converts an HSL color value to RGB. Conversion formula
			 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
			 * Assumes h, s, and l are contained in the set [0, 1] and
			 * returns r, g, and b in the set [0, 255].
			 *
			 * @param   Number  h       The hue
			 * @param   Number  s       The saturation
			 * @param   Number  l       The lightness
			 * @return  Object            The RGB representation
			 */
			hslToRgb : function(h, s, l) {
				var r, g, b;

				if (s === 0) {
					r = g = b = l;
					// achromatic
				} else {

					var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
					var p = 2 * l - q;
					r = imageFun.utils._hue2rgb(p, q, h + 1 / 3);
					g = imageFun.utils._hue2rgb(p, q, h);
					b = imageFun.utils._hue2rgb(p, q, h - 1 / 3);
				}

				return {
					r : r * 255,
					g : g * 255,
					b : b * 255
				};
			},

			/**
			 * Converts an RGB color value to HSV. Conversion formula
			 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
			 * Assumes r, g, and b are contained in the set [0, 255] and
			 * returns h, s, and v in the set [0, 1].
			 *
			 * @param   Number  r       The red color value
			 * @param   Number  g       The green color value
			 * @param   Number  b       The blue color value
			 * @return  Object            The HSV representation
			 */

			rgbToHsv : function(r, g, b) {
				r = r / 255;
				g = g / 255;
				b = b / 255;
				var max = Math.max(r, g, b), min = Math.min(r, g, b);
				var h, s, v = max;

				var d = max - min;
				s = max === 0 ? 0 : d / max;

				if (max === min) {
					h = 0;
					// achromatic
				} else {
					switch(max) {
						case r:
							h = (g - b) / d + (g < b ? 6 : 0);
							break;
						case g:
							h = (b - r) / d + 2;
							break;
						case b:
							h = (r - g) / d + 4;
							break;
					}
					h /= 6;
				}
				return imageFun.utils.rgbToHsvCache[str] = {h:h, s:s, v:v};

			},

			/**
			 * Converts an HSV color value to RGB. Conversion formula
			 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
			 * Assumes h, s, and v are contained in the set [0, 1] and
			 * returns r, g, and b in the set [0, 255].
			 *
			 * @param   Number  h       The hue
			 * @param   Number  s       The saturation
			 * @param   Number  v       The value
			 * @return  Object            The RGB representation
			 */
			hsvToRgb : function(h, s, v) {
				var r, g, b;

				var i = Math.floor(h * 6);
				var f = h * 6 - i;
				var p = v * (1 - s);
				var q = v * (1 - f * s);
				var t = v * (1 - (1 - f) * s);

				switch(i % 6) {
					case 0:
						r = v;
						g = t;
						b = p;
						break;
					case 1:
						r = q;
						g = v;
						b = p;
						break;
					case 2:
						r = p;
						g = v;
						b = t;
						break;
					case 3:
						r = p;
						g = q;
						b = v;
						break;
					case 4:
						r = t;
						g = p;
						b = v;
						break;
					case 5:
						r = v;
						g = p;
						b = q;
						break;
				}

				return {
					r : r * 255,
					g : g * 255,
					b : b * 255
				};
			}
		};

	}()
);
