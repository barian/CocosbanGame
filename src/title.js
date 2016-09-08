var TitleLayer = cc.Layer.extend({
    ctor: function() {
        this._super();

        var size = cc.director.getWinSize();
        /*
                var sprite = cc.Sprite.create(res.HelloWorld_png);
                sprite.setPosition(size.width / 2, size.height / 2);
                sprite.setScale(0.8);
                this.addChild(sprite, 0);
        */
        //難易度の表示
        var title = cc.Sprite.create(res.description_png);
        title.setPosition(size.width / 2, size.height/1.65);
        title.setScale(0.725,0.6);
        this.addChild(title);
        for(i=0;i<3;i++){
          var rp = new mode();
          rp.pictureValue = i;
          rp.setPosition( 120*(i+1), 60);
          rp.setScale(0.5);
          this.addChild(rp);
        }
      }

});
//拡張
var mode = cc.Sprite.extend({
    ctor:function() {
        this._super();
        if(i==0)this.initWithFile(res.easy);
        if(i==1)this.initWithFile(res.nomal);
        if(i==2)this.initWithFile(res.hard);
        cc.eventManager.addListener(lis.clone(), this);
    }
});
//押されたときの処理
var lis = cc.EventListener.create({
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
                  [1, 1, 3, 0, 2, 0, 1],
                  [1, 0, 0, 4, 0, 0, 1],
                  [1, 0, 3, 1, 2, 0, 1],
                  [1, 0, 0, 1, 1, 1, 1],
                  [1, 1, 1, 1, 1, 1, 1]
                ];
              }
              if(target.pictureValue == 1){
                level = [
                  [1, 1, 1, 1, 1, 1, 1,1],
                  [1, 1, 0, 0, 0, 1, 0,1],
                  [1, 1, 3, 0, 2, 2, 0,1],
                  [1, 0, 0, 4, 3, 0, 1,1],
                  [1, 0, 3, 1, 2, 0, 0,1],
                  [1, 0, 0, 1, 1, 1, 0,1],
                  [1, 1, 1, 1, 1, 1, 1,1]
                ];
              }
              if(target.pictureValue == 2){
                level = [
                  [1, 1, 1, 1, 1, 1, 1,1,1],
                  [1, 1, 1, 1, 0, 0, 1,1,1],
                  [1, 0, 0, 2, 0, 2, 0,0,1],
                  [1, 0, 3, 4, 1, 3, 3,0,1],
                  [1, 0, 3, 0, 2, 2, 0,0,1],
                  [1, 0, 0, 1, 1, 0, 0,1,1],
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
var TitleScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var titlelayer = new TitleLayer();
        this.addChild(titlelayer);
    }
});
