function Fighter() {
  var STOPPED  = 1;
  var MOVING   = 2;
  var PUNCHING = 3;
  var DANCING  = 4;
  var DEAD     = 0;

  this.x = 0;
  this.y = 0;
  this.angle = 0;
  this.stepSize = 10;
  this.angleStep = 45;
  this.size = 32;
  this.state = STOPPED;

  this.images = {
    stopped: new Image(),
    idle1: new Image(),
    idle2: new Image(),
    moving1: new Image(),
    moving2: new Image(),
    punch_left: new Image(),
    punch_right: new Image(),
  };

  this.images.stopped.src = 'player_idle.png';
  this.images.idle1.src = 'player_idle1.png';
  this.images.idle2.src = 'player_idle2.png';
  this.images.moving1.src = 'player_moving_l.png';
  this.images.moving2.src = 'player_moving_r.png';
  this.images.punch_left.src = 'player_punch_l.png';
  this.images.punch_right.src = 'player_punch_r.png';


  this.isStopped = function() {
    return this.state == STOPPED;
  };

  this.isPunching = function() {
    return this.state == PUNCHING;
  };

  this.move = function() {
    this.state = MOVING;
  };

  this.stop = function() {
    this.state = STOPPED;
  };

  this.punch = function() {
    this.state = PUNCHING;
  }

  this.moveForward = function() {
    this.step(false);
  };

  this.moveBackward = function() {
    this.step(true)
  };

  this.moveRight = function() {
    this.rotate(false);
  };

  this.moveLeft = function() {
    this.rotate(true);
  };

  this.step = function(reverse) {
    reverse = reverse || false;
    mult = reverse ? -1 : +1;

    if (!this.isStopped()) {
      this.y += this.getDirection(reverse) * this.getNextYStep();
      this.x += this.getDirection(reverse) * this.getNextXStep();
    }
  };

  this.rotate = function(reverse) {
    if (!this.isStopped()) {
      this.angle += this.getDirection(reverse) * this.angleStep;

      if (this.angle >= 360 || this.angle < -360) {
        this.angle = 0;
      }
    }
  };

  this.getAngle = function() {
    angle = this.angle < 0 ? 360 + this.angle : this.angle;
    angle = Math.round(angle / this.angleStep) * this.angleStep;
    return angle;
  };

  this.getNextYStep = function() {
    return -1 * this.stepSize * Math.cos((Math.PI / 180) * this.angle);
  };

  this.getNextXStep = function() {
    return this.stepSize * Math.sin((Math.PI / 180) * this.angle)
  }

  this.getDirection = function(reverse) {
    reverse = reverse || false;
    return reverse ? -1 : +1;
  };

  this.getImage = function() {
    var image;

    this._movement = (!this._movement || this._movement > 1) ? 0 : 1;

    switch(this.state) {
      case STOPPED:
        image = this._movement == 0 ? this.images.idle1 : this.images.idle2;
        break;
      case PUNCHING:
        image = this._movement == 0 ? this.images.punch_left : this.images.punch_right;
        break;
      case MOVING:
        image = this._movement == 0 ? this.images.moving1 : this.images.moving2;
        break;
      default:
        image = this.images.stopped;
        break;
    }

    this._movement++;

    return image;
  };

  this.getAttrs = function() {
    var attrs = {};

    for (attr in this) {
      var value = this[attr];
      if (typeof(value) != 'function' && typeof(value) != 'object') {
        attrs[attr] = value;
      }
    }

    return attrs;
  };

  this.setAttrs = function(attrs) {
    if (typeof(attrs) != 'object') return false;
    for (a in this.getAttrs()) {
      if (typeof(attrs[a]) != 'undefined') {
        this[a] = attrs[a];
      }
    }
  };
};

