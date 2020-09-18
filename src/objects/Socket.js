import io from 'socket.io-client'

export default class Socket extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene)
    this.socket = io('http://localhost:5000')
    this.lobbyId = scene.lobbyID
    this.configure(this.socket, scene.lobbyID)
  }

  configure(socket, room) {
    socket.emit('join', room)

    socket.on('message', function (msg) {
      console.log(msg)
    })
  }

  sendMessage(msg) {
    this.socket.emit('message', msg, this.lobbyId)
  }

}