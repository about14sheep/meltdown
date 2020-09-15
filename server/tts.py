import asyncio
import websockets
import json

from player import Player

sockets = set()
players = {}


def socket_count():
    return json.dumps({
        "type": "SOCKET_COUNT",
        "data": len(sockets)
    })


def player_disconnect(id):
    return json.dumps({
        "type": "PLAYER_DISCONNECT",
        "data": {
            "player": id
        }
    })


def lobby_players():
    return json.dumps({
        "type": "LOBBY_PLAYERS",
        "data": [player.to_dict() for key, player in players.items()]
    })


async def notify_players(msg):
    if sockets:
        await asyncio.wait([socket.send(msg) for socket in sockets])


async def configure_lobby(websocket):
    await websocket.send(lobby_players())


async def register(websocket):
    sockets.add(websocket)
    await notify_players(socket_count())


async def unregister(websocket):
    sockets.remove(websocket)
    await notify_players(player_disconnect(players.pop(websocket).id))


async def connect(websocket, path):
    await register(websocket)
    try:
        async for msg in websocket:
            data = json.loads(msg)
            if data['type'] == 'PLAYER_CONNECTION':
                await configure_lobby(websocket)
                data = data['data']
                players[websocket] = Player(data['player'], data['position'])
            elif data['type'] == 'PLAYER_POSITION':
                data = data['data']
                players[websocket].location = data['position']
            await notify_players(msg)
    finally:
        await unregister(websocket)


start_server = websockets.serve(connect, "localhost", 3000)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
