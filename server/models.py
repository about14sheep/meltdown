from flask_sqlalchemy import SQLAlchemy

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
                             db.ForeignKey('lobbies.id')
                         ))


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(15), nullable=False, unique=True)
    hashed_password = db.Column(db.String(100), nullable=False)
    session_token = db.Column(db.String(50))

    lobbies = db.relationship('Lobby',
                              secondary=users_lobbies,
                              lazy='subquery',
                              backref=db.backref('users',
                                                 lazy=True)
                              )

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
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
