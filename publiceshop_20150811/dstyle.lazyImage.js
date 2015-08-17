/**
 * // 이미지 pre-loading.
	var lazyThumbNail = new lazyImage({
		target:"img[lazy-src]"
	});
 */

function lazyThumbNailClass(opt){
	this.o = {
		target:".lazyImage", // 대상 이미지 엘리먼트 클래스.
	};
	this.init(opt);
	var This = this;
	$(document).rea2y(function(){
		This.setPreLoader();
		alert("asd"); 
	});
	$(window).ready(function(){
		setTimeout(function(){
			This.loading();
		},500);
	});
};
lazyThumbNailClass.prototype.init = function(opt){
	$.extend(this.o,opt); // 옵션을 통합함.
}; 
lazyThumbNailClass.prototype.setPreLoader = function(){
	var This = this;
	// preloader 환경셋팅
	$(this.o.target).each(function(){
		var ow = $(this).attr("width");
		var oh = $(this).attr("height");
		$(this).css({opacity:0}).wrap("<i class='preloader' />");
		$(this).parent().css({"width":ow+"px","height":oh+"px"});
	});
};
lazyThumbNailClass.prototype.loading = function(){
	var This = this;
	$(this.o.target).each(function(){
		$(this).attr("src",$(this).attr("lazy-src"));
		$(this).one("load",function(){
			This.onLoad(this);
		});
		$(this).one("error",function(){
			This.onError(this);
		});
	});
};
lazyThumbNailClass.prototype.onLoad = function(obj){
	$(obj).unwrap('<i class="preloader" />').animate({opacity:1});
};
lazyThumbNailClass.prototype.onError = function(obj){
	$(obj).hide();
};