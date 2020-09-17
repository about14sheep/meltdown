from server.models import User, Lobby
from server import app, db


with app.app_context():
    db.drop_all()
    db.create_all()

    ian = User(username='Ian', hashed_password='password')
    javier = User(username='Javier', hashed_password='password')
    dean = User(username='Dean', hashed_password='password')

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
