(function(root) {

	/*** INTERNALS ***/
	var VIS = {
		_version: "0.0.1",
		_installed: false,
		_isLooping: true,
		_stroke: false,
		_fill: false,
		width: 0,
		height: 0,
		mouseX: 0,
		mouseY: 0,
		PI: Math.PI,
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
		document.addEventListener("mousemove", setMousePos);
		if (typeof move !== "undefined") document.addEventListener("mousemove", move);

		// TODO: have this wait until all scripts have finished loading

		requestAnimationFrame(internalLoop);
	}

	function internalLoop() {
		if (VIS._isLooping) {
			if (typeof update !== "undefined") update();
			if (typeof draw !== "undefined") draw();			
		}

		// TODO: throttle loop speed to some framerate

		requestAnimationFrame(internalLoop);
	}

	function setMousePos(e) {
		VIS.mouseX = e.clientX;
		VIS.mouseY = e.clientY;
		if (VIS._installed) {
			root.mouseX = e.clientX;
			root.mouseY = e.clientY;
		}
	}

	/*** SETUP ***/
	VIS.install = function() {
		for (var name in VIS) {
			if (name.slice(0, 1) !== "_") {
				root[name] = VIS[name];
			}
		}
		VIS._installed = true;
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
		VIS.height = height;
		canvas.setAttribute("height", height);
		if (VIS._installed) {
			root.width = width;
			root.height = height;			
		}
	};

	VIS.loop = function() {
		VIS._isLooping = true;
	};

	VIS.noLoop = function() {
		VIS._isLooping = false;
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
		if (VIS._stroke) ctx.strokeRect(x, y, w, h);
		if (VIS._fill) ctx.fillRect(x, y, w, h);
		else ctx.rect(x, y, w, h);
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

	/*** PIXEL MANUPULATION ***/
	VIS.ImageData = function(x, y, w, h) {
		if (typeof x === "undefined") this.x = 0;
		if (typeof y === "undefined") this.y = 0;
		if (typeof w === "undefined") this.w = VIS.width;
		if (typeof h === "undefined") this.h = VIS.height;
		this.img = ctx.getImageData(this.x, this.y, this.w, this.h);
	};

	VIS.ImageData.newImage = function(width, height) {
		return ctx.createImageData(width, height);
	};

	VIS.ImageData.prototype = (function() {
		var api = {};

		api.getPx = function() {
			this.img = ctx.getImageData(this.x, this.y, this.w, this.h);
			return this.img.data;
		};

		api.newData = function(newData, x, y) {
			if (typeof x === "undefined") x = 0;
			if (typeof y === "undefined") y = 0;
			this.img = newData;
			this.x = x;
			this.y = y;
			this.w = newData.width;
			this.h = newData.height;
		};

		api.draw = function() {
			ctx.putImageData(this.img, this.x, this.y);
		};

		return api;
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

	// TODO: implement 2-d and 3-d perlin simplex noise function
	VIS.noise = function(x, y, z) {
		if (arguments.length === 2) return perlin2D(x, y);
		if (arguments.length === 3) return perlin3D(x, y, z);
	};

	function perlin2D(x, y) {

	}

	function perlin3D(x, y, z) {

	}

})(this);