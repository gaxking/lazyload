var LazyLoad = (function() {
	var queue = [], t, ele;

	//load背景图，可以替换
	var loadPic = 'images/loading.png';
	function onscroll(isInit) {
		var list = ele.querySelectorAll('[data-src]');
		if(list.length === 0) {
			document.removeEventListener('scroll', scrollHander);
		}

		for(var i = 0, newnode;i<list.length;i++) {
			//初始化要给img／div外面加一个“套”，目的是能显示loading背景
			if(isInit) {
				if(list[i].tagName.toLowerCase()=='img') {
					list[i].style.visibility = 'hidden';
				}
				newnode = document.createElement("div");
				newnode.style.background = 'url('+loadPic+') center no-repeat';
				var display = getComputedStyle(list[i]).getPropertyValue("display");

				newnode.style.width = getComputedStyle(list[i]).getPropertyValue("width");
				newnode.style.height = getComputedStyle(list[i]).getPropertyValue("height");
				newnode.style.display = display=='inline'?'inline-block':display;

				//使用replaceChild，而不用innerhtml，减少DOM消耗
				list[i].parentNode.replaceChild(newnode, list[i]);
				newnode.appendChild(list[i]);
			}

			var dataSrc = list[i].getAttribute('data-src'), rect = list[i].getBoundingClientRect();
			
			//判断元素是否在可视区域内
			if(queue.indexOf(dataSrc)==-1&&rect.bottom>0&&rect.top-window.innerHeight<0) {
				var img = new Image();
				img.onload = (function(dom, dataSrc) {
					return function() {
						if(dom.tagName.toLowerCase()=='img') {
							dom.setAttribute('src', dataSrc);
							dom.style.visibility = null;
						}else{
							dom.style.backgroundImage = 'url('+dataSrc+')';
						}

						dom.classList.add('fadeIn');
						dom.parentNode.parentNode.replaceChild(dom, dom.parentNode);
						dom.removeAttribute('data-src');
						queue.splice(queue.indexOf(dataSrc), 1);
					};
				})(list[i], dataSrc);

				img.src = dataSrc;
				
				//加入下载标志队列，防止重复下载
				queue.push(dataSrc);
			}
		}
	}

	function scrollHander() {
		if(t)clearTimeout(t);
		t = setTimeout(function() {
			onscroll();
		}, 250);
	}

	return function(_ele) {
		ele = _ele || document.body;
		onscroll(true);
		document.addEventListener('scroll', scrollHander);
	};
})();
