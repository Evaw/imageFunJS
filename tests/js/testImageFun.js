/*global imageFun: false, $:false, document: false, test, asyncTest,
 expect, module, QUnit, ok, equal, notEqual, deepEqual, notDeepEquaal,
 sotStricitEqual, raises, start, stop, isNan*/
/*jslint nomen: true, plusplus: true, vars: true, white: true */
( function() {"use strict";
		module('imageFun.fxCore');
		var checkRange = function(modN) {
			var i, ans = 0, res;
			for ( i = -(modN * 10); i < modN * 10; i += 1) {
				res = imageFun.fxCore.mod(i, modN);
				var msg = "";
				msg += i + " mod " + modN;
				msg += "=>" + "ans: " + ans + " got:" + res;
				ok(res === ans, msg);
				ans = (ans + 1) % modN;
			}
		};
		test('mod', function() {

			checkRange(4);
			checkRange(3);
			checkRange(2);
			checkRange(1);
		});
		test('mod', function() {
			ok(isNaN(imageFun.fxCore.mod(3, 0)), 'mod 0');
		});
		test('clamp', function() {
			//clamp:function(val, max, min)
			ok(imageFun.fxCore.clamp(4, 5, 2) === 4, 'in range');
			ok(imageFun.fxCore.clamp(-1, 5, 2) === 2, 'clamp low');
			ok(imageFun.fxCore.clamp(6, 5, 2) === 5, 'clamp high');
			ok(imageFun.fxCore.clamp(-9, 5) === 0, ' using default 0 min');
			var exceptRx = /bad\s+parameters,\s+max:\s*[0-9]+\s+min:\s*[0-9]+/;
			raises(function() {
				imageFun.fxCore.clamp(4, 1, 2);
			}, exceptRx, 'expection thrown when min>max');
			ok(imageFun.fxCore.clamp(-8, 3, 3) === 3, 'clamp max===min');
			ok(imageFun.fxCore.clamp(8, 3, 3) === 3, 'clamp max===min');
			ok(imageFun.fxCore.clamp(3, 3, 3) === 3, 'clamp max===min');

		});
		var modCounterWitStartTest=function(modCounterSetSize, start){
			var nAryModCounter = new imageFun.fxCore.ModCounter(modCounterSetSize, start);
			var i, ans;
			for(i=start;i<modCounterSetSize*3;i+=1){
				ans = imageFun.fxCore.mod(i, modCounterSetSize);
				ok(ans===nAryModCounter.count());
			}			
		};
		var modCounterSimpleTest=function(modCounterSetSize){
			modCounterWitStartTest(modCounterSetSize, 0)
		};
		test('ModCounter',function(){
			modCounterSimpleTest(2);
			modCounterSimpleTest(3);
			modCounterSimpleTest(4);
			modCounterSimpleTest(100);
		});
		test('modCounter - startValue', funcmodCounterSimpleTesttion(){
			modCounterSimpleTest(2);
			modCounterSimpleTest(3);
			modCounterSimpleTest(4);
			modCounterSimpleTest(100);
		});
	}()
);

