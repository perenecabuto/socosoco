var game;

function createNewGame() {
    game = new Game();
    game.init();
};

function Game() {
  var _self = this;

  this.objects = [];
  this.player = null;

  this.init = function() {
    this.canvas = document.getElementById('board');
    this.context = this.canvas.getContext('2d');
    this.objectManager = new ObjectManager( this.context, this.canvas);
    this.createPlayerObject();
    this.preparePlayerEvents();
    this.createChallenger();
    this.createChallenger();
    this.drawScreen();
  };

  this.createPlayerObject = function() {
    var fighter = new Fighter();
    this.player = fighter;
    this.player.x = this.canvas.width / 2;
    this.player.y = this.canvas.height / 2;
    this.addObject(fighter);
  };

  this.createChallenger = function() {
    var fighter = new Fighter();
    fighter.x = Math.round(Math.random() * game.canvas.width);
    fighter.y = Math.round(Math.random() * game.canvas.height);
    fighter.angle = Math.round(Math.random() * 360);
    this.addObject(fighter);
  };

  this.preparePlayerEvents = function() {
    window.addEventListener('keyup', function(e) {
      _self.player.stop();
    });

    window.addEventListener('keydown', function(e) {
      //console.log('moving');
      if (!(e && e.keyCode)) {
          return false;
      }

      _self.player.move();

      switch(e.keyCode) {
        case 40:
        case 83:
          _self.player.moveBackward();
          break;
        case 38:
        case 87:
          _self.player.moveForward();
          break;
        case 37:
        case 65:
          _self.player.moveLeft();
          break;
        case 39:
        case 68:
          _self.player.moveRight();
          break;
        case 32:
          _self.player.punch();
          break;
        default:
          _self.player.stop();
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
        _self.objectManager.update(object);
    }

    _self.objectManager.updateForCollision(_self.objects);

    _self.objectManager.showInfo(_self.player);

    setTimeout(_self.drawScreen, 150);
  };

  this.cleanScreen = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
};

function ObjectManager(context, canvas) {

  this.context = context;
  this.canvas = canvas;

  this.update = function(object) {
    this.context.save();

    object.x = object.x < 0 ? 0 : (object.x > this.canvas.width  ? this.canvas.width  : object.x);
    object.y = object.y < 0 ? 0 : (object.y > this.canvas.height ? this.canvas.height : object.y);

    this.context.translate(object.x + (object.size/2), object.y + (object.size/2));
    this.context.rotate(object.angle * (Math.PI / 180));
    this.context.drawImage(object.getImage(), 0, 0, object.size * 2, object.size * 2, -object.size/2, -object.size/2, object.size, object.size);

    this.context.restore();
  };

  this.updateForCollision = function(objects) {
    for (i in objects) {
      var object = objects[i];
      var nextStep = {x: object.getNextXStep(), y: object.getNextYStep()};

      for (i in objects) {
        var currObj = objects[i];
        if (object != currObj && this.getDistance(object, currObj) <= object.size / 2) {
          object.move();
          object.moveBackward();
          object.stop();
        }
      }
    }
  };

  this.getDistance = function(obj1, obj2) {
    return Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2));
  };

  this.showInfo = function(object) {
    var angle = object.angle;
    var dimensions = [Math.round(object.x), Math.round(object.y)];

    this.context.font = '10px sans-serif';
    this.context.strokeText("Ang: " + angle + " (X: " + dimensions[0] + " Y: " + dimensions[1] + ")", 10, 10);
    this.context.strokeText("SETAS para andar, ESPACO para Bater =)", 60, 145);
  };
}


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

  this.getNextYStep = function() {
    return -1 * this.stepSize * Math.cos((Math.PI / 180) * this.angle);
  };

  this.getNextXStep = function() {
    return this.stepSize * Math.sin((Math.PI / 180) * this.angle)
  }

  this.rotate = function(reverse) {
    if (!this.isStopped()) {
      this.angle += this.getDirection(reverse) * this.angleStep;

      if (this.angle >= 360 || this.angle < -360) {
        this.angle = 0;
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

