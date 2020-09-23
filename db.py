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

from werkzeug.security import generate_password_hash
from dotenv import load_dotenv

from server.models import User, Lobby
from server import app, db

load_dotenv()

with app.app_context():
    db.drop_all()
    db.create_all()

    ian = User(username='Ian',
               password='password')
    javier = User(username='Javier',
                  password='password')
    dean = User(username='Dean',
                password='password')

    lobby1 = Lobby(name='Lobby One', player_max=10)
    lobby2 = Lobby(name='lobby two', player_max=8)

    ian.lobbies.append(lobby1)
    javier.lobbies.append(lobby1)
    dean.lobbies.append(lobby1)
    javier.lobbies.append(lobby2)

    db.session.add(ian)
    db.session.add(javier)
    db.session.add(dean)
    db.session.commit()
