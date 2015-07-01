/*
@LM_ReadImgMode  单页轮播读图模式
========================================
auther: LM
blog: http://www.cnblogs.com/dtdxrk
========================================
v2.0 2015-6-29
1.组件重构
2.不在依赖jq
3.增加对外的接口
========================================
*/
;(function(window,undefined){

	/*
	======== demo document ========

		var box = new LM_ReadImgMode({
			imgID : @sting,	//轮播的图片id *必填
			aImg : @Array,	//轮播图片url的数组 *必填
			isAuto : @Boole,	//是否自动播放 (默认或省略为暂停)
		});

		//当前页数 从1开始
		box.page = number;
	
		//总页数
		box.tote = number;
		
		//跳转到number页
		box.jump(number)
		
		//翻页开始
		box.onPageStart(fn);

		//翻页结束
		box.onPageEnd(fn);

		//上一张
		box.prev();

		//下一张
		box.next();

		//上一张到头事件
		box.prevEnd(fn);

		//下一张到头事件
		box.nextEnd(fn);
		
		//自动播放
		box.isAuto = true;

		//自动播放
		box.autoPlay();

		//自动播放暂停
		box.autoStop();

		//自动播放时间(默认6000毫秒)
		box.autoTime = 6000;

	*/

	function LM_ReadImgMode(arguments){
		this.init.call(this, arguments);
	}

	LM_ReadImgMode.prototype = {
		/*初始化*/
		init:function(opt){
			if(!opt && typeof opt.id!=String && typeof opt.aImg!=Array){throw new Error('LM_ReadImgMode arguments is not undefined');}

			/*继承参数*/
			extend(this, opt);

			/*图片*/
			this.img = document.getElementById(this.id);

			/*page*/
			this.page = 1;

			/*总页数*/
			this.tote = this.aImg.length;

			/*预加载图片*/
			this._img = new Image();

			/*自动播放定时器缓存*/
			this.autoTimmer = null;

			/*自动播放时间(默认6000毫秒)*/
			this.autoTime = 6000;

			/*获取页数*/
			this.getPage().jump(this.page).autoFun();
			
		},

		/*判断自动播放*/
		autoFun:function(){
			if(this.isAuto){
				this.autoPlay();
			}
			return this;
		},

		/*自动播放*/
		autoPlay :function(){
			var that = this;
			that.isAuto = true;	
			clearTimeout(that.autoTimmer);
			that.autoTimmer = setTimeout(function(){
				that.next();
			},that.autoTime);
		},

		/*自动播放停止*/
		autoStop:function(){
			this.isAuto = false;
			clearTimeout(this.autoTimmer);
		},

		/*根据url解析当前页数*/
		getPage:function(){
			var url = window.location.href,
				index;
			
			// %23 mac本判断
			if(url.indexOf('#LM_ReadImgMode=')>-1 || url.indexOf('%23LM_ReadImgMode=')>-1){	
				url = url.split('#LM_ReadImgMode=') || url.split('%23LM_ReadImgMode=');
				index = Number(url[1]);
				this.page = this.extPage(index);
			}

			return this;
		},

		/*跳到页码*/
		jump:function(index) {
			//翻页开始
			this.onPageStart();

			//翻页中
			this.page = this.extPage(index);
			this.loadImg(this.aImg[this.page-1]);

			return this;
		},

		//翻页开始
		onPageStart:function(fn){
			if(typeof fn == 'function'){this.onPageStart = fn;}
			return this;
		},

		/*翻页中*/
		onPageLoad:function(url){
			//设置图片
			this.img.src = url;

			/*修改url*/
			location.hash='#LM_ReadImgMode='+this.page;

			//翻页结束
			this.onPageEnd();

			/*判断自动播放*/
			this.autoFun();

			return this;
		},

		//翻页结束
		onPageEnd:function(fn){
			if(typeof fn == 'function'){this.onPageEnd = fn;}
			return this;	
		},

		/*上一张*/
		prev:function() {
			this.page--;
			if(this.page<1){
				this.page=1;
				return this.prevEnd();
			}
			this.jump(this.page);
			return this;
		},

		/*下一张*/
		next:function() {
			this.page++;
			if(this.page>this.tote){
				this.page=this.tote;
				return this.nextEnd();
			}
			this.jump(this.page);
			return this;
		},

		/*上一张到头*/
		prevEnd:function(fn){
			if(typeof fn == 'function'){this.prevEnd = fn;}
			return this;
		},

		/*下一张到头*/
		nextEnd:function(fn){
			if(typeof fn == 'function'){this.nextEnd = fn;}
			return this;
		},

		/*验证page*/
		extPage:function(index){
			return (index>this.tote || index<1 || isNaN(index)) ? 1 : index;
		},

		/*判断图片加载完毕*/
		loadImg : function(url){
			var that = this;
				_img = new Image();
			_img.src = url;

			if(_img.complete){	//图片已经在内存里
				that.onPageLoad(url);
			}else{	
				_img.onload = function(){	//图片加载完成
					that.onPageLoad(url);
				}
			}

			return that;
		}
	};


	/*继承*/
	function extend(target, source) {
	    for (var p in source) {
	        if (source.hasOwnProperty(p)) {
	            target[p] = source[p];
	        }
	    }
	    return target;
	}

	/*添加到全局*/
	window['LM_ReadImgMode'] = LM_ReadImgMode;

})(window);