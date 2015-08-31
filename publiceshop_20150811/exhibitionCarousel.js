/**
 * 이미지 로딩 달기
 * 인디케이터 손꾸락
 * 롤링 시간 설정
 * 롤링 기능 사용여부
 * 
 * // 아래는 부가기능
 * 탭사이즈 적용.
 */
// [Class] 기획전 상단비주얼 롤링
function exhibitionCarouselClass(opt){
	this.val = { // 클래스의 기본 변수.
			carouselId:"#exhibitionCarouselNew", // 캐라솔 케이스 아이디
			indicatorId:"#exhibitionIndicatorNew", // 인디케이터 아이디
			paneId:"#exhibitionVisualTabNew", // 탭 아이디
			width:985, // 비주얼의 가로값
			height:400, // 비주얼의 세로값
			myIdxMax:0, // 아이템들의 전체 갯수 인덱스의 끝. (myIdx의 끝)
			nowIdx:0 // 현재 선택된 인덱스
	};
	this.moving = false; // 현재 움직이고 있는가.
	this.interval = true; // 돌아가는 중.
	this.ul = $(this.val.carouselId).find("ul"); // 아이템들이 담긴 UL.
	this.indi = $(this.val.indicatorId);
	this.paneLi = $(this.val.paneId).find("li");
	this.pane = []; // 판의 정보들 정리. (ex : [{item:[...]},{item:[...]},{item:[...]}])
	$.extend(this.val,opt);
	this.init();
};

// [Core] 초기에 사용할 데이터 셋팅
exhibitionCarouselClass.prototype.init = function(idx){
	this.item = $(this.val.carouselId).find("li");
	this.val.myIdxMax = this.item.length-1;
	this.val.length = this.item.length;
	
	var This = this;
	This.item.each(function(idx,item){
		
		$(item).attr("myIdx",idx);
		var pIdx = $(item).attr("paneIdx");
		if(!This.pane[pIdx]){
			var pData = {item:[],sIdx:idx};
			This.pane.push(pData)
		};
		This.pane[pIdx].item.push(item);
	});
	$(This.pane).each(function(idx){
		this.max = this.item.length-1;
		$(this.item).each(function(jdx,jtem){
			$(jtem).attr("itemIdx",jdx);
		});
	});
	
	this.itemSort(this.val.nowIdx);
	
	// 엘리먼트 셋팅
	$(this.val.carouselId).parent().on("mouseenter",function(){
		This.interval = false;
	}).on("mouseleave",function(){
		This.interval = true;
	});
	
	
	// 이미지 로딩 시작.
	this.imageLoad();
	
	// 롤링 시작
	this.play();
};

// [Core] 아이템끼리 움직이기.
exhibitionCarouselClass.prototype.itemMove = function(gotoIdx,type){
	if(gotoIdx == this.val.nowIdx){ // 현재 선택된 아이템과, 가려고 하는 아이템이 동일하면 팅겨버림.
		return;
	}
	if(!this.moving){ // 움직이는 상태가 아니여만(false) 실행한다.
		this.moving = true;
		var gotoIdx = gotoIdx;
		var type = type;
		var gotoLi = this.item.filter("[myIdx="+gotoIdx+"]");
		var nowLi = this.nowLi;
		var This = this;
		if(type=="next"){
			nowLi.after(gotoLi);
			$(this.ul).animate({"left":(this.val.width*-2)+"px"},function(){
				setTimeout(function(){
					This.val.nowIdx = gotoIdx;
					
					This.itemSort(This.val.nowIdx);
				},300);
				setTimeout(function(){
					This.moving = false;
				},500);
			});
		}else{
			$(this.ul).append( $(this.ul).find("li").eq(0) )
			nowLi.before(gotoLi);
			$(this.ul).animate({"left":"0px"},function(){
				setTimeout(function(){
					This.val.nowIdx = gotoIdx;
					This.itemSort(This.val.nowIdx);
				},300);
				setTimeout(function(){
					This.moving = false;
				},500);
			});
		};
	};
};

// [Method] 아이템 이전이동
exhibitionCarouselClass.prototype.prevMove = function(){
	var gotoIdx = this.getPrev(); // 이전에 적용될 엘리먼트(LI)의 인덱스 및 엘리먼트 구하기. {idx:이전인덱스,li:엘리먼트}
	this.itemMove(gotoIdx.idx,"prev");
};

// [Method] 아이템 다음이동
exhibitionCarouselClass.prototype.nextMove = function(){
	var gotoIdx = this.getNext(); // 다음에 적용될 엘리먼트(LI)의 인덱스 및 엘리먼트 구하기. {idx:다음인덱스,li:엘리먼트}
	this.itemMove(gotoIdx.idx,"next");
};

// [Method] 이전(prev) 아이템 엘리먼트 및 인덱스 구하기.
exhibitionCarouselClass.prototype.getPrev = function(idx){
	return this.getItem(idx,"prev");
};
// [Method] 다음(next) 아이템 엘리먼트 및 인덱스 구하기.
exhibitionCarouselClass.prototype.getNext = function(idx){
	return this.getItem(idx,"next");
};
//[Method] 현재 선택된(now) 아이템 엘리먼트 및 인덱스 구하기.
exhibitionCarouselClass.prototype.getNow = function(idx){
	return this.getItem(idx,"now");
};

// [Core] 이전(prev) 또는 다음(next) 아이템 엘리먼트 및 인덱스 구하기.
// type "now" : 지금선택된거 , "prev" : 이전거 , "next" : 다음거
exhibitionCarouselClass.prototype.getItem = function(idx,type){
	var idx = (!idx && idx!=0) ? this.val.nowIdx : idx; // 인덱스를 못받으면, 현재 선택된 인덱스로 치환한다.
	var gIdx = idx; // 기본은 현재 선택된 인덱스
	if(type=="prev"){
		gIdx = ((((idx*1)-1)+this.val.length)%this.val.length); // 이전걸 구할때.
	}else if(type=="next"){
		gIdx = (((idx*1)+1)%this.val.length) // 다음걸 구할때.
	};	
	var li = this.item.filter("[myIdx="+gIdx+"]");
	return {
			idx:gIdx, 
			li:li,
			paneIdx:li.attr("paneIdx"),
			itemIdx:li.attr("itemIdx")
		};
};

// [Core] 선택된 인덱스에 맞추어 각 오브젝트 정리. (움직임은 없음)
exhibitionCarouselClass.prototype.itemSort = function(idx){
	var prev = this.getPrev(idx);
	var next = this.getNext(idx);
	var nowLi = this.item.filter("[myIdx="+idx+"]");
	
	$(this.ul).css({"left":(this.val.width*-1)+"px"});
	$(this.ul).prepend(next.li);
	$(this.ul).prepend(nowLi);
	$(this.ul).prepend(prev.li);
	
	// 현재상태 셋팅.
	this.val.nowIdx = idx;
	this.nowLi = this.getNow().li;
	
	// 인디케이터 넣기
	this.setIndiCator();
	this.paneOnOff(this.getNow().paneIdx);
};

// [Core] 인디케이터 넣기
exhibitionCarouselClass.prototype.setIndiCator = function(){
	var This = this;
	var nowLi = This.getNow();
	This.indi.empty();
	$(This.pane[nowLi.paneIdx].item).each(function(idx){
		var myIdx = $(this).attr("myIdx");
		var indi = $("<span></span>");
		if(idx==nowLi.itemIdx){
			indi.addClass("on");
		};
		indi.on("click",function(){
			This.itemMove(myIdx,"next");
		});
		This.indi.append(indi);
	});
};


// [Method] 판단위로 움직이기.
exhibitionCarouselClass.prototype.paneMove = function(pIdx){
	var itemIdx = this.pane[pIdx].sIdx;
	this.itemMove(itemIdx,"next");
};
// [Core] 판 온오프
exhibitionCarouselClass.prototype.paneOnOff = function(pIdx){
	this.paneLi.eq(pIdx).addClass("over").siblings().removeClass("over");
};


// 이미지를 로딩하기
exhibitionCarouselClass.prototype.imageLoad = function(){
	this.item.find("img").css({opacity:0});
	this.item.find("img").one("error",function(){
		this.src="/images/common/noimg_visual.gif"; 
	});
	this.item.find("img").one("load",function(){
		$(this).delay(1000).animate({opacity:1});
	})
	this.item.find("img").each(function(){
		$(this).attr("src",$(this).attr("data-src"));
	});
};
// 인터벌 멈추기
exhibitionCarouselClass.prototype.stop = function(){
	This.interval = false;
};
// 인터벌하게 돌리기
exhibitionCarouselClass.prototype.play = function(){
	var This = this;
	This.count = 0;
	setInterval(function(){
		if(This.interval){
			if(This.count<30){
				This.count++;
			}else{
				This.count = 0;
				This.nextMove();
			}
		}else{
			This.count = 0;
		}
	},100);
};