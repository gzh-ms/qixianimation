(function() {
  // 容器
  var container = $('#content');
  // 容器宽高
  var visualWidth = container.width();
  var visualHeight = container.height();

  // 滑动对象
  var swipe = Swipe(container);
  // 小男孩
  var boy = BoyWalk();

  // 页面滚动到指定的位置
  function scrollTo(time, proportionX) {
    var x = visualWidth * proportionX;
    swipe.scrollTo(x, time);
  }

  // 开关门动画
  function doorAction(left, right, time) {    
    var doorLeft = $('.door_left');
    var doorRight = $('.door_right');
    var dfd = $.Deferred();
    var count = 2;
    // 开门完成
    function complete() {
      if (count == 1) {
        dfd.resolve();
        return;
      }
      count--;
    }      
    doorLeft.transition({
      left: left
    }, time, complete);
    doorRight.transition({
      left: right
    }, time, complete);

    return dfd;
  }

  // 开门
  function openDoor(time = 1000) {
    return doorAction('-50%', '100%', time);
  }

  // 关门
  function shutDoor(time = 1000) {
    return doorAction('0', '50%', time);
  }

  // 灯
  var lamp = {
    elem: $('.b_background'),
    bright: function() {
      this.elem.addClass('lamp-bright');
    },
    dark: function() {
      this.elem.removeClass('lamp-bright');
    }
  };

  // 鸟
  var bird = {
    elem: $('.bird'),
    fly: function() {
      this.elem.addClass('birdFly');
      this.elem.transition({
        right: '100%'
      }, 15000, 'linear');
    }
  };

  // 获取位置数据
  var getValue = function(className) {
    var $elem = $('' + className + '');
    return {
        height: $elem.height(), // 高度
        top: $elem.position().top // 距离容器顶部的距离
    };
  };

  // 桥距离容器顶部距离
  var bridgeY = function() {
    var data = getValue('.c_background_middle');
    return  data.top;
  }();

  // 小女孩
  var girl = {
    elem: $('.girl'),
    getHeight: function() {
      return this.elem.height();
    },
    setOffset: function() {
      this.elem.css({
        left: visualWidth / 2,
        top: bridgeY - this.getHeight()
      });
    },
    getOffset: function() {
      return this.elem.offset();
    },
    getWidth: function() {
      return this.elem.width();
    },
    rotate: function() {
      this.elem.addClass('girlRotate').removeClass;
    }
  };

  // 修正小女孩位置
  girl.setOffset();

  // logo
  var logo = {
    elem: $('.logo'),
    run: function() {
      this.elem.addClass('logoIn');
      this.elem.on('animationend webkitanimationend', function() {
          $(this).addClass('logoShake').off();
        })
    }
  };

  // 飘花
  var snowFlake = {
    elem: $('#snowFlake'),
    // 随机获取一张雪花图片地址
    getImageSrc: function() {
      var snowPics = ['./images/snowflake/snowflake1.png', './images/snowflake/snowflake2.png', './images/snowflake/snowflake3.png', './images/snowflake/snowflake4.png', './images/snowflake/snowflake5.png', './images/snowflake/snowflake6.png'];

      return snowPics[Math.floor(Math.random() * 6)];     
    },
    // 创建雪花节点
    createSnowElem: function() {
      var url = this.getImageSrc();

      return $('<div class="snowRotate"></div>').css({
        position: 'absolute',
        top: '-41px',
        zIndex: 100,
        width: '41px',
        height: '41px',
        background: 'url(' + url + ')'
      });
    },
    // 开始飘花
    start: function() {
      let count = 0;
      const _start = () => {
        count++;
        // 创建节点速度
        if (count > 10) {
          count = 0;
          // 运动轨迹
          var startPositionLeft = visualWidth * Math.random() - 100,
          startOpacity = 1,
          endPositionTop = visualHeight - 40,
          endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
          duration = visualHeight * 10 + Math.random() * 5000;

            // 随机透明度,不小于0.5
            var randomStart = Math.random();
            randomStart = randomStart < 0.5 ? startOpacity : randomStart;

            // 创建一个雪花
            var $snow = this.createSnowElem();

            // 设置起点left、opacity
            $snow.css({
              left: startPositionLeft,
              opacity: randomStart
            });

            //加入到容器
            this.elem.append($snow);

            // 开始执行动画
            $snow.transition({
              left: endPositionLeft,
              top: endPositionTop,
              opacity: 0.7
            }, duration, 'ease-out', function() {
              // 动画完成后删除该雪花节点
              $(this).remove();
            });           
          }
          requestAnimationFrame(_start);
        }
      requestAnimationFrame(_start);
    }
  };

  // 音乐
  var audio = {
    elem: null,
    // 参数
    config: {
      enable: true, // 是否开启音乐
      playURL: './music/happy.wav',
      cycleURL: './music/circulation.wav'
    },
    // 创建，播放
    html5Audio: function(url, isLoop) {
      var audio = this.elem = new Audio(url);
      audio.autoplay = true;
      audio.loop = isLoop || false;
      audio.play();
      return {
        end: function(callback) {
          // 音乐结束后
         audio.addEventListener('ended', function() {
            callback && callback();
          });
        }
      };
    },
    // 暂停
    pause: function() {
      this.elem.pause();
    },
    // 播放
    play: function() {
      this.elem.play();
    }
  };

  $('button:first').click(function() {
    // 太阳公转
    $('#sun').addClass('sunRotation');

    // 开启音乐
    var audio1 = audio.html5Audio(audio.config.playURL);
    // 第一段音乐结束后自动播放下一首
    audio1.end(function() {
      audio.html5Audio(audio.config.cycleURL);
    });

    // 小男孩走到第一幅 60%的位置
    boy.walkTo(8000, 0.5)
      .then(function() {
        // 页面切换到第二幅
        return swipe.scrollTo(visualWidth, 8000);
      })
      .then(function() {
        // 暂停走路
        boy.stopWalk();
      }).then(function() {
        // 开门
        return openDoor();
      })
      .then(function() {
        // 开灯
        lamp.bright();
      })
      .then(function() {
        // 走进商店
        return boy.toShop(1500);
      })
      .then(function() {
        // 拿花
        return boy.takeFlower(2000);
      })
      .then(function() {
        // 飞鸟
        bird.fly();
      })
      .then(function() {
        // 走出商店
        return boy.outShop(1500);
      })
      .then(function() {
        // 关门
        return shutDoor();
      })
      .then(function() {
        // 关灯
        lamp.dark();
      })
      .then(function() {
        // 回到视图起点。小男孩移动速度与页面切换速度一致，达到视觉差。
        boy.walkTo(10000, 0);
        // 切换页面到第三幅
        return swipe.scrollTo(visualWidth * 2, 10000);
      })
      .then(function() {
        // 走到桥边
        return boy.walkTo(5000, 0.15);
      })
      .then(function() {
        // 上桥
        return boy.walkTo(5000, 0.25, (bridgeY - girl.getHeight()) / visualHeight);
      })
      .then(function() {
        // 修正小男孩与小女孩的距离
        var proportionX = (girl.getOffset().left - boy.getWidth()) / visualWidth;
        // 走到小女孩面前
        return boy.walkTo(5000, proportionX);
      })
      .then(function() {
        // 男孩恢复拿花初始状态
        boy.resetOriginal();
      })
      .then(function() {
        // 等一秒后转身
        setTimeout(function() {
          // 小女孩转身
          girl.rotate();
          // 小男孩转身，转身完成后触发回调
          boy.rotate(function() {
            // logo动画
            logo.run();
            
            // 飘花
            snowFlake.start();
          });
        }, 3000);
      });
  });

  $('button:last').on('click', function() {
    var text = this.innerHTML;
    switch(text) {
      case '关闭音乐': 
        audio.pause();
        this.innerHTML = '开启音乐';
        break;
      case '开启音乐':
        audio.play();
        this.innerHTML = '关闭音乐';
        break;
      default: return null;
    }
  });
})();
