/*** INTERNALS ***/
var VIS = {
	VERSION: "0.0.1",
	_installed: false,
	_isLooping: true,
	_stroke: false,
	_fill: false,
	width: 0,
	height: 0,
	mouseX: 0,
	mouseY: 0,
	keyPressed: null,
	PI: Math.PI,
	TWO_PI: 2 * Math.PI
};

var root = this;

// umd module definition code taken from https://github.com/umdjs/umd/blob/master/returnExportsGlobal.js
if (typeof define === 'function' && define.amd) {
    define([], function () {
        return (root.VIS = VIS);
    });
} else if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
		exports = module.exports = VIS;
    }
    exports.VIS = VIS;
} else {
    root.VIS = VIS;
}

// TODO: figure out whether this works in node
// see https://github.com/learnboost/node-canvas
// see also https://github.com/rogerwang/node-webkit

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

if (typeof root.onload !== "undefined") {
	var _load = root.onload;
	root.onload = function() {
		if (typeof _load === "function") _load();
		internalSetup();
	};
} else {
	internalSetup();
}

function internalSetup() {
	if (typeof root.click !== "undefined") document.addEventListener("click", root.click);
	document.addEventListener("mousemove", setMousePos);
	if (typeof root.move !== "undefined") document.addEventListener("mousemove", root.move);
	document.addEventListener("keydown", keyDown);
	document.addEventListener("keyup", keyUp);
	if (typeof root.key !== "undefined") document.addEventListener("keydown", root.key);
	if (typeof root.setup !== "undefined") root.setup();
	// run these at least once
	if (typeof root.update !== "undefined") root.update();
	if (typeof root.draw !== "undefined") root.draw();	

	// TODO: create Ticker, based on EaselJS, which has a framerate setter and which can be listened to

	requestAnimationFrame(internalLoop);
}

function internalLoop() {
	if (VIS._isLooping) {
		if (typeof root.update !== "undefined") root.update();
		if (typeof root.draw !== "undefined") root.draw();			
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

function keyDown(e) {
	var code = typeof e.keyCode !== "undefined" ? e.keyCode : e.charCode;
	var key = VIS.keyDict[code] || code;
	VIS.keyPressed = key;
	if (VIS._installed) {
		root.keyPressed = key;
	}
}

function keyUp(e) {
	VIS.keyPressed = null;
	if (VIS._installed) {
		root.keyPressed = null;
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

VIS.isInstalled = function() {
	return VIS._installed;
};

VIS.setCanvas = function(newCanvas) {
	if (!newCanvas.getContext) {
		if (typeof newCanvas === "string" && newCanvas.charAt(0) === "#")  {
			canvas = document.getElementById(newCanvas.substr(1));
		} else {
			throw new Error("Argument passed to setCanvas must be either canvas or canvas ID. "+newCanvas.toString()+" passed instead.");
		}
	} else {
		canvas = newCanvas;
	}
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

/*** keyCode dict ***/
VIS.keyDict = {
	8: "backspace",
	9: "tab",
	13: "return",
	16: "shift",
	17: "control",
	18: "alt",
	27: "escape",
	32: "space",
	33: "pageup",
	34: "pagedown",
	37: "left",
	38: "up",
	39: "right",
	40: "down",
	46: "delete",
	87: "w",
	65: "a",
	83: "s",
	68: "d"
};