/*** PIXEL MANUPULATION ***/
function RawPixels(instance, x, y, w, h) {
	this._inst = instance;
	if (typeof x === "undefined") this.x = 0;
	if (typeof y === "undefined") this.y = 0;
	if (typeof w === "undefined") this.w = this._inst.width;
	if (typeof h === "undefined") this.h = this._inst.height;
	this.img = this._inst.ctx.getImageData(this.x, this.y, this.w, this.h);
};

vp.RawPixels = function(x, y, w, h) {
	return new RawPixels(this, x, y, w, h);
};

vp.NewImage = function(width, height) {
	if (vp.isUndefined(width)) width = this._inst.width;
	if (vp.isUndefined(height)) height = this._inst.height;
	return this._inst.ctx.createImageData(width, height);
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
