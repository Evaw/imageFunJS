/*global $:false, document: false*/
/*jslint plusplus: true, vars: true, white: true */
var imageFun = imageFun || {};
imageFun.fx = imageFun.fx || {}; 

(function(){
	"use strict";
	imageFun.fxCore = {
		/**
		 * goes pixel by pixesl and calls pixelEffectFn on each pixel by passing it  imageData, x, y object
		 * where x increases to the right if the screen and y increases to the bottom of the screen x:[0-width] y:[0-height]
		 */
		pixelByPixelIteration:function(canvas, imageFunction) {
			//var start = new Date();
			var w = canvas.width;
			var h = canvas.height;
			var ctx =  canvas.getContext('2d');
			var data = ctx.getImageData(0,0,w,h);
			var x, y;
			var dataIndex = 0;
			
			for ( y = 0; y < h; y += 1) {
				for ( x = 0; x < w; x += 1) {
					imageFunction(data, x, y, dataIndex);
					dataIndex +=4;
				}
			}

			ctx.putImageData(data, 0,0);
			//console.log(new Date() - start);
		},
		/**
		 * @returns a mod b
		 */
		mod:function(a,b){
			if(a<0){
				return (a%b + b)%b;
			}else {
				return a%b;
			}
		},
		/*
		 * counter counts from start
		 * use with new keword to make new mod counters
		 */
		ModCounter: function(eltSetSize, start){
			var cur, max = eltSetSize;
			if(start === undefined){
				start = 0;
			}
			cur = imageFun.fxCore.mod(start,eltSetSize);
			var countingFn = function(){
				var retVal = cur;
				cur = (cur+1)%max;
				return retVal;
			};
			this.count = countingFn;
		},
		clamp:function(val, max, min) {
			
			if(min === undefined){
				min = 0;
			}
			if(min > max){
				throw new Error('bad parameters, max:' + max +' min:' +min);
			}
			val = val >= min ? val : min;
			return val <= max ? val : max;
		}
	};

}());
