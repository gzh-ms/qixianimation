/* 页面滑动
* @param {[type]} container 页面容器节点
*/
function Swipe(container) {
  // 获取第一个子节点
  var element = container.find(':first');

  // 滑动对象
  var swipe = {};

  // 获取li数量
  var slides = element.find('> li');

  // 获取容器尺寸
  var width = container.width();
  var height = container.height();

  // 设置li页面总宽度
  element.css({
    width: slides.length * width + 'px',
    height: height + 'px'
  });

  // 设置每个li页面宽度
  $.each(slides, function(_, slide) {
    $(slide).css({
      width: width + 'px',
      height: height + 'px'
    });
  });

  // api，监控完成与移动
  swipe.scrollTo = function(x, time) {
    // 动画
    var defer = $.Deferred();
    element.css({
      transform: 'translate3d(-'+ x + 'px, 0, 0)',
      'transition-duration': time + 'ms',
      'transition-timing-function': 'linear'
    });
    // 动画结束后
    element.on('transitionend', function() {
      defer.resolve();      
    });
    return defer;
  };

  return swipe;
}