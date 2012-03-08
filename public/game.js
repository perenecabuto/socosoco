var game;

function createNewGame() {
    game = new Game();
    game.init();
};

function Game() {
  var _self = this;

  this.player = null;
  this.objects = [];
  this.drawScreenCallback = function() {};

  this.init = function() {
    this.canvas = document.getElementById('board');
    this.context = this.canvas.getContext('2d');
    this.objectManager = new ObjectManager( this.context, this.canvas);
    this.drawScreen();
  };

  this.createPlayer = function() {
    var fighter = new Fighter();
    this.player = fighter;
    this.player.x = this.canvas.width / 2;
    this.player.y = this.canvas.height / 2;
    this.addObject(fighter);
    return fighter;
  };

  this.addObject = function(object) {
    this.objects.push(object);
    return this;
  };

  this.removeObject = function(object) {
    for (i in _self.objects) {
      if (_self.objects[i] == object) {
        _self.objects.splice(i,1);
        break;
      }
    }

    return object;
  };

  this.showInfo = function(player) {
    this.objectManager.showInfo(player);
  };

  this.drawScreen = function() {
    //console.log('drawing...');
    _self.cleanScreen();

    for (i in _self.objects) {
        var object = _self.objects[i];
        _self.objectManager.updatePosition(object);
    }

    _self.objectManager.updateForCollision(_self.objects);
    _self.drawScreenCallback(_self);

    setTimeout(_self.drawScreen, 150);
  };

  this.cleanScreen = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  this.prepareEvents = function(player) {
    var _self = this;

    window.addEventListener('keyup', function(e) {
      player.stop();
    });

    window.addEventListener('keydown', function(e) {
      //console.log('moving');
      if (!(e && e.keyCode)) {
          return false;
      }

      player.move();

      switch(e.keyCode) {
        case 40:
        case 83:
          player.moveBackward();
          break;
        case 38:
        case 87:
          player.moveForward();
          break;
        case 37:
        case 65:
          player.moveLeft();
          break;
        case 39:
        case 68:
          player.moveRight();
          break;
        case 32:
          player.punch();
          break;
        default:
          player.stop();
      };
    });
  };
};

  

