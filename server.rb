require 'bundler/setup'
require 'sinatra'
require 'em-websocket'
require 'json'

@session_players = {}
@id_seq = 0

class Player
  attr_accessor :id, :data, :created_at

  def initialize(options = {})
    self.id = options[:id]
    self.data = options[:data]
    self.created_at = Time.now
  end

  def attributes
    {:id => self.id, :data => self.data, :created_at => self.created_at}
  end
end

class App < Sinatra::Base
  set :sessions, true
  set :reload_templates, true
  set :public_folder, 'public'

  get '/' do
    erb :index
  end

end

EventMachine.run do     # <-- Changed EM to EventMachine
  EventMachine::WebSocket.start(:host => '0.0.0.0', :port => 5777) do |ws|
    ws.onopen {
      id = ws.request['cookie']
      player = @session_players[id] ||= Player.new(:id => (@id_seq += 1))

      puts "Open session: #{JSON.unparse(player.attributes)}"

      ws.send "{\"player\": #{JSON.unparse(player.attributes)}}"
    }

    ws.onmessage { |msg|
      id = ws.request['cookie']
      player = @session_players[id]
      challengers = @session_players.select {|k,v| k != id }.values

      puts "Update #{player}, Data #{msg}"
      player.data = JSON.parse msg
      resp = JSON.unparse(challengers.collect {|c| c.attributes })

      ws.send "{\"other\": #{resp}}"
    }

    ws.onclose   {
      id = ws.request['cookie']
      player = @session_players[id] ||= Player.new(:key => id)

      #puts "Close #{player}"
      #@session_players.delete(id)

      ws.send "true"
    }
  end

  App.run!({:port => 3000})
end

