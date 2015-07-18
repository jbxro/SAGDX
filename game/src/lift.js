var Lift = function(conflux, game, x, y, group, waypoints, speed){
  if(typeof group === 'undefined'){ group = game.world; }
  if(typeof speed === 'undefined') { speed = 10; }
  Phaser.Sprite.call(this, game, x, y, 'lift');
  game.physics.arcade.enable(this);
  group.add(this);
  this.body.setSize(64,32);
  this.mobType = "lift";
  this.body.immovable = true;
  this.waypoints = waypoints;
  this.conflux = conflux;
  this.paused = false;

  this.cConstants = {
    speed: speed*gridSize
  }

  this.nextWaypoint = {
    index: 0,
    x: this.waypoints[0].x*gridSize,
    y: this.waypoints[0].y*gridSize
  }

  if(this.nextWaypoint.x < this.body.x){
    this.nextWaypoint.directionX = -1;
  } else if(this.nextWaypoint.x > this.body.x) {
    this.nextWaypoint.directionX = 1;
  } else {
    this.nextWaypoint.directionX = 0;
  }
  if(this.nextWaypoint.y < this.body.y){
    this.nextWaypoint.directionY = -1;
  } else if(this.nextWaypoint.y > this.body.y) {
    this.nextWaypoint.directionY = 1;
  } else {
    this.nextWaypoint.directionY = 0;
  }

  this.body.velocity.x = this.nextWaypoint.directionX * this.cConstants.speed;
  this.body.velocity.y = this.nextWaypoint.directionY * this.cConstants.speed;

  this.update = function(){

    if(this.paused){
      this.body.velocity.x = 0;
      this.body.velocity.y = 0;
    } else {

      reachedX = this.nextWaypoint.directionX == 0 || (this.nextWaypoint.directionX < 0 && this.body.x < this.nextWaypoint.x)
      reachedX = reachedX || (this.nextWaypoint.directionX > 0 && this.body.x > this.nextWaypoint.x)

      reachedY = this.nextWaypoint.directionY == 0 || (this.nextWaypoint.directionY < 0 && this.body.y < this.nextWaypoint.y)
      reachedY = reachedY || (this.nextWaypoint.directionY > 0 && this.body.y > this.nextWaypoint.y)

      // Don't go past our target point
      if(reachedX){
        this.body.x = this.nextWaypoint.x;
      }
      if(reachedY){
        this.body.y = this.nextWaypoint.y;
      }

      // Move, unless we've reached our target, in which case set next target
      if(reachedX && reachedY){
        if(this.nextWaypoint.destroy){
          this.destroy();
        } else {
          this.setNextWaypoint();
        }
      } else {
        if(!reachedX){
          this.body.velocity.x = this.nextWaypoint.directionX * this.cConstants.speed;
        }
        if(!reachedY){
          this.body.velocity.y = this.nextWaypoint.directionY * this.cConstants.speed;
        }
      }
    }
  }

  this.setNextWaypoint = function(){

    if(this.nextWaypoint.index == 1){
      this.nextWaypoint.index = 0;
    } else {
      this.nextWaypoint.index = 1;
    }
    this.nextWaypoint.x = this.waypoints[this.nextWaypoint.index].x*gridSize;
    this.nextWaypoint.y = this.waypoints[this.nextWaypoint.index].y*gridSize;
    if(this.waypoints[this.nextWaypoint.index].destroy){
      this.nextWaypoint.destroy = true;
    }
    if(this.nextWaypoint.x < this.body.x){
      this.nextWaypoint.directionX = -1;
    } else if(this.nextWaypoint.x > this.body.x) {
      this.nextWaypoint.directionX = 1;
    } else {
      this.nextWaypoint.directionX = 0;
    }
    if(this.nextWaypoint.y < this.body.y){
      this.nextWaypoint.directionY = -1;
    } else if(this.nextWaypoint.y > this.body.y) {
      this.nextWaypoint.directionY = 1;
    } else {
      this.nextWaypoint.directionY = 0;
    }
    this.body.velocity.x = this.nextWaypoint.directionX * this.cConstants.speed;
    this.body.velocity.y = this.nextWaypoint.directionY * this.cConstants.speed;
  }

  this.setPause = function(pause){
    this.paused = pause;
  }

  this.debugString = function(){
    return "PLATFORM: [pos:"+Math.floor(this.body.x)+"/"+Math.floor(this.body.y)+"][target:"+this.nextWaypoint.x+"/"+this.nextWaypoint.y+"]"+
      "[looking:"+this.nextWaypoint.directionX+"/"+this.nextWaypoint.directionY+"][moving:"+this.body.velocity.x+"/"+this.body.velocity.y+"]";
  }
}

Lift.prototype = Object.create(Phaser.Sprite.prototype);
Lift.prototype.constructor = Lift;
