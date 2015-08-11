$(window).load(function() {
	setTimeout(function(){
		var o = {
				wid:$("body").attr("width"),
				hei:$("body").attr("height"),
				scr:$("body").attr("scroll")
			}
	
	o.wid = (o.wid) ? o.wid : 600;
	o.hei = (o.hei) ? o.hei : $(".popWrap").outerHeight()+40;
	o.scr = (o.scr) ? o.scr : "no";
	
	if($(".popCaleWrap").length){
		o.hei = $(".popCaleWrap").outerHeight()+67;
	}
	
	window.resizeTo( o.wid , o.hei );
	 if(o.scr=="no"){
		 $("html,body").height(o.hei+"px").css({"overflow":"hidden"});
	 }
		
	},500);
	
	$(".popWrap>.close").on("click",function(){
		self.close();
	});
	$(".popWrap .close.selfClose").on("click",function(){
		self.close();
	});
});