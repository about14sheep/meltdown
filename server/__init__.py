# Meltdown Atomic City
# Copyright (C) 2020 Austin Burger

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>


from .models import db, User, Lobby
from .config import Config
import os
import logging
import eventlet
import json
import random
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, join_room, leave_room, send, emit
from flask_cors import CORS
from flask_login import LoginManager, current_user, login_user, logout_user
from flask_jwt_extended import (
    jwt_required, create_access_token, get_jwt_identity, JWTManager
)

app = Flask(__name__)
app.config.from_object(Config)
logging.basicConfig(level=logging.DEBUG)
logging.getLogger('flask_cors').level = logging.DEBUG
# socketio = SocketIO(app, cors_allowed_origins='http://localhost:8080')
socketio = SocketIO(
    app, cors_allowed_origins='https://meltdowntts.herokuapp.com')
db.init_app(app)
login_manager = LoginManager(app)
jwt = JWTManager(app)
CORS(app)
lobbyImposters = {}
players = []


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


@app.route('/')
def index():
    return app.send_static_file("index.html")


@app.route('/api/session', methods=['POST'])
def auth():
    if not request.is_json:
        return {'msg': 'Missing JSON in request'}, 400
    username = request.json.get('username', None)
    if not username:
        return {"msg": "Enter a name"}, 400
    prevUser = User.query.filter_by(username=username).first()
    if prevUser:
        return {'user': prevUser.to_dict()}, 200
    user = User(username=username)
    db.session.add(user)
    db.session.commit()
    return {'user': user.to_dict()}, 200


@app.route('/api/lobbies')
def lobbies():
    lobbies = Lobby.query.all()
    return {'lobbies': [lobby.to_dict() for lobby in lobbies]}


@app.route('/api/lobby/<id>', methods=['GET', 'PUT'])
def lobby(id):
    lobby = Lobby.query.get(id)
    lob = lobby.to_dict()
    if request.method == 'PUT':
        if len(lob['players']) >= lob['player_max']:
            return False
        userId = json.loads(request.json)['id']
        user = User.query.get(userId)
        lobby.users.append(user)
        db.session.commit()
    return lob


def build_player(msg):
    return {
        'lobby': msg['lobby'],
        'id': msg['playerId']
    }


@socketio.on('join')
def on_join(data):
    join_room(data['lobby'])
    msg = {
        'type': 'PLAYER_CONNECTION',
        'lobby': data['lobby'],
        'data': {
            'player': data['playerId'],
            'username': data['username'],
            'position': {
                'x': 400,
                'y': 300
            }
        }
    }
    players.append((request.sid, build_player(data)))
    emit("message", msg, room=data['lobby'])


@socketio.on('leave')
def on_leave(data):
    leave_room(data['lobby'])
    playerToRemove = User.query.get(data['playerId'])
    db.session.remove(playerToRemove)
    msg = {
        'type': 'PLAYER_DISONNECT',
        'data': {
            'player': data['playerId']
        }
    }
    emit("message", msg, room=data['lobby'])


@socketio.on('disconnect')
def handle_disconnect():
    for player in players:
        if player[0] == request.sid:
            data = player[-1]
            lobby = Lobby.query.get(data['lobby'])
            playerToRemove = User.query.get(data['id'])
            lobby.users.remove(playerToRemove)
            players.remove(player)
            db.session.commit()
            leave_room(data['lobby'])
            msg = {
                'type': 'PLAYER_DISONNECT',
                'data': {
                    'player': data['id']
                }
            }
            emit("message", msg, room=data['lobby'])
            return


@socketio.on('message')
def handle_message(message, room):
    if message['type'] == 'GAME_START':
        data = message['data']
        if not message['lobby'] in lobbyImposters:
            lobbyImposters[message['lobby']] = random.sample(
                data['players'], 2 if len(data['players']) > 2 else 1)
        msg = {
            'type': 'START_GAME',
            'data': lobbyImposters[message['lobby']]
        }
        send(msg)
    else:
        send(message, room=room)


if __name__ == "__main__":
    socketio.run(app)
