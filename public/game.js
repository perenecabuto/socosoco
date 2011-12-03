var game;

function createNewGame() {
    game = new Game();
    game.init();
};

function Game() {
  var _self = this;

  this.player = null;
  this.objects = [];

  this.init = function() {
    this.canvas = document.getElementById('board');
    this.context = this.canvas.getContext('2d');
    this.objectManager = new ObjectManager( this.context, this.canvas);
    this.drawScreen();
  };

  this.prepareEvents = function(player) {
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

    setTimeout(_self.drawScreen, 150);
  };

  this.cleanScreen = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
};

function ObjectManager(context, canvas) {

  this.context = context;
  this.canvas = canvas;

  this.updatePosition = function(object) {
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
          this.chove(object, currObj);
        }
      }
    }
  };

  this.chove = function(obj1, obj2) {
    var opositeAngle = false;
    var angle1 = obj1.getAngle();
    var angle2 = obj2.getAngle();
    var angSlices = 90 / obj1.angleStep;
    var obj = (angle1 =! angle2) ? obj1 : obj2;

    for (i = 1; i <= angSlices; i++) {
      if (opositeAngle) break;
      opositeAngle = Math.abs((i * angle1) - angle2) == 180;
    }

    movement = (opositeAngle) ? obj.moveBackward : obj.moveForward;
    obj.move();
    movement.call(obj);
    obj.stop();
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
