/*global $:false, document: false*/
/*jslint nomen: true, plusplus: true, vars: true, white: true */
var imageFun = imageFun || {};
imageFun.ui = imageFun.ui || {};
( function() {"use strict";
		imageFun.ui.addNoise = {};
		var me = imageFun.ui.addNoise;
		var uiWrapper;
		var base = {
			render:function(container){
				container = $(container);
				
				container.empty();
				if(uiWrapper){
					uiWrapper.remove();
				}
				uiWrapper = $('<div class="noise-ui-wrapper"></div>');
				var meanMarkup = $([
					'<div class="noise-mean">',
						'<span class="noise-mean-text"> noise mean</span>',
						'<span class="noise-mean-slider-value"></span>',
						'<div class="noise-mean-slider"></div>',
					'</div>'
				].join(''));
				
				uiWrapper.append(meanMarkup);
				var sliderVal = uiWrapper.find('.noise-mean-slider-value');
				uiWrapper.find('.noise-mean-slider').slider({
					value: imageFun.fx.addNoise.mean,
					min: -255,
					max: 255,
					step: 0.5,
					slide: function(ev, ui){
						imageFun.fx.addNoise.changeParameters({mean:ui.value});
						sliderVal.text(ui.value);
					}
				});
				
				var stdevMarkup = $([
					'<div class="noise-stdev">',
						'<span class="noise-stdev-text"> stdev</span>',
						'<span class="noise-stdev-slider-value"></span>',
						'<div class="noise-stdev-slider"></div>',
					'</div>'
				].join(''));
				
				var stdevSlider = stdevMarkup.find('.noise-stdev-slider-value');
				stdevMarkup.find('.noise-stdev-slider').slider({
					value: imageFun.fx.addNoise.stdev,
					min: 0,
					max: 1024,
					step: 0.5,
					slide: function(ev, ui){
						imageFun.fx.addNoise.changeParameters({stdev:ui.value});
						stdevSlider.text(ui.value);
					}
				});
				uiWrapper.append(stdevMarkup);
				container.append(uiWrapper);
			},
			destroy:function(){
				if(uiWrapper){
					uiWrapper.remove();
				}
			}
		};
		$.extend(imageFun.ui.addNoise, base);
	}()
);
