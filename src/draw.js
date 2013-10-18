/*** DRAW SETTINGS ***/
VIS.clear = function() {
	ctx.clearRect(0, 0, VIS.width, VIS.height);
};

VIS.background = function(r, g, b) {
	if (arguments.length === 1) g = b = r;
	var _fill = ctx.fillStyle;
	ctx.fillStyle = VIS.rgbToHex(r, g, b);
	ctx.fillRect(0, 0, VIS.width, VIS.height);
	ctx.fillStyle = _fill;
};

VIS.stroke = function(r, g, b) {
	if (arguments.length === 1) g = b = r;
	ctx.strokeStyle = VIS.rgbToHex(r, g, b);
	VIS._stroke = true;
};

VIS.strokeWidth = function(w) {
	ctx.lineWidth = w;
};

VIS.lineCap = function(cap) {
	switch (cap) {
		case "butt":
		case "round":
		case "square":
			ctx.lineCap = cap;
		break;
	}
};

VIS.lineJoin = function(join) {
	switch (join) {
		case "round":
		case "bevel":
		case "miter":
			ctx.lineJoin = join;
		break;
	}
};

VIS.noStroke = function() {
	ctx.strokeStyle = "";
	VIS._stroke = false;
};

VIS.fill = function(r, g, b) {
	if (arguments.length === 1) g = b = r;
	ctx.fillStyle = VIS.rgbToHex(r, g, b);
	VIS._fill = true;
};

VIS.noFill = function() {
	ctx.fillStyle = "";
	VIS._fill = false;
};

/*** SHAPE PRIMITIVES ***/
VIS.line = function(x1, y1, x2, y2) {
	if (arguments.length === 2) x2 = y1.x, y2 = y1.y, y1 = x1.y, x1 = x1.x;
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	if (VIS._stroke) ctx.stroke();
};

VIS.rect = function(x, y, w, h) {
	ctx.rect(x, y, w, h);
	if (VIS._fill) ctx.fill();
	if (VIS._stroke) ctx.stroke();
};

VIS.roundRect = function(x, y, w, h, r) {
	ctx.beginPath();
	// begin at end of upper left corner arc
	ctx.moveTo(x + r, y);
	// upper side
	ctx.lineTo(x + w - r, y);
	// upper right corner
	ctx.arcTo(x + w, y, x + w, y + r, r);
	// right side
	ctx.lineTo(x + w, y + h - r);
	// lower right corner
	ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
	// lower side
	ctx.lineTo(x + r, y + h);
	// lower left corner
	ctx.arcTo(x, y + h, x, y + h - r, r);
	// left side
	ctx.lineTo(x, y + r);
	// upper left corner
	ctx.arcTo(x, y, x + r, y, r);
	// end
	if (VIS._fill) ctx.fill();
	if (VIS._stroke) ctx.stroke();
};

VIS.triangle = function(x1, y1, x2, y2, x3, y3) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.lineTo(x3, y3);
	ctx.lineTo(x1, y1);
	if (VIS._stroke) ctx.stroke();
	if (VIS._fill) ctx.fill();
};

VIS.circle = function(x, y, r) {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arc(x, y, r, 0, VIS.TWO_PI);
	if (VIS._stroke) ctx.stroke();
	if (VIS._fill) ctx.fill();
};

VIS.arc = function(x, y, r0, r1, a0, a1) {
	var _width = ctx.lineWidth;
	a0 = a0 === VIS.TWO_PI ? a0 : Math.abs(VIS.TWO_PI - a0);
	a1 = a1 === VIS.TWO_PI ? a1 : Math.abs(VIS.TWO_PI - a1);
	ctx.lineWidth = r1 - r0;
	var r = r0 + ctx.lineWidth / 2;
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.arc(x, y, r, a0, a1, true);
	if (VIS._stroke) ctx.stroke();
	ctx.lineWidth = _width;
};

VIS.ngon = function(x, y, r, n) {
	var inc = VIS.TWO_PI / n;
	var px, py, a = 0;
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	for (var i = 0; i <= n; ++i) {
		a += inc;
		px = x + Math.cos(a) * r;
		py = y + Math.sin(a) * r;
		ctx.lineTo(px, py);
	}
	if (VIS._stroke) ctx.stroke();
	if (VIS._fill) ctx.fill();
};