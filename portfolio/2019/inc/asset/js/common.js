/* 스크립트 초기화 */
$(document).ready(function(){
	ui.init();
});

var ui = {
	init: function() {
		ui.layerNavi(); /* 전체메뉴, 타이틀메뉴 레이어 */
		ui.toggleType1(); /* 아코디언 타입1 */
		ui.toggleType2(); /* 아코디언 타입2 */
		ui.formType(); /* 폼요소 디자인 타입 */
		ui.formType2(); /* 폼요소 디자인 타입2 */
		ui.layerComm.init(); /* 레이어팝업 초기화 */
		ui.tooltipLayer(); /* 툴팁 레이어 */
		ui.eventList_month();/*지난 이벤트 month flag*/
		ui.gotoTop.init(); /* 최상단 이동 버튼 */
	},

	afterLoading: function() {
		ui.toggleType1();
		ui.toggleType2();
	},
	layerComm: {
		init: function() {
			ui.layerPopup();
			ui.layerAlert();
		},
		open: function() {
			if($(".layer_popup").length) {
				resizeLayer();
			}
			function resizeLayer() {
				var verticalGap = 130
				var $layerPopup = $(".layer_popup");
				var $scroller = $layerPopup.find(".cont_wrap");
				var scroller_mg = parseInt($scroller.css("marginTop")) + parseInt($scroller.css("marginBottom"));
				$scroller.css({
					"maxHeight": $(window).height() - $layerPopup.find(".popup_head").height() - $scroller.next(".btn_wrap3").height() - scroller_mg - verticalGap
				});
			}
			$(window).on("resize", function() {
				if($(".layer_popup").length) {
					resizeLayer();
				}
			});
		},
		close: function() {

		}
	},
	layerPopup: function() {
		var $button = 0;
		var $layer = 0;
		var verticalGap = 130;

		$(".btn_layer_popup, .btn_layer_fulltype").off("click").on("click", function() {
			$button = $(this);
			$layer = $($button.attr("href"));
			if($button.attr("href") == "#none" || $layer == "") return false;
			$("body").addClass("open_layer");
			if ($(".layer_fulltype").hasClass("show") || !$(".layer_dimmed").length) {
				ui.layerDimmed.make($($layer));
			}
			$layer.addClass("show").attr("tabIndex", "0").focus();
			if($layer.hasClass("layer_popup")) {
				var $scroller = $layer.find(".cont_wrap");
				var scroller_mg = parseInt($scroller.css("marginTop")) + parseInt($scroller.css("marginBottom"));
				$scroller.css({
					"maxHeight": $(window).height() - $layer.find(".popup_head").height() - $scroller.next(".btn_wrap3").height() - scroller_mg - verticalGap
				});
			} else if($layer.hasClass("layer_fulltype")) {
				$layer.find(".pop_content").css({
					"minHeight": $layer.height()
				});
			}

			return false;
		});
		$(".layer_popup, .layer_fulltype").find(".btn_close").off("click").on("click", function() {
			if ($(".layer_popup.show, .layer_fulltype.show").length <= 1) {
				$("body").removeClass("open_layer");
			}
			var $layerWrap = $(this).closest(".layer_popup.show, .layer_fulltype.show");

			$layerWrap.removeClass("show")
			ui.layerDimmed.delete($($layerWrap));
			//$(".layer_popup.show, .layer_fulltype.show").removeClass("show");
			if ($button) $button.focus();
			if ($layer) {
				$layer.removeAttr("tabIndex");
				$layer.find(".popup_content").removeAttr("style");
			}
			return false;
		});
	},
	layerDimmed: {
		make: function(e) {
			e.before("<div class=\"layer_dimmed\"></div>");
		},
		delete: function(e) {
			if(e.prev(".layer_dimmed").length) {
				e.prev(".layer_dimmed").remove();
			}
		}
	},
	layerNavi: function() {
		$("#shcNavi .list_nav.depth1>li>.tit_menu>a").attr("aria-selected", "false");
		$("#shcNavi .list_nav.depth1>li.on>.tit_menu>a").attr("aria-selected", "true");
		$("#shcNavi .list_nav.depth1>li>.tit_menu>a").off("click.tab").on("click.tab", function() {
			$("#shcNavi .list_nav.depth1>li").removeClass("on");
			$("#shcNavi .list_nav.depth1>li>.tit_menu>a").attr("aria-selected", "false");
			$(this).parents("li").addClass("on");
			$(this).attr("aria-selected", "true");
			return false;
		});

		$("#shcLoc .list_nav.depth2>li>.tit_menu>a").attr("aria-expanded", "false");
		$("#shcLoc .list_nav.depth2>li.on>.tit_menu>a").attr("aria-expanded", "true");
		$("#shcLoc .list_nav.depth2>li>.tit_menu>a").off("click.toggle").on("click.toggle", function() {
			if (!$(this).parents("li").hasClass("blank")) {
				if ($(this).parents("li").hasClass("on")) {
					$("#shcLoc .list_nav.depth2>li").removeClass("on");
					$("#shcLoc .list_nav.depth2>li>.tit_menu>a").attr("aria-expanded", "false");
				} else {
					$("#shcLoc .list_nav.depth2>li").removeClass("on");
					$("#shcLoc .list_nav.depth2>li>.tit_menu>a").attr("aria-expanded", "false");
					$(this).parents("li").addClass("on");
					$(this).attr("aria-expanded", "true");
				}
				return false;
			}
		});

	},
	layerAlert: function() {
		var $button = 0;
		var $layer = 0;
		$(".btn_alert").off("click").on("click", function() {
			$button = $(this);
			$layer = $($(this).attr("href"));
			$("body").addClass("open_layer");
			$layer.addClass("show").attr("tabIndex", "0").focus();
			return false;
		});
		$(".layer_alert .btn_close").off("click").on("click", function() {
			$("body").removeClass("open_layer");
			$(".layer_alert.show").removeClass("show");
			if ($button) $button.focus();
			if ($layer) $layer.removeAttr("tabIndex");
			return false;
		});
	},
	toggleType1: function() {
		$(".accordian_type").find("dt .btn_toggle").attr("aria-expanded", "false");
		$(".accordian_type.on").find("dt .btn_toggle").attr("aria-expanded", "true");

		$(".accordian_type .btn_toggle").off("click.toggle").on("click.toggle", function() {
			var $toggleWrap = $(this).closest(".accordian_type");
			var $button = $(this);
			var $content = $toggleWrap.find(".cont_toggle");

			if (!$toggleWrap.hasClass("disabled")) {
				if(!$toggleWrap.hasClass("on")) {
					$toggleWrap.siblings(".accordian_type").removeClass("on").find("dt .btn_toggle").attr("aria-expanded", "false");
					$toggleWrap.addClass("on").find("dt .btn_toggle").attr("aria-expanded", "true");
					$(window).scrollTop($toggleWrap.offset().top);
				} else {
					$toggleWrap.removeClass("on").find("dt .btn_toggle").attr("aria-expanded", "false");
				}
			}
			return false;
		});
	},
	toggleType2: function() {
		$(".accordian_type2").find("dt .btn_toggle").attr("aria-expanded", "false");
		$(".accordian_type2.on").find("dt .btn_toggle").attr("aria-expanded", "true");

		$(".accordian_type2 .btn_toggle").off("click.toggle").on("click.toggle", function() {
			var $toggleWrap = $(this).closest(".accordian_type2");
			var $button = $(this);
			var $content = $toggleWrap.find(".cont_toggle");
			if (!$toggleWrap.hasClass("disabled")) {
				if(!$toggleWrap.hasClass("on")) {
					$toggleWrap.siblings(".accordian_type2").removeClass("on").find("dt .btn_toggle").attr("aria-expanded", "false");
					$toggleWrap.addClass("on").find("dt .btn_toggle").attr("aria-expanded", "true");
				} else {
					$toggleWrap.removeClass("on").find("dt .btn_toggle").attr("aria-expanded", "false");
				}
			}
			return false;
		});
	},
	formType: function() {
		$(".form").find("select").focusin(function() {
			$(this).parents(".form").addClass("focus");
		}).focusout(function() {
			$(this).parents(".form").removeClass("focus");
		});

		$(".form").find("textarea").focusin(function() {
			$(this).parents(".form").addClass("focus");
		}).focusout(function() {
			$(this).parents(".form").removeClass("focus");
		});

		$(".form").find("input").focusin(function() {
			$(this).parents(".form").addClass("focus");
		}).focusout(function() {
			$(this).parents(".form").removeClass("focus");
		});
	},
	formType2: function(){
		$("input[type='checkbox'], input[type='radio']").click(function(){
			if($(this).is(":checked")){
				$(this).prop('checked',true);
			}else{
				$(this).prop('checked',false);
			}
		});
	},
	gotoTop: {
		init: function() {
			var html = '<a href="#none" class="btn_gotop">페이지 상단으로 이동</a>'
			$("#ebppWrap").append(html);
			$("#ebppWrap").find(".btn_gotop").on("click", function(e) {
				e.preventDefault();
				ui.gotoTop.move();
			});
			$(window).on("scroll touchmove", function(e) {
				ui.gotoTop.scrolling();
			});
		},
		scrolling: function() {
			if($(window).scrollTop() > $("#ebppWrap").offset().top) {
				$(".btn_gotop").show();	
			} else {
				$(".btn_gotop").hide();					
			}
		},
		move: function() {
			$("body").animate(
				{"scrollTop": $(window).scrollTop(0)},
				function() {
					$("#ebppContent").attr("tabIndex", "0").focus().focusout(function() {$(this).removeAttr("tabIndex");
					});
				});
			return false;
		}
	},
	eventList_month : function() {
		if ($(".event_past").length) {
			$(".cont_month").each(function(index) {
				var $wrap = $(this);
				var $month = $wrap.find(".month");
				var gap = 13;
				$(window).on("scroll touchmove", function() {
					if ($(window).scrollTop() >= $wrap.offset().top && $(window).scrollTop() < $wrap.offset().top + $wrap.innerHeight() - $month.height() - gap * 2) {
						$month.removeClass("bottom").addClass("fixed");
					} else if ($(window).scrollTop() >= $wrap.offset().top + $wrap.innerHeight() - $month.innerHeight() - gap * 2) {
						$month.removeClass("fixed").addClass("bottom");
					} else {
						$month.removeClass("fixed").removeClass("bottom");
					}
				});
			});
		}
	},
	tooltipLayer: function() {
		$.fn.focusWithoutScrolling = function(){
			var x = window.scrollX;
			var y = window.scrollY;
			window.scrollTo(x,y);
			return this;
		};
		$("[data-type='tooltipLayer']").each(function(){
			var toolLocation = $(this).attr("data-direction"); //툴팁 노출 위치(top, bottom) bottom은 기본
			var toolName = $(this).attr("tooltip");
			var top = 0;
			var left = 27;
			var right = 27;
			var gap = 11;

			if(!toolLocation) toolLocation = "bottom";



			$(this).off("click.toggle").on("click.toggle", function() {
				if ($(this).hasClass("on")) {
					$("div.tooltipWrap").remove();
					$(this).removeClass("on");
				} else {
					createTooltipFunc($(this));
					$(this).addClass("on");
					closeTooltip(true);
				}
			});

			function closeTooltip(flag) {
				if(!!flag) {
					$(document).off("click.tooltip touchstart.tooltip").on("click.tooltip touchstart.tooltip", function(e) {
						if ( $(e.target).attr("data-type") != "tooltipLayer") {
							if(!$(e.target).hasClass("tooltipWrap")) {
								$(".tooltipWrap").remove();
								$(".btn_tooltip").removeClass("on");
								$(document).off("click.tooltip touchstart.tooltip");
							}
						}
					});
				} else {
					$(document).off("click.tooltip touchstart.tooltip");
				}
			}


			function createTooltipFunc(obj){
				var layer = obj.parents(".layer_fulltype,.layer_popup")
				$("div.tooltipWrap").remove();
				var tooltip = obj.next().html();
				var toolSize = obj.outerWidth();

				$("body").append("<div class=\"tooltipWrap\">" + tooltip + "</div>");
				$("div.tooltipWrap").attr("tabIndex","0").focusWithoutScrolling();
				$("div.tooltipWrap").append("<a href=\"javascript:void(0);\" class=\"btn_close\">툴팁닫기</a>");

				if (toolLocation == "top") {
					bottom = $(window).height() - obj.offset().top + gap;
					$(".tooltipWrap").css({"left": left, "right": right, "bottom": bottom});
				} else if (toolLocation == "bottom") {
					top = obj.offset().top + 30;
					$(".tooltipWrap").css({"left": left, "right": right, "top": top});
				} else {
					bottom = $(window).height() - obj.offset().top + gap;
					$(".tooltipWrap").css({"left": left, "right": right, "bottom": bottom});
				}
				if(layer.length >0){
					var tool = $(".tooltipWrap").clone();
					$(".tooltipWrap").remove();
					layer.append(tool);
					var toolTop = $(".tooltipWrap").position().top;
					var ws = layer.scrollTop();
					$(".tooltipWrap").css("top",toolTop+ws*2)
				}else{

				}
				$("div.tooltipWrap").find(".btn_close").on("click", function() {
					obj.removeClass("on").focusWithoutScrolling();
					$("div.tooltipWrap").remove();
				});
			}
		});
	}
};

/***********************************************
* default tab
************************************************/
$.fn.defaultTab = function(options) {
	return this.each(function() {
		options = options || {};
		var $this = $(this);
		var opts = $.extend({}, $.fn.defaultTab.defaults, options || {});
		var $eventEls = $(opts.eventEls);

		$eventEls.each(function(i){

			var cont = $(this).attr("href");
			if($(this).parent().hasClass("on")){
				$(this).attr("aria-selected",true);
				$(cont).removeClass(opts.hiddenClass)
			}else{
				$(this).attr("aria-selected",false);
				$(cont).addClass(opts.hiddenClass);
			}
		})
		$eventEls.on('click', function(ev) {
			var href=$(this).attr("href");
			$(this).attr("aria-selected",true);
			$(href).removeClass(opts.hiddenClass);
			$(this).parent().addClass(opts.tabOnClass);
			$(this).parent().siblings().removeClass(opts.tabOnClass).find("a").attr("aria-selected",false);
			$(this).parents("ul").find(">li>a").each(function(){
				if($(this).parent().hasClass(opts.tabOnClass)){

				}else{
					var hiddenCont = $(this).attr("href");
					$(hiddenCont).addClass(opts.hiddenClass);
				}
			});

			return false;
		});//click focus

	});
};

$.fn.defaultTab.defaults = {
	ajaxTarget : 'AjaxContentWrap',
	eventEls : 'a',
	eventChildren : true,
	tabOnClass : 'on',
	hoverClass : 'hover',
	onimg : '_on.gif',
	offimg : '_off.gif',
	hiddenClass : 'hide',
	clickCallback : false
};


$.fn.ShowAction = function(options) {
	$.fn.ShowAction.defaults = {
		CommonClass:$(".tab_formtype"),
		Data:'data-tabButton',
		OnClass:'on',
		showClass:'show',
		hideClass:'hide',
		HideArea:''
	};
	return this.each(function() {
		options = options || {};
		var t = $(this);
		var opts = $.extend({}, $.fn.ShowAction.defaults, options || {});
		var Data = opts.Data;
		var commonClass =opts.CommonClass;
		var is_input =  t .is("input");
		var is_radio = t.attr("type") == "radio";
		var is_check = t.attr("type") == "checkbox";
		var is_select = t.is("select");
		var Grp = t.attr("name");
		var GrpObj = $("input[name="+Grp+"]");
		var hide ="";
		if(is_input){
			t.attr("aria-selected",false);
		}else if(!is_select){
			t.attr("aria-selected",false);
		}
		if(is_select){ //셀렉트일때 기본 숨기기
			t.find("option").each(function(){
				hide = $($(this).attr(Data));
				ToggleClass(hide,"hide");
			});
		}else{//기타 다른 태그일때 기본 숨기기
			hide = $(t.attr(Data));
			ToggleClass(hide,"hide");
		}
		if(t.prop("checked") == true){// 인풋 체크되있을때 해당 영역 block
			t.attr("aria-selected",true);
			ToggleClass($(t.attr(Data)));
		}else if(t.find("option").prop("selected") == true){// 셀렉트 셀렉된거 해당 영역 block
			ToggleClass($(t.find("option").attr(Data)));
		}else if(t.hasClass(opts.OnClass)){// on된 엘리먼트에 해당 영역 block
			t.attr("aria-selected",true);
			ToggleClass($(t.attr(Data)));
		}
		if(is_input || is_select){
			t.on("change",function(){
				var target = $($(this).attr(Data));
				if(is_select){
					var opt = t.find("option");
					var target = $(t.find("option:selected").attr(Data));
					opt.each(function(){
						hide = $($(this).attr(Data));
						ToggleClass(hide,"hide");
					});
					ToggleClass(target);
				}
				var check = $(this).prop("checked");
				if(is_radio){
					GrpObj.each(function(){
						hide = $($(this).attr(Data));
						ToggleClass(hide,"hide");
						if($(this).prop("checked")){
							$(this).attr("aria-selected",true);
						}else{
							$(this).attr("aria-selected",false);
						}

					});
				}
				if(check){
					ToggleClass(target);
					t.attr("aria-selected",true);
				}else{
					 t.attr("aria-selected",false);
					if(is_check){ToggleClass(target,"hide");}
				}
				if(is_input){

				}
				AddHide();// 추가하이드
			});
		}else{
			t.on("click",function(){
				var target = $($(this).attr(Data));
				if(t.hasClass(opts.OnClass)){
					ToggleClass(target,"hide");
					$(this).attr("aria-selected",false);
					$(this).removeClass(opts.OnClass);
				}else{
					$(this).attr("aria-selected",true);
					ToggleClass(target);
					$(this).addClass(opts.OnClass);
					ToggleClass(target);
				}
				AddHide();// 추가하이드
			});
		}
		function ToggleClass(obj,flag){
			if(flag == "hide"){
				obj.removeClass(opts.showClass).addClass(opts.hideClass);
			}else{
				obj.removeClass(opts.hideClass).addClass(opts.showClass);
			}
		}
		function AddHide(){//추가로 하이드 시킬것 함수
			var hideLen = opts.HideArea.length;
			for(i = 0; i < hideLen; i++){
				if($(opts.HideArea[i]).hasClass(opts.showClass)){
					var TabBtn = $("*["+Data+"='"+opts.HideArea[i]+"']");
					if(TabBtn.is("option")){
						TabBtn.parent("select").find("option:eq(0)").prop("selected",true);
					}else if(TabBtn.is("input")){
						TabBtn.prop("checked",false);
					}else{
						TabBtn.removeClass(opts.OnClass);
					}
				}
				$(opts.HideArea[i]).removeClass(opts.showClass).addClass(opts.hideClass);
			}
		}
	});
};

//탭 컨텐츠
$(".tab_wrap1").defaultTab({
	eventEls : ".tab_type1>li>a"
});

//라디오 컨텐츠
$("input[name='listRadio']").ShowAction({});


//page nav
$(document).ready(function(){
	$(".list_nav li").find("a").attr("aria-selected", "false");
	$(".list_nav li.on").find("a").attr("aria-selected", "true");

	//명세서 수령 선택시 우편수령지 선택
	$('[name="cb"]').click(function(){
		if($('.postB').is(':checked')){
			$('.list_radio').show();
		}else{
			$('.list_radio').hide();
		}
	});
});

//input type="date" 키입력 방지
$(document).ready(function(){
	$('input[type="date"]').keydown(function(){
		event.preventDefault();
	});
});



