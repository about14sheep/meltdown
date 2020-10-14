// Meltdown Atomic City
// Copyright (C) 2020 Austin Burger

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>

import io from 'socket.io-client'
export default class Socket extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene)
    this.scene = scene
    this.socket = io('ws://localhost:3000')
    // this.socket = io(`wss://${window.location.host}`)
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
      case 'PLAYER_MODEL':
        this.scene.gameState.updatePlayers(msg.data)
        break
      case 'PLAYER_CONNECTION':
        this.scene.gameState.addOtherPlayers(msg.data)
        break
      case 'PLAYER_DISONNECT':
        this.scene.gameState.removePlayers(msg.data)
        break
      case 'START_GAME':
        this.scene.gameState.setImposters(msg.data)
        break
      case 'PLAYER_KILL':
        this.scene.gameState.acceptDeath(msg.data)
        break
      case 'PLAYER_MEETING':
        this.scene.gameState.startMeeting(msg.data)
        break
      case 'PLAYER_CHAT':
        this.scene.gameState.addChatMessage(msg.data)
        break
      case 'PLAYER_VOTE':
        this.scene.gameState.addPlayerVote(msg.data)
        break
      default:
        this.scene.gameState.updateMiniGame(msg)
    }
  }

  sendMessage(msg) {
    this.socket.emit('message', msg, this.lobbyId)
  }

}