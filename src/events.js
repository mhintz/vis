/*** Mostly stolen from Backbone or EaselJS ***/
function Events() {
	this._handlers = {};
}

VIS.Events = function() {
	return new Events();
};

Events.prototype.on = function(name, response, context) {
	var list = this._handlers[name] || (this._handlers[name] = []);
	var i = list.length;
	while (i--) if (list[i].fn === response) return false;
	list.push({fn: response, cx: context || this});
	return true;
};

Events.prototype.once = function(name, response, context) {
	var self = this;
	var once = function() {
		self.off(name, once);
		response.apply(this, arguments);
	};
	this.on(name, once, context);
	return true;
};

Events.prototype.trigger = function(name) {
	var list = this._handlers[name];
	if (list) {
		var args = vp.slice.call(arguments, 1), info, i = -1, l = list.length;
		while (++i < l) (info = list[i]).fn.apply(info.cx, args);
	}
	return true;
};

Events.prototype.off = function(name, response) {
	if (!response) {
		return delete this._handlers[name];
	}
	var list = this._handlers[name];
	if (list) {
		var i = list.length;
		while (i--) {
			if (list[i].fn === response) list.splice(i, 1);
		}
		return true;
	}
};
