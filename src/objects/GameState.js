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

import Socket from './Socket'
import Player from './Player'

export default class GameState extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene)
    this.scene = scene
    this.player = scene.player
    this.gameStarted = false
    this.alert = ''
    this.ws = new Socket(scene)
    this.playersMap = new Map()
    this.lobbySize = 1
    this.otherPlayers = scene.physics.add.group()
    this.miniGameBarLastPosition = {}
    this.playerLastUpdate = {}
    this.playersScore = 0
    this.impostersScore = 0
  }

  update() {
    this.sendPlayerUpdate()

    if (this.otherPlayers.getChildren().length === this.lobbySize && this.playersReady().length === this.otherPlayers.getChildren().length) {
      if (!this.gameStarted) {
        this.sendStartGame()
        this.gameStarted = true
      }
    }
  }

  sendPlayerUpdate() {
    const playerUpdate = this.player.playerUpdater()
    if (!this.__checkEqual(this.playerLastUpdate, playerUpdate)) {
      this.playerLastUpdate = playerUpdate
      this.ws.sendMessage(playerUpdate)
    }
  }

  playersReady() {
    return this.otherPlayers.getChildren().filter(el => el.isRett === true)
  }

  alertMessage() {
    if (this.otherPlayers.getChildren().length === this.lobbySize) {
      return `(${this.playersReady().length + (this.player.isRett ? 1 : 0)} / 8) Waiting for players to ready..`
    } else {
      return `(${this.otherPlayers.getChildren().length + 1} / 8) Waiting for players to join..`
    }
  }


  sendStartGame() {
    const msg = {
      type: 'GAME_START',
      lobby: this.scene.lobbyID,
      data: {
        players: this.gatherPlayerIds()
      }
    }
    this.ws.sendMessage(msg)
  }

  gatherPlayerIds() {
    return this.otherPlayers.getChildren().map(el => el.ID)
  }

  tetherMiniGame(game) {
    const barPos = {
      x: game.bar.x,
      y: game.bar.y
    }
    if (!this.__checkEqual(this.miniGameBarLastPosition, barPos)) {
      this.ws.sendMessage({ type: game.handle, data: barPos })
      this.miniGameBarLastPosition = barPos
    }
  }

  updatePlayers(data) {
    if (!this.playersMap.get(data.player)) this.addOtherPlayers(data)
    this.otherPlayers.getChildren().forEach(otherPlayer => {
      if (otherPlayer.ID === data.player) {
        otherPlayer.setPosition(data.position.x, data.position.y)
        otherPlayer.updateNameTag()
        otherPlayer.setFlipX(data.direction)
        otherPlayer.isRett = data.ready
        if (otherPlayer.lastAnim !== data.animation) {
          otherPlayer.lastAnim = data.animation
          otherPlayer.play(data.animation, true)
        }
      }
    })
  }

  setImposters(imps) {
    console.log(imps)
  }

  addOtherPlayers(data) {
    if (!data) return
    const id = data.player
    if (this.playersMap.get(id)) return
    this.playersMap.set(id, data.position)
    if (id != this.player.ID) {
      const otherPlayer = new Player(this.scene, data.position.x, data.position.y, id, data.username, true)
      this.otherPlayers.add(otherPlayer)
    }
  }

  removePlayers(data) {
    if (!this.playersMap.get(data.player)) return
    this.playersMap.delete(data.player)
    this.otherPlayers.getChildren().forEach(player => {
      if (player.ID === data.player) {
        player.destroy()
        player.nameTag.destroy()
      }
    })
  }

  minutesToMidnight() {
    return this.impostersScore < 3 ? 12 / (this.impostersScore + 1) : 0
  }

  readyPlayerOne(bool) {
    this.player.isRett = bool
  }

  reset() {
    if (this.impostersScore === 3 || this.playersScore === 3) {
      this.impostersScore = 0
      this.playersScore = 0
      this.impostersScore > this.playersScore ? console.log('0 minutes to midnight. BOOM EVENT -- GAME OVER') : console.log('players saved the world. SALUTE EVENT -- GAME OVER')
      this.otherPlayers.getChildren().forEach(player => {
        player.gameOver = true
        player.reset()
      })
    } else {
      this.otherPlayers.getChildren().forEach(player => {
        player.reset()
      })
    }
  }

  __checkEqual(obj1, obj2) {
    const obj1Keys = Object.keys(obj1)
    const obj2Keys = Object.keys(obj2)
    if (obj1Keys.length !== obj2Keys.length) {
      return false
    }
    for (let key of obj1Keys) {
      const val1 = obj1[key]
      const val2 = obj2[key]
      const areObjects = (val1 != null && typeof val1 === 'object') && (val2 != null && typeof val2 === 'object')
      if (areObjects && !this.__checkEqual(val1, val2) || (!areObjects && val1 !== val2)) {
        return false
      }
    }
    return true
  }
}