import io from 'socket.io-client'

export default class Socket extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene)
    this.lobbyId = scene.lobbyID
    this.socket = io('ws://localhost:5000')
  }

  create(){
    this.socket.on('connection', socket => {
      socket.join(this.lobbyID)
    })
  }

  sendMessage(msg) {
    // this.socket.to(this.lobbyID).emit('message')
  }

}