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
        scoreText = cc.LabelTTF.create("ゲームクリアー" ,"Arial","30",cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(scoreText);
        scoreText.setPosition(size.width / 2, size.height / 2);
        level = [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 0, 0, 0, 0, 1],
          [1, 0, 3, 0, 2, 0, 1],
          [1, 0, 0, 4, 0, 0, 1],
          [1, 0, 3, 0, 2, 0, 1],
          [1, 0, 0, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1]
        ];
        cflag = 0;
        gameflag = 0;
        // タップイベントリスナーを登録する
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);

        return true;
    },

    onTouchBegan: function(touch, event) {
        return true;
    },
    onTouchMoved: function(touch, event) {},
    onTouchEnded: function(touch, event) {
        // 次のシーンに切り替える
        cc.director.runScene(new gameScene());
    },
});

var OverScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var overlayer = new OverLayer();
        this.addChild(overlayer);
    }
});
