from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

db = SQLAlchemy()

users_lobbies = db.Table('userslobbies',
                         db.Column(
                             'user_id',
                             db.Integer,
                             db.ForeignKey('users.id'),
                             primary_key=True
                         ),
                         db.Column(
                             'lobby_id',
                             db.Integer,
                             db.ForeignKey('lobbies.id'),
                             primary_key=True
                         ))


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(15), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    session_token = db.Column(db.String(500))

    lobbies = db.relationship('Lobby',
                              secondary=users_lobbies,
                              lazy='subquery',
                              backref=db.backref('users',
                                                 lazy=True)
                              )

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'hashed_password': self.hashed_password,
            'session_token': self.session_token,
            'lobbies': [lobby.to_dict() for lobby in self.lobbies]
        }


class Lobby(db.Model):
    __tablename__ = 'lobbies'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(20))
    player_max = db.Column(db.Integer)
    player_count = db.Column(db.Integer)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'player_max': self.player_max,
            'player_count': self.player_count
        }
