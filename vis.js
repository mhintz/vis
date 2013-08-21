(function(root) {

	var VIS = {
		version: "0.0.1",
		width: 0,
		height: 0,
		installed: false
	};

	// TODO: add support for node? windowed mode?
	// see https://github.com/rogerwang/node-webkit for probable way to do this

	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");

	internalSetup();

	function internalSetup() {
		if (typeof setup !== "undefined") setup();

		// TODO: have this wait until all scripts have finished loading

		requestAnimationFrame(internalLoop);
	}

	function internalLoop() {
		if (typeof update !== "undefined") update();
		else VIS.update();
		if (typeof draw !== "undefined") draw();
		else VIS.draw();

		// TODO: throttle loop speed to some framerate

		requestAnimationFrame(internalLoop);
	}

	VIS.install = function() {
		for (var name in VIS) {
			if (typeof VIS[name] === "function") {
				root[name] = VIS[name];
			}
		}
		VIS.installed = true;
	};

	VIS.update = function() {};

	VIS.draw = function() {};

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
	};

	VIS.background = function(r, g, b) {
		if (arguments.length === 1) g = b = r;
		ctx.fillStyle = VIS.rgbToHex(r, g, b);
		ctx.fillRect(0, 0, VIS.width, VIS.height);
		ctx.fillStyle = "";
	};

	VIS.fill = function(r, g, b) {
		if (arguments.length === 1) g = b = r;
		ctx.fillStyle = VIS.rgbToHex(r, g, b);
	};

	VIS.noFill = function() {
		ctx.fillStyle = "";
	};

	VIS.rect = function(x, y, w, h) {
		if (ctx.fillStyle) {
			ctx.fillRect(x, y, w, h);
		} else {
			ctx.rect(x, y, w, h);
		}
	};

	VIS.rgbToHex = function(r, g, b) {
		r = r.toString(16), g = g.toString(16), b = b.toString(16);
		if (r.length < 2) r = "0" + r;
		if (g.length < 2) g = "0" + g;
		if (b.length < 2) b = "0" + b;
		return "#" + r + g + b;
	};

	root.VIS = VIS;

})(this);