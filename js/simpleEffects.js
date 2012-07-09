/*global $:false, document: false*/
/*jslint nomen: true, plusplus: true, vars: true, white: true */
var imageFun = imageFun || {};
imageFun.fx = imageFun.fx || {};
( function() {"use strict";
		var utils = imageFun.utils;
		var simpleEffects = {
			noEffect : {
				applyEffect : function() {

				}
			},
			setRZero : {
				effectFunction : function(imgData, x, y, dataIndex) {
					imgData = imgData.data;
					imgData[dataIndex] = 0;

				},
				applyEffect : function(canvas, options) {
					utils.pixelByPixelIteration(canvas, simpleEffects.setRZero.effectFunction);
				}
			},
			setGZero : {
				effectFunction : function(imgData, x, y, dataIndex) {
					imgData = imgData.data;
					imgData[dataIndex + 1] = 0;

				},
				applyEffect : function(canvas, options) {
					utils.pixelByPixelIteration(canvas, simpleEffects.setGZero.effectFunction);
				}
			},
			setBZero : {
				effectFunction : function(imgData, x, y, dataIndex) {
					imgData = imgData.data;
					imgData[dataIndex + 2] = 0;

				},
				applyEffect : function(canvas, options) {
					utils.pixelByPixelIteration(canvas, simpleEffects.setBZero.effectFunction);
				}
			},
			blackAndWhite : {
				effectFunction : function(imgData, x, y, dataIndex) {
					imgData = imgData.data;
					var avg = imgData[dataIndex] + imgData[dataIndex + 1] + imgData[dataIndex + 1];
					avg = avg / 3;
					imgData[dataIndex] = avg;
					imgData[dataIndex + 1] = avg;
					imgData[dataIndex + 2] = avg;
				},
				applyEffect : function(canvas, options) {
					utils.pixelByPixelIteration(canvas, simpleEffects.blackAndWhite.effectFunction);
				}
			},
			grayScale : {
				effectFunction : function(imgData, x, y, dataIndex) {
					imgData = imgData.data;
					// http://en.wikipedia.org/wiki/Luma_(video)
					// Y' = 0.299 R' + 0.587 G' + 0.114 B'
					var avg = 0.299 * imgData[dataIndex] + 0.587 * imgData[dataIndex + 1] + 0.114 * imgData[dataIndex + 1];

					imgData[dataIndex] = avg;
					imgData[dataIndex + 1] = avg;
					imgData[dataIndex + 2] = avg;
				},
				applyEffect : function(canvas, options) {
					utils.pixelByPixelIteration(canvas, simpleEffects.grayScale.effectFunction);
				}
			},
			chromaBlue : {
				effectFunction : function(imgData, x, y, dataIndex) {
					imgData = imgData.data;
					// http://en.wikipedia.org/wiki/YCbCr
					//
					var avg = 128 - 0.168736 * imgData[dataIndex] - 0.331264 * imgData[dataIndex + 1] + 0.5 * imgData[dataIndex + 1];

					imgData[dataIndex] = avg;
					imgData[dataIndex + 1] = avg;
					imgData[dataIndex + 2] = avg;
				},
				applyEffect : function(canvas, options) {
					utils.pixelByPixelIteration(canvas, simpleEffects.chromaBlue.effectFunction);
				}
			},
			chromaRed : {
				effectFunction : function(imgData, x, y, dataIndex) {
					imgData = imgData.data;
					// http://en.wikipedia.org/wiki/YCbCr
					//
					var avg = 128 + 0.5 * imgData[dataIndex] - 0.418688 * imgData[dataIndex + 1] - 0.081312 * imgData[dataIndex + 1];

					imgData[dataIndex] = avg;
					imgData[dataIndex + 1] = avg;
					imgData[dataIndex + 2] = avg;
				},
				applyEffect : function(canvas, options) {
					utils.pixelByPixelIteration(canvas, simpleEffects.chromaRed.effectFunction);
				}
			},
			swapRGBtoBRG : {
				effectFunction : function(imgData, x, y, dataIndex) {
					imgData = imgData.data;
					var r = imgData[dataIndex];
					var g = imgData[dataIndex + 1];
					var b = imgData[dataIndex + 2];
					imgData[dataIndex] = b;
					imgData[dataIndex + 1] = r;
					imgData[dataIndex + 2] = g;
				},
				applyEffect : function(canvas, options) {
					utils.pixelByPixelIteration(canvas, simpleEffects.swapRGBtoBRG.effectFunction);
				}
			}
		};
		$.extend(imageFun.fx, simpleEffects);
	}()
);
