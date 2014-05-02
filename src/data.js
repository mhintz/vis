/*** DATA CLASSES ***/
function Point(x, y) {
	this.x = x;
	this.y = y;
}

vp.Point = function(x, y) {
	return new Point(x, y);
};

Point.prototype.reset = function(x, y) {
	this.x = x;
	this.y = y;
};

function Vec2D(x, y) {
	this.x = x;
	this.y = y;
}

vp.Vec2D = function(x, y) {
	return new Vec2D(x, y);
};

Vec2D.prototype.add = function(pt) {
	this.x += pt.x;
	this.y += pt.y;
};

Vec2D.prototype.rot = function(pt) {
	this.x *= pt.x;
	this.y *= pt.y;
};