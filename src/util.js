/*** GENERAL UTILITIES ***/
/* (mostly stolen from underscore) */
VIS.slice = Array.prototype.slice;

VIS.bind = function(func, context) {
	var args = VIS.slice.call(arguments, 2);
	return function() {
		func.apply(context, args.concat(VIS.slice.call(arguments)));
	};
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

/*** MATH UTILITIES ***/
VIS.lerp = function(low, high, amount) {
	return low + amount * (high - low);
};

VIS.clamp = function(x, bot, top) {
	x = Math.min(top, Math.max(bot, parseFloat(x)));
	if (Math.abs(x - top) < 0.000001) return top;
	else if (Math.abs(x - bot) < 0.000001) return bot;
	else return x;
};