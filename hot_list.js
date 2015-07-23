$(document).ready(function() {     
	$('.swiper-slide').html('<span class="loadingAni on"><span></span><span></span><span></span></span>');
	var page_btn = $('.list_hotType a'),
		wrapper_con,wrapper_contain,
		loading = $('.loadingAni'),
		timeout = 1*10*1000,//本地存储时间1min
		pass_time,
		swiper_slide = $('.swiper-slide'),
		swiper_slide_img = $('.swiper-slide .list_work'),
		startY = 0,
		disY = 0,
		scrooltop = 0,
		scroll = false;
		load = true;
		hotListUrl = '/newmodule_dev/index.php/wechat/gethotlist',
		$width = $(window).width(),
		$height = $(window).height();
		$('.swiper-container').css({width:$width,height:$height-50});
		$('.list_hotType').css('width',$width-50);
	// // 获取三个板块内容	增加mother分类 by duzi 2015/05/09
	// getList('',0,1);//类型、模块index、页码
	// getList('mother',1,1);
	// getList('wedding',2,1);
	var tpl = $('#js-tmpl').html();

	swiper();

	// 列表滑动
	stopWindowDrag();

	// 获取热门内容数据
	function getList(sort_type,index,page){
		$.ajax({
			type: 'post',
			dataType:"json",
			url: hotListUrl,
			data:{
				action_type:sort_type,
				page: page
			},
			success: function(data) {
				console.log('现在'+sort_type+'的页码'+page);
				// console.log(data.data.hasmore);
				// if (data.retmsg === 1 && data.data){
				if (data.retmsg === 1 && data.data.hasmore == 1 && load){
					get_list_content(data,index,page);
				}
				else{
					alert('由于网络等原因,加载失败,请刷新！');
					// swiper_slide.eq(index).find('.loadingAni').removeClass('on').html('没有了没有了～');
				}
			}
		});
	}

	function get_list_content(data,index,page){
		var htmls='';
		var list = data.data.data;
		for(var inv = 0; inv < list.length; inv++){
			var param = list[inv];
			htmls += tpl.replace('{title}', param['title'])
					.replace('{img}', param['share_img'] + '?imageView2/0/w/320')
					.replace('{visit}', param['read_count'])
					.replace('{page}', page)
					.replace('{url}', param['url']);
		};
		if(htmls){
			$('#swiper'+index).find('.loadingAni').before(htmls);
			swiper_slide.eq(index).find('.loadingAni').removeClass('on').html('上拉刷新');
			wrapper_contain = $('#wrapper').html();
	    	window.localStorage.setItem('wrapper_contain',wrapper_contain);
			pass_time = String(Date.now());
			window.localStorage.removeItem('pass_time');
	    	window.localStorage.setItem('pass_time',pass_time);
	    	// console.log(pass_time);
	    	if(data.data.hasmore == 0){load = false;
				swiper_slide.eq(index).find('.loadingAni').removeClass('on').html('没有了没有了～');
			}
		}else{
			loading.eq(index).removeClass('on').html('暂无内容');
		}
	}
		
	// 定义swiper
	function swiper () {
	  var swiper_slide = $('.swiper-slide');

		var swiper_config = {
	      speed: 500,
	      mode : 'horizontal',
		   onSlidePrev:function(swiper){load = true;
		   		cur_index = mySwiper.activeIndex;//console.log(cur_index)
		   		page_btn.eq(cur_index).addClass('selected').siblings().removeClass('selected');
		   		$('.swiper-slide').removeClass('scrollable').eq(cur_index).addClass('scrollable');
	   			if(cur_index>=3 && $('.swiper-slide').eq(cur_index).hasClass('slide')){
		   			$('.swiper-slide').eq(cur_index).removeClass('slide');
		   			addslide(cur_index,1);
		   		}
		   		$('#list').removeClass().addClass('list_hotType transleft'+cur_index);
		   },
		   onSlideNext:function(swiper){load = true;
		   		cur_index = mySwiper.activeIndex;
		   		page_btn.eq(cur_index).addClass('selected').siblings().removeClass('selected');
		   		$('.swiper-slide').removeClass('scrollable').eq(cur_index).addClass('scrollable');
		   		if(cur_index>=3 && $('.swiper-slide').eq(cur_index).hasClass('slide')){
		   			$('.swiper-slide').eq(cur_index).removeClass('slide');
		   			addslide(cur_index,1);
		   		}
		   		$('#list').removeClass().addClass('list_hotType transleft'+cur_index);
		   }
	    };
	    //初始化myswiper
	    mySwiper =  new Swiper(".swiper-container",swiper_config); 

	    // 点击导航分类跳转
	    page_btn.on('click',function(){
	    	var cur_index = page_btn.index(this);
		   	$('.swiper-slide').removeClass('scrollable').eq(cur_index).addClass('scrollable');
	    	page_btn.removeClass('selected').eq(cur_index).addClass('selected');
	    	mySwiper.swipeTo(cur_index,500,false);
	    	if($('.swiper-slide').eq(cur_index).hasClass('slide')){
	    		$('.swiper-slide').eq(cur_index).removeClass('slide');
	    		addslide(cur_index,1);
	   		}
		   	$('#list').removeClass().addClass('list_hotType transleft'+cur_index);
	    })
		// 点击查看链接返回到当前位置
	    if(window.localStorage.getItem('cur_index') && window.localStorage.getItem('scrooltop')){
	    	mySwiper.reInit();
			var cur_index = window.localStorage.getItem('cur_index');
			 wrapper_con = window.localStorage.getItem('wrapper_con');
			$('#wrapper').html(wrapper_con);
			page_btn.eq(cur_index).addClass('selected').siblings().removeClass('selected');
		   	$('#list').removeClass().addClass('list_hotType transleft'+cur_index);
	    	$('.swiper-slide').removeClass('scrollable').eq(cur_index).addClass('scrollable');
			$('.swiper-slide').eq(index).find('.loadingAni').removeClass('on');
			var scrooltop = window.localStorage.getItem('scrooltop')
			mySwiper.swipeTo(cur_index,500,false);
	    	$('#swiper'+cur_index)[0].scrollTop = scrooltop;
	   		window.localStorage.clear();
	    }else if(window.localStorage.getItem('wrapper_contain')){
	    	pass_time = window.localStorage.getItem('pass_time');
	    	var date_time = String(Date.now()-pass_time);console.log(date_time+','+timeout);//获取时间差
	    	if(date_time <= timeout){
	    		wrapper_contain = window.localStorage.getItem('wrapper_contain');
				$('#wrapper').html(wrapper_contain);
				$('.swiper-slide').removeClass('scrollable').eq(0).addClass('scrollable');
	    	}else{
	   			window.localStorage.removeItem('wrapper_contian');
	    		getList('',0,1);//类型、模块index、页码
				getList('graduate',1,1);
				getList('wedding',2,1);
	    	}
	    }else{console.log('sdf')
	    	// 第一次加载时首先获取三个板块内容	增加mother分类 by duzi 2015/05/09
			getList('',0,1);//类型、模块index、页码
			getList('graduate',1,1);
			getList('wedding',2,1);
		    var action = getPara('action');
	          //by duzi  2015/05/09 母亲节顺带修改，暂时把母亲节修改到第二位
	          var matchIndex = {
	            'wedding': 1,
	            'graduate': 2,
	            'lovers': 3,
	            'bestie': 4,
	            'parents': 5,
	            'enjoyalone': 6,
	            'travel': 7,
	            'mother': 8
	          }
	        var index = matchIndex[action] || 0;
		    if(action){
			    page_btn.removeClass('selected').eq(index).addClass('selected');
			    $('.swiper-slide').removeClass('scrollable').eq(index).addClass('scrollable');
		   		$('#list').removeClass().addClass('list_hotType transleft'+index);
				mySwiper.swipeTo(index,500,false);
				addslide(index,1);
			}
		}
		
	    // 点击图片跳转页面
	    $('.scrollable').on('click','.list_img',function(e){
	    	var cur = mySwiper.activeIndex<1?0:mySwiper.activeIndex;
	    	var cur_slide = $('#swiper'+cur);
	    	var scrolltop = cur_slide[0].scrollTop;
	    	 wrapper_con = $('#wrapper').html();
	    	window.localStorage.setItem('wrapper_con',wrapper_con);
	    	window.localStorage.setItem('cur_index',cur);
	    	window.localStorage.setItem('scrooltop',scrolltop);//console.log(cur+','+scrolltop)
	    	var url = $(this).attr('href');
	    	window.location.href=url;
	    })

		var move = false;
		// 上啦刷新
		swiper_slide.on('touchstart',function(e){
			startY = e.targetTouches[0].pageY;
		})
		swiper_slide.on('touchend touchcancel',function(e){
			var endY = e.changedTouches[0].pageY;
			disY = endY - startY;
			var cur_index = swiper_slide.index(this);
			var cur_slide = $('#swiper'+cur_index);//console.log(cur_slide[0].scrollHeight+','+cur_slide[0].scrollTop)
			var $curIndex = $('#swiper'+cur_index);
			if(cur_slide[0].scrollHeight < cur_slide[0].scrollTop+$height && disY < -100 && !move){move = true;
	            //增加mother分类时，发现如果第一次加载少于20个还是会加第二页，暂时修复 by duzi 2015/05/09
	            var $curIndex = $('#swiper'+cur_index);
				var num =$curIndex.find('.list_work').length/36;
	            if(/^[0-9]*[1-9][1-9]*$/.test(num)){//console.log(num);
	              num = num + 1;
	              addslide(cur_index,num);move = false;
	            }else{
	                $curIndex.find('.loadingAni').html('没有了没有了～');
	            }
			}
		})
	}

	//获取search值
	function getPara(param) {
		var reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)", "i"),
		  r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	}

	// 加载当前板块的内容 增加mother分类 by duzi 2015/05/09
	function addslide(cur_index,num){//console.log(num);
		swiper_slide.eq(cur_index).find('.loadingAni').html('<span></span><span></span><span></span>');
		action_type = [{'value':''},{'value':'graduate'},{'value':'wedding'},{'value':'lovers'},{'value':'bestie'},{'value':'parents'},{'value':'enjoyalone'},{'value':'travel'},{'value':'mother'}];
		var type = action_type[cur_index].value;
		getList(type,cur_index,num);
	}

	function stopWindowDrag(){
	  var selScrollable = '.scrollable';
	  var slow_level = 0.9;

	  $(window).on('touchmove',function(e){
	     e.preventDefault();
	  });
	  var touchStartX = 0,
	    touchStartY = 0,
	    backTop = 0,
	    backLeft = 0,
	    startTime = 0,
	    disY = 0,
	    disX = 0,
	    speed = 0;

	  var can_animating = true,
	      stop_animating = false;

	  $('body').on('touchstart',selScrollable,function(e){
	      touchStartX = e.touches[0].clientX;
	      touchStartY = e.touches[0].clientY;
	      disY = 0;
	      disX = 0;
	      speed = 0;
	      backTop = this.scrollTop;
	      backLeft = this.scrollLeft;
	      startTime = new Date();
	  });

	  $('body').on('touchmove',selScrollable,function(e){
	    disY = (e.touches[0].clientY - touchStartY);
	    disX = (e.touches[0].clientX - touchStartX);
	    var 
	      nowY = backTop - disY,
	      nowX = backLeft - disX;
	    if(nowY <= 0){
	      nowY = 0;
	    }else if(nowY > this.scrollHeight){
	      nowY = this.scrollHeight;
	    }
	    if(nowX <= 0){
	      nowX = 0;
	    }else if(nowY > this.scrollWidth){
	      nowX = this.scrollWidth;
	    }
	    this.scrollTop = nowY;
	    if($(this)[0].scrollWidth > $(this).width()) {
	        this.scrollLeft = nowX;
	    }
	  });

	  $('body').on('touchend',selScrollable,function(e){
	    var that = this;
	    var durTime = (new Date() - startTime)/1000;
	    if(durTime < 0.2 && Math.abs(disY) > 20 ){
	      speed = parseInt((-disY)/durTime)/15;
	      if(can_animating){
	        can_animating = false;
	        requestAnimationFrame(function(){
	          scrollAniamtion.call(that);
	        });
	      }else{
	        stop_animating = true;
	        can_animating = true;
	      }
	    }
	  });
	  function scrollAniamtion(timestamp){
	    speed *= slow_level;
	    var 
	      that = this,
	      newTop = this.scrollTop + speed;
	    this.scrollTop = newTop;
	    // console.log(mySwiper.activeIndex);
	    var cur_index = mySwiper.activeIndex<1?0:mySwiper.activeIndex;
	    if (newTop <= 0){
	      this.scrollTop = 0;
	    }else if(newTop > that.scrollHeight){console.log('1111111')
	      that.scrollTop = that.scrollHeight-500;
	    }
	    if( ( speed > 2 || speed < - 2 ) && !stop_animating ){//console.log('222222222')
	      requestAnimationFrame(function(){
	        scrollAniamtion.call(that);
	      });
	    }else{
	      stop_animating = false;
	      can_animating = true;
	      if(newTop+1100>that.scrollHeight){
	      	// console.losg(newTop+','+that.scrollHeight)
	      	var $curIndex = $('#swiper'+cur_index);
			var num =$curIndex.find('.list_work').length/36;
	        if(/^[0-9]*[1-9][1-9]*$/.test(num)){//console.log(num);
	          num = num + 1;
	          addslide(cur_index,num);
	        }else{
	            $curIndex.find('.loadingAni').html('没有了没有了～');
	        }
	      }
	    }
	  }
	}

	//阻止iphone默认行为
	document.body.ontouchmove = function(e){
	    e.preventDefault();
	};
});	