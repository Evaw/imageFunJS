/*global $:false, document: false*/
/*jslint nomen: true, plusplus: true, vars: true, white: true */
/**TODO
 * major improvement in performance if cache gaussian distribuition and use uniform distribution to get 
 * values from the gaussian cache
 */
var imageFun = imageFun || {};
imageFun.fx = imageFun.fx || {};
( function() {"use strict";
		imageFun.fx.addNoise = {};
		//imageFun.fx.addNoise.prototype = imageFun.fx.utils;
		var utils = imageFun.utils;
		var me = imageFun.fx.addNoise;

		var addNoiseBase = {
			binaryModCounter : new utils.ModCounter(2),
			sinSample : null,
			cosSample : null,
			twoPI : 2 * Math.PI,
			stdev : 128,
			mean : 0,
			_init : function() {
				me.binaryModCounter = new utils.ModCounter(2);
				me.stdev = 10;
				me.mean = 0;
			},
			generateGaussianSample : function(mean, stdev) {
				//Box-muller transform
				//http://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
				var mu = mean, sigma = stdev, u1, u2, retVal, R;
				if (me.binaryModCounter.count() === 0) {
					u1 = Math.random();
					u2 = Math.random();
					R = sigma * Math.sqrt(-2.0 * Math.log(u1));
					me.sinSample = R * Math.sin(me.twoPI * u2) + mean;
					me.cosSample = R * Math.cos(me.twoPI * u2) + mean;
					retVal = me.cosSample;
				} else {
					retVal = me.sinSample;
				}

				return retVal;
			},
			_addAndClamp : function(imgData, index) {
				var gaussRand = me.generateGaussianSample(me.mean, me.stdev);
				imgData.data[index] = utils.clamp(imgData.data[index] + gaussRand, 255, 0);
			},
			_effectHelper : function(imgData, x, y, dataIndex) {
				me._addAndClamp(imgData, dataIndex);
				me._addAndClamp(imgData, dataIndex + 1);
				me._addAndClamp(imgData, dataIndex + 2);
			},
			applyEffect : function(canvas, options) {
				//much better performance by not creating annonymous function every call
				utils.pixelByPixelIteration(canvas, me._effectHelper);

				/*this has worse performance (larger method, which chould prevent JIT and also creation of function every single call)
				 utils.pixelByPixelIteration(canvas, function(imgData, x, y, dataIndex) {
				 me._addAndClamp(imgData, dataIndex);
				 me._addAndClamp(imgData, dataIndex + 1);
				 me._addAndClamp(imgData, dataIndex + 2);
				 });
				 */

			},
			/**
			 * 
			 * @param {Object} obj  in the form of: {mean:number, stdev:number}
			 * range of mean [-Infinity, Infinity]
			 * range of stdev [0, Infinity]
			 */
			changeParameters : function(obj) {
				if(obj.mean){
					me.mean = utils.clamp(obj.mean, 255,-255);	
				}
				if(obj.stdev){
					me.stdev = obj.stdev;
				}
				
			}
		};
		$.extend(imageFun.fx.addNoise, addNoiseBase);
	}());
