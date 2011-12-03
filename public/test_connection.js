var connection;

function prepareConnection() {
  connection = new GameConnectionManager('ws://' + window.location.hostname + ":8080", game);
}

var testConnection = function() {
  connection.persist();
  setTimeout(testConnection, 100);
}

window.addEventListener('load', prepareConnection, false);
window.addEventListener('load', testConnection, false);
