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

    lobby1 = Lobby(name='West Wing B Reactor', player_max=8)
    lobby2 = Lobby(name='Fifth Floor Laboratories', player_max=8)
    lobby3 = Lobby(name='Cafeteria Waiting Room', player_max=8)
    lobby4 = Lobby(name='Atomic City Freeway Truck Stop', player_max=8)
    lobby5 = Lobby(name='Factory Floor', player_max=8)

    db.session.add(lobby1)
    db.session.add(lobby2)
    db.session.add(lobby3)
    db.session.add(lobby4)
    db.session.add(lobby5)
    db.session.commit()
