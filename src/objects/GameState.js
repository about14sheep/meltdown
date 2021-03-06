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
    this.inMeeting = false
    this.minigames = new Map()
    this.gameStarted = false
    this.newMessage = null
    this.newVote = null
    this.alert = ''
    this.ws = new Socket(scene)
    this.playersMap = new Map()
    this.lobbySize = 2
    this.otherPlayers = scene.physics.add.group()
    this.miniGameBarLastPosition = {}
    this.playerLastUpdate = {}
    this.playersScore = 0
    this.impostersScore = 0
  }

  update() {
    this.sendPlayerUpdate()
    if (this.gameStarted) {
      this.player.emMeeting || !this.player.isAlive ? this.scene.ui.hideEmButton() : this.scene.ui.showEmButton()
    }
    if (((this.otherPlayers.getChildren().length + 1) >= this.lobbySize) && ((this.playersReady().length + (this.player.isRett ? 1 : 0)) === (this.otherPlayers.getChildren().length + 1))) {
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
    if (this.otherPlayers.getChildren().length + 1 >= this.lobbySize) {
      return ` W,S,A,D to move \n Walk over computer to activate it \n\n (${this.playersReady().length + (this.player.isRett ? 1 : 0)} / ${this.otherPlayers.getChildren().length + 1}) Waiting for players to ready..`
    } else {
      return ` W,S,A,D to move \n Walk over a computer to activate it \n\n (${this.otherPlayers.getChildren().length + 1} / 8) Waiting for players to join..`
    }
  }

  gameStartMessage() {
    return this.player.imposter ? 'Boom this lab by any means!' : 'Find the Imposters and save this lab!'
  }

  updateMiniGame({ type, data }) {
    this.minigames.set(type, { x: data.x, y: data.y })
  }

  joinMeeting() {
    this.inMeeting = true
    this.player.zeroSpeed()
  }

  callMeeting() {
    this.ws.sendMessage({ type: 'PLAYER_MEETING', data: this.player.ID })
  }

  startMeeting() {
    this.scene.toggleMeeting()
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

  sendChatMessage(msg) {
    this.ws.sendMessage({ type: 'PLAYER_CHAT', data: { username: msg.player, message: msg.text } })
  }

  sendVote(player, id) {
    this.ws.sendMessage({ type: 'PLAYER_VOTE', data: { player: player, vote: id } })
  }

  addPlayerVote(data) {
    this.newVote = data
  }

  addChatMessage(data) {
    this.newMessage = data
  }

  gatherPlayerIds() {
    return [...this.otherPlayers.getChildren(), this.player].map(el => el.ID)
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
        otherPlayer.imposter = data.imposter
        otherPlayer.isAlive = data.isAlive
        otherPlayer.setFlipX(data.direction)
        otherPlayer.isRett = data.ready
        if (this.player.isAlive) {
          otherPlayer.setVisible(data.isAlive)
          otherPlayer.nameTag.setVisible(data.isAlive)
        } else if (!data.isAlive) {
          otherPlayer.setVisible(true)
          otherPlayer.nameTag.setVisible(true)
          otherPlayer.setAlpha(0.5)
        }
        if (otherPlayer.lastAnim !== data.animation) {
          otherPlayer.lastAnim = data.animation
          otherPlayer.play(data.animation, true)
        }
      }
    })
  }

  setImposters(arr) {
    arr.forEach(el => {
      if (el === this.player.ID) {
        this.player.imposter = true
      }
    })
    this.player.reset()
  }

  checkImposter() {
    return this.player.imposter
  }

  addOtherPlayers(data) {
    if (!data) return
    const id = data.player
    if (this.playersMap.get(id)) return
    this.playersMap.set(id, data.position)
    if (id != this.player.ID) {
      const otherPlayer = new Player(this.scene, data.position.x, data.position.y, id, data.username, true)
      this.scene.physics.add.collider(this.player.hitbox, otherPlayer, this.playerInRange, this.checkImposter, this)
      this.otherPlayers.add(otherPlayer)
    }
  }

  playerInRange(_, player) {
    if (!this.player.imposter) return
    if (player.isAlive && player.imposter !== true) {
      this.player.setTarget(player)
    }
  }

  killPlayer() {
    const deadMan = this.otherPlayers.getChildren().find(el => el.ID === this.player.target.ID)
    deadMan.isAlive = false
    this.player.target = null
    this.killPlayerByID(deadMan.ID)
  }

  killPlayerByID(id) {
    this.ws.sendMessage({ type: 'PLAYER_KILL', data: id })
  }

  acceptDeath(data) {
    if (this.player.ID === data) {
      this.player.isAlive = false
    } else {
      const deadMan = this.otherPlayers.getChildren().find(el => el.ID === data)
      deadMan.isAlive = false
      if (this.player.isAlive) {
        deadMan.nameTag.setVisible(false)
        deadMan.setVisible(false)
      } else {
        deadMan.setAlpha(0.5)
      }
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
      this.gameStarted = false
      this.player.gameOver = true
      this.impostersScore > this.playersScore ? console.log('0 minutes to midnight. BOOM EVENT -- GAME OVER') : console.log('players saved the world. SALUTE EVENT -- GAME OVER')
      this.player.reset()
    } else {
      this.player.reset()
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