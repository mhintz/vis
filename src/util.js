/*** PIXEL MANUPULATION ***/
VIS.RawPixels = function(x, y, w, h) {
	if (typeof x === "undefined") this.x = 0;
	if (typeof y === "undefined") this.y = 0;
	if (typeof w === "undefined") this.w = VIS.width;
	if (typeof h === "undefined") this.h = VIS.height;
	this.img = ctx.getImageData(this.x, this.y, this.w, this.h);
};

VIS.RawPixels.newImage = function(width, height) {
	if (typeof width === "undefined") width = VIS.width;
	if (typeof height === "undefined") height = VIS.height;
	return ctx.createImageData(width, height);
};

VIS.RawPixels.prototype = (function() {
	var api = {};

	api.getImg = function() {
		this.img = ctx.getImageData(this.x, this.y, this.w, this.h);
		return this.img;
	};

	api.setImg = function(newImg, x, y) {
		if (typeof x === "undefined") x = 0;
		if (typeof y === "undefined") y = 0;
		this.img = newImg;
		this.x = x;
		this.y = y;
		this.w = newImg.width;
		this.h = newImg.height;
		ctx.putImageData(this.img, this.x, this.y);
	};

	api.getPx = function() {
		this.img = ctx.getImageData(this.x, this.y, this.w, this.h);
		return this.img.data;
	};

	api.setPx = function(newPx) {
		this.img.data = newPx;
		ctx.putImageData(this.img, this.x, this.y);
	};

	api.draw = function() {
		ctx.putImageData(this.img, this.x, this.y);
	};

	return api;
})();

/*** MATH UTILITIES ***/
VIS.clamp = function(x, bot, top) {
	x = Math.min(top, Math.max(bot, parseFloat(x)));
	if (Math.abs(x - top) < 0.000001) return top;
	else if (Math.abs(x - bot) < 0.000001) return bot;
	else return x;
};

/*** COLOR UTILITIES ***/
VIS.rgbToHex = function(r, g, b) {
	r = r.toString(16), g = g.toString(16), b = b.toString(16);
	if (r.length < 2) r = "0" + r;
	if (g.length < 2) g = "0" + g;
	if (b.length < 2) b = "0" + b;
	return "#" + r + g + b;
};

// hsv conversion functions from the quite well-documented TinyColor.js library
// https://github.com/bgrins/TinyColor
VIS.rgbToHsv = function(r, g, b) {
    r = VIS.clamp(r, 0, 255) / 255;
    g = VIS.clamp(g, 0, 255) / 255;
    b = VIS.clamp(b, 0, 255) / 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max === 0 ? 0 : d / max;

    if(max == min) {
        h = 0; // achromatic
    }
    else {
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h, s: s, v: v };
};

VIS.hexToRgb = function(hex) {
	if (hex.length === 4) {
		return {
			r: parseInt(hex.substr(1, 1), 16),
			g: parseInt(hex.substr(2, 1), 16),
			b: parseInt(hex.substr(3, 1), 16)
		};
	} else {
		return {
			r: parseInt(hex.substr(1, 2), 16),	
			g: parseInt(hex.substr(3, 2), 16),
			b: parseInt(hex.substr(5, 2), 16)
		};
	}
};

VIS.hexToHsv = function(hex) {
	return VIS.rgbToHsv(VIS.hexToRgb(hex));
};

VIS.hsvToRgb = function(h, s, v) {
    h = VIS.clamp(h, 360) / 360 * 6;
    s = VIS.clamp(s, 100) / 100;
    v = VIS.clamp(v, 100) / 100;

    var i = Math.floor(h),
        f = h - i,
        p = v * (1 - s),
        q = v * (1 - f * s),
        t = v * (1 - (1 - f) * s),
        mod = i % 6,
        r = [v, q, p, p, t, v][mod],
        g = [t, v, v, q, p, p][mod],
        b = [p, p, t, v, v, q][mod];

    return { r: r * 255, g: g * 255, b: b * 255 };
};