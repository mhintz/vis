/*** GENERAL UTILITIES ***/
/* (mostly stolen from underscore) */
vp.slice = Function.prototype.call.bind(Array.prototype.slice); // now you can vp.slice any arguments array

vp.bindAll = function(context) {
	var funcs = vp.isArray(arguments[1]) ? arguments[1] : vp.slice(arguments, 1),
		i = funcs.length,
		f;
	while (i--) {
		f = funcs[i];
		context[f] = context[f].bind(context);
	}
	return context;
};

vp.isArray = function(candidate) {
	return Object.prototype.toString.call(candidate) === "[object Array]";
};

vp.isObject = function(candidate) {
	return candidate === Object(candidate);
};

vp.isFunction = function(candidate) {
	return typeof candidate === "function";
};

vp.isUndefined = function(candidate) {
	return candidate === void 0;
};

// extend an object with optional overwriting
vp.extend = function(obj) {
	var ext, i, l, p;
	for (i = 1, l = arguments.length; i < l; ++i) {
		ext = arguments[i];
		if (ext) {
			for (p in ext) {
				if (ext.hasOwnProperty(p)) obj[p] = ext[p];
			}
		}
	}
	return obj;
};

vp.functions = function(obj) {
	var funcs = [];
	for (var key in obj) {
		if (vp.isFunction(obj[key])) funcs.push(key);
	}
	return funcs.sort();
};

/*** MATH UTILITIES ***/
(function() {
	var usefulMath = "PI abs acos asin atan atan2 ceil cos floor max min pow round sin sqrt tan".split(" "),
		prop;
	while (prop = usefulMath.pop()) {
		vp[prop] = Math[prop];
	}
})();

vp.lerp = function(low, high, amount) {
	return low + amount * (high - low);
};

vp.project = function(v, domLo, domHi, rngLo, rngHi) {
	var t = (v - domLo) / (domHi - domLo);
	return vp.lerp(rngLo, rngHi, t);
};

vp.clamp = function(x, bot, top) {
	x = Math.min(top, Math.max(bot, parseFloat(x)));
	if (Math.abs(x - top) < 0.000001) return top;
	else if (Math.abs(x - bot) < 0.000001) return bot;
	else return x;
};