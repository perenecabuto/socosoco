function GameConnectionManager(uri, game) {
  var _self = this;

  this.game = game;
  this.websocket = new WebSocket(uri);
  this.persistentPlayers = [];
  this.currentPlayer = null;

  this.websocket.onopen = function(evt) {
    this.ready = true;
  };

  this.websocket.onmessage = function(evt) {
    //console.log('Data', evt.data);
    var response = JSON.parse(evt.data);

    if (response.player) {
      var player = _self.game.createPlayer();

      _self.currentPlayer = new PersistentObject(response.player.id, player);
      _self.currentPlayer.update(response.player.data);
      _self.game.prepareEvents(player);
    }

    if (response.other) {
      for (i in response.other) {
        var challenger_id = response.other[i].id;
        var challenger_data = response.other[i].data;
        var player; 

        for (i in _self.persistentPlayers) {
          var p = _self.persistentPlayers[i];
          if (p.id == challenger_id) {
            player = p;
          }
        }

        if (!player) {
          player = new PersistentObject(challenger_id, _self.game.createPlayer());
          _self.persistentPlayers.push(player);
        }

        player.update(challenger_data);
      }
    }
  };

  this.websocket.onerror = function(evt) {
      console.log('Error', evt.data);
  };

  this.websocket.onclose = function(evt) {
    this.ready = false;

    console.log('Close', evt.data);
  };

  this.persist = function() {
    if (this.websocket.ready) {
      this.websocket.send(this.currentPlayer.freeze());
    }
  }

  this.createChallenger = function() {
    var fighter = new Fighter();
    fighter.x = Math.round(Math.random() * game.canvas.width);
    fighter.y = Math.round(Math.random() * game.canvas.height);
    fighter.angle = Math.round(Math.random() * 360);
    this.game.addObject(fighter);
  };
}

function PersistentObject(id, object) {
  this.id = id;
  this.object = object;

  this.freeze = function() {
    return JSON.stringify(this.object.getAttrs());
  };

  this.update = function(value) {
    if (value) this.object.setAttrs(value);
  }
}
