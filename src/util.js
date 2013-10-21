/*** GENERAL UTILITIES ***/
/* (mostly stolen from underscore) */
VIS.slice = Array.prototype.slice;

VIS.bind = function(func, context) {
	if (!VIS.isFunction(func)) throw new TypeError("passed a non-function to bind");
	var args = VIS.slice.call(arguments, 2);
	return function() {
		func.apply(context, args.concat(VIS.slice.call(arguments)));
	};
};

VIS.bindAll = function(context) {
	var funcs = VIS.isArray(arguments[1]) ? arguments[1] : VIS.slice.call(arguments, 1),
		i = funcs.length;
	while (i--) {
		context[funcs[i]] = VIS.bind(context[funcs[i]], context);
	}
	return context;
};

VIS.isArray = function(candidate) {
	return Object.prototype.toString.call(candidate) === "[object Array]";
};

VIS.isObject = function(candidate) {
	return candidate === Object(candidate);
};

VIS.isFunction = function(candidate) {
	return typeof candidate === "function";
};

VIS.isUndefined = function(candidate) {
	return candidate === void 0;
};

// extend an object with optional overwriting
VIS.extend = function(obj, overwrite) {
	if (typeof overwrite === "boolean") {
		var args = VIS.slice.call(arguments, 2);
	} else {
		var args = VIS.slice.call(arguments, 1);
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

VIS.functions = function(obj) {
	var funcs = [];
	for (var key in obj) {
		if (VIS.isFunctions(obj[key])) funcs.push(key);
	}
	return funcs.sort();
};

/*** MATH UTILITIES ***/
var usefulMath = "PI abs acos asin atan atan2 ceil cos floor max min pow round sin sqrt tan".split(" "),
	i = usefulMath.length,
	prop;
while (i--) {
	prop = usefulMath[i];
	VIS[prop] = Math[prop];
}

VIS.lerp = function(low, high, amount) {
	return low + amount * (high - low);
};

VIS.clamp = function(x, bot, top) {
	x = Math.min(top, Math.max(bot, parseFloat(x)));
	if (Math.abs(x - top) < 0.000001) return top;
	else if (Math.abs(x - bot) < 0.000001) return bot;
	else return x;
};