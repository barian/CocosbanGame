var OverLayer = cc.Layer.extend({
    ctor: function() {
        this._super();

        var size = cc.director.getWinSize();
        /*
                var sprite = cc.Sprite.create(res.HelloWorld_png);
                sprite.setPosition(size.width / 2, size.height / 2);
                sprite.setScale(0.8);
                this.addChild(sprite, 0);
        */
        var back_ground = cc.Sprite.create(res.ura);
        back_ground.setPosition(size.width / 2, size.height/2);
        this.addChild(back_ground);
        scoreText = cc.LabelTTF.create("ゲームクリアー" ,"Arial","30",cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(scoreText);
        scoreText.setPosition(size.width / 2, size.height / 2);
        cc.eventManager.addListener(title, this);

      }

});

//押されたときの処理
var title = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    swallowTouches: true,
    onTouchBegan: function (touch, event) {
    var titlescene = cc.TransitionFadeDown.create(1, new TitleScene());
    cc.director.runScene(titlescene);
    }
});
var OverScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var overlayer = new OverLayer();
        this.addChild(overlayer);
    }
});
