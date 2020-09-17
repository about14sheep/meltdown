from .models import db, User, Lobby
from .config import Config
import os
import logging
import redis
import gevent
from flask import Flask, request, jsonify
from flask_sockets import Sockets
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
sockets = Sockets(app)
redis = redis.from_url(REDIS_URL)
db.init_app(app)
login_manager = LoginManager(app)
jwt = JWTManager(app)
CORS(app)


class WebSocket:
    def __init__(self):
        self.clients = list()
        self.pubsub = redis.pubsub()
        self.pubsub.subscribe(REDIS_CHAN)

    def __iter_data(self):
        for message in self.pubsub.listen():
            data = message.get('data')
            if message['type'] == 'message':
                app.logger.info(u'Sending message: {}'.format(data))
                yield data

    def register(self, client):
        self.clients.append(client)

    def send(self, client, data):
        try:
            client.send(data)
        except Exception:
            self.clients.remove(client)

    def run(self):
        for data in self.__iter_data():
            for client in self.clients:
                gevent.spawn(self.send, client, data)

    def start(self):
        gevent.spawn(self.run)


server = WebSocket()
server.start()


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


@sockets.route('/submit')
def submit_state(ws):
    while not ws.closed:
        gevent.sleep(0.1)
        message = ws.receive()
        if message:
            app.logger.info(u'Inserting message: {}'.format(message))
            redis.publish(REDIS_CHAN, message)


@sockets.route('/receive')
def recieve_state(ws):
    server.register(ws)
    while not ws.closed:
        gevent.sleep(0.1)
