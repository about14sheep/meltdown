import asyncio
import websockets
import json

players = set()


def player_connect():
    return json.dumps({"type": "players", "count": len(players)})


async def notify_players(msg):
    if players:
        await asyncio.wait([player.send(msg) for player in players])


async def register(websocket):
    players.add(websocket)
    await notify_players(player_connect())


async def unregister(websocket):
    players.remove(websocket)
    await notify_players(player_connect())


async def connect(websocket, path):
    await register(websocket)
    try:
        async for msg in websocket:
            data = json.loads(msg)
            # await notify_players(msg)
    finally:
        await unregister(websocket)


start_server = websockets.serve(connect, "localhost", 3000)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
