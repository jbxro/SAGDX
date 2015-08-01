SAGDX.level1State = function(game){};

SAGDX.level1State.prototype = {
  // Settings
  timeMultiplier: 400,

  // State Variables
  debugMode:false,
  justToggled:null,
  paused:false,
  events: [],
  eventSpawns: [],
  eventActivations: [],
  dialogue: null,
  textIndent: "           ",

  create: function(){
    this.game.world.alpha = 1;
    this.mobs = this.game.add.group();
    this.lifts = this.game.add.group();
    this.turrets = this.game.add.group();
    this.blasts = this.game.add.group();
    this.game.renderer.renderSession.roundPixels = true;

    this.map = this.game.add.tilemap('level1ForegroundLayerMap');
    this.map.addTilesetImage('tileset');
    this.foregroundLayer = this.map.createLayer('foregroundLayer');
    this.foregroundLayer.resizeWorld();
    this.foregroundLayer.renderSettings.enableScrollDelta = false;

    this.bgMap = this.game.add.tilemap('level1BackgroundLayerMap');
    this.bgMap.addTilesetImage('tileset');
    this.backgroundLayer = this.bgMap.createLayer('backgroundLayer');
    this.backgroundLayer.renderSettings.enableScrollDelta = false;

    this.collisionMap = this.game.add.tilemap('level1CollisionLayerMap');
    this.collisionMap.addTilesetImage('tileset');
    this.collisionLayer = this.collisionMap.createLayer('collisionLayer');
    this.collisionMap.setCollision(1, true, this.collisionLayer);
    this.collisionLayer.visible = false;

    this.parabgsBack = this.game.add.group();
    this.parabg1 = new ParaBackground(this, this.game, 0, 0.5, 0.8, this.parabgsBack, "parabackground3");
    this.parabg1.animations.add("full");
    this.parabg1.animations.play('full', 30, true);
    this.parabg2 = new ParaBackground(this, this.game, 768, 0.5, 0.8, this.parabgsBack, 'parabackground3');
    this.parabg2.animations.add("full");
    this.parabg2.animations.play('full', 30, true);

    this.parabgsBackPaused = this.game.add.group();
    this.parabg1p = new ParaBackground(this, this.game, 0, 0.5, 0.8, this.parabgsBackPaused, "parabackground3p");
    this.parabg1p.animations.add("full");
    this.parabg2p = new ParaBackground(this, this.game, 768, 0.5, 0.8, this.parabgsBackPaused, 'parabackground3p');
    this.parabg2p.animations.add("full");
    this.parabg2p.visible = false;

    this.parabgsFront = this.game.add.group();
    this.parabg3 = new ParaBackground(this, this.game, 0, 0.45, 0.8, this.parabgsFront, "parabackground1");
    this.parabg3.animations.add("full");
    this.parabg3.animations.play('full', 30, true);
    this.parabg4 = new ParaBackground(this, this.game, 768, 0.45, 0.8, this.parabgsFront, 'parabackground1');
    this.parabg4.animations.add("full");
    this.parabg4.animations.play('full', 30, true);

    this.parabgsFrontPaused = this.game.add.group();
    this.parabg3p = new ParaBackground(this, this.game, 0, 0.45, 0.8, this.parabgsFrontPaused, "parabackground1p");
    this.parabg3p.animations.add("full");
    this.parabg4p = new ParaBackground(this, this.game, 768, 0.45, 0.8, this.parabgsFrontPaused, 'parabackground1p');
    this.parabg4p.animations.add("full");
    this.parabg4p.visible = false;

    this.overlays = this.game.add.group();
    this.overlay1 = new ParaBackground(this, this.game, 0, 0, 0.8, this.overlays, 'overlay');

    var distanceFilterGraphic = new Phaser.Graphics().beginFill(0x000000).drawRect(0,0,this.game.camera.width,this.game.camera.height);
    this.distanceFilter1 = this.game.add.sprite(0,0,distanceFilterGraphic.generateTexture());
    this.distanceFilter1.alpha = 0.1;
    this.distanceFilter1.fixedToCamera = true;
    this.distanceFilter2 = this.game.add.sprite(0,0,distanceFilterGraphic.generateTexture());
    this.distanceFilter2.alpha = 0.6;
    this.distanceFilter2.fixedToCamera = true;

    this.distanceFilter1p = this.game.add.sprite(0,0,distanceFilterGraphic.generateTexture());
    this.distanceFilter1p.alpha = 0.1;
    this.distanceFilter1p.fixedToCamera = true;
    this.distanceFilter1p.visible = false;
    this.distanceFilter2p = this.game.add.sprite(0,0,distanceFilterGraphic.generateTexture());
    this.distanceFilter2p.alpha = 0.6;
    this.distanceFilter2p.fixedToCamera = true;
    this.distanceFilter1p.visible = false;

    this.pauseTexts = [];

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.stage.backgroundColor = 000000;

    this.player = new Player(this, this.game, 3*gridSize, 15*gridSize, 'player');
    this.game.camera.follow(this.player);

    /***** TERRIBLE ****/
    this.bonuses = this.game.add.group();
    this.bonus1 = this.game.add.sprite(48*gridSize,1*gridSize, 'tinroof');
    this.bonus1.animations.add("full");
    this.bonus1.animations.play('full', 10, true);
    this.bonuses.add(this.bonus1);
    this.bonus2 = this.game.add.sprite(161*gridSize,63*gridSize, 'showerwithdad');
    this.bonus2.animations.add("full");
    this.bonus2.animations.play('full', 10, true);
    this.bonuses.add(this.bonus2);

    this.door = this.game.add.sprite(268*gridSize,73*gridSize+4, 'door');
    this.door.frame = 1;
    this.bonuses.add(this.door);

    this.backtrash = this.game.add.group();
    this.trash1 = this.game.add.sprite(-3*gridSize, 31*gridSize, 'trashpile');
    this.trash1.frame = 0;
    this.backtrash.add(this.trash1);
    this.trash2 = this.game.add.sprite(4*gridSize, 35*gridSize, 'trashpile');
    this.trash2.frame = 0;
    this.backtrash.add(this.trash2);

    this.fronttrash = this.game.add.group();
    this.trash3 = this.game.add.sprite(3*gridSize, 34*gridSize+9, 'smalltrashpile');
    this.trash3.frame = 0;
    this.fronttrash.add(this.trash3);
    this.trash4 = this.game.add.sprite(14*gridSize, 34*gridSize+9, 'smalltrashpile');
    this.trash4.frame = 0;
    this.fronttrash.add(this.trash4);
    /*******************/

    this.keyboard = this.game.input.keyboard;
    this.timerEvents = [];

    this.eventSpawns = [];
    var spawnList = JSON.parse(this.game.cache.getText('level1Spawns'));
    var ii, spawnDef;
    for(var ii=0; ii < spawnList.length; ii+=1){
      spawnDef = spawnList[ii];
      if(spawnDef.trigger){
        this.eventSpawns.push(spawnDef);
      } else {
        for(var jj=0; jj < spawnDef.spawns.length; jj+=1){
          if(spawnDef.type=="once"){
              this.spawnMob(spawnDef.unit, spawnDef.spawns[jj].x*gridSize, spawnDef.spawns[jj].y*gridSize, spawnDef.spawns[jj].firstWaypoint);
          } else if(spawnDef.type=="continous"){
              this.spawnMob(spawnDef.unit, spawnDef.spawns[jj].x*gridSize, spawnDef.spawns[jj].y*gridSize, spawnDef.spawns[jj].firstWaypoint);
              this.timerEvents.push(this.game.time.events.loop(spawnDef.interval*this.timeMultiplier, this.spawnMob, this, spawnDef.unit, spawnDef.spawns[jj].x*gridSize, spawnDef.spawns[jj].y*gridSize));
          }
        }
      }
    }

    var thisEvent;
    this.events = JSON.parse(this.game.cache.getText('level1Events'));
    for(var ii=0; ii < this.events.length; ii+=1){
      thisEvent = this.events[ii];
      thisEvent.triggered = false;
      if(thisEvent.x){ thisEvent.x *= gridSize; }
      if(thisEvent.y){ thisEvent.y *= gridSize; }
      if(thisEvent.x2){ thisEvent.x2 *= gridSize; }
      if(thisEvent.y2){ thisEvent.y2 *= gridSize; }
      if(thisEvent.type=="dialogue"){
        thisEvent.resultCallbackName = "sendDialogue";
      } else if(thisEvent.type=="transition"){
        thisEvent.resultCallbackName = "touchDoor";
      } else if(thisEvent.type=="spawn"){
        thisEvent.resultCallbackName = "spawnEvent";
      } else if(thisEvent.type=="activation"){
        thisEvent.resultCallbackName = "checkActivations";
      }
    }

    this.game.world.bringToTop(this.parabgsBackPaused);
    this.game.world.bringToTop(this.distanceFilter2p);
    this.game.world.bringToTop(this.parabgsFrontPaused);
    this.game.world.bringToTop(this.distanceFilter1p);
    this.game.world.bringToTop(this.parabgsBack);
    this.game.world.bringToTop(this.distanceFilter2);
    this.game.world.bringToTop(this.parabgsFront);
    this.game.world.bringToTop(this.distanceFilter1);
    this.game.world.bringToTop(this.overlays);
    this.game.world.bringToTop(this.backtrash);
    this.game.world.bringToTop(this.turrets);
    this.game.world.bringToTop(this.backgroundLayer);
    this.game.world.bringToTop(this.mobs);
    this.game.world.bringToTop(this.lifts);
    this.game.world.bringToTop(this.bonuses);
    this.game.world.bringToTop(this.player);
    this.game.world.bringToTop(this.blasts);
    this.game.world.bringToTop(this.foregroundLayer);
    this.game.world.bringToTop(this.fronttrash);

    if(this.debugMode){
      this.debugText = this.game.add.text(5, 50, 'DEBUG INFO ', { fontSize: '10px', fill: '#FFF' });
      this.debugText.fixedToCamera = true;
    }

    if(!music.isPlaying){
      music.play('', 0, 1, true);
    }
    music.volume = 1;
    ambience.volume = 0.5;

    //this.game.add.tween(this.game.world).to({ alpha:1 }, 750).start();
  },
  update: function(){
    if(this.debugMode){
      this.debugText.text = "";
    }

    if(this.dialogue){
      this.processDialogue();
    } else {
      this.checkInput();

      this.game.physics.arcade.collide(this.mobs, this.lifts);
      if(!this.player.cState.hurt){
        this.game.physics.arcade.collide(this.player, this.mobs, this.customMobContact, null, this);
      }
      this.game.physics.arcade.collide(this.player, this.turrets, this.customMobContact, null, this);
      this.game.physics.arcade.collide(this.player, this.collisionLayer, this.customTileContact, null, this);
      this.game.physics.arcade.collide(this.mobs, this.collisionLayer);
      this.game.physics.arcade.collide(this.player, this.lifts, this.customMobContact, null, this);

      this.game.physics.arcade.collide(this.player, this.blasts, this.customMobContactedBy, null, this);
      this.game.physics.arcade.collide(this.blasts, this.collisionLayer, this.customTileContact, null, this);
      this.game.physics.arcade.collide(this.blasts, this.blasts, this.customMobContact, null, this);
      this.game.physics.arcade.collide(this.blasts, this.turrets, this.customMobContact, null, this);
      this.game.physics.arcade.collide(this.blasts, this.mobs, this.customMobContact, null, this);

      if(this.debugMode){
        this.debugText.text += "Player: "+this.player.debugString()+"\n";
        conflux = this;
        this.mobs.forEach(function(mob){conflux.debugText.text += mob.mobType+": "+mob.debugString()+"\n";});
        this.lifts.forEach(function(mob){conflux.debugText.text += mob.mobType+": "+mob.debugString()+"\n";});
      }

      this.checkEvents();

    }

    if(this.player.cState.outOfBounds){
      this.goToState("Level1");
    }
  },
  customMobContact: function(firstObject, secondObject){
    firstObject.mobContact(secondObject);
  },
  customMobContactedBy: function(firstObject, secondObject){
    secondObject.mobContact(firstObject);
  },
  customTileContact: function(firstObject, secondObject){
    firstObject.tileContact(secondObject);
  },
  spawnMob: function(unit, xCoord, yCoord, firstWaypoint){
    var mob;
    if(unit.type=="truck"){
      mob = new Truck(this, this.game, xCoord, yCoord, this.mobs, unit.facing, unit.speed, unit.paused);
    } else if(unit.type=="carrier"){
      mob = new Carrier(this, this.game, xCoord, yCoord, this.lifts, unit.facing, unit.waypoints, firstWaypoint, unit.speed, unit.paused);
    } else if(unit.type=="lift"){
      mob = new Lift(this, this.game, xCoord, yCoord, this.lifts, unit);
    } else if(unit.type=="turret"){
      mob = new Turret(this, this.game, xCoord, yCoord, this.turrets, unit);
    } else if(unit.type=="bigblast"){
      mob = new BigBlast(this, this.game, xCoord, yCoord, this.blasts, unit.facing, unit.speed, unit.paused);
    } else if(unit.type=="littleblast"){
      mob = new LittleBlast(this, this.game, xCoord, yCoord, this.blasts, unit.facing, unit.speed, unit.paused);
    } else if(unit.type=="floater"){
      mob = new Floater(this, this.game, xCoord, yCoord, this.mobs, unit.facing, unit.waypoints, firstWaypoint, unit.speed, unit.paused);
    } else if(unit.type=="flag"){
      mob = this.add.sprite(xCoord, yCoord, 'flag');
    }
    return mob;
  },

  checkInput: function(){
    if(this.justToggled){
      if(!this.keyboard.isDown(this.justToggled)){
        this.justToggled = null;
      }
    } else {
      if(this.keyboard.isDown(72)){
        this.justToggled = 72;
        if(this.player.cState.hurt){
          this.player.cancelHurt();
        }else{
          this.player.hurt();
        }
        this.backgroundLayer.visible=false;
      }
      if(this.keyboard.isDown(70)){
        this.justToggled = 70;
        if(this.player.cState.flying){
          this.player.cState.flying=false;
        }else{
          this.player.cState.flying=true;
        }
      }
      if(this.keyboard.isDown(13)){
        this.justToggled = 13;
        this.enablePause();
      }
      if(this.player.cState.paused){
        if( this.keyboard.isDown(32) ||
            this.player.cursors.left.isDown ||
            this.player.cursors.right.isDown ||
            this.player.cursors.up.isDown ||
            this.player.cursors.down.isDown){
          this.player.setPause(false);
        }
      }
      if(this.keyboard.isDown(82)){
        this.justToggled = 82;
        this.goToState("Level1");
      }
    }
  },
  newPauseText: function(){
    var x = this.game.camera.x + this.game.camera.width/2;
    var y = this.game.camera.y + this.game.camera.height/2;
    var sprite = this.game.add.sprite(x, y-10, 'pausetext');
    sprite.anchor.setTo(0.5, 0.5);
    return sprite;
  },
  enablePause: function(){
    music.volume = 0.3;
    ambience.volume = 0;
    sfx.stop();
    this.pauseTexts.push(this.newPauseText());
    this.mobs.forEach(function(mob){
      mob.setPause(true);
    });
    this.turrets.forEach(function(mob){
      mob.setPause(true);
    });
    this.lifts.forEach(function(lift){
      lift.setPause(true);
    });
    this.blasts.forEach(function(blast){
      blast.setPause(true);
    });

    if(!this.paused){
      // Pause Backgrounds
      this.parabg1.animations.paused = true;
      this.parabg1.visible = false;
      this.parabg1p.visible = true;
      this.parabg1p.animations.frame = this.parabg1.animations.frame;
      this.parabg2.animations.paused = true;
      this.parabg2.visible = false;
      this.parabg2p.visible = true;
      this.parabg2p.animations.frame = this.parabg2.animations.frame;

      this.parabg3.animations.paused = true;
      this.parabg3.visible = false;
      this.parabg3p.visible = true;
      this.parabg3p.animations.frame = this.parabg3.animations.frame;
      this.parabg4.animations.paused = true;
      this.parabg4.visible = false;
      this.parabg4p.visible = true;
      this.parabg4p.animations.frame = this.parabg4.animations.frame;

      this.distanceFilter1.visible = false;
      this.distanceFilter2.visible = false;
      this.distanceFilter1p.visible = true;
      this.distanceFilter2p.visible = true;

      // PAUSE TILES
      var tilecount = 54;
      for(var ii=0; ii < tilecount; ii+=1){
        this.bgMap.swap(ii, ii+tilecount);
        this.map.swap(ii, ii+tilecount);
      }
    }

    this.player.setPause(true);
    for (var i=0; i<this.timerEvents.length; i++){
      this.game.time.events.remove(this.timerEvents[i]);
    }
    this.paused = true;
  },
  checkEvents: function(){
    var nextEvent;
    for(var ii = 0; ii < this.events.length; ii += 1){
      nextEvent = this.events[ii];
      if(!nextEvent.triggered){
        if(nextEvent.triggerType == "pass"){
          if(nextEvent.x < this.player.body.x){
            this.triggerEvent(nextEvent);
          }
        } else if(nextEvent.triggerType == "inside"){
          var betweenSides = (this.player.body.x > nextEvent.x) && (this.player.body.right < nextEvent.x2);
          var underAndOver = (this.player.body.y > nextEvent.y) && (this.player.body.bottom < nextEvent.y2);
          if(betweenSides && underAndOver){
            this.triggerEvent(nextEvent);
          }
        }
      }
    }
  },
  triggerEvent: function(newEvent){
    if(!newEvent.repeats){
      newEvent.triggered = true;
    }
    this[newEvent.resultCallbackName](newEvent);
  },
  sendDialogue: function(newEvent){
    this.enablePause();
    var dialogueElement = newEvent.dialogue;
    var name = dialogueElement[0].speaker;
    var text = this.textIndent+dialogueElement[0].text;

    if(name == "Unknown"){
      this.dialogueBox = this.game.add.sprite(30, 220, 'unknownDialogBox');
      this.speakerPortrait = this.game.add.sprite(4,4, 'unknownFace');
    } else if(name == "Factory"){
      this.dialogueBox = this.game.add.sprite(30, 220, 'factoryDialogBox');
      this.speakerPortrait = this.game.add.sprite(8,8, 'factoryFace');
    }
    this.speakerPortrait.animations.add("full");
    this.speakerPortrait.animations.play('full', 10, true);
    this.dialogueBox.addChild(this.speakerPortrait);
    this.dialogueBox.fixedToCamera = true;
    this.speakerName = this.game.add.text(120, 15, name, {font: '16px Lato', fill: '#000', wordWrap: true, wordWrapWidth: 200});
    this.dialogueBox.addChild(this.speakerName);
    this.dialogueText = this.game.add.text(45, 50, text, { font: '20px Lato Black', fill: '#000', wordWrap: true, wordWrapWidth: 600});
    this.dialogueBox.addChild(this.dialogueText);
    this.dialogue = {
      index: 0,
      element: dialogueElement
    };

    if(this.keyboard.isDown(32)){
      this.justToggled = 32;
    }
  },
  spawnEvent: function(newEvent){
    var ii, spawnDef;
    for(ii = 0; ii < this.eventSpawns.length; ii += 1){
      spawnDef = this.eventSpawns[ii];
      if(spawnDef.trigger == newEvent.name){
        for(var jj=0; jj < spawnDef.spawns.length; jj+=1){
          if(spawnDef.type=="once"){
              this.spawnMob(spawnDef.unit, spawnDef.spawns[jj].x*gridSize, spawnDef.spawns[jj].y*gridSize, spawnDef.spawns[jj].firstWaypoint);
          } else if(spawnDef.type=="continous"){
              this.spawnMob(
                spawnDef.unit, spawnDef.spawns[jj].x*gridSize, spawnDef.spawns[jj].y*gridSize, spawnDef.spawns[jj].firstWaypoint
              );
              this.timerEvents.push(this.game.time.events.loop(spawnDef.interval*this.timeMultiplier, this.spawnMob, this,
                spawnDef.unit, spawnDef.spawns[jj].x*gridSize, spawnDef.spawns[jj].y*gridSize, spawnDef.spawns[jj].firstWaypoint));
          }
        }
      }
    }
  },
  checkActivations: function(newEvent){
    for(var ii = 0; ii < this.eventActivations.length; ii += 1){
      if(this.eventActivations[ii].activatedBy.indexOf(newEvent.activates) >= 0){
        this.eventActivations[ii].activate(newEvent.activates);
      }
    }
  },
  processDialogue: function(){
    if(this.justToggled){
      if(!this.keyboard.isDown(this.justToggled)){
        this.justToggled = null;
      }
    } else {
      if(this.keyboard.isDown(32)){
        this.justToggled = 32;
        this.advanceDialogue();
      }
    }
  },
  advanceDialogue: function(){
    this.dialogue.index += 1;
    if(this.dialogue.element[this.dialogue.index]){
      var line = this.dialogue.element[this.dialogue.index];
      if(line.speaker == "Unknown"){
        this.dialogueBox.loadTexture('unknownDialogBox');
        this.speakerPortrait.loadTexture('unknownFace');
      } else if(line.speaker == "Factory"){
        this.dialogueBox.loadTexture('factoryDialogBox');
        this.speakerPortrait.loadTexture('factoryFace');
      }
      this.speakerName.text = line.speaker
      this.dialogueText.text = this.textIndent + line.text;
    }else{
      this.dialogueText.text = "";
      this.speakerName.text = "";
      this.dialogue = null;
      this.dialogueBox.destroy();
    }
  },
  touchDoor: function(event){
    this.player.cState.inputDisabled = true;
    this.player.steps.stop();
    this.goToState(event.target);
  },
  goToState: function(state){
    //var fadeOut = this.game.add.tween(this.game.world).to({ alpha:0 }, 720);
    //fadeOut.onComplete.add(function(){
      this.events = [];
      this.eventSpawns = [];
      this.eventActivations = [];
      this.paused = false;
      this.player.steps.stop();
      this.state.start(state);
    //}, this);
    //fadeOut.start();
  }

}
