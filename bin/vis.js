(function() {
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
    var VIS = function(canvas, options) {
        options = options || {};
        this.setCanvas(canvas || document.createElement("canvas"));
        vp.extend(this, initialProps, defaultOpts, options);
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
        if (vp.isFunction(root.click)) this.canvas.addEventListener("click", root.click);
        if (vp.isFunction(root.mousedown)) this.canvas.addEventListener("mousedown", root.mousedown);
        if (vp.isFunction(root.mouseup)) this.canvas.addEventListener("mouseup", root.mouseup);
        if (vp.isFunction(root.move)) this.canvas.addEventListener("mousemove", root.move);
        if (vp.isFunction(root.key)) document.addEventListener("keydown", root.key);
        if (vp.isFunction(root.setup)) requestAnimationFrame(root.setup);
        if (vp.isFunction(root.update)) requestAnimationFrame(root.update);
        if (vp.isFunction(root.draw)) requestAnimationFrame(root.draw);
        requestAnimationFrame(this.internalLoop);
    };
    var vp = VIS.prototype;
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
    var PI = Math.PI, TWO_PI = 2 * PI;
    if (typeof define === "function" && define.amd) {
        define([], function() {
            return root.VIS = VIS;
        });
    } else if (typeof exports !== "undefined") {
        if (typeof module !== "undefined" && module.exports) {
            exports = module.exports = VIS;
        }
        exports.VIS = VIS;
    } else {
        root.VIS = VIS;
    }
    vp.internalLoop = function() {
        if (this._isLooping) {
            if (vp.isFunction(root.update)) root.update();
            if (vp.isFunction(root.draw)) root.draw();
        }
        requestAnimationFrame(this.internalLoop);
    };
    vp.setMousePos = function(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        if (this._installed) {
            root.mouseX = e.clientX;
            root.mouseY = e.clientY;
        }
    };
    vp.keyDown = function(e) {
        var code = !vp.isUndefined(e.keyCode) ? e.keyCode : e.charCode;
        var key = vp.keyDict[code] || String.fromCharCode(code);
        this.keyPressed = key;
        if (this._installed) {
            root.keyPressed = key;
        }
    };
    vp.keyUp = function() {
        this.keyPressed = null;
        if (this._installed) {
            root.keyPressed = null;
        }
    };
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
            if (typeof newCanvas === "string" && newCanvas.charAt(0) === "#") {
                this.canvas = document.getElementById(newCanvas.substr(1));
            } else {
                throw new Error("Argument passed to setCanvas must be either canvas or canvas ID. " + newCanvas.toString() + " passed instead.");
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
        var color;
        if (arguments.length === 1) {
            if (vp.isColor(r)) color = r; else if (typeof r === "number") color = vp.rgbToHex(r, r, r);
        } else {
            color = vp.rgbToHex(r, g, b);
        }
        if (this._stroke = !!color) this.ctx.strokeStyle = color;
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
        this.ctx.moveTo(x + r, y);
        this.ctx.lineTo(x + w - r, y);
        this.ctx.arcTo(x + w, y, x + w, y + r, r);
        this.ctx.lineTo(x + w, y + h - r);
        this.ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
        this.ctx.lineTo(x + r, y + h);
        this.ctx.arcTo(x, y + h, x, y + h - r, r);
        this.ctx.lineTo(x, y + r);
        this.ctx.arcTo(x, y, x + r, y, r);
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
        if (arguments.length === 1) this.vertices.push(x); else this.vertices.push(vp.Point(x, y));
    };
    Polygon.prototype.clear = function() {
        this.vertices = [];
    };
    Polygon.prototype.draw = function(open) {
        this._inst.ctx.beginPath();
        this._inst.ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
        for (var i = 1, l = this.vertices.length; i < l; ++i) {
            this._inst.ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
        }
        if (open !== "open") this._inst.ctx.closePath();
        if (this._inst._stroke) this._inst.ctx.stroke();
        if (this._inst._fill) this._inst.ctx.fill();
    };
    vp.random = function(low, high) {
        if (arguments.length === 0) return Math.random(); else if (arguments.length === 1) high = low, 
        low = 0;
        return Math.random() * (high - low) + low;
    };
    vp.noise = function(x, y, z) {
        if (arguments.length === 2) return perlin2D(x, y);
        if (arguments.length === 3) return perlin3D(x, y, z);
    };
    function perlin2D(x, y) {
        return noiseMaker.noise(x, y);
    }
    function perlin3D(x, y, z) {
        return noiseMaker.noise3d(x, y, z);
    }
    var noiseMaker = new SimplexNoise();
    function SimplexNoise(r) {
        if (r == undefined) r = Math;
        this.grad3 = [ [ 1, 1, 0 ], [ -1, 1, 0 ], [ 1, -1, 0 ], [ -1, -1, 0 ], [ 1, 0, 1 ], [ -1, 0, 1 ], [ 1, 0, -1 ], [ -1, 0, -1 ], [ 0, 1, 1 ], [ 0, -1, 1 ], [ 0, 1, -1 ], [ 0, -1, -1 ] ];
        this.p = [];
        for (var i = 0; i < 256; i++) {
            this.p[i] = Math.floor(r.random() * 256);
        }
        this.perm = [];
        for (var i = 0; i < 512; i++) {
            this.perm[i] = this.p[i & 255];
        }
        this.simplex = [ [ 0, 1, 2, 3 ], [ 0, 1, 3, 2 ], [ 0, 0, 0, 0 ], [ 0, 2, 3, 1 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 1, 2, 3, 0 ], [ 0, 2, 1, 3 ], [ 0, 0, 0, 0 ], [ 0, 3, 1, 2 ], [ 0, 3, 2, 1 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 1, 3, 2, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 1, 2, 0, 3 ], [ 0, 0, 0, 0 ], [ 1, 3, 0, 2 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 2, 3, 0, 1 ], [ 2, 3, 1, 0 ], [ 1, 0, 2, 3 ], [ 1, 0, 3, 2 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 2, 0, 3, 1 ], [ 0, 0, 0, 0 ], [ 2, 1, 3, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 2, 0, 1, 3 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 3, 0, 1, 2 ], [ 3, 0, 2, 1 ], [ 0, 0, 0, 0 ], [ 3, 1, 2, 0 ], [ 2, 1, 0, 3 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 3, 1, 0, 2 ], [ 0, 0, 0, 0 ], [ 3, 2, 0, 1 ], [ 3, 2, 1, 0 ] ];
    }
    SimplexNoise.prototype.dot = function(g, x, y) {
        return g[0] * x + g[1] * y;
    };
    SimplexNoise.prototype.noise = function(xin, yin) {
        var n0, n1, n2;
        var F2 = .5 * (Math.sqrt(3) - 1);
        var s = (xin + yin) * F2;
        var i = Math.floor(xin + s);
        var j = Math.floor(yin + s);
        var G2 = (3 - Math.sqrt(3)) / 6;
        var t = (i + j) * G2;
        var X0 = i - t;
        var Y0 = j - t;
        var x0 = xin - X0;
        var y0 = yin - Y0;
        var i1, j1;
        if (x0 > y0) {
            i1 = 1;
            j1 = 0;
        } else {
            i1 = 0;
            j1 = 1;
        }
        var x1 = x0 - i1 + G2;
        var y1 = y0 - j1 + G2;
        var x2 = x0 - 1 + 2 * G2;
        var y2 = y0 - 1 + 2 * G2;
        var ii = i & 255;
        var jj = j & 255;
        var gi0 = this.perm[ii + this.perm[jj]] % 12;
        var gi1 = this.perm[ii + i1 + this.perm[jj + j1]] % 12;
        var gi2 = this.perm[ii + 1 + this.perm[jj + 1]] % 12;
        var t0 = .5 - x0 * x0 - y0 * y0;
        if (t0 < 0) n0 = 0; else {
            t0 *= t0;
            n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0);
        }
        var t1 = .5 - x1 * x1 - y1 * y1;
        if (t1 < 0) n1 = 0; else {
            t1 *= t1;
            n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1);
        }
        var t2 = .5 - x2 * x2 - y2 * y2;
        if (t2 < 0) n2 = 0; else {
            t2 *= t2;
            n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2);
        }
        return 70 * (n0 + n1 + n2);
    };
    SimplexNoise.prototype.noise3d = function(xin, yin, zin) {
        var n0, n1, n2, n3;
        var F3 = 1 / 3;
        var s = (xin + yin + zin) * F3;
        var i = Math.floor(xin + s);
        var j = Math.floor(yin + s);
        var k = Math.floor(zin + s);
        var G3 = 1 / 6;
        var t = (i + j + k) * G3;
        var X0 = i - t;
        var Y0 = j - t;
        var Z0 = k - t;
        var x0 = xin - X0;
        var y0 = yin - Y0;
        var z0 = zin - Z0;
        var i1, j1, k1;
        var i2, j2, k2;
        if (x0 >= y0) {
            if (y0 >= z0) {
                i1 = 1;
                j1 = 0;
                k1 = 0;
                i2 = 1;
                j2 = 1;
                k2 = 0;
            } else if (x0 >= z0) {
                i1 = 1;
                j1 = 0;
                k1 = 0;
                i2 = 1;
                j2 = 0;
                k2 = 1;
            } else {
                i1 = 0;
                j1 = 0;
                k1 = 1;
                i2 = 1;
                j2 = 0;
                k2 = 1;
            }
        } else {
            if (y0 < z0) {
                i1 = 0;
                j1 = 0;
                k1 = 1;
                i2 = 0;
                j2 = 1;
                k2 = 1;
            } else if (x0 < z0) {
                i1 = 0;
                j1 = 1;
                k1 = 0;
                i2 = 0;
                j2 = 1;
                k2 = 1;
            } else {
                i1 = 0;
                j1 = 1;
                k1 = 0;
                i2 = 1;
                j2 = 1;
                k2 = 0;
            }
        }
        var x1 = x0 - i1 + G3;
        var y1 = y0 - j1 + G3;
        var z1 = z0 - k1 + G3;
        var x2 = x0 - i2 + 2 * G3;
        var y2 = y0 - j2 + 2 * G3;
        var z2 = z0 - k2 + 2 * G3;
        var x3 = x0 - 1 + 3 * G3;
        var y3 = y0 - 1 + 3 * G3;
        var z3 = z0 - 1 + 3 * G3;
        var ii = i & 255;
        var jj = j & 255;
        var kk = k & 255;
        var gi0 = this.perm[ii + this.perm[jj + this.perm[kk]]] % 12;
        var gi1 = this.perm[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]] % 12;
        var gi2 = this.perm[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]] % 12;
        var gi3 = this.perm[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]] % 12;
        var t0 = .6 - x0 * x0 - y0 * y0 - z0 * z0;
        if (t0 < 0) n0 = 0; else {
            t0 *= t0;
            n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0, z0);
        }
        var t1 = .6 - x1 * x1 - y1 * y1 - z1 * z1;
        if (t1 < 0) n1 = 0; else {
            t1 *= t1;
            n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1, z1);
        }
        var t2 = .6 - x2 * x2 - y2 * y2 - z2 * z2;
        if (t2 < 0) n2 = 0; else {
            t2 *= t2;
            n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2, z2);
        }
        var t3 = .6 - x3 * x3 - y3 * y3 - z3 * z3;
        if (t3 < 0) n3 = 0; else {
            t3 *= t3;
            n3 = t3 * t3 * this.dot(this.grad3[gi3], x3, y3, z3);
        }
        return 32 * (n0 + n1 + n2 + n3);
    };
    vp.slice = Function.prototype.call.bind(Array.prototype.slice);
    vp.bindAll = function(context) {
        var funcs = vp.isArray(arguments[1]) ? arguments[1] : vp.slice(arguments, 1), i = funcs.length, f;
        while (i--) {
            f = funcs[i];
            context[f] = context[f].bind(context);
        }
        return context;
    };
    vp.isArray = function(candidate) {
        return Object.prototype.toString.call(candidate) === "[object Array]";
    };
    vp.isObject = function(candidate) {
        return candidate === Object(candidate);
    };
    vp.isFunction = function(candidate) {
        return typeof candidate === "function";
    };
    vp.isUndefined = function(candidate) {
        return candidate === void 0;
    };
    vp.extend = function(obj) {
        var ext, i, l, p;
        for (i = 1, l = arguments.length; i < l; ++i) {
            ext = arguments[i];
            if (ext) {
                for (p in ext) {
                    if (ext.hasOwnProperty(p)) obj[p] = ext[p];
                }
            }
        }
        return obj;
    };
    vp.functions = function(obj) {
        var funcs = [];
        for (var key in obj) {
            if (vp.isFunction(obj[key])) funcs.push(key);
        }
        return funcs.sort();
    };
    (function() {
        var usefulMath = "PI abs acos asin atan atan2 ceil cos floor max min pow round sin sqrt tan".split(" "), prop;
        while (prop = usefulMath.pop()) {
            vp[prop] = Math[prop];
        }
    })();
    vp.lerp = function(low, high, amount) {
        return low + amount * (high - low);
    };
    vp.project = function(v, domLo, domHi, rngLo, rngHi) {
        var t = (v - domLo) / (domHi - domLo);
        return vp.lerp(rngLo, rngHi, t);
    };
    vp.clamp = function(x, bot, top) {
        x = Math.min(top, Math.max(bot, parseFloat(x)));
        if (Math.abs(x - top) < 1e-6) return top; else if (Math.abs(x - bot) < 1e-6) return bot; else return x;
    };
    vp.isColor = function(str) {
        if (typeof str !== "string") return false;
        if (str[0] === "#" && (str.length === 4 || str.length === 7)) return true;
        var split = str.split(new RegExp("\\(|,|\\)"));
        if (split[0].slice(0, 3) === "rgb" && parseInt(split[1]) && parseInt(split[2]) && parseInt(split[3])) return true;
        return false;
    };
    vp.rgbToHex = function(r, g, b) {
        r = r.toString(16), g = g.toString(16), b = b.toString(16);
        if (r.length < 2) r = "0" + r;
        if (g.length < 2) g = "0" + g;
        if (b.length < 2) b = "0" + b;
        return "#" + r + g + b;
    };
    vp.rgbToHsv = function(r, g, b) {
        r = vp.clamp(r, 0, 255) / 255;
        g = vp.clamp(g, 0, 255) / 255;
        b = vp.clamp(b, 0, 255) / 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, v = max;
        var d = max - min;
        s = max === 0 ? 0 : d / max;
        if (max == min) {
            h = 0;
        } else {
            switch (max) {
              case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;

              case g:
                h = (b - r) / d + 2;
                break;

              case b:
                h = (r - g) / d + 4;
                break;
            }
            h /= 6;
        }
        return {
            h: h,
            s: s,
            v: v
        };
    };
    vp.hexToRgb = function(hex) {
        if (hex.length === 4) {
            return {
                r: parseInt(hex.substr(1, 1), 16),
                g: parseInt(hex.substr(2, 1), 16),
                b: parseInt(hex.substr(3, 1), 16)
            };
        } else {
            return {
                r: parseInt(hex.substr(1, 2), 16),
                g: parseInt(hex.substr(3, 2), 16),
                b: parseInt(hex.substr(5, 2), 16)
            };
        }
    };
    vp.hexToHsv = function(hex) {
        return vp.rgbToHsv(vp.hexToRgb(hex));
    };
    vp.hsvToRgb = function(h, s, v) {
        h = vp.clamp(h, 360) / 360 * 6;
        s = vp.clamp(s, 100) / 100;
        v = vp.clamp(v, 100) / 100;
        var i = Math.floor(h), f = h - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s), mod = i % 6, r = [ v, q, p, p, t, v ][mod], g = [ t, v, v, q, p, p ][mod], b = [ p, p, t, v, v, q ][mod];
        return {
            r: r * 255,
            g: g * 255,
            b: b * 255
        };
    };
    function RawPixels(instance, x, y, w, h) {
        this._inst = instance;
        if (typeof x === "undefined") this.x = 0;
        if (typeof y === "undefined") this.y = 0;
        if (typeof w === "undefined") this.w = this._inst.width;
        if (typeof h === "undefined") this.h = this._inst.height;
        this.img = this._inst.ctx.getImageData(this.x, this.y, this.w, this.h);
    }
    vp.RawPixels = function(x, y, w, h) {
        return new RawPixels(this, x, y, w, h);
    };
    vp.NewImage = function(width, height) {
        if (vp.isUndefined(width)) width = this.width;
        if (vp.isUndefined(height)) height = this.height;
        return this.ctx.createImageData(width, height);
    };
    RawPixels.prototype.getImg = function() {
        this.img = this._inst.ctx.getImageData(this.x, this.y, this.w, this.h);
        return this.img;
    };
    RawPixels.prototype.setImg = function(newImg, x, y) {
        if (typeof x === "undefined") x = 0;
        if (typeof y === "undefined") y = 0;
        this.img = newImg;
        this.x = x;
        this.y = y;
        this.w = newImg.width;
        this.h = newImg.height;
        this._inst.ctx.putImageData(this.img, this.x, this.y);
    };
    RawPixels.prototype.getPx = function() {
        this.img = this._inst.ctx.getImageData(this.x, this.y, this.w, this.h);
        return this.img.data;
    };
    RawPixels.prototype.setPx = function(newPx) {
        this.img.data = newPx;
        this._inst.ctx.putImageData(this.img, this.x, this.y);
    };
    RawPixels.prototype.draw = function() {
        this._inst.ctx.putImageData(this.img, this.x, this.y);
    };
    function Events() {
        this._handlers = {};
    }
    VIS.Events = function() {
        return new Events();
    };
    Events.prototype.on = function(name, response, context) {
        var list = this._handlers[name] || (this._handlers[name] = []);
        var i = list.length;
        while (i--) if (list[i].fn === response) return false;
        list.push({
            fn: response,
            cx: context || this
        });
        return true;
    };
    Events.prototype.once = function(name, response, context) {
        var self = this;
        var once = function() {
            self.off(name, once);
            response.apply(this, arguments);
        };
        this.on(name, once, context);
        return true;
    };
    Events.prototype.trigger = function(name) {
        var list = this._handlers[name];
        if (list) {
            var args = vp.slice.call(arguments, 1), info, i = -1, l = list.length;
            while (++i < l) (info = list[i]).fn.apply(info.cx, args);
        }
        return true;
    };
    Events.prototype.off = function(name, response) {
        if (!response) {
            return delete this._handlers[name];
        }
        var list = this._handlers[name];
        if (list) {
            var i = list.length;
            while (i--) {
                if (list[i].fn === response) list.splice(i, 1);
            }
            return true;
        }
    };
})();