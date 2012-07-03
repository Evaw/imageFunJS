/*global $:false, document: false*/
/*jslint nomen: true, plusplus: true, vars: true, white: true */
var imageFun = imageFun || {};
imageFun.fx = imageFun.fx || {};
( function() {"use strict";
		var fxCore = imageFun.fxCore;
		var simpeEffects = {
			noEffect: {
				applyEffect:function(){
					
				}
			},
			blackAndWhite : {
				applyEffect : function(canvas, options) {
					fxCore.pixelByPixelIteration(canvas, function(imgData, x, y, dataIndex) {
						imgData = imgData.data;
						var avg = imgData[dataIndex] + imgData[dataIndex + 1] + imgData[dataIndex + 1];
						avg = avg / 3;
						imgData[dataIndex] = avg;
						imgData[dataIndex + 1] = avg;
						imgData[dataIndex + 2] = avg;
					});
				}
			},
			grayScale:{
				applyEffect:function(canvas, options){
					fxCore.pixelByPixelIteration(canvas, function(imgData, x, y, dataIndex) {
						imgData = imgData.data;
						// http://en.wikipedia.org/wiki/Luma_(video)
						// Y' = 0.299 R' + 0.587 G' + 0.114 B'
						var avg = 0.299*imgData[dataIndex] + 0.587*imgData[dataIndex + 1] + 0.114*imgData[dataIndex + 1];
						
						imgData[dataIndex] = avg;
						imgData[dataIndex + 1] = avg;
						imgData[dataIndex + 2] = avg;
					});
				}
			},
			chromaBlue:{
				applyEffect:function(canvas, options){
					fxCore.pixelByPixelIteration(canvas, function(imgData, x, y, dataIndex) {
						imgData = imgData.data;
						// http://en.wikipedia.org/wiki/YCbCr
						// 
						var avg = 128-0.168736*imgData[dataIndex] - 0.331264*imgData[dataIndex + 1] + 0.5*imgData[dataIndex + 1];
						
						imgData[dataIndex] = avg;
						imgData[dataIndex + 1] = avg;
						imgData[dataIndex + 2] = avg;
					});
				}
			},
			chromaRed:{
				applyEffect:function(canvas, options){
					fxCore.pixelByPixelIteration(canvas, function(imgData, x, y, dataIndex) {
						imgData = imgData.data;
						// http://en.wikipedia.org/wiki/YCbCr
						// 
						var avg = 128+0.5*imgData[dataIndex] - 0.418688*imgData[dataIndex + 1] - 0.081312*imgData[dataIndex + 1];
						
						imgData[dataIndex] = avg;
						imgData[dataIndex + 1] = avg;
						imgData[dataIndex + 2] = avg;
					});
				}
			},
			swapRGBtoBRG:{
				applyEffect:function(canvas, options){
					fxCore.pixelByPixelIteration(canvas, function(imgData, x, y, dataIndex) {
						imgData = imgData.data;
						var r = imgData[dataIndex];
						var g = imgData[dataIndex+1];
						var b = imgData[dataIndex+2];		
						imgData[dataIndex] = b;
						imgData[dataIndex + 1] = r;
						imgData[dataIndex + 2] = g;
					});
				}
			}
		};
		$.extend(imageFun.fx, simpeEffects);
	}()
);
