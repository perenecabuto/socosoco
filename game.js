function createNewGame() {
    new Game().init();
};

function Game() {
  var _self = this;

  this.objects = [];
  this.playerObject = null;

  this.init = function() {
    this.canvas = document.getElementById('board');
    this.context = this.canvas.getContext('2d');
    this.createPlayerObject();
    this.preparePlayerEvents();
    this.drawScreen();
  };

  this.createPlayerObject = function() {
    var fighter = new Fighter();
    this.playerObject = fighter;
    this.playerObject.x = this.canvas.width / 2;
    this.playerObject.y = this.canvas.height / 2;
    this.addObject(fighter);
  };

  this.preparePlayerEvents = function() {
    window.addEventListener('keyup', function(e) {
      _self.playerObject.stop();
    });

    window.addEventListener('keydown', function(e) {
      //console.log('moving');
      if (!(e && e.keyCode)) {
          return false;
      }

      _self.playerObject.move();

      switch(e.keyCode) {
        case 40:
        case 83:
          _self.playerObject.moveDown();
          break;
        case 38:
        case 87:
          _self.playerObject.moveUp();
          break;
        case 37:
        case 65:
          _self.playerObject.moveLeft();
          break;
        case 39:
        case 68:
          _self.playerObject.moveRight();
          break;
        case 32:
          _self.playerObject.punch();
          break;
        default:
          _self.playerObject.stop();
      };
    });
  };

  this.addObject = function(object) {
    this.objects.push(object);
  };

  this.drawScreen = function() {
    //console.log('drawing...');
    _self.cleanScreen();

    for (i in _self.objects) {
        var object = _self.objects[i];
        object.update(_self.context, _self.canvas);
    }

    setTimeout(_self.drawScreen, 150);
  };

  this.cleanScreen = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
};

var angle = 0;
function Fighter() {
  var STOPPED  = 1;
  var MOVING   = 2;
  var PUNCHING = 3;

  this.x = 0;
  this.y = 0;
  this.rotation = 0;
  this.stepSize = 10;
  this.rotationStep = 45;
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

  this.update = function(context, canvas) {
    context.save();

    this.x = this.x < 0 ? 0 : (this.x > canvas.width  ? canvas.width  : this.x);
    this.y = this.y < 0 ? 0 : (this.y > canvas.height ? canvas.height : this.y);


    context.translate(this.x + (this.size/2), this.y + (this.size/2));
    context.rotate(this.rotation * (Math.PI / 180));
    context.drawImage(this.getImage(), 0, 0, this.size * 2, this.size * 2, -this.size/2, -this.size/2, this.size, this.size);

    context.restore();

    context.font = 'bold 10px sans-serif';
    context.strokeText("Ang: " + this.rotation + " (X: " + Math.round(this.x) + " Y: " + Math.round(this.y) + ")", 10, 10);
  };

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


  this.moveUp = function() {
    this.step(false);
  };

  this.moveDown = function() {
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
      this.y -= this.getDirection(reverse) * this.stepSize * Math.cos((Math.PI / 180) * this.rotation);
      this.x += this.getDirection(reverse) * this.stepSize * Math.sin((Math.PI / 180) * this.rotation);
    }
  };

  this.rotate = function(reverse) {
    if (!this.isStopped()) {
      this.rotation += this.getDirection(reverse) * this.rotationStep;

      if (this.rotation >= 360 || this.rotation < -360) {
        this.rotation = 0;
      }
    }
  };

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
};

