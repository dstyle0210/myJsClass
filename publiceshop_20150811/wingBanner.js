/**
 * 윙베너 하단 버블베너 영역 UI구현
 * 
 */
var wingBannerIndex = 0; // 생성인자에 따라 ID가 늘어남.
function wingBannerClass(opt){
	wingBannerIndex++;
	this.o = $.extend({
		top:"-999", // 버블베너 상단(초기)
		left:"-9999", // 버블베너 좌측(초기)
		sTop:"-999", // 버블베너 상단(초기)
		sLeft:"-9999", // 버블베너 좌측(초기)
		oid:"wingBig"+wingBannerIndex,
		closeTime:5000
	},opt);
	this.init();
};
wingBannerClass.prototype.init = function(){ // 초기에 생성 (가로세로 값 잡아내는 용도)
	var o = this.o;
	var This = this;
	this.makeDom();
	setTimeout(function(){
		o.wid = $("#"+o.oid).width();
		o.hei = $("#"+o.oid).height();
	},200);
	$.extend(o,this.o);
};
wingBannerClass.prototype.getOffset = function(){ // 띄울때 top 및 left 값 가져오기
	var o = this.o;
	$.extend(o,$("#wingBannerSec").offset());
	o.top = o.top - o.hei + 157; // 최종 베너상단위치
	o.left = o.left - o.wid - 30; // 최종 베너좌측위치
	o.sTop = o.top + 80; // 시작 베너상단위치
	o.sLeft = o.left + 20; // 시작 베너좌측위치
	$.extend(o,this.o);
};
wingBannerClass.prototype.makeDom = function(){
	var o = this.o;
	var str = '<div class="wingBig" id="'+o.oid+'" style="top:'+o.sTop+'px;left:'+o.sLeft+'px">'+
				'<a href="'+o.link+'"><img src="'+o.big+'" alt="" /></a>'+
				'<div class="closeBtn">'+
					'<a href="#" onclick="wingBanner.close();return false;"><img src="/images/common/btn/btnWingBig.png" alt="닫기" /></a>'+
				'</div>'+
			'</div>';
	$("body").append(str);
};
wingBannerClass.prototype.open = function(type){ // 베너 오픈.
	var o = this.o;
	var This = this;
	this.getOffset(); // offset 구하기.
	this.remove();
	this.makeDom();
	$("#"+o.oid).delay(300).animate({
		"top":o.top,
		"left":o.left,
		"opacity":1
	});
	
	if(type){
		setTimeout(function(){
			This.close();
		},o.closeTime);
	};
};
wingBannerClass.prototype.close = function(){
	var o = this.o;
	var This = this;
	$("#"+o.oid).delay(300).animate({
		"top":o.sTop,
		"left":o.sLeft,
		"opacity":0
	},function(){
		This.remove();
	});
};
wingBannerClass.prototype.remove = function(){
	var o = this.o;
	console.log(o.oid);
	$("#"+o.oid).remove();
};