/*global $:false, document: false*/
/*jslint plusplus: true, vars: true, white: true */
( function() {"use strict";
		var effectFunction;
		addNoise
		function addFunctionOptions() {
			var sel = document.getElementById('selectEffect');
			var iterator, optionElt;
			for(iterator in imageFun.fx){
				//<option value="AddNoiseB">AddNoiseB</option>
				optionElt = document.createElement('option');
				optionElt.value = iterator.toString();
				optionElt.innerHTML = iterator.toString();
				sel.appendChild(optionElt);
			}
			$(sel).bind('change', function(event) {
				var selection = event.target.value;
				effectFunction = imageFun.fx[selection].applyEffect;
				/*
				switch(selection) {
					case 'BlackAndWhite':
						effectFunction = blackAndWhite;
						break;
					case 'AddNoise':
						effectFunction = addNoise;
						break;				
					case 'FT':
						effectFunction = fourierTransform;
						break;
					case 'BlackAndWhiteB':
						effectFunction = imageFun.fx.blackAndWhite.applyEffect;
						break;
					case 'GrayScale':
						effectFunction =  imageFun.fx.grayScale.applyEffect;
						break;
					case 'AddNoiseB':
						effectFunction = imageFun.fx.addNoise.applyEffect;//addNoise;
						break;
					default:
						effectFunction = nothing;
				}*/
			});
		}

		function init() {

			addFunctionOptions();
			getUserMedia();

		}

		/**
		 * goes pixel by pixesl and calls pixelEffectFn on each pixel by passing it  imageData, x, y object
		 * where x increases to the right if the screen and y increases to the bottom of the screen x:[0-width] y:[0-height]
		 */
		function pixelByPixelIteration(canvasB, imageFunction) {
			//var start = new Date();
			var c = canvasB.getContext('2d');
			var w = canvasB.width;
			var h = canvasB.height;
			var data = c.getImageData(0, 0, w, h);

			var x, y;
			for ( x = 0; x < w; x += 1) {
				for ( y = 0; y < h; y += 1) {
					imageFunction(data, x, y);
				}
			}
			c.putImageData(data, 0, 0);
			//console.log(new Date() - start);
		}

		var canvas = document.getElementById('canvas');
		var canvasBuff = document.createElement('canvas');
		
		var canvasBuffData;
		canvasBuff.id = 'canvasBufferId';

		var canvasContext = canvas.getContext('2d');
		canvasContext.id = 'canvasContextId';
		var canvasBuffContext = canvasBuff.getContext('2d');
		canvasBuffContext.id = 'canvasBufferContextId';
		var localVideo = document.getElementById('video');
		var samplingInterval = null;
		var samplingPeriod = 100;
		effectFunction = function(canvasB) {

		};

		function fourierTransform(canvasB) {
			FFT(canvasB);
			console.log('done ft');
		}

		function generateGaussianSample(mean, stdev) {
			//Box-muller transform
			//http://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
			var mu = mean;
			var sigma = stdev;
			var u1 = Math.random();
			var u2 = Math.random();
			return sigma * Math.sqrt(-2 * Math.log(u1)) * Math.cos(twoPI * u2) + mean;
		}

		function clamp(val, min, max) {
			val = val >= min ? val : min;
			return val <= max ? val : max;
		}			

		function addNoise(canvasB, mean, stdev) {
			mean = mean ? mean : 128;
			stdev = stdev ? stdev : 128;
			pixelByPixelIteration(canvasB, function(data, x, y) {
				var p = getPixel(data, x, y);
				p.r = p.r + generateGaussianSample(mean, stdev);
				p.r = clamp(p.r, 0, 255);
				p.g = p.g + generateGaussianSample(mean, stdev);
				p.g = clamp(p.g, 0, 255);
				p.b = p.b + generateGaussianSample(mean, stdev);
				p.b = clamp(p.b, 0, 255);
				setPixel(data, p.x, p.y, p.r, p.g, p.b, p.a);
			});
		}


		addNoise.setup = function() {

		};

		addNoise.tearDown = function() {

		};
		function blackAndWhite(canvasB) {
			pixelByPixelIteration(canvasB, function(data, x, y) {
				var p = getPixel(data, x, y);
				var avg = getPixelAverage(p);
				setPixel(data, x, y, avg, avg, avg, p.a);
			});
		}

		function getRandmom8bit() {
			return r = Math.random() * 255;
		}

		function nothing() {
		};
		var twoPI = 2 * Math.PI;

		function getDataIndex(imageData, x, y) {
			return (x + y * imageData.width) * 4;
		}

		function setPixel(imageData, x, y, r, g, b, a) {
			var index = getDataIndex(imageData, x, y);
			imageData.data[index + 0] = r;
			imageData.data[index + 1] = g;
			imageData.data[index + 2] = b;
			imageData.data[index + 3] = a;
		}

		function getPixel(imageData, x, y) {
			var index = getDataIndex(imageData, x, y);
			var data = imageData.data;
			return {
				'x' : x,
				'y' : y,
				'r' : data[index],
				'g' : data[index + 1],
				'b' : data[index + 2],
				'a' : data[index + 3]

			};
		}

		function getPixelAverage(p) {
			return (p.r + p.g + p.b) / 3;
		}

		function drawVideoToCanvas() {
			var canvasW = canvasBuff.width;
			var canvasH = canvasBuff.height;
			canvasContext.drawImage(localVideo, 0, 0, canvasW, canvasH);

		}
		function drawVideoToBuffCanvas() {
			var canvasW = canvasBuff.width;
			var canvasH = canvasBuff.height;
			canvasBuffContext.drawImage(localVideo, 0, 0, canvasW, canvasH);

		}

		function drawBuffToCanvas() {
			canvasContext.drawImage(canvasBuff, 0, 0, canvasBuff.width, canvasBuff.height);
		}
		var imageData;
		function samplingIntervalCall() {
			drawVideoToBuffCanvas();
			effectFunction(canvasBuff);
			drawBuffToCanvas();
			
		}

		function createCanvasCapture() {
			var w = $(localVideo).width();
			var h = $(localVideo).height();
			canvasBuff.width = w;
			canvasBuff.height = h;

			canvas.width = w;
			canvas.height = h;
			imageData = canvas.getContext('2d').getImageData(0,0,w,h);
			clearInterval(samplingInterval);
			samplingInterval = setInterval(samplingIntervalCall, samplingPeriod);
		}

		function onUserMediaSuccess(stream) {
			console.log("User has granted access to local media.");
			var url = webkitURL.createObjectURL(stream);
			localVideo.style.opacity = 1;
			$(localVideo).bind('canplay', function() {
				createCanvasCapture();
			});
			localVideo.src = url;
			
			localVideo.autoplay = true;
		}

		function onUserMediaError(e) {
			var s;
			s++;
			s++;
			s++;
			s++;
			console.log('error getting media' + e);
		}

		function getUserMedia() {
			try {
				navigator.webkitGetUserMedia({video:true}, onUserMediaSuccess, onUserMediaError);
				console.log("Requested access to local media.");
			} catch (e) {
				document.write('could not get webcam stream. Use a browser that supports getUserMedia API. Known to run in Google Chrome 20 (jul 3, 2012) with mediaStream flag enabled');
				console.log("getUserMedia error.");
			}
		}


		$(document).ready(init);
	}()); 