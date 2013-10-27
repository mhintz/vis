/*** DRAW SETTINGS ***/
vp.clear = function() {
	this.ctx.clearRect(0, 0, this.width, this.height);
};

vp.background = function(r, g, b) {
	if (arguments.length === 1) g = b = r;
	var _fill = this.ctx.fillStyle;
	this.ctx.fillStyle = vp.rgbToHex(r, g, b);
	this.ctx.fillRect(0, 0, this.width, this.height);
	this.ctx.fillStyle = _fill;
};

vp.stroke = function(r, g, b) {
	if (arguments.length === 1) g = b = r;
	this.ctx.strokeStyle = vp.rgbToHex(r, g, b);
	this._stroke = true;
};

vp.strokeWidth = function(w) {
	this.ctx.lineWidth = w;
};

vp.lineCap = function(cap) {
	switch (cap) {
		case "butt":
		case "round":
		case "square":
			this.ctx.lineCap = cap;
		break;
	}
};

vp.lineJoin = function(join) {
	switch (join) {
		case "round":
		case "bevel":
		case "miter":
			this.ctx.lineJoin = join;
		break;
	}
};

vp.noStroke = function() {
	this.ctx.strokeStyle = "";
	this._stroke = false;
};

vp.fill = function(r, g, b) {
	if (arguments.length === 1) g = b = r;
	this.ctx.fillStyle = vp.rgbToHex(r, g, b);
	this._fill = true;
};

vp.noFill = function() {
	this.ctx.fillStyle = "";
	this._fill = false;
};

/*** SHAPE PRIMITIVES ***/
vp.line = function(x1, y1, x2, y2) {
	if (arguments.length === 2) x2 = y1.x, y2 = y1.y, y1 = x1.y, x1 = x1.x;
	this.ctx.beginPath();
	this.ctx.moveTo(x1, y1);
	this.ctx.lineTo(x2, y2);
	if (this._stroke) this.ctx.stroke();
};

vp.rect = function(x, y, w, h) {
	this.ctx.rect(x, y, w, h);
	if (this._fill) this.ctx.fill();
	if (this._stroke) this.ctx.stroke();
};

vp.roundRect = function(x, y, w, h, r) {
	this.ctx.beginPath();
	// begin at end of upper left corner arc
	this.ctx.moveTo(x + r, y);
	// upper side
	this.ctx.lineTo(x + w - r, y);
	// upper right corner
	this.ctx.arcTo(x + w, y, x + w, y + r, r);
	// right side
	this.ctx.lineTo(x + w, y + h - r);
	// lower right corner
	this.ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
	// lower side
	this.ctx.lineTo(x + r, y + h);
	// lower left corner
	this.ctx.arcTo(x, y + h, x, y + h - r, r);
	// left side
	this.ctx.lineTo(x, y + r);
	// upper left corner
	this.ctx.arcTo(x, y, x + r, y, r);
	// end
	if (this._fill) this.ctx.fill();
	if (this._stroke) this.ctx.stroke();
};

vp.triangle = function(x1, y1, x2, y2, x3, y3) {
	this.ctx.beginPath();
	this.ctx.moveTo(x1, y1);
	this.ctx.lineTo(x2, y2);
	this.ctx.lineTo(x3, y3);
	this.ctx.lineTo(x1, y1);
	if (this._stroke) this.ctx.stroke();
	if (this._fill) this.ctx.fill();
};

vp.circle = function(x, y, r) {
	this.ctx.beginPath();
	this.ctx.moveTo(x + r, y);
	this.ctx.arc(x, y, r, 0, TWO_PI);
	if (this._stroke) this.ctx.stroke();
	if (this._fill) this.ctx.fill();
};

vp.arc = function(x, y, r0, r1, a0, a1) {
	var _width = this.ctx.lineWidth;
	a0 = a0 === TWO_PI ? a0 : Math.abs(TWO_PI - a0);
	a1 = a1 === TWO_PI ? a1 : Math.abs(TWO_PI - a1);
	this.ctx.lineWidth = r1 - r0;
	var r = r0 + this.ctx.lineWidth / 2;
	this.ctx.beginPath();
	this.ctx.moveTo(x, y);
	this.ctx.arc(x, y, r, a0, a1, true);
	if (this._stroke) this.ctx.stroke();
	this.ctx.lineWidth = _width;
};

vp.ngon = function(x, y, r, n) {
	var inc = TWO_PI / n;
	var px, py, a = 0;
	this.ctx.beginPath();
	this.ctx.moveTo(x + r, y);
	for (var i = 0; i <= n; ++i) {
		a += inc;
		px = x + Math.cos(a) * r;
		py = y + Math.sin(a) * r;
		this.ctx.lineTo(px, py);
	}
	if (this._stroke) this.ctx.stroke();
	if (this._fill) this.ctx.fill();
};