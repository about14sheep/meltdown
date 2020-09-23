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
import redis
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, join_room, leave_room, send, emit
from flask_cors import CORS
from flask_login import LoginManager, current_user, login_user, logout_user
from flask_jwt_extended import (
    jwt_required, create_access_token, get_jwt_identity, JWTManager
)

REDIS_URL = os.environ.get('REDIS_URL')
REDIS_CHAN = 'game'

app = Flask(__name__)
app.config.from_object(Config)
logging.basicConfig(level=logging.DEBUG)
redis = redis.from_url(REDIS_URL)
socketio = SocketIO(app, cors_allowed_origins='http://localhost:8080')
db.init_app(app)
login_manager = LoginManager(app)
jwt = JWTManager(app)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:8080"}})
players = []


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


@app.route('/')
def index():
    res = User.query.all()
    return {'users': [user.to_dict() for user in res]}


@app.route('/api/session', methods=['PUT', 'POST', 'DELETE'])
def auth():
    if not request.is_json:
        return jsonify({'msg': 'Missing JSON in request'}), 400

    if request.method == 'DELETE':
        id = request.json.get('userId', None)
        user = User.query.filter(User.id == id).first()
        user.session_token = None
        db.session.add(user)
        db.session.commit()
        return jsonify({'msg': 'Session token removed'}), 200

    username = request.json.get('username', None)
    password = request.json.get('password', None)

    if not username:
        return jsonify({"msg": "Missing username"}), 400
    if not password:
        return jsonify({"msg": "Missing password"}), 400

    if request.method == 'PUT':
        user = User.query.filter(User.username == username).first()
        print(user.password == password)
        print(user.check_password('password'))
        if not user or not user.check_password(password):
            return jsonify({"msg": "Password or Username dont match"}), 401
    elif request.method == 'POST':
        username = request.json.get('username', None)
        if not username:
            return jsonify({"msg": "Missing username"}), 400
        user = User(username=username)
        user.password = password
    access_token = create_access_token(identity=username)
    user.session_token = access_token
    login_user(user)
    db.session.add(user)
    db.session.commit()
    return jsonify({'user': user.to_dict(), 'token': access_token}), 200


@app.route('/api/lobbies')
def lobbies():
    lobbies = Lobby.query.all()
    return {'lobbies': [lobby.to_dict() for lobby in lobbies]}


@app.route('/api/lobby/<id>', methods=['GET', 'PUT'])
def lobby(id):
    lobby = Lobby.query.get(id)
    if request.method == 'PUT':
        if len(lobby.users) >= lobby.player_max:
            return False
        userId = request.json.get('id')
        user = User.query.get(userId)
        user.lobbies.append(lobby)
        db.session.commit()
        return lobby.to_dict()
    return lobby.to_dict()


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
    print('player_disconnect')
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
            players.remove(player)
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
    send(message, room=room)


if __name__ == "__main__":
    socketio.run(app)
