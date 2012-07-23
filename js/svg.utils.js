/*global $:false, document: false*/
/*jslint nomen: true, plusplus: true, vars: true, white: true */
var imageFun = imageFun || {};
imageFun.svg = imageFun.svg || {};

(function(){
	"use strict";
	/**
	 * 
	 * @param {Object} opt  {x,y,width, height}
	 */
	imageFun.svg.utils = {
		_doc: document,
		W3svgNS:'http://www.w3.org/2000/svg',
		changeDocument:function(newDoc){
			this._doc = newDoc;
		},
		get$doc: function(){
			return $(this._doc);
		},
		createRawElt:function(eltName){
			var d = this._doc;
			return d.createElementNS(this.W3svgNS, eltName);
		},
		forceRender:function(svgTag){
			svgTag = $(svgTag);
			var rect = this.createRawElt('rect');
			svgTag.append(rect);
			setTimeout(function(){$(rect).remove();});
		}
	};
}());
