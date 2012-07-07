/*global $:false, document: false*/
/*jslint nomen: true, plusplus: true, vars: true, white: true */
var imageFun = imageFun || {};
imageFun.fx = imageFun.fx || {};
( function() {"use strict";
		imageFun.fx.rgbFilter = {};
		//imageFun.fx.effectName.prototype = imageFun.fx.fxCore;
		var fxCore = imageFun.fxCore;
		var me = imageFun.fx.rgbFilter;

		var base = {
			settings : {
				wrapAround : false,
				centerR : 0,
				rangeRup : 255,
				rangeRdown : 255,

				centerG : 0,
				rangeGup : 255,
				rangeGdown : 255,

				centerB : 0,
				rangeBup : 255,
				rangeBdown : 255
			},
			_setSettingHelper : function(property, newSettings, defaultVal) {
				me.settings[property] = newSettings[property] === undefined ? defaultVal : newSettings[property];
			},

			_checkInRangeWrapAround : function(val, center, down, up) {
				throw new Error('not implemented wrapAround check');
			},

			_checkInRangeNoWrapAround : function(val, center, down, up) {
				if (val < center - down) {
					return false;
				}
				if (val > center + up) {
					return false;
				}
				return true;
			},
			_checkInRange : me._checkInRangeNoWrapAround,
			_isInRange : function(colorCapitalizedCode, val) {
				
				return me._checkInRange(val, me.settings['center'+colorCapitalizedCode], me.settings['range'+colorCapitalizedCode+'down'], me.settings['range'+colorCapitalizedCode+'up']);
			},
			/**
			 * @param settings {Object.<string, number>} in the form of
			 * {centerR:number, rangeRup:number, centerG, rangeGup, centerB, rangeBup}
			 * all key value pairs are optional
			 * numbers range from 0-255
			 * colors that are not in the range are filtered out
			 * |0--------------------------------------------255|
			 * |---------|===rangeXup=|centerX|===rangeXdown==|-|
			 * |---------|======colors remaining==============|-|
			 *
			 * if center + rangeXup > 255, the filter wraps around depending on its settings
			 * if center - rangeXdown <0 the filter wraps around depending on its settings
			 * if no value is specified, center defaults to 0 and range to 255 (ie. no filter)
			 */
			changeSettings : function(settings) {
				me._setSettingHelper('centerR', settings, 0);
				me._setSettingHelper('centerG', settings, 0);
				me._setSettingHelper('centerB', settings, 0);
				
				me._setSettingHelper('rangeRup', settings, 255);
				me._setSettingHelper('rangeGup', settings, 255);
				me._setSettingHelper('rangeBup', settings, 255);

				me._setSettingHelper('rangeRdown', settings, 255);
				me._setSettingHelper('rangeGdown', settings, 255);
				me._setSettingHelper('rangeBdown', settings, 255);
				
				me._setSettingHelper('wrapAround', settings, "false");
				if (me.settings.wrapAround) {
					me._checkInRange = me._checkInRangeWrapAround;
				} else {
					me._checkInRange = me._checkInRangeNoWrapAround;
				}
			},
			_dimPixel:function(imgDataArray, index){
				imgDataArray[index]=0;
				imgDataArray[index+1]=0;
				imgDataArray[index+2]=0;
			},
			effectFunction : function(imgData, x, y, dataIndex) {
				imgData = imgData.data;
				
				if(!me._isInRange('R', imgData[dataIndex])){
					me._dimPixel(imgData, dataIndex);
					return;
				}
				if(!me._isInRange('G', imgData[dataIndex+1])){
					me._dimPixel(imgData, dataIndex);
					return;
				} 
				if(!me._isInRange('B', imgData[dataIndex+2])){
					me._dimPixel(imgData, dataIndex);
					return;
				}
				
			},
			applyEffect : function(canvas, options) {
				fxCore.pixelByPixelIteration(canvas, me.effectFunction);
			}
		};
	
		$.extend(imageFun.fx.rgbFilter, base);
		me._checkInRange = me._checkInRangeNoWrapAround;
	}()
);
