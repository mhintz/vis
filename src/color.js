/*** COLOR UTILITIES ***/
vp.isColor = function(str) {
    if (typeof str !== "string") return false;
    if (str[0] === "#" && (str.length === 4 || str.length === 7)) return true;
    var split = str.split(new RegExp("\\(|,|\\)"));
    if (split[0].slice(0, 3) === "rgb" && parseInt(split[1]) && parseInt(split[2]) && parseInt(split[3])) return true;
    return false;
};

vp.rgbToHex = function(r, g, b) {
	r = r.toString(16), g = g.toString(16), b = b.toString(16);
	if (r.length < 2) r = "0" + r;
	if (g.length < 2) g = "0" + g;
	if (b.length < 2) b = "0" + b;
	return "#" + r + g + b;
};

// hsv conversion functions from the quite well-documented TinyColor.js library
// https://github.com/bgrins/TinyColor
vp.rgbToHsv = function(r, g, b) {
    r = vp.clamp(r, 0, 255) / 255;
    g = vp.clamp(g, 0, 255) / 255;
    b = vp.clamp(b, 0, 255) / 255;

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

vp.hexToRgb = function(hex) {
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

vp.hexToHsv = function(hex) {
	return vp.rgbToHsv(vp.hexToRgb(hex));
};

vp.hsvToRgb = function(h, s, v) {
    h = vp.clamp(h, 360) / 360 * 6;
    s = vp.clamp(s, 100) / 100;
    v = vp.clamp(v, 100) / 100;

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