import io, { managers } from 'socket.io-client'

export default class Socket extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene)
    this.scene = scene
    this.socket = io('ws://localhost:3000')
    this.lobbyId = scene.lobbyID
    this.configure(this.socket)
  }


  configure(socket) {
    socket.on('connect', _ => {
      socket.emit('join', { playerId: this.scene.player.ID, username: this.scene.player.username, lobby: this.lobbyId })
    })

    socket.on('disconnect', _ => {
      socket.emit('leave', { playerId: this.scene.player.ID, username: this.scene.player.username, lobby: this.lobbyId })
    })

    socket.on('message', msg => {
      this.scene.gameState.addOtherPlayers(msg.data)

      if (msg.type === 'PLAYER_DISCONNECT') {
        console.log('PLAYER DISCONNECT')
        this.scene.gameState.removePlayers(msg.data)
      }
      if (msg.type === 'PLAYER_POSITION') {
        this.scene.gameState.updatePositions(msg.data)
      }
      if (msg.type === 'PLAYER_IDLE') {
        this.scene.gameState.updateIdle(msg.data)
      }
      if (msg.type === 'PLAYER_USING') {
        this.scene.gameState.updateUsing(msg.data)
      }
    })
  }


  sendMessage(msg) {
    this.socket.emit('message', msg, this.lobbyId)
  }

}