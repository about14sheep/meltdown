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
    this.ws = new Socket(scene)
    this.playersMap = new Map()
    this.otherPlayers = scene.physics.add.group()
    this.miniGameBarLastPosition = {}
    this.playersScore = 0
    this.impostersScore = 0
  }

  update() {
    if (this.player.active) { this.ws.sendMessage(this.player.playerUpdater()) }
  }

  playersReady() {
    return this.otherPlayers.getChildren().every(player => player.isReady === true)
  }

  canGameStart() {
    return this.otherPlayers.getLength() === 8 && this.playersReady()
  }

  tetherMiniGame(game) {
    const barPos = {
      x: game.bar.x,
      y: game.bar.y
    }
    if (!this.checkEqual(this.miniGameBarLastPosition, barPos)) {
      this.ws.sendMessage({ type: game.handle, data: barPos })
      this.miniGameBarLastPosition = barPos
    }
  }

  checkEqual(obj1, obj2) {
    const obj1Keys = Object.keys(obj1)
    const obj2Keys = Object.keys(obj2)
    if (obj1Keys.length !== obj2Keys.length) {
      return false
    }
    for (let key of obj1Keys) {
      if (obj1[key] !== obj2[key]) {
        return false
      }
    }
    return true
  }

  updatePlayers(data) {
    if (!this.playersMap.get(data.player)) this.addOtherPlayers(data)
    this.otherPlayers.getChildren().forEach(otherPlayer => {
      if (otherPlayer.ID === data.player) {
        otherPlayer.setPosition(data.position.x, data.position.y)
        otherPlayer.setFlipX(data.direction)
        if (otherPlayer.lastAnim !== data.animation) {
          otherPlayer.lastAnim = data.animation
          otherPlayer.play(data.animation, true)
        }
      }
    })
  }

  addOtherPlayers(data) {
    if (!data) return
    const id = data.player
    if (this.playersMap.get(id)) return
    this.playersMap.set(id, data.position)
    if (id != this.player.ID) {
      const otherPlayer = new Player(this.scene, data.position.x, data.position.y, id, data.username)
      this.otherPlayers.add(otherPlayer)
    }
  }

  removePlayers(data) {
    if (!this.playersMap.get(data.player)) return
    this.playersMap.delete(data.player)
    this.otherPlayers.getChildren().forEach(player => {
      if (player.ID === data.player) {
        player.destroy()
      }
    })
  }

  minutesToMidnight() {
    return this.impostersScore < 3 ? 12 / (this.impostersScore + 1) : 0
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
}