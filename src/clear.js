var i;
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
        for(i=0;i<3;i++){
          var rp = new mode();
          rp.pictureValue = i;
          rp.setPosition( 60, 80*(i+1));
          rp.setScale(0.5);
          this.addChild(rp);
        }
      }

});
var mode = cc.Sprite.extend({
    ctor:function() {
        this._super();
        if(i==0)this.initWithFile(res.easy);
        if(i==1)this.initWithFile(res.nomal);
        if(i==2)this.initWithFile(res.hard);
        cc.eventManager.addListener(listener3.clone(), this);
    }
});
var listener3 = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    swallowTouches: true,
    onTouchBegan: function (touch, event) {
            var target = event.getCurrentTarget();
            var location = target.convertToNodeSpace(touch.getLocation());
            var targetSize = target.getContentSize();
            var targetRectangle = cc.rect(0, 0, targetSize.width, targetSize.height);
            if (cc.rectContainsPoint(targetRectangle, location)) {
              if(target.pictureValue == 0){
                level = [
                  [1, 1, 1, 1, 1, 1, 1],
                  [1, 1, 0, 0, 0, 0, 1],
                  [1, 0, 3, 0, 2, 0, 1],
                  [1, 0, 0, 4, 0, 0, 1],
                  [1, 0, 3, 0, 2, 0, 1],
                  [1, 0, 0, 1, 1, 1, 1],
                  [1, 1, 1, 1, 1, 1, 1]
                ];
              }
              if(target.pictureValue == 1){
                level = [
                  [1, 1, 1, 1, 1, 1, 1,1],
                  [1, 1, 1, 0, 0, 0, 0,1],
                  [1, 0, 3, 0, 2, 2, 0,1],
                  [1, 0, 0, 4, 3, 0, 0,1],
                  [1, 0, 3, 0, 2, 0, 0,1],
                  [1, 0, 0, 1, 1, 1, 0,1],
                  [1, 1, 1, 1, 1, 1, 1,1]
                ];
              }
              if(target.pictureValue == 2){
                level = [
                  [1, 1, 1, 1, 1, 1, 1,1,1],
                  [1, 1, 1, 1, 0, 0, 0,0,1],
                  [1, 0, 3, 2, 0, 2, 0,0,1],
                  [1, 0, 0, 4, 0, 3, 3,0,1],
                  [1, 0, 3, 0, 2, 2, 0,0,1],
                  [1, 0, 0, 1, 1, 1, 0,0,1],
                  [1, 1, 1, 1, 1, 1, 1,1,1]
                ];
              }
              map = target.pictureValue;
              cflag = 0;
              gameflag = 0;
              cc.director.runScene(new gameScene());
            }
    }
});
var OverScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var overlayer = new OverLayer();
        this.addChild(overlayer);
    }
});
