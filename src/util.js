/*** GENERAL UTILITIES ***/
/* (mostly stolen from underscore) */
vp.slice = Array.prototype.slice;

vp.bind = function(func, context) {
	if (!vp.isFunction(func)) throw new TypeError("passed a non-function to bind");
	var args = vp.slice.call(arguments, 2);
	return function() {
		return func.apply(context, args.concat(vp.slice.call(arguments)));
	};
};

vp.bindAll = function(context) {
	var funcs = vp.isArray(arguments[1]) ? arguments[1] : vp.slice.call(arguments, 1),
		i = funcs.length;
	while (i--) {
		context[funcs[i]] = vp.bind(context[funcs[i]], context);
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
vp.extend = function(obj, overwrite) {
	if (typeof overwrite === "boolean") {
		var args = vp.slice.call(arguments, 2);
	} else {
		var args = vp.slice.call(arguments, 1);
		overwrite = false;
	}
	var i = -1, l = args.length, source;
	while (++i < l) {
		source = args[i];
		for (var key in source) {
			if (!(key in obj) || overwrite) {
				obj[key] = source[key];
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
var usefulMath = "PI abs acos asin atan atan2 ceil cos floor max min pow round sin sqrt tan".split(" "),
	i = usefulMath.length,
	prop;
while (i--) {
	prop = usefulMath[i];
	vp[prop] = Math[prop];
}

vp.lerp = function(low, high, amount) {
	return low + amount * (high - low);
};

vp.clamp = function(x, bot, top) {
	x = Math.min(top, Math.max(bot, parseFloat(x)));
	if (Math.abs(x - top) < 0.000001) return top;
	else if (Math.abs(x - bot) < 0.000001) return bot;
	else return x;
};