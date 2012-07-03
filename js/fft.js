/*************FFT code came from http://nklein.com/2009/09/fourier-transforms-in-javascript/***************/
	function __getNextPowerOfTwo(nn) {
	    var pp = 1;
	    while(pp < nn) {
		pp *= 2;
	    }
	    return pp;
	}

	function prepImageForFFT(_imageId, _canvasId) {
	    var image = document.getElementById(_imageId);
	    var canvas = document.getElementById(_canvasId);
	    if(!image || !canvas) {
		return false;
	    }
	    var ww = __getNextPowerOfTwo(image.width);
	    var hh = __getNextPowerOfTwo(image.height);
	    canvas.width = ww;
	    canvas.height = hh;
	    var context = canvas.getContext('2d');
	    if(!context) {
		return false;
	    }
	    context.drawImage(image, 0, 0, ww, hh);
	    return true;
	}

	function __rearrangeSamples(_array, _offset, _ww, _stride) {
	    var target = 0;
	    for(var pos = 0; pos < _ww; ++pos) {
		if(target > pos) {
		    for(var kk = 0; kk < 4; ++kk) {
			var tmp = _array[target * _stride + kk + _offset];
			_array[target * _stride + kk + _offset] = _array[pos * _stride + kk + _offset];
			_array[pos * _stride + kk + _offset] = tmp;
		    }
		}
		var mask = _ww;
		while((target & (mask >>= 1 ) )) {
		    target &= ~mask;
		}
		target |= mask;
	    }
	}

	function __shiftSamples(_samps, _base, _ww, _stride) {
	    var mid = _base + _ww * _stride / 2;
	    for(var ii = 0; ii < _ww / 2; ++ii) {
		for(var kk = 0; kk < 3; ++kk) {
		    var tmp = _samps[_base + ii * _stride + kk];
		    _samps[_base + ii * _stride + kk] = _samps[mid + ii * _stride + kk];
		    _samps[mid + ii * _stride + kk] = tmp;
		}
	    }
	}

	function __performFFT(_real, _imag, _ww, _hh, _dx, _dy, _inverse) {
	    for(var jj = 0; jj < _hh; ++jj) {
		if(_inverse) {
		    __shiftSamples(_real, jj * _dy, _ww, _dx);
		    __shiftSamples(_imag, jj * _dy, _ww, _dx);
		}
		__rearrangeSamples(_real, jj * _dy, _ww, _dx);
		__rearrangeSamples(_imag, jj * _dy, _ww, _dx);
		var pi = Math.PI;
		//3.14159265358979323846264338327950288;
		var angularScale = (_inverse ) ? pi : -pi;
		for(var step = 1; step < _ww; step += step) {
		    var delta = angularScale / step;
		    var sine = Math.sin(delta / 2.0);
		    var fac_r = 1.0;
		    var fac_i = 0.0;
		    var mul_r = -2.0 * sine * sine;
		    var mul_i = Math.sin(delta);
		    for(var group = 0; group < step; ++group) {
			for(var pair = group; pair < _ww; pair += step * 2) {
			    var match = pair + step;
			    for(var kk = 0; kk < 3; ++kk) {
				var commonSum = jj * _dy + kk;
				//var p_index = jj * _dy + pair * _dx + kk;
				//var m_index = jj * _dy + match * _dx + kk;
				var p_index = commonSum + pair * _dx;
				var m_index = commonSum + match * _dx;

				var rr = _real[m_index];
				var ii = _imag[m_index];
				var prod_r = rr * fac_r - ii * fac_i;
				var prod_i = rr * fac_i + ii * fac_r;
				_real[m_index] = _real[p_index] - prod_r;
				_imag[m_index] = _imag[p_index] - prod_i;
				_real[p_index] += prod_r;
				_imag[p_index] += prod_i;
			    }
			}
			var inc_r = mul_r * fac_r - mul_i * fac_i;
			var inc_i = mul_r * fac_i + mul_i * fac_r;
			fac_r += inc_r;
			fac_i += inc_i;
		    }
		}
		if(!_inverse) {
		    __shiftSamples(_real, jj * _dy, _ww, _dx);
		    __shiftSamples(_imag, jj * _dy, _ww, _dx);
		}
	    }
	    return {
		width : _ww,
		height : _hh,
		real : _real,
		imag : _imag,
	    };
	}

	function FFT(canvasLocal) {
	    //var canvasLocal = document.getElementById(_canvasId);
	    if(!canvasLocal) {
		return false;
	    }
	    var ww = canvasLocal.width;
	    var hh = canvasLocal.height;
	    var context = canvasLocal.getContext('2d');
	    if(!context) {
		return false;
	    }
	    var rawResult = context.getImageData(0, 0, ww, hh);
	    var result = rawResult.data;
	    var real = new Array();
	    var imag = new Array();
	    real.length = ww * hh * 4;
	    imag.length = ww * hh * 4;
	    for(var pp = 0; pp < result.length; ++pp) {
		real[pp] = result[pp] / 255.0;
		imag[pp] = 0.0;
	    }
	    var fftData = __performFFT(real, imag, ww, hh, 4, ww * 4, false);
	    __performFFT(real, imag, hh, ww, ww * 4, 4, false);
	    for(var pp = 0; pp < result.length; pp += 4) {
		for(var kk = 0; kk < 3; ++kk) {
		    var index = pp + kk;
		    var rr = real[index];
		    var ii = imag[index];
		    result[index] = Math.sqrt(rr * rr + ii * ii);
		}
		result[pp + 3] = 255;
	    }
	    context.putImageData(rawResult, 0, 0);
	    return fftData;
	}

	function IFFT(_fftData, _canvasId) {
	    var canvasLocal = document.getElementById(_canvasId);
	    if(!canvasLocal) {
		return false;
	    }
	    var ww = _fftData.width;
	    var hh = _fftData.height;
	    canvasLocal.width = ww;
	    canvasLocal.height = hh;
	    var context = canvasLocal.getContext('2d');
	    if(!context) {
		return false;
	    }
	    var real = _fftData.real;
	    var imag = _fftData.imag;
	    __performFFT(real, imag, hh, ww, ww * 4, 4, true);
	    __performFFT(real, imag, ww, hh, 4, ww * 4, true);
	    var rawResult = context.getImageData(0, 0, ww, hh);
	    var result = rawResult.data;
	    var scale = ww * hh;
	    for(var pp = 0; pp < result.length; pp += 4) {
		for(var kk = 0; kk < 3; ++kk) {
		    var index = pp + kk;
		    var vv = 255.0 * real[index] / scale;
		    if(vv < 0) {
			vv = 0;
		    } else if(255 < vv) {
			vv = 255;
		    }
		    result[index] = vv;
		}
		result[pp + 3] = 255;
	    }
	    context.putImageData(rawResult, 0, 0);
	    return true;
	}

	/*****************************/