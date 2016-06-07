
;(function (factory) {
    /* CommonJS module. */
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = factory(window);
        /* AMD module. */
    } else if (typeof define === "function" && define.amd) {
        define(factory(window));
        /* Browser globals. */
    } else {
        factory(window);
    }
}(function(global, undefined) {
    /**
     * 图片资源
     */
    var res = {
        img: {
            path: "img/",
            manifest: [{
                src: "gift1.png",
                id: "gift1"
            },{
                src: "gift2.png",
                id: "gift2"
            },{
                src: "gift3.png",
                id: "gift3"
            },{
                src: "gift4.png",
                id: "gift4"
            },{
                src: "gift5.png",
                id: "gift5"
            },{
                src: "gift6.png",
                id: "gift6"
            },{
                src: "gift7.png",
                id: "gift7"
            },{
                src: "score.png",
                id: "score"
            }]
        }
    };

    /**
     * 资源载入
     */
    var Loading = {};
    Loading.queue = {};
    Loading.init = function(stage,successCallBack){
        Loading.queue = new createjs.LoadQueue();
        Loading.queue.setMaxConnections(20);
        //Loading.queue.on("complete",successCallBack, null, !0);
        res.img && Loading.queue.loadManifest(res.img, !1);
        Loading.queue.load();

    };
    Loading.getResult = function(resName){
        return Loading.queue.getResult(resName);
    };

    var W, H;
    var JCGame = (function(obj){
        obj.score = 0;
        obj.init = false; //刚进入页面还未游戏
        obj.getResult = function(a) {
            return Loading.getResult(a)
        };
        obj.init = function(stage, $$Img) {
            Loading.init(stage);
            this.Stage = JCStage.Stage = stage;
            W = 750;
            H = 800;
            //Loading.loadImg($$Img);
        };
        //开始游戏
        obj.initGame = function() {
            //显示坑洞视图
            obj.score = 0;
        };
        //开始游戏
        obj.playGame = function(replay) {
            JCGame.gameEnd = false;
            JCGame.score = 0;
            JCStage.gameover = false;
            obj.vMove = new JCStage.vMove;
            this.Stage.addChild(obj.vMove);
        };
        function intNumber(n){
            return n < 10 ? '0'+n : n;
        }
        obj.gameover = function() {
            obj.gameEnd = true;
            JCStage.gameover = true;
        };
        return obj;
    })(JCGame || {})

    var JCStage = (function(obj){
        //var documentBounding = document.documentElement.getBoundingClientRect();
        obj.gameTime = 20,
            obj.interval = 1,
            obj.vStart = function(){
                this.initialize();
                this.x = this.y = 0;
                JCGame.init = true;
            };

        //顶部分数、计时器视图
        obj.vMove = function(){
            var _this = this;
            var gifts = new obj.vGift();
            this.addChild(gifts);
        };
        //礼物
        obj.vGift = function(){
            var _this = this;
            _this.y = 0;
            var timer = setInterval(function() {
                if(obj.gameover){
                    clearInterval(timer);
                    return;
                }

                var number = Math.randomInt(7) + 1;
                var gift = new createjs.Bitmap(Loading.getResult('gift'+number));

                gift.y = Math.randomInt(250);
                gift.x = 750;
                createjs.Tween.get(gift).to({ x:-750 }, 5000).call(function(){
                    gift.parent.removeChild(gift);
                });
                var bounds = gift.getBounds();
                gift.hitArea = new createjs.Shape;
                gift.hitArea.graphics.beginFill("#000").drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
                if(number < 5) {
                    gift.addEventListener('mousedown', function() {
                        //$('body').innerHTML += 1;
                        createjs.Tween.get(gift).to({y:550-gift.y},800*((550-gift.y)/550)).to({y:700-gift.y,alpha:0},300).call(function(){
                            if(gift.x > 15){
                                JCGame.score += 2;
                                var img = new createjs.Bitmap(Loading.getResult('score'));
                                //img.y = 500;
                                //img.x = 500;
                                img.regX = -(document.documentElement.getBoundingClientRect().width / 2);
                                img.regY = -(window.innerHeight / 2);
                                if(JCStage.Stage.scaleX < 1) {
                                    img.regX *= 2;
                                    img.regY *= 2;
                                }
                                //img.regX = 0;
                                //img.regY = 0;
                                _this.addChild(img);
                                //log(JCGame.score);
                                //var txt = new createjs.Text();
                                //txt.font = "130px Arial";
                                //txt.textBaseline = "middle";
                                //txt.textAlign = "center";
                                //txt.color = "#ff007d";
                                //txt.text = "+2";
                                //txt.y = -150;
                                //txt.X = 80;
                                //txt.regX = -txt.getBounds().width - 20;
                                //txt.regY = -txt.getBounds().height*5 + 10;
                                //_this.addChild(txt);
                                createjs.Tween.get(img).to({
                                        //y: txt.y - 50,
                                        y: img.y - 50,
                                        alpha: 0
                                    }, 500).call(function() {
                                    //txt.parent.removeChild(txt)
                                    img.parent.removeChild(img);
                                });
                            }
                        })
                    });
                }

                _this.addChild(gift);
            }, 400);
        };
        obj.vMove.prototype      =  new createjs.Container;
        obj.vGift.prototype      =  new createjs.Container;
        //createjs.DisplayObject.prototype.onClick = function(a){
        //    this.on("click",function(event) {
        //        createjs.Touch.isSupported() && event.nativeEvent.constructor == MouseEvent || a(event);
        //    })
        //};
        return obj;
    })(JCStage || {});

    Array.prototype.indexOf = function(a) {
        for (var b = 0; b < this.length; b++) {
            if (this[b] == a) return b;
        }
        return -1
    };
    Array.prototype.remove = function(a) {
        a = this.indexOf(a);
        a > -1 && this.splice(a, 1)
    };
    Math.randomInt = function(a) {
        return parseInt(Math.random() * a);
    };

    return JCGame;
}));