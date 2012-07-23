/*global $:false*/
/*jslint nomen: true, plusplus: true, vars: true, white: true */
var imageFun = imageFun || {};
imageFun.svg = imageFun.svg || {}; ( function() {"use strict";

		/**
		 *
		 * @param {Object} opt  {x,y,width, height}
		 */
		imageFun.svg.Rect = function(opt) {
			var rect = imageFun.svg.utils.createRawElt('rect'); 
			var $rect = $(rect);

			/*
			 *
			 <rect style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); cursor: pointer; " x="2" y="2" width="74" height="74" fill="none" stroke="#b40500" stroke-opacity="0.7" stroke-width="2" stroke-dasharray="0">',
			 '	</rect>',
			 */
			opt = $rect.extend({}, this.attributeDefaults, opt);
			$rect.attr(opt);

			this.$tag = $rect;
			this.tag = this.$tag[0];
		};

		var proto = {
			privateLogStr : '',
			privateLog : function(s) {
				this.privateLogStr += s + '\n';
			},
			destroy : function() {
				this.$tag.remove();
			},
			_getResizeMovementObj : function(percentOnRight, percentOnTop) {
				var inRectX = percentOnRight;
				var inRectY = percentOnTop;
				var thresh = 0.1;
				var resizeMovement = {};
				if (inRectX < thresh) {
					if (inRectY < thresh) {
						//expand uppper left corner
						resizeMovement.resizeFromTop = true;
						resizeMovement.resizeFromRight = false;

						//me._rectResize(r, changeX, changeY, true, false);
					} else if (inRectY > 1 - thresh) {
						//expand lower  left corner
						resizeMovement.resizeFromTop = false;
						resizeMovement.resizeFromRight = false;
						//me._rectResize(r, changeX, changeY, false, false);
					} else {
						//expand left
						resizeMovement.resizeFromTop = false;
						resizeMovement.resizeFromRight = false;
						//me._rectResize(r, changeX, changeY, false, false);
					}
				} else if (inRectX > 1 - thresh) {
					if (inRectY < thresh) {
						//expand upper right corner
						resizeMovement.resizeFromTop = true;
						resizeMovement.resizeFromRight = true;
						//me._rectResize(r, changeX, changeY, true, true);
					} else if (inRectY > 1 - thresh) {
						//expand lower  right corner
						resizeMovement.resizeFromTop = false;
						resizeMovement.resizeFromRight = true;
						//me._rectResize(r, changeX, changeY, false, true);
					} else {
						//expand right
						resizeMovement.resizeFromTop = false;
						resizeMovement.resizeFromRight = true;
						//me._rectResize(r, changeX, changeY, false, true);
					}
				} else {
					//in width
					if (inRectY > 1 - thresh) {
						//expand  bottom
						resizeMovement.resizeFromTop = false;
						resizeMovement.resizeFromRight = false;
						//me._rectResize(r, changeX, changeY, false, false);
					} else {
						//expand top
						resizeMovement.resizeFromTop = true;
						resizeMovement.resizeFromRight = false;
						//me._rectResize(r, changeX, changeY, true, false);
					}
				}
				return resizeMovement;
			},
			mouseResizeable : function(obj) {
				
				var me = this;
				var defaults={
					maxX: Number.MAX_VALUE,
					maxY: Number.MAX_VALUE,
					minX: 0,
					minY: 0,
					minWidth: 1,
					minH: 1,
					limitRight: false,
					limitLeft: false,
					limitTop:false,
					limitBottom: false
				};
				obj = $.extend({}, defaults, obj);
				me.mouseRexizableOptions = obj;
				this.$tag.bind('mousedown', function() {
					var r = me.$tag;
					var $doc = imageFun.svg.utils.get$doc();
					var pastX = null;
					var pastY = null;
					var resizeMovement;
					$doc.bind('mouseup', function(e) {
						resizeMovement = null;
						$doc.unbind('mousemove.movingrect');
					});
					$doc.unbind('mousemove.movingrect');
					$doc.bind('mousemove.movingrect', function(e) {
						var changeX, changeY, newW, newH;
						var rectOffsetX, rectOffsetY, rectOffset;
						var inRectX, inRectY;
						if (pastX === null) {
							pastX = e.pageX;
							pastY = e.pageY;
							return;
						}
						changeX = e.pageX - pastX;
						changeY = e.pageY - pastY;
						pastX = e.pageX;
						pastY = e.pageY;

						newW = parseInt(r.attr('width'), 10);
						newH = parseInt(r.attr('height'), 10);
						rectOffset = r.offset();
						rectOffsetX = rectOffset.left;
						rectOffsetY = rectOffset.top;

						inRectX = e.pageX - rectOffsetX;
						inRectX = inRectX / newW;

						inRectY = e.pageY - rectOffsetY;
						inRectY = inRectY / newH;
						if (!resizeMovement) {
							//this keeps resizing in the same way as when the event began because
							//the direction is only found once
							resizeMovement = me._getResizeMovementObj(inRectX, inRectY);
						}
						me._rectResize(r, changeX, changeY, resizeMovement.resizeFromTop, resizeMovement.resizeFromRight);
					});

				});
			},

			_rectResize : function(rect, changeX, changeY, resizeFromTop, resizeFromRight) {
				var newW, newH, newX, newY;
				var me = this;
				var opt = me.mouseRexizableOptions;
				var maxX = opt.maxX;
				var minX = opt.minX;
				var maxY = opt.maxY;
				var minY = opt.minY;
				var minW = opt.minWidth;
				var minH = opt.minHeight;
				var clamp = imageFun.utils.clamp;
				
				rect = $(rect);
				newX = parseInt(rect.attr('x'), 10);
				newY = parseInt(rect.attr('y'), 10);
				newH = parseInt(rect.attr('height'), 10);
				newW = parseInt(rect.attr('width'), 10);
				
				if (resizeFromRight) {
					//newW = imageFun.utils.clamp(newW + changeX, maxX, minX);
					newW = clamp(newW + changeX, maxX-newX, minW);
				} else {
					var oldX = newX;
					newX = clamp(newX+changeX,maxX-minW , minX);
					changeX = newX-oldX;
					newW = clamp(newW - changeX, maxX, minW);
				}
				if (resizeFromTop) {
					var oldY = newY;
					newY = clamp(newY+changeY,maxY-minH , minY);
					changeY = newY-oldY;
					newH = clamp(newH - changeY, maxY, minH);
					
				} else {
					newH = clamp(newH + changeY, maxY-newY, minH);
				}

				rect.attr({
					x : newX,
					y : newY,
					width : newW,
					height : newH
				});
				$(this).trigger('resize', [{x:newX, y:newY, width: newW, height: newH}]);
			},
			attributeDefaults : {
				'fill' : 'none',
				'style' : '-webkit-tap-highlight-color: rgba(0, 0, 0, 0); cursor: pointer;',
				'stroke' : "blue", //"#b40500",
				'stroke-opacity' : "0.7",
				'stroke-width' : "2",
				'stroke-dasharray' : "0"
			},
			getMarkup : function() {
				return this.tag;
			}
		};
		$.extend(imageFun.svg.Rect.prototype, proto);
	}());
