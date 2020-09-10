import asyncio
import websockets
import json

sockets = set()
players = {}


def player_connect():
    return json.dumps({"type": "PLAYERS", "data": len(sockets)})


def player_disconnect(id):
    return json.dumps({"type": "PLAYER_DISCONNECT", "data": {"player": id}})  # noqa


async def notify_players(msg):
    if sockets:
        await asyncio.wait([socket.send(msg) for socket in sockets])


async def register(websocket):
    sockets.add(websocket)
    await notify_players(player_connect())


async def unregister(websocket):
    sockets.remove(websocket)
    del players[websocket]
    await notify_players(player_connect())


async def connect(websocket, path):
    await register(websocket)
    try:
        async for msg in websocket:
            data = json.loads(msg)
            if data['type'] == 'PLAYER_CONNECTION':
                data = data['data']
                players[websocket] = data['player']
            await notify_players(msg)
    finally:
        await notify_players(player_disconnect(players[websocket]))
        await unregister(websocket)

start_server = websockets.serve(connect, "localhost", 3000)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
