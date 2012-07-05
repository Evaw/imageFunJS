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
				if (selection === "RGBfilter") {
					imageFun.fx[selection].changeSettings({
						wrapAround : false,
						centerR : 30,
						rangeRup : 55,
						rangeRdown : 30,

						centerG : 120,
						rangeGup : 70,
						rangeGdown : 70,

						centerB : 128,
						rangeBup : 70,
						rangeBdown : 70
					});
				}
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
				samplingTimeout = setTimeout(samplingTimeoutCall, 100);
				//allow some time to not block browser
			} else {
				samplingTimeout = setTimeout(samplingTimeoutCall, nextTimeoutTime);
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
20
			canvas.width = w;
			canvas.height = h;
			imageData = canvas.getContext('2d').getImageData(0, 0, w, h);
			clearTimeout(samplingTimeout);
			samplingTimeout = setTimeout(samplingTimeoutCall, samplingPeriod);
		}

		function onUserMediaSuccess(stream) {
			console.log("User has granted access to local media.");
			var URL = window.webkitURL || window.URL;
			var url = URL.createObjectURL(stream);
			localVideo.style.opacity = 1;
			$(localVideo).bind('canplay', function() {
				createCanvasCapture();
			});
			localVideo.src = url;

			localVideo.autoplay = true;
		}

		function onUserMediaError(e) {
			//TODO
			console.log('error getting media' + e);
		}

		function getUserCamera() {
			try {
				/*chrome cant make assignment of js var to point to native code*/
				var getUserMediaStrings = ['getUserMedia', 'webkitGetUserMedia'];
				var i;
				var getUserMediaString = getUserMediaStrings[0];
				for ( i = 0; i < getUserMediaStrings.length; i += 1) {
					if (navigator[getUserMediaStrings[i]]) {
						getUserMediaString = getUserMediaStrings[i];
					}
				}
				navigator[getUserMediaString]({
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

			addFunctionOptions();
			getUserCamera();
			//obtaining media successfully starts the interval to get the video image
		}


		$(document).ready(init);
	}()
);
