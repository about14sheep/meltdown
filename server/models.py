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


from flask_sqlalchemy import SQLAlchemy
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
    username = db.Column(db.String(15), nullable=False)

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
        }


class Lobby(db.Model):
    __tablename__ = 'lobbies'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), nullable=False)
    password = db.Column(db.String(20))
    player_max = db.Column(db.Integer)
    player_count = db.Column(db.Integer)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'player_max': self.player_max,
            'players': [user.to_dict() for user in self.users]
        }
