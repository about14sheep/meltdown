import os
import logging
import redis
import gevent
from flask import Flask
from flask_sockets import Sockets
from flask_login import LoginManager

from .config import Config
from .models import db, User, Lobby

REDIS_URL = os.environ.get('REDIS_URL')
REDIS_CHAN = 'game'

app = Flask(__name__)
app.config.from_object(Config)
logging.basicConfig(level=logging.DEBUG)
sockets = Sockets(app)
redis = redis.from_url(REDIS_URL)
db.init_app(app)
login_manager = LoginManager()


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
