/*global $:false, document: false, webkitURL: false, console:false*/
/*jslint plusplus: true, vars: true, white: true */
var imageFun = imageFun || {};
imageFun.fx = imageFun.fx || {};
( function() {"use strict";
		var effectFunction = function() {
		};
		var canvas;
		var canvasContext;
		var canvasBuff;
		var canvasBuffContext;
		var localVideo;
		var samplingTimeout = null;
		var samplingPeriod = 100;
		var lastDate;
		var imageData;

		function addFunctionOptions() {
			var sel = document.getElementById('selectEffect');
			var iterator, optionElt;
			for (iterator in imageFun.fx) {
				if (imageFun.fx.hasOwnProperty(iterator)) {
					//<option value="AddNoiseB">AddNoiseB</option>
					optionElt = document.createElement('option');
					optionElt.value = iterator.toString();
					optionElt.innerHTML = iterator.toString();
					sel.appendChild(optionElt);
				}
			}
			$(sel).bind('change', function(event) {
				var selection = event.target.value;
				effectFunction = imageFun.fx[selection].applyEffect;
			});
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

		function callSamplingTimeoutAgain() {
			var curTime = new Date();
			var timeDiff = curTime - lastDate;
			var nextTimeoutTime = samplingPeriod - timeDiff;
			if (nextTimeoutTime < 0) {
				//the previous calculation took longer than sampling period

				console.warn('the effect is taking too long');
				setTimeout(samplingTimeoutCall, 1);
			} else {
				setTimeout(samplingTimeoutCall, nextTimeoutTime);
			}
		}

		function samplingTimeoutCall() {
			lastDate = new Date();
			drawVideoToBuffCanvas();
			effectFunction(canvasBuff);
			drawBuffToCanvas();
			callSamplingTimeoutAgain();
		}

		function createCanvasCapture() {
			var w = $(localVideo).width();
			var h = $(localVideo).height();
			canvasBuff.width = w;
			canvasBuff.height = h;

			canvas.width = w;
			canvas.height = h;
			imageData = canvas.getContext('2d').getImageData(0, 0, w, h);
			clearInterval(samplingTimeout);
			samplingTimeout = setTimeout(samplingTimeoutCall, samplingPeriod);
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
			console.log('error getting media' + e);
		}

		function getUserMedia() {
			try {
				navigator.webkitGetUserMedia({
					video : true
				}, onUserMediaSuccess, onUserMediaError);
				console.log("Requested access to local media.");
			} catch (e) {
				var s;
				var p = $('<p></p>');
				s = 'could not get webcam stream. Use a browser that supports getUserMedia API.';
				s += 'Known to run in Google Chrome 20 (jul 3, 2012) with mediaStream flag enabled';
				p.html(s);
				$('body').empty().append(p);
				console.log("getUserMedia error.");
			}
		}

		function init() {
			canvas = document.getElementById('canvas');
			canvasBuff = document.createElement('canvas');
			canvasContext = canvas.getContext('2d');
			canvasBuffContext = canvasBuff.getContext('2d');
			localVideo = document.getElementById('video');
			samplingTimeout = null;
			samplingPeriod = 100;

			addFunctionOptions();
			getUserMedia();
			//obtaining media successfully starts the interval to get the video image
		}


		$(document).ready(init);
	}()
);
