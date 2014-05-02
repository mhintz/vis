/**
 * @preserve
 * VIS.js, a library for creative coding in the browser
 * Version 0.1.0
 * Written as a personal exercise in coding, to better understand good API construction and use,
 * to learn more about canvas and rendering, and to give me something to use for my own explorations.
 * Tons of inspiration (and actual code) taken from the following excellent libraries:
 * EaselJS: http://www.createjs.com/#!/EaselJS
 * Sketch.js: https://github.com/soulwire/sketch.js
 * Underscore: http://underscorejs.org/
 * Backbone: http://backbonejs.org/
 * Tons of inspiration for method ideas comes from the Processing project:
 * http://processing.org/

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

// VIS object constructor.
// Binds all prototype methods to the new object
// optionally makes all properties of VIS globals (for processing sketch-style apps)
var VIS = function(canvas, options) {
	options = options || {};
	this.setCanvas(canvas || document.createElement("canvas"));
	vp.extend(this, false, options, defaultOpts, initialProps);
	vp.bindAll(this, vp.functions(this));

	if (options.augment || options.global) {
		for (var name in this) {
			if (name.slice(0, 1) !== "_") {
				(options.augment ? this.ctx : root)[name] = this[name];
			}
		}
	}
	this._installed = !!options.global;

	this.canvas.addEventListener("mousemove", this.setMousePos);
	document.addEventListener("keydown", this.keyDown);
	document.addEventListener("keyup", this.keyUp);
	// sugar for user-defined event handlers
	if (vp.isFunction(root.click)) this.canvas.addEventListener("click", root.click);
	if (vp.isFunction(root.mousedown)) this.canvas.addEventListener("mousedown", root.mousedown);
	if (vp.isFunction(root.mouseup)) this.canvas.addEventListener("mouseup", root.mouseup);
	if (vp.isFunction(root.move)) this.canvas.addEventListener("mousemove", root.move);
	if (vp.isFunction(root.key)) document.addEventListener("keydown", root.key);
	// sugar for user-defined setup/update/draw loop
	if (vp.isFunction(root.setup)) requestAnimationFrame(root.setup);
	// run these at least once
	if (vp.isFunction(root.update)) requestAnimationFrame(root.update);
	if (vp.isFunction(root.draw)) requestAnimationFrame(root.draw);	

	// TODO: create Ticker, based on EaselJS, which has a framerate setter and which can be listened to
	// TODO: include RAF polyfill
	// TODO: throttle loop speed to some framerate

	requestAnimationFrame(this.internalLoop);
};

// helper variables
var vp = VIS.prototype;
// root object
var root = this;

VIS.VERSION = "0.1.0";

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

// constants
var PI = Math.PI,
	TWO_PI = 2 * PI;

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

vp.internalLoop = function() {
	if (this._isLooping) {
		if (vp.isFunction(root.update)) root.update();
		if (vp.isFunction(root.draw)) root.draw();
	}

	requestAnimationFrame(this.internalLoop);
}

vp.setMousePos = function(e) {
	this.mouseX = e.clientX;
	this.mouseY = e.clientY;
	if (this._installed) {
		root.mouseX = e.clientX;
		root.mouseY = e.clientY;
	}
}

vp.keyDown = function(e) {
	var code = !vp.isUndefined(e.keyCode) ? e.keyCode : e.charCode;
	var key = vp.keyDict[code] || String.fromCharCode(code);
	this.keyPressed = key;
	if (this._installed) {
		root.keyPressed = key;
	}
}

vp.keyUp = function() {
	this.keyPressed = null;
	if (this._installed) {
		root.keyPressed = null;
	}
}

/*** SETUP ***/
vp.install = function() {
	for (var name in this) {
		if (name.slice(0, 1) !== "_") {
			root[name] = this[name];
		}
	}
	this._installed = true;
};

vp.isInstalled = function() {
	return this._installed;
};

vp.setCanvas = function(newCanvas) {
	if (!newCanvas.getContext) {
		if (typeof newCanvas === "string" && newCanvas.charAt(0) === "#")  {
			this.canvas = document.getElementById(newCanvas.substr(1));
		} else {
			throw new Error("Argument passed to setCanvas must be either canvas or canvas ID. "+newCanvas.toString()+" passed instead.");
		}
	} else {
		this.canvas = newCanvas;
	}
	this.ctx = this.canvas.getContext("2d");
};

vp.getCanvas = function() {
	return this.canvas;
};

vp.size = function(width, height) {
	this.width = width;
	this.canvas.setAttribute("width", width);
	this.height = height;
	this.canvas.setAttribute("height", height);
	if (this._installed) {
		root.width = width;
		root.height = height;			
	}
};

vp.loop = function() {
	this._isLooping = true;
};

vp.noLoop = function() {
	this._isLooping = false;
};

/*** keyCode dict ***/
vp.keyDict = {
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