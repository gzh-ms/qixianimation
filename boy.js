function BoyWalk() {
  // 获取容器
  var container = $('#content');

  // 可视区域宽高
  var visaulWidth = container.width();
  var visaulHeight = container.height();

  // 获取数据
  var getValue = function(className) {
    var $elem = $('' + className + '');
    return {
        height: $elem.height(), // 路的高度
        top: $elem.position().top // 路距离容器顶部的距离
    };
  };

  // 路中心距离容器顶部距离
  var pathY = function() {
    var data = getValue('.a_background_middle');
    return data.height / 2 + data.top;
  }();

  var $boy = $("#boy");
  var boyHeight = $boy.height();
  
  // 小男孩动态坐标，25修正值
  $boy.css({
    top: pathY - boyHeight + 25 + 'px'
  });

  // 恢复走路
  function restoreWalk() {
    $boy.removeClass('pauseWalk');
  }

  // 停止走路
  function pauseWalk() {
    $boy.addClass('pauseWalk');
  }

  // 走路动作
  function slowWalk() {
    $boy.addClass('slowWalk');
  }

  // 计算距离
  function calculateDist(direction, proportion) {
    return (direction == 'x' ? visaulWidth : visaulHeight) * proportion;
  }

  // 小男孩运动
  function startRun(options, runtime) {
    var dfdPlay = $.Deferred();
    // 恢复走路
    restoreWalk();
    // 运动属性
    // jquery.transit库实现
    $boy.transition(options, runtime, 'linear', () => dfdPlay.resolve());
    
    // jquery animate实现
    // $boy.animate(options, runtime, 'linear', () => dfdPlay.resolve());
    return dfdPlay;
  }

  // 开始走路
  function walkRun(time, disX, disY) {
    time = time || 3000;
    // 脚动作
    slowWalk();
    // 开始走路
    var d1 = startRun({
        'left': disX + 'px',
        'top': disY ? disY : undefined
    }, time);
    return d1;
  }

  var instanceX;

  // 走进商店
  function walkToShop(time) {
    var dfd = $.Deferred();
    var door = $('.door');
    // 门相对于整个页面的left值
    var doorOffsetLeft = door.offset().left;
    // 小男孩当前的坐标
    var boyOffsetLeft = $boy.offset().left;

    // 当前需要移动的坐标
    instanceX = (doorOffsetLeft + door.width() / 2) - (boyOffsetLeft + $boy.width() / 2);
    // 走路
    var walkPlay = startRun({
      transform: 'translateX(' + instanceX + 'px), scale(.3, .3)',
      opacity: 0.1
    }, time);

    walkPlay.done(function() {
      $boy.css('opacity', 0);
      dfd.resolve();
    })

    return dfd;
  }

  // 走出商店
  function walkOutShop(time) {
    var defer = $.Deferred();
    restoreWalk();
    //开始走路
    var walkPlay = startRun({
      transform: 'translateX(' + instanceX + 'px),scale(1,1)',
      opacity: 1
    }, time);
    //走路完毕
    walkPlay.done(function() {
        defer.resolve();
    });
    return defer; 
  }

  // 拿花
  function takeFlower(time) {
    var defer = $.Deferred();
    setTimeout(function() {
      // 拿花动作
      $boy.addClass('takeFlower');
      defer.resolve();
    }, time);

    return defer;
  }

  // 动画结束事件
  var animationend = (function() {
    var explorer = navigator.userAgent;
    if (explorer.indexOf('webkit') > -1) {
      return 'webkitanimationend';
    }
    return 'animationend';
  })();

  return {
    // 开始走路
    walkTo: function(time, proportionX, proportionY) {
      var disX = calculateDist('x', proportionX);
      var disY = calculateDist('y', proportionY);

      return walkRun(time, disX, disY);
    },
    // 停止走路
    stopWalk: function() {
      pauseWalk();
    },
    setColor: function(value) {
      $boy.css('background-color',value);
    },
    // 进商店
    toShop: function() {
      return walkToShop.apply(null, arguments);
    },
    // 出商店
    outShop: function() {
      return walkOutShop.apply(null, arguments);
    },
    // 拿花
    takeFlower: function() {
      return takeFlower.apply(null, arguments);
    },
    // 获取自身宽度
    getWidth: function() {
      return $boy.width();
    },
    // 图片还原
    resetOriginal: function() {
      this.stopWalk();
      $boy.removeClass('slowWalk takeFlower').addClass('boyOriginal');
    },
    // 转身
    rotate(callback) {
      restoreWalk();
      $boy.addClass('boyRotate');
      // 转身完成后
      callback && $boy.on(animationend, function() {        
        callback();
        $(this).off();
      });
    }
  }
}