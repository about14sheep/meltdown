import asyncio
import websockets


async def connect(websocket, path):
    res = await websocket.recv()
    print(f'{res}')
    msg = f'from server: {res}'
    await websocket.send(msg)


start_server = websockets.serve(connect, "localhost", 3000)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
