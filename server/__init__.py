from .models import db, User, Lobby
from .config import Config
import os
import logging
import redis
import eventlet
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, join_room, leave_room
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
CORS(app)

if __name__ == "__main__":
    socketio.run(app)


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
        if not user or not user.check_password(password):
            return jsonify({"msg": "Password or Username do match"}), 401
    elif request.method == 'POST':
        username = request.json.get('username', None)
        if not username:
            return jsonify({"msg": "Missing username"}), 400
        user = User(username=username)
        user.password = password

    access_token = create_access_token(identity=username)
    user.session_token = access_token
    db.session.add(user)
    db.session.commit()
    return jsonify({'user': user.to_dict(), 'token': access_token}), 200


@socketio.on('join')
def on_join(data):
    print(data)
    userId = data['userId']
    room = data['room']
    join_room(room)
    send(userIs + ' has entered the room.', room=room)


@socketio.on('leave')
def on_leave(data):
    print(data)
    userId = data['userId']
    room = data['room']
    leave_room(room)
    send(userId + ' has left the room.', room=room)


@socketio.on('connect')
def handle_connection():
    print('hi')


@socketio.on('message')
def handle_message(message):
    print(message)
