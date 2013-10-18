(function() {
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
        if (typeof root.update !== "undefined") root.update();
        if (typeof root.draw !== "undefined") root.draw();
        requestAnimationFrame(internalLoop);
    }
    function internalLoop() {
        if (VIS._isLooping) {
            if (typeof root.update !== "undefined") root.update();
            if (typeof root.draw !== "undefined") root.draw();
        }
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
            if (typeof newCanvas === "string" && newCanvas.charAt(0) === "#") {
                canvas = document.getElementById(newCanvas.substr(1));
            } else {
                throw new Error("Argument passed to setCanvas must be either canvas or canvas ID. " + newCanvas.toString() + " passed instead.");
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
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.arcTo(x + w, y, x + w, y + r, r);
        ctx.lineTo(x + w, y + h - r);
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
        ctx.lineTo(x + r, y + h);
        ctx.arcTo(x, y + h, x, y + h - r, r);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
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
    VIS.random = function(low, high) {
        if (arguments.length === 0) return Math.random(); else if (arguments.length === 1) high = low, 
        low = 0;
        return Math.random() * (high - low) + low;
    };
    VIS.noise = function(x, y, z) {
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
    VIS.Point = function(x, y) {
        this.x = x;
        this.y = y;
    };
    VIS.Point.prototype = function() {
        var proto = {};
        proto.reset = function(x, y) {
            this.x = x;
            this.y = y;
        };
        return proto;
    }();
    VIS.Vec2D = function(x, y) {
        this.x = x;
        this.y = y;
    };
    VIS.Vec2D.prototype = function() {
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
    }();
    VIS.Particle = function(loc, vel, acc) {
        this.loc = loc;
        this.vel = vel;
        this.acc = acc;
    };
    VIS.Particle.prototype = function() {
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
    }();
    VIS.Triangle = function(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    };
    VIS.Triangle.prototype = function() {
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
    }();
    VIS.Polygon = function() {
        this.vertices = [];
    };
    VIS.Polygon.prototype = function() {
        var proto = {};
        proto.vertex = function(x, y) {
            if (arguments.length === 1) this.vertices.push(x); else this.vertices.push(new Point(x, y));
        };
        proto.clear = function() {
            this.vertices = [];
        };
        proto.draw = function(open) {
            ctx.beginPath();
            ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
            for (var i = 1, l = this.vertices.length; i < l; ++i) {
                ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
            }
            if (open !== "open") ctx.closePath();
            if (VIS._stroke) ctx.stroke();
            if (VIS._fill) ctx.fill();
        };
        return proto;
    }();
    VIS.RawPixels = function(x, y, w, h) {
        if (typeof x === "undefined") this.x = 0;
        if (typeof y === "undefined") this.y = 0;
        if (typeof w === "undefined") this.w = VIS.width;
        if (typeof h === "undefined") this.h = VIS.height;
        this.img = ctx.getImageData(this.x, this.y, this.w, this.h);
    };
    VIS.RawPixels.newImage = function(width, height) {
        if (typeof width === "undefined") width = VIS.width;
        if (typeof height === "undefined") height = VIS.height;
        return ctx.createImageData(width, height);
    };
    VIS.RawPixels.prototype = function() {
        var api = {};
        api.getImg = function() {
            this.img = ctx.getImageData(this.x, this.y, this.w, this.h);
            return this.img;
        };
        api.setImg = function(newImg, x, y) {
            if (typeof x === "undefined") x = 0;
            if (typeof y === "undefined") y = 0;
            this.img = newImg;
            this.x = x;
            this.y = y;
            this.w = newImg.width;
            this.h = newImg.height;
            ctx.putImageData(this.img, this.x, this.y);
        };
        api.getPx = function() {
            this.img = ctx.getImageData(this.x, this.y, this.w, this.h);
            return this.img.data;
        };
        api.setPx = function(newPx) {
            this.img.data = newPx;
            ctx.putImageData(this.img, this.x, this.y);
        };
        api.draw = function() {
            ctx.putImageData(this.img, this.x, this.y);
        };
        return api;
    }();
    VIS.clamp = function(x, bot, top) {
        x = Math.min(top, Math.max(bot, parseFloat(x)));
        if (Math.abs(x - top) < 1e-6) return top; else if (Math.abs(x - bot) < 1e-6) return bot; else return x;
    };
    VIS.rgbToHex = function(r, g, b) {
        r = r.toString(16), g = g.toString(16), b = b.toString(16);
        if (r.length < 2) r = "0" + r;
        if (g.length < 2) g = "0" + g;
        if (b.length < 2) b = "0" + b;
        return "#" + r + g + b;
    };
    VIS.rgbToHsv = function(r, g, b) {
        r = VIS.clamp(r, 0, 255) / 255;
        g = VIS.clamp(g, 0, 255) / 255;
        b = VIS.clamp(b, 0, 255) / 255;
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
    VIS.hexToRgb = function(hex) {
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
    VIS.hexToHsv = function(hex) {
        return VIS.rgbToHsv(VIS.hexToRgb(hex));
    };
    VIS.hsvToRgb = function(h, s, v) {
        h = VIS.clamp(h, 360) / 360 * 6;
        s = VIS.clamp(s, 100) / 100;
        v = VIS.clamp(v, 100) / 100;
        var i = Math.floor(h), f = h - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s), mod = i % 6, r = [ v, q, p, p, t, v ][mod], g = [ t, v, v, q, p, p ][mod], b = [ p, p, t, v, v, q ][mod];
        return {
            r: r * 255,
            g: g * 255,
            b: b * 255
        };
    };
})();