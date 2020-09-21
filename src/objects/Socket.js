import io from 'socket.io-client'

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

    socket.on('close', _ => {
      socket.emit('leave', { playerId: this.scene.player.ID, username: this.scene.player.username, lobby: this.lobbyId })
    })

    socket.on('message', msg => {
      this.msgSwitch(msg)
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

  msgSwitch(msg) {
    switch (msg.type) {
      case 'PLAYER_CONNECTION':
        this.scene.gameState.addOtherPlayers(msg.data)
        break
      case 'PLAYER_DISONNECT':
        this.scene.gameState.removePlayers(msg.data)
        break
      case 'PLAYER_POSITION':
        this.scene.gameState.updatePositions(msg.data)
        break
      case 'PLAYER_USING':
        this.scene.gameState.updateUsing(msg.data)
        break
      case 'PLAYER_IDLE':
        this.scene.gameState.updateIdle(msg.data)
        break
      default:
        this.scene.scene.get(msg.type).syncGame(msg.data)
    }
  }

  sendMessage(msg) {
    this.socket.emit('message', msg, this.lobbyId)
  }

}