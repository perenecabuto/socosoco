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
        object.update(_self.context);
    }

    setTimeout(_self.drawScreen, 100);
  };

  this.cleanScreen = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
};

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
    moving1: new Image(),
    moving2: new Image(),
    punch_left: new Image(),
    punch_right: new Image(),
  };

  this.images.stopped.src = 'player_idle.png';
  this.images.moving1.src = 'player_moving_l.png';
  this.images.moving2.src = 'player_moving_r.png';
  this.images.punch_left.src = 'player_punch_l.png';
  this.images.punch_right.src = 'player_punch_r.png';

  this.update = function(context) {
    //context.translate( this.x, this.y);
    //context.rotate(this.rotation * Math.PI * 180);
    context.drawImage(this.getImage(), this.x, this.y, this.size, this.size);
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
    if (!this.isStopped()) {
      this.y -= this.stepSize;
    }
  };

  this.moveDown = function() {
    if (!this.isStopped()) {
      this.y += this.stepSize;
    }
  };

  this.moveRight = function() {
    if (!this.isStopped()) {
      this.rotation += this.rotationStep;
    }
  };

  this.moveLeft = function() {
    if (!this.isStopped()) {
      this.rotation -= this.rotationStep;
    }
  };

  this.getImage = function() {
    var image;

    this._movement = (!this._movement || this._movement > 1) ? 0 : 1;

    switch(this.state) {
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

