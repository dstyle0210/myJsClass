/**
 * 메인초기 진입시 발생하는 팝업.
 * require : src/com/js/lib/jquery.js , src/com/js/commonG.js
 * fn.open(idx) : 팝업 오픈 , idx가 없을경우에는 모든 팝업을 띄움. (있을경우 해당하는 팝업만 발생)
 * fn.close(idx,bool) : 팝업강제종료(닫기) , idx가 없을경우 모든 팝업을 닫음, bool : true일 경우 쿠키도 함께 삭제함(다시 팝업이 발생함 , null일경우 상태유지)
 */
function mainPopupBannerClass(opt){
	if(opt.length<1) return;
	// 데이터 받기 시작.
	this.arr = []; // 실제 사용할 데이터 => 쿠키상으로 오늘하루안보는걸로 되어있다면 저장되지 않음.
	this.optArr = []; // 닫기를 위해서 만든 데이터 => 전달될 데이터 그대로 저장함.
	this.init(opt);
};
// 데이터 셋팅
mainPopupBannerClass.prototype.init = function(opt){
	var This = this;
	this.optArr = opt;
	// this.arr 데이터 정제.
	$(opt).each(function(i,item){
		if(!commonJs.getCookie(item.pid+"cookie")){
			This.arr.push(opt[i]);
		};
	});
	// 좌측위치 정제 및 삽입.
	$(This.arr).each(function(i){
		var left = 0;
		for(k=i;0<k;--k){
			left = left + This.arr[k-1].width + 10;
		};
		This.arr[i].left = left;
		This.arr[i].top = 0;
	});
};
// 팝업만드는 함수.
mainPopupBannerClass.prototype.makePopup = function(hash,idx){
	var hash = hash;
	this.arr[idx].popup = window.open("",hash.pid,"width="+(hash.width-10)+",height="+(hash.height+25)+",top="+hash.top+",left="+hash.left+"");
	var str = "" +
	"<link rel='stylesheet' href='/com/css/public.css' />"+
	"<style>" +
	"*{margin:0;padding:0;list-style:none;}" +
	"body{background:#ed193a;width:100%;height:100%;overflow:hidden;}"+
	"div{padding:3px 10px;text-align:right;}"+
	"div *{vertical-align:middle;}" +
	"div label{margin-left:5px;color:#fff}"+
	"</style>";
	if(hash.url==""){
		str += "<img src='"+hash.img+"' />";
	}else{
		str += "<a href='"+hash.url+"' onclick='window.opener.location=this.href;self.close();'><img src='"+hash.img+"' /></a>";
	};
	str += "<div>" +
		"<input type='checkbox' onclick='opener.mainPopupBannerClassSetCookie(\""+hash.pid+"cookie\");self.close();' />" +
		"<label onclick='opener.mainPopupBannerClassSetCookie(\""+hash.pid+"cookie\");self.close();'>오늘하루열지않음</label>" +
	"</div>";
	this.arr[idx].popup.document.write(str);
};

// 팝업 열기.
mainPopupBannerClass.prototype.open = function(idx){
	var This = this;
	if(!idx && idx!=0){
		$(This.arr).each(function(idx){
			This.makePopup(This.arr[idx],idx);
		});
	}else{
		This.makePopup(This.arr[idx],idx);
	};
};
//팝업 닫기.
mainPopupBannerClass.prototype.close = function(idx,bool){
	var This = this;
	if(!idx && idx!=0){
		$(This.arr).each(function(idx){
			This.arr[idx].popup.close();
		});
		if(bool){
			This.resetCookie();
		}
	}else{
		$(This.arr).each(function(){
			if(this.pid == This.optArr[idx].pid){
				this.popup.close();
				if(bool){
					This.resetCookie(idx);
				}
			}
		});
	};
};
// 쿠키 리셋 (또는 특정 인덱스만 리셋)
mainPopupBannerClass.prototype.resetCookie = function(idx){
	var This = this;
	if(!idx && idx!=0){
		$(This.optArr).each(function(idx){
			commonJs.delCookie(This.optArr[idx].pid+"cookie");
		});
	}else{
		commonJs.delCookie(This.optArr[idx].pid+"cookie");
	};
};
// 쿠키 저장(함수 내부용)
mainPopupBannerClass.prototype.setCookie = function(idx){
	mainPopupBannerClassSetCookie(this.arr[idx].pid+"cookie");
};

/**
 * mainPopupBannerClass에서 발생한 팝업에서 쿠키를 저장하기 위한 opener전용 함수.
 * @param cookieName : 저장할 쿠키 이름 ("1" 이라는 value로 저장됨)
 */
function mainPopupBannerClassSetCookie(cookieName){
	commonJs.setCookie(cookieName,"1",2400);
};
