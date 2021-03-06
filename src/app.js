var size;



var back_level = [];
var back_crates = [];

var map = 0;    //マップ選択
var playerPosition; //マップ内のプレイやの位置(ｘ、ｙ)を保持する
var playerSprite; //プレイヤーのスプライト
var cratesArray = []; //配置した木箱のスプライトを配列に保持する
var cflag=0;      //ゲームクリアーフラグ
var gameflag=0;   //箱が穴に入っているかのフラグ

var startTouch;
var endTouch;
var swipeTolerance = 10;//スワイプかを判断する閾値

var gameScene = cc.Scene.extend({
  onEnter: function() {
    this._super();

    audioEngine = cc.audioEngine;

    var layer0 = new gameLayer();
    layer0.init();
    this.addChild(layer0);

  }
});

var gameLayer = cc.Layer.extend({
  init: function() {
    this._super();
    //スプライトフレームのキャッシュオブジェクトを作成する
    cache = cc.spriteFrameCache;
    //スプライトフレームのデータを読み込む
    cache.addSpriteFrames(res.spritesheet_plist);
    var backgroundSprite = cc.Sprite.create(cache.getSpriteFrame("background.png"));
    //アンチエイリアス処理を止める
    backgroundSprite.getTexture().setAliasTexParameters();


    backgroundSprite.setPosition(240, 160);
    //スプライトがとても小さいので拡大する
    backgroundSprite.setScale(5);
    this.addChild(backgroundSprite);

    //タイトルボタンの追加
    var title_button = new title_png();
    title_button.setPosition( 60, 150);
    title_button.setScale(0.5);
    this.addChild(title_button);
    //リセットボタンの追加
    var rp_png = new retry();
    rp_png.setPosition( 60, 100);
    rp_png.setScale(0.5);
    this.addChild(rp_png);
    //バックボタンの追加
    var back_button = new back();
    back_button.setPosition( 60,50);
    back_button.setScale(0.5);
    this.addChild(back_button);
    //下地になるものを作る
    for (i = 0; i < 7; i++) {　　　　　　
      for (j = 0; j < 9; j++) {
        switch (level[i][j]) {
          case 0:
          case 3:
          case 4:
            groundSprite = cc.Sprite.create(cache.getSpriteFrame("ground.png"));
            groundSprite.setPosition(165 + 25 * j, 185 - 25 * i);
            groundSprite.setScale(5);
            this.addChild(groundSprite);
            break;
          case 1:
            wallSprite = cc.Sprite.create(cache.getSpriteFrame("wall.png"));
            wallSprite.setPosition(165 + 25 * j, 185 - 25 * i);
            wallSprite.setScale(5);
            this.addChild(wallSprite);
            break;
          case 2:
            holeSprite = cc.Sprite.create(cache.getSpriteFrame("hole.png"));
            holeSprite.setPosition(165 + 25 * j, 185 - 25 * i);
            holeSprite.setScale(5);
            this.addChild(holeSprite);
            cflag+=1;
          break;
        }
      }
    }
    //プレイヤーや箱など動くものを作る
    for (i = 0; i < 7; i++) {　　　　　　
      cratesArray[i] = [];　 //配列オブジェクトの生成
      for (j = 0; j < 9; j++) {
        switch (level[i][j]) {
          case 4:
          case 6:
            playerSprite = cc.Sprite.create(cache.getSpriteFrame("player.png"));
            playerSprite.setPosition(165 + 25 * j, 185 - 25 * i);
            playerSprite.setScale(5);
            this.addChild(playerSprite);
            playerPosition = {
              x: j,
              y: i
            };　　　　　　　　　　　　
            cratesArray[i][j] = null;　 //playerがいるので、その場所には木箱はないのでnullを代入する
            break;
          case 3:
          case 5:
            var crateSprite = cc.Sprite.create(cache.getSpriteFrame("crate.png"));
            crateSprite.setPosition(165 + 25 * j, 185 - 25 * i);
            crateSprite.setScale(5);
            this.addChild(crateSprite);
            cratesArray[i][j] = crateSprite;//(i,j)の位置にcrateSpriteを入れる
            break;
          default:
            cratesArray[i][j] = null;//木箱のコード以外の場合は、その場所に木箱がない値としてnullを代入する
            break;
        }
      }
    }
    //return true;
    cc.eventManager.addListener(listener, this);
  },

});
//タイトルボタンの拡張
var title_png = cc.Sprite.extend({
    ctor:function() {
        this._super();
        this.initWithFile(res.title_png);
        cc.eventManager.addListener(title_go, this);
    }
});
//リセットボタンの拡張
var retry = cc.Sprite.extend({
    ctor:function() {
        this._super();
        this.initWithFile(res.rp_png);
        cc.eventManager.addListener(reset, this);
    }
});
//バックボタンの拡張
var back = cc.Sprite.extend({
    ctor:function() {
        this._super();
        this.initWithFile(res.back);
        cc.eventManager.addListener(back_go, this);
    }
});
var title_go = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    swallowTouches: true,
    onTouchBegan: function (touch, event) {
            var target = event.getCurrentTarget();
            var location = target.convertToNodeSpace(touch.getLocation());
            var targetSize = target.getContentSize();
            var targetRectangle = cc.rect(0, 0, targetSize.width, targetSize.height);
            if (cc.rectContainsPoint(targetRectangle, location)) {
              cc.director.runScene(new TitleScene());
            }
    }
});
var back_go = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    swallowTouches: true,
    onTouchBegan: function (touch, event) {
            var target = event.getCurrentTarget();
            var location = target.convertToNodeSpace(touch.getLocation());
            var targetSize = target.getContentSize();
            var targetRectangle = cc.rect(0, 0, targetSize.width, targetSize.height);
            if (cc.rectContainsPoint(targetRectangle, location)) {
              for (var i = 0; i < 7; i++){
                  for (var j = 0; j < 7; j++){
                    var copy1 = back_level[i][j];
                    level[i][j] = copy1;
                    switch (level[i][j]) {
                      case 4:
                      case 6:
                      playerSprite.setPosition(165 + 25 * j, 185 - 25 * i);
                      playerPosition = {
                        x: j,
                        y: i
                      };
                      var copy2 = back_crates[i][j];
                      cratesArray[i][j] = copy2;
                      break;
                      case 3:
                      case 5:
                      var copy2 = back_crates[i][j];
                      cratesArray[i][j] = copy2;
                      var crateSprite = cratesArray[i][j];

                      crateSprite.setPosition(165 + 25 * j, 185 - 25 * i);
                      break;
                      default:
                      var copy2 = back_crates[i][j];
                      cratesArray[i][j] = copy2;
                      break;
                    }
                  }
              }
            }
    }
});
//リセットボタンを押されたときの処理
var reset = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    swallowTouches: true,
    onTouchBegan: function (touch, event) {
            var target = event.getCurrentTarget();
            var location = target.convertToNodeSpace(touch.getLocation());
            var targetSize = target.getContentSize();
            var targetRectangle = cc.rect(0, 0, targetSize.width, targetSize.height);
            if (cc.rectContainsPoint(targetRectangle, location)) {
              if(map == 0){
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
              if(map == 1){
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
              if(map == 2){
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
              cflag = 0;
              gameflag = 0;
              cc.director.runScene(new gameScene());
            }
    }
});
//スワイプのタッチ感知
var listener = cc.EventListener.create({
  event: cc.EventListener.TOUCH_ONE_BY_ONE,
  swallowTouches: true,
  onTouchBegan:function (touch,event) {
    startTouch = touch.getLocation();
    return true;
  },
  onTouchEnded:function(touch, event){
    endTouch = touch.getLocation();
    swipeDirection();
  }
});
//スワイプ方向を検出する処理
function swipeDirection(){


    var distX = endTouch.x - startTouch.x ;
    var distY = endTouch.y - startTouch.y ;
    if(Math.abs(distX)+Math.abs(distY)>swipeTolerance){
        if(Math.abs(distX)>Math.abs(distY)){
            if(distX>0){//右方向移動
              //playerSprite.setPosition(playerSprite.getPosition().x+25,playerSprite.getPosition().y);
                move(1,0);
            }
            else{//左方向移動
              //playerSprite.setPosition(playerSprite.getPosition().x-25,playerSprite.getPosition().y);
                move(-1,0);
            }
        }
        else{
        //  console.log("endTouch.y "+endTouch.y );
        //  console.log("startTouch.y "+startTouch.y );
        //  console.log("distY "+ distY );
            if(distY>0){ //上方向移動
            //  playerSprite.setPosition(playerSprite.getPosition().x,playerSprite.getPosition().y+25)
              move(0,-1);

            }
            else{ //下方向移動
              //playerSprite.setPosition(playerSprite.getPosition().x,playerSprite.getPosition().y-25);
              move(0,1);
            }
        }
    }
}
//プレイヤー、箱の移動処理
function move(deltaX,deltaY){
  back_up();
switch(level[playerPosition.y+deltaY][playerPosition.x+deltaX]){
    case 0:
    case 2:
        level[playerPosition.y][playerPosition.x]-=4;
        playerPosition.x+=deltaX;
        playerPosition.y+=deltaY;
        level[playerPosition.y][playerPosition.x]+=4;
        audioEngine.playEffect(res.reg_se);
        playerSprite.setPosition(165+25*playerPosition.x,185-25*playerPosition.y);
    break;
    case 3:
    case 5:
        if(level[playerPosition.y+deltaY*2][playerPosition.x+deltaX*2]==0 ||
           level[playerPosition.y+deltaY*2][playerPosition.x+deltaX*2]==2){
            level[playerPosition.y][playerPosition.x]-=4;
            //console.log(level[playerPosition.y+deltaY][playerPosition.x+deltaX]);木箱移動前
            //if(level[playerPosition.y+deltaY][playerPosition.x+deltaX] == 5){
              //gameflag -= 1;
            //}
            playerPosition.x+=deltaX;
            playerPosition.y+=deltaY;
            level[playerPosition.y][playerPosition.x]+=1;
            playerSprite.setPosition(165+25*playerPosition.x,185-25*playerPosition.y);
            level[playerPosition.y+deltaY][playerPosition.x+deltaX]+=3;
            //console.log(level[playerPosition.y+deltaY][playerPosition.x+deltaX]);木箱移動後
            audioEngine.playEffect(res.hako_se);
            /*if(level[playerPosition.y+deltaY][playerPosition.x+deltaX]==5){
              gameflag += 1;
              if(gameflag == cflag){
                console.log("ガメクリア");
                cc.director.runScene(new OverScene());
              }
            }*/
            var movingCrate = cratesArray[playerPosition.y][playerPosition.x];
            movingCrate.setPosition(movingCrate.getPosition().x+25*deltaX,movingCrate.
            getPosition().y-25*deltaY);
            cratesArray[playerPosition.y+deltaY][playerPosition.x+deltaX]=movingCrate;
            cratesArray[playerPosition.y][playerPosition.x]=null;
        }
        break;
    }
    for (i = 0; i < 7; i++) {
      for (j = 0; j < 9; j++) {
        switch (level[i][j]) {
          case 5:
          gameflag += 1;
          if(gameflag == cflag){
            cc.director.runScene(new OverScene());
          }
          break;
      }
    }
  }
  gameflag = 0;
}
//一つ戻るためのバックアップ
function back_up(){
  for ( var i = 0;i < 7; i++){
    back_level[i] = [];
    back_crates[i] = [];
    for ( var j = 0; j < 9; j++){
      var copy1 = level[i][j];
      back_level[i][j] = copy1;
      var copy2 = cratesArray[i][j];
      back_crates[i][j] = copy2;
    }
  }
}
