(function(root) {

	/*** INTERNALS ***/
	var VIS = {
		_version: "0.0.1",
		width: 0,
		height: 0,
		TWO_PI: 2 * Math.PI
	};

	root.VIS = VIS;

	// TODO: add support for node? windowed mode?
	// see https://github.com/rogerwang/node-webkit for probable way to do this

	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");

	if (typeof root.onload !== undefined) {
		var _load = root.onload;
		root.onload = function() {
			if (typeof _load === "function") _load();
			internalSetup();
		};
	} else {
		internalSetup();
	}

	function internalSetup() {
		if (typeof setup !== "undefined") setup();
		if (typeof click !== "undefined") document.addEventListener("click", click);

		// TODO: have this wait until all scripts have finished loading

		requestAnimationFrame(internalLoop);
	}

	function internalLoop() {
		if (typeof update !== "undefined") update();
		if (typeof draw !== "undefined") draw();

		// TODO: throttle loop speed to some framerate

		requestAnimationFrame(internalLoop);
	}

	/*** SETUP ***/
	VIS.install = function() {
		for (var name in VIS) {
			if (name.slice(0, 1) !== "_") {
				root[name] = VIS[name];
			}
		}
	};

	VIS.setCanvas = function(newCanvas) {
		canvas = newCanvas;
		ctx = canvas.getContext("2d");
	};

	VIS.getCanvas = function() {
		return canvas;
	};

	VIS.size = function(width, height) {
		VIS.width = width;
		canvas.setAttribute("width", width);
		root.width = width;
		VIS.height = height;
		canvas.setAttribute("height", height);
		root.height = height;
	};

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
		VIS.stroke = true;
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
		VIS.stroke = false;
	};

	VIS.fill = function(r, g, b) {
		if (arguments.length === 1) g = b = r;
		ctx.fillStyle = VIS.rgbToHex(r, g, b);
		VIS.fill = true;
	};

	VIS.noFill = function() {
		ctx.fillStyle = "";
		VIS.fill = false;
	};

	/*** SHAPE PRIMITIVES ***/
	VIS.line = function(x1, y1, x2, y2) {
		if (arguments.length === 2) x2 = y1.x, y2 = y1.y, y1 = x1.y, x1 = x1.x;
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		if (VIS.stroke) ctx.stroke();
	};

	VIS.rect = function(x, y, w, h) {
		if (VIS.stroke) ctx.strokeRect(x, y, w, h);
		if (VIS.fill) ctx.fillRect(x, y, w, h);
		else ctx.rect(x, y, w, h);
	};

	VIS.triangle = function(x1, y1, x2, y2, x3, y3) {
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.lineTo(x3, y3);
		ctx.lineTo(x1, y1);
		if (VIS.stroke) ctx.stroke();
		if (VIS.fill) ctx.fill();
	};

	VIS.circle = function(x, y, r) {
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.arc(x, y, r, 0, VIS.TWO_PI);
		if (VIS.stroke) ctx.stroke();
		if (VIS.fill) ctx.fill();
	};

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

		proto.draw = function() {
			ctx.beginPath();
			ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
			for (var i = 1, l = this.vertices.length; i < l; ++i) {
				ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
			};
			ctx.closePath();
			if (VIS.stroke) ctx.stroke();
			if (VIS.fill) ctx.fill();
		};

		return proto;
	})();


	/*** COLOR UTILITIES ***/
	VIS.rgbToHex = function(r, g, b) {
		r = r.toString(16), g = g.toString(16), b = b.toString(16);
		if (r.length < 2) r = "0" + r;
		if (g.length < 2) g = "0" + g;
		if (b.length < 2) b = "0" + b;
		return "#" + r + g + b;
	};

	/*** UTILITIES ***/
	VIS.random = function(low, high) {
		if (arguments.length === 0) return Math.random();
		else if (arguments.length === 1) high = low, low = 0;
		return Math.random() * (high - low) + low;
	};



})(this);