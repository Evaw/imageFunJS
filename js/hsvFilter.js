/*global $:false, document: false*/
/*jslint nomen: true, plusplus: true, vars: true, white: true */
var imageFun = imageFun || {};
imageFun.fx = imageFun.fx || {};
( function() {"use strict";
		imageFun.fx.hsvFilter = {};
		//imageFun.fx.effectName.prototype = imageFun.fx.utils;
		var utils = imageFun.utils;
		var me = imageFun.fx.hsvFilter;

		var base = {
			settings : {
				wrapAround : false,
				centerH : 0,
				rangeHup : 1,
				rangeHdown : 1,

				centerS : 0,
				rangeSup : 1,
				rangeSdown : 1,

				centerV : 0,
				rangeVup : 1,
				rangeVdown : 1
			},
			_setSettingHelper : function(property, newSettings, defaultVal) {
				if(me.settings[property] === undefined){
					me.settings[property] = defaultVal;
				}
				me.settings[property] = newSettings[property] === undefined ? me.settings[property] : newSettings[property];
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
			 * all key value pairs are optional
			 * numbers range from 0-1
			 * colors that are not in the range are filtered out
			 * |0----------------------------------------------1|
			 * |---------|===rangeXup=|centerX|===rangeXdown==|-|
			 * |---------|======colors remaining==============|-|
			 *
			 * if center + rangeXup > 1, the filter wraps around depending on its settings
			 * if center - rangeXdown <0 the filter wraps around depending on its settings
			 * if no value is specified, center defaults to 0 and range to 1 (ie. no filter)
			 */
			changeSettings : function(settings) {
				me._setSettingHelper('centerH', settings, 0);
				me._setSettingHelper('centerS', settings, 0);
				me._setSettingHelper('centerV', settings, 0);
				
				me._setSettingHelper('rangeHup', settings, 1);
				me._setSettingHelper('rangeSup', settings, 1);
				me._setSettingHelper('rangeVup', settings, 1);

				me._setSettingHelper('rangeHdown', settings, 1);
				me._setSettingHelper('rangeSdown', settings, 1);
				me._setSettingHelper('rangeVdown', settings, 1);
				
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
				var hsv = utils.rgbToHsv(imgData[dataIndex], imgData[dataIndex+1], imgData[dataIndex+2])
				if(!me._isInRange('H', hsv.h)){
					me._dimPixel(imgData, dataIndex);
					return;
				}
				if(!me._isInRange('S', hsv.s)){
					me._dimPixel(imgData, dataIndex);
					return;
				} 
				if(!me._isInRange('V', hsv.v)){
					me._dimPixel(imgData, dataIndex);
					return;
				}
				
			},
			applyEffect : function(canvas, options) {
				utils.pixelByPixelIteration(canvas, me.effectFunction);
			}
		};
	
		$.extend(imageFun.fx.hsvFilter, base);
		me._checkInRange = me._checkInRangeNoWrapAround;
	}()
);
