class Player:
    def __init__(self, id, location):
        self.__id = id
        self.__location = location

    @property
    def id(self):
        return self.__id

    @id.setter
    def id(self, value):
        self.__id = value

    @property
    def location(self):
        return self.__location

    @location.setter
    def location(self, value):
        self.__location = value

    def to_dict(self):
        return {
            'player': self.id,
            'position': {
                'x': self.location['x'],
                'y': self.location['y']
            }
        }
