var introState = {
  // Settings
  runSpeed: 15,
  maxJumpHeight: 4*gridSize,
  minJumpHeight: 1*gridSize,
  jumpSpeed: 20*gridSize,
  maxJumpReduction: 0.7,
  fallSpeed: 20*gridSize,

  // State Variables
  jumping: false,
  jumpStart: 0,
  jumpHeight: 0,
  jumpReduction: 0,
  landed: false,
  debug:false,
  preload: function(){
    this.game.load.tilemap('map', 'data/tiles_map.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap('bg_map', 'data/bg_tiles_map.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap('collision_map', 'data/collision_tiles_map.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tiles', 'assets/level_tileset.png');
    this.game.load.image('bg_tiles', 'assets/bg_tileset.png');
    this.game.load.image('collision_tiles', 'assets/collision_tileset.png');
    this.game.load.image('player', 'assets/player1.png');
  },
  create: function(){
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.map = this.game.add.tilemap('map');
    this.layer = this.map.createLayer('tiles_layer');
    this.map.addTilesetImage('tiles');
    this.layer.resizeWorld();

    this.bgMap = this.game.add.tilemap('bg_map');
    this.bgMap.addTilesetImage('bg_tiles');
    this.bgMap.createLayer('bg_tiles_layer');

    this.collisionMap = this.game.add.tilemap('collision_map');
    this.collisionLayer = this.collisionMap.createLayer('collision_tiles_layer');
    this.collisionMap.addTilesetImage('collision_tiles');
    this.collisionMap.setCollision(1, true, this.collisionLayer);
    this.collisionLayer.visible = false;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.stage.backgroundColor = 808080;

    this.player = this.game.add.sprite(60, 200, 'player');
    this.player.anchor.setTo(0.5, 0.5);
    this.game.physics.arcade.enable(this.player);
    this.player.body.gravity.y = 0;
    this.player.body.collideWorldBounds = true;
    this.game.camera.follow(this.player);
    if(this.debug){
      this.debugText = this.game.add.text(5, 50, 'DEBUG INFO ', { fontSize: '8px', fill: '#000' });
    }
  },
  update: function(){
    this.game.physics.arcade.collide(this.player, this.collisionLayer);
    this.updatePlayer();

    if(this.debug){
      this.debugText.text = "DEBUG INFO - Player Info: [X:"+this.player.x+"] [Y:"+this.player.y+"]\n"+
          "[MIN JUMP HEIGHT:"+this.minJumpHeight+"] [MAX JUMP HEIGHT:"+this.maxJumpHeight+"]\n"+
          "[JUMP HEIGHT:"+this.jumpHeight+"] [JUMPING:"+this.jumping+"] [OKAY TO JUMP:"+this.landed+"] [SPEED REDUCTION:"+this.jumpReduction+"]";
    }
  },
  updatePlayer: function(){
    this.player.body.velocity.x = 0;

    // Horizontal Movement
    if(this.cursors.left.isDown){
      this.player.body.velocity.x = gridSize*-this.runSpeed;
    }
    else if(this.cursors.right.isDown){
      this.player.body.velocity.x = gridSize*this.runSpeed;
    }

    // Jumps
    /// Check if we can jump
    if(this.player.body.onFloor() && this.landed){
      this.landed = true;
    } else if(this.player.body.onFloor() && this.cursors.up.isUp){
      this.landed = true;
    } else {
      this.landed = false;
    }

    /// Start a Jump
    if(this.landed && this.cursors.up.isDown) {
      this.jumping = true;
      this.jumpStart = this.player.body.y;
    }
    
    /// Handle a Jump
    if(this.jumping){
      this.jumpHeight = Math.floor(this.jumpStart - this.player.body.y)
      if(this.jumpHeight >= this.maxJumpHeight || this.player.body.blocked.up || this.cursors.up.isUp){
        this.jumping = false;
        this.player.body.velocity.y = 0;
        if(this.jumpHeight < this.minJumpHeight){
          this.jumping = true;
          this.player.body.velocity.y = -this.jumpSpeed
        }
      } else {
        this.jumpReduction = 0;
        if(this.jumpHeight >= this.minJumpHeight){
          this.jumpReduction = (this.jumpHeight - this.minJumpHeight) / (this.maxJumpHeight - this.minJumpHeight);
          if(this.jumpReduction > this.maxJumpReduction){
            this.jumpReduction = this.maxJumpReduction;
          }
        }
        this.player.body.velocity.y = - (this.jumpSpeed - (this.jumpSpeed * this.jumpReduction));
      }
    } else {
      this.player.body.gravity.y = gridSize*40;
    }
    if(this.player.body.velocity.y > this.fallSpeed){
      this.player.body.velocity.y = this.fallSpeed;
    }
  }
}
