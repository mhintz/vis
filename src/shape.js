/*** DATA CLASSES ***/
function Point(instance, x, y) {
	this._inst = instance;
	this.x = x;
	this.y = y;
}

vp.Point = function(x, y) {
	return new Point(this, x, y);
};

Point.prototype.reset = function(x, y) {
	this.x = x;
	this.y = y;
};

function Vec2D(instance, x, y) {
	this._inst = instance;
	this.x = x;
	this.y = y;
}

vp.Vec2D = function(x, y) {
	return new Vec2D(this, x, y);
};

Vec2D.prototype.add = function(pt) {
	this.x += pt.x;
	this.y += pt.y;
};

Vec2D.prototype.rot = function(pt) {
	this.x *= pt.x;
	this.y *= pt.y;
};

/*** DRAWING CLASSES ***/
function Particle(instance, loc, vel, acc) {
	this._inst = instance;
	this.loc = loc;
	this.vel = vel;
	this.acc = acc;
}

vp.Particle = function(loc, vel, acc) {
	return new Particle(this, loc, vel, acc);
};

Particle.prototype.loc = function(loc) {
	if (arguments.length === 0) return this.loc;
	this.loc = loc;
};

Particle.prototype.vel = function(vel) {
	if (arguments.length === 0) return this.vel;
	this.vel = vel;
};

Particle.prototype.acc = function(acc) {
	if (arguments.length === 0) return this.acc;
	this.acc = acc;
};

Particle.prototype.update = function() {
	this.vel.add(this.acc);
	this.loc.add(this.vel);
};

Particle.prototype.draw = function() {
	this._inst.circle(this.loc.x, this.loc.y, 1);
};

Particle.prototype.inView = function() {
	return this.loc.x >= 0 && this.loc.x <= this._inst.width && this.loc.y >= 0 && this.loc.y <= this._inst.height;
};

function Triangle(instance, a, b, c) {
	this._inst = instance;
	this.a = a;
	this.b = b;
	this.c = c;
}

vp.Triangle = function(a, b, c) {
	return new Triangle(this, a, b, c);
};

Triangle.prototype.reset = function(a, b, c) {
	this.a = a;
	this.b = b;
	this.c = c;
};

Triangle.prototype.draw = function() {
	this._inst.triangle(this.a.x, this.a.y, this.b.x, this.b.y, this.c.x, this.c.y);
};

function Polygon(instance) {
	this._inst = instance;
	this.vertices = [];
}

vp.Polygon = function() {
	return new Polygon(this);
};

Polygon.prototype.vertex = function(x, y) {
	if (arguments.length === 1) this.vertices.push(x);
	else this.vertices.push(new Point(x, y));
};

Polygon.prototype.clear = function() {
	this.vertices = [];
};

Polygon.prototype.draw = function(open) {
	this._inst.ctx.beginPath();
	this._inst.ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
	for (var i = 1, l = this.vertices.length; i < l; ++i) {
		this._inst.ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
	};
	if (open !== "open") this._inst.ctx.closePath();
	if (this._inst._stroke) this._inst.ctx.stroke();
	if (this._inst._fill) this._inst.ctx.fill();
};