/**
 * @preserve
 * VIS.js, a library for creative coding in the browser
 * Version 0.0.1
 * Written as a personal exercise in coding, to better understand good API construction and use,
 * to learn more about canvas and rendering, and to give me something to use for my own explorations.
 * Tons of inspiration (and actual code) taken from the following excellent libraries:
 * EaselJS: http://www.createjs.com/#!/EaselJS
 * Sketch.js: https://github.com/soulwire/sketch.js
 * Underscore: http://underscorejs.org/
 * Backbone: http://backbonejs.org/

 * Copyright (c) 2013 Mark Hintz

 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:

 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/*** CORE ***/
var VIS = function(canvas, options) {
	this.canvas = canvas || document.createElement("canvas");
	this.ctx = canvas.getContext("2d");
	VIS.extend(this, false, options || {}, defaultOpts, initialProps);
	VIS.bindAll(this, VIS.functions(this));

	if (options.augment || options.global) {
		for (var name in this) {
			if (name.slice(0, 1) !== "_") {
				(options.augment ? this.ctx : root)[name] = this[name];
			}
		}
	}
	return options.augment ? this.ctx : options.global ? root : this;
};

VIS.VERSION = "0.0.1";

var vp = VIS.prototype;

var defaultOpts = {
	augment: false,
	global: false,
	fullscreen: false,
	autostart: true,
	autoclear: false,
	autopause: true
};

var initialProps = {
	_installed: false,
	_isLooping: true,
	_stroke: false,
	_fill: false,
	width: 0,
	height: 0,
	mouseX: 0,
	mouseY: 0,
	keyPressed: null,
	touches: []
};

var constants = {
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