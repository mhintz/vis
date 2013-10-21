/*** PIXEL MANUPULATION ***/
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

VIS.RawPixels.prototype = (function() {
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
})();