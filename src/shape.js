/*** DATA CLASSES ***/
VIS.Point = function(x, y) {
	this.x = x;
	this.y = y;
};

VIS.Point.prototype = (function() {
	var proto = {};

	proto.reset = function(x, y) {
		this.x = x;
		this.y = y;
	};

	return proto;
})();

VIS.Vec2D = function(x, y) {
	this.x = x;
	this.y = y;
};

VIS.Vec2D.prototype = (function() {
	var proto = VIS.Point.prototype;

	proto.add = function(pt) {
		this.x += pt.x;
		this.y += pt.y;
	};

	proto.rot = function(pt) {
		this.x *= pt.x;
		this.y *= pt.y;
	};

	return proto;
})();

/*** DRAWING CLASSES ***/
VIS.Particle = function(loc, vel, acc) {
	this.loc = loc;
	this.vel = vel;
	this.acc = acc;
};

VIS.Particle.prototype = (function() {
	var proto = {};

	proto.loc = function(loc) {
		if (arguments.length === 0) return this.loc;
		this.loc = loc;
	};

	proto.vel = function(vel) {
		if (arguments.length === 0) return this.vel;
		this.vel = vel;
	};

	proto.acc = function(acc) {
		if (arguments.length === 0) return this.acc;
		this.acc = acc;
	};

	proto.update = function() {
		this.vel.add(this.acc);
		this.loc.add(this.vel);
	};

	proto.draw = function() {
		VIS.circle(this.loc.x, this.loc.y, 1);
	};

	proto.inView = function() {
		return this.loc.x >= 0 && this.loc.x <= VIS.width && this.loc.y >= 0 && this.loc.y <= VIS.height;
	};

	return proto;
})();

VIS.Triangle = function(a, b, c) {
	this.a = a;
	this.b = b;
	this.c = c;
};

VIS.Triangle.prototype = (function() {
	var proto = {};

	proto.reset = function(a, b, c) {
		this.a = a;
		this.b = b;
		this.c = c;
	};

	proto.draw = function() {
		VIS.triangle(this.a.x, this.a.y, this.b.x, this.b.y, this.c.x, this.c.y);
	};

	return proto;
})();

VIS.Polygon = function() {
	this.vertices = [];
};

VIS.Polygon.prototype = (function() {
	var proto = {};

	proto.vertex = function(x, y) {
		if (arguments.length === 1) this.vertices.push(x);
		else this.vertices.push(new Point(x, y));
	};

	proto.clear = function() {
		this.vertices = [];
	};

	proto.draw = function(open) {
		ctx.beginPath();
		ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
		for (var i = 1, l = this.vertices.length; i < l; ++i) {
			ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
		};
		if (open !== "open") ctx.closePath();
		if (VIS._stroke) ctx.stroke();
		if (VIS._fill) ctx.fill();
	};

	return proto;
})();