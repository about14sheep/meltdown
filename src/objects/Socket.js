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
      const msg = {
        'typed': 'PLAYER_CONNECTION'
      }
      socket.emit('join', { playerId: this.scene.player.ID, username: this.scene.player.username, lobby: this.lobbyId })
    })

    socket.on('close', _ => {
      socket.emit('leave', { playerId: this.scene.player.ID, username: this.scene.player.username, lobby: this.lobbyId })
    })

    socket.on('message', msg => {
      if (msg.type === 'PLAYER_CONNECTION') {
        this.scene.gameState.addOtherPlayers(msg.data)
      }
      if (msg.type === 'PLAYER_DISONNECT') {
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

    socket.current = {
      socket
    }

    return function cleanup() {
      if (socket.current !== null) {
        socket.current.close()
      }
    }


  }


  sendMessage(msg) {
    this.socket.emit('message', msg, this.lobbyId)
  }

}