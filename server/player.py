import uuid


class Player:
    def __init__(self, socket):
        self.socket = socket
        self.id = uuid.uuid4()
        self.location = {'x': 0, 'y': 0}
