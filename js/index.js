var $ = require('./zepto');
var dom = require('./common/dom');
var url = require('./common/url');
var com = require('./common/const');
var MZGame = require('./game');
var $loading = $('#loading'), playImages = [], lucky={},
    $fourth = $('#fourth'), $third = $('#third'), $second=$('#second'), $btnGame=$('#btn-game'),
    rem=75, rankHeight=240,
    scale = +document.getElementsByTagName('html')[0].getAttribute('data-dpr'), $rankProcess=$('#rankProcess');
var dev = '../data.json',
    h5 = '../data.json';
var current = url.current(h5, dev),
    addUrl = current,
    giftUrl = current;

Zepto(function() {
    /**
     * 预加载图片
     */
    $("img[data-src]").each(function() {
        var $this = $(this);
        var src = $this.data('src');
        dom.preImage(src, function() {
            $this.attr('src', src);
        });
    });
    function next() {
        var $next = $(this).closest('section').hide().removeClass('fadeIn').next();
        $next.show().addClass('fadeIn');
        $next.find('aside').addClass('zoomIn');
    }

    /**
     * 游戏规则
     */
    $('#rule').on('click', function() {
        $(this).siblings('.dialog').show().addClass('zoomIn').removeClass('fadeOut');
    });
    /**
     * 开始游戏
     */
    $('#begin').on('click', function() {
        next.call(this);
    });
    /**
     * 弹出框
     */
    $('.btn-dialog').on('touchstart', function(e) {
        e.preventDefault();
        $(this).closest('aside').removeClass('zoomIn').hide();
        //$(this).hide();
    });
    /**
     * 开始游戏
     */
    $btnGame.on('touchstart', function() {
        interval();
        //requestAnimationFrame(interval2);
        MZGame.playGame();
        //move1();
    });
    /**
     * 选择战队
     */
    var $corps = $('#corps');
    var corps = ['车轮','喜马拉雅FM', '墨迹天气', '高夫']
    $corps.on('click', 'li', function(e) {
        var icon = +$(this).data('icon');
        $corps.data('current', icon);
        //选完后要将龙舟上的Logo标志修改
        $('#dragon-logo').attr('class', 'brand-'+icon);
        next.call(this);
    });
    /**
     * 查看优惠券
     */
    $('#btn-go').on('click', function() {
        next.call(this);
    });
    /**
     * 跳转
     */
    $('[data-href]').on('click', function() {
       location.href = $(this).data('href');
    });

    /**
     * 领奖逻辑
     */
    var $alert = $fourth.find('aside');
    $('#btnPrice').on('click', function() {
        var mobile = $.trim($('#mobile').val());
        if(!com.regex.mobile.test(mobile)) {
            $alert.find('p').html('请输入正确的手机号');
            $alert.show();
            return;
        }
        $loading.show();
        $.get(giftUrl, {}, function (json) {
            $loading.hide();

            if(json.code != 0) {
                $alert.find('p').html(json.message);
                $alert.show();
                return;
            }
            $alert.find('p').html('提交成功');
            $alert.show();
            setTimeout(function() {
                next.call($fourth);
            }, 1500);
        }, 'json');
    });
    var countdown, second = 9, count = 100;

    /**
     * 倒计时与游戏逻辑
     */
    var $thousand = $('#thousand'), $hundred=$('#hundred'), $decade = $('#decade');
    function interval() {
        countdown = setInterval(function() {
            if(second < 0) {
                $decade.html(0);//小数位赋0
                MZGame.gameover();
                clearInterval(countdown);
                //发送消息给服务器 添加游戏信息
                $loading.show();
                $.get(addUrl, {team_id: $corps.data('current')}, function(json) {
                    if(json.code != 0) {
                        $loading.find('p').html(json.message);
                        return;
                    }
                    var data = json.data;
                    lucky.is_lucky = data.is_lucky;
                    lucky.lucky_num = data.lucky_num;
                    lucky.rank_num = data.rank_num;
                    //处理第四屏
                    $('#luckNum').html(data.lucky_num);
                    $('#rankNum').html(data.rank_num);
                    if(lucky.is_lucky) {
                        $('#has-gift').show();
                    }else {
                        $('#no-gift').show();
                    }
                    //计算排行
                    var total = 0, numbers = [];
                    for(var i=1; i<=4; i++) {
                        var key = 'team_'+i, number;
                        if(!data[key]) {
                            number = 0;
                        }else {
                            number = +data[key];
                            total += number;
                        }
                        numbers.push(number);
                    }

                    numbers.forEach(function(value, key) {
                        var $p = $rankProcess.children('td').eq(key).find('p');
                        var height = value / total * rankHeight / rem;//计算柱状图，最后换算rem单位
                        $p.last().css('height', height+'rem');
                        $p.first().html(value);
                        //$last.html(value);
                    });

                    next.call($third);
                    $loading.hide();
                }, 'json');
            }
            count--;
            if(count <= 0) {
                count = 100;
                second--;
                if(second >= 0) {
                    $thousand.html(second);
                }
            }
            if(second >= 0) {
                $decade.html(count % 10);
                $hundred.html((count /10 >>0) % 10);
            }
            //$('#hundred').html((count /10) % 10);

        }, 10);
    }

    /**
     * 再玩一次
     */
    $('#btn-again').on('click', function() {
        $('#fifth').hide().removeClass('fadeIn');
        $second.show().addClass('fadeIn');
        $second.find('aside').addClass('zoomIn');

        //初始化游戏
        second = 9;
        count = 100;
        $thousand.html(second);
        MZGame.Stage.clear();
        $btnGame.closest('aside').show();
        $('#has-gift').hide();
        $('#no-gift').hide();
        //gameInit();
        //interval();
        //requestAnimationFrame(interval2);
        //MZGame.playGame();
    });

    /**
     * 炫耀一下
     */
    var $flaunt = $('#flaunt');
    $('#btnFlaunt').on('click', function() {
        if($flaunt.css('height') == '0px') {
            $flaunt.css('height', $(document).height());
        }
        $flaunt.show();
    });
    $flaunt.on('click', function() {
        $(this).hide();
    });

    var $canvas = $('#game');
    /**
     * 画布初始化
     */
    function canvas() {
        var winW = window.innerWidth,
            winH = window.innerHeight;
        $canvas[0].width = winW;
        $canvas[0].height = winH;
        $canvas.css({position:'absolute', display:'block', left:0, top:'20%'});
    }
    canvas();

    /**
     * 游戏图片预加载
     */
    playImages = [
        'img/gift1.png',
        'img/gift2.png',
        'img/gift3.png',
        'img/gift4.png',
        'img/gift5.png',
        'img/gift6.png',
        'img/gift7.png',
        'img/dragon-boat.png',
        'img/score.png',
        'img/corps.png',//display:none中的背景图将不会加载
        'img/game-bac.png',
        'img/countdown.png',
        'img/river.png',
        'img/boat-opacity-bac.png',
        'img/coupon-bac.png',
        'img/coupon.png',
        'img/weixin.jpg'
    ];
    dom.preImage(playImages, function() {
        //this.style.width = (this.width / rem) + 'rem';
        //this.style.height = (this.height / rem) + 'rem';
        //console.log(this)
    });

});

/**
 * 游戏初始化
 */
function gameInit() {
    var stage = new createjs.Stage("game");
    if(scale <= 1) {
        stage.scaleX = stage.scaleY = 0.5;
    }
    createjs.Ticker.on("tick", function(){
        if(!MZGame.gameEnd){
            stage.update();
        }
    });
    createjs.Ticker.setFPS(60);
    MZGame.init(stage);
    //使得画布可以触摸
    createjs.Touch.enable(stage, true);
}

window.onload = function() {
    gameInit();
    $loading.hide();
    $('#first').show();
};

/**
 * 错误信息
 * @param msg
 * @param url
 * @param line
 * @param col
 * @param error
 */
//window.onerror = function(msg, url, line, col, error) {
//    var newMsg = msg;
//    //alert(error)
//    if (error && error.stack) {
//        var stack = error.stack.replace(/\n/gi, "").split(/\bat\b/).slice(0, 9).join("@").replace(/\?[^:]+/gi, "");
//        var msg = error.toString();
//        if (stack.indexOf(msg) < 0) {
//            stack = msg + "@" + stack;
//        }
//        newMsg = stack;
//    }
//    var obj = {msg:newMsg, target:url, rowNum:line, colNum:col};
//    $('body')[0].innerHTML += line + ':'+''+'：<p>'+obj.msg+'</p>';
//    console.log(obj.msg)
//};