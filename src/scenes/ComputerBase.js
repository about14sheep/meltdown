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

import ComputerBaseImage from '../assets/computer_screen_base.png'
import HackIcon from '../assets/hack_icon_spritesheet.png'
export default class ComputerBase extends Phaser.Scene {
  constructor() {
    super({ key: 'computer', active: true })
    this.currentGame = ''
    this.miniGameBarLastPosition = {}
    this.minigames = []
    this.ws = null
    this.count = 0
    this.baseKey = 'computer'
  }

  preload() {
    this.load.image('computerbase', ComputerBaseImage)
    this.load.spritesheet('hack', HackIcon, {
      frameWidth: 54,
      frameHeight: 48
    })
  }

  create() {
    this.anims.create({
      key: 'hacking',
      frames: this.anims.generateFrameNumbers('hack', { prefix: 'hack_icon_', start: 1, end: 0 }),
      frameRate: 1,
      repeat: 5
    })

    this.hackButton = this.add.sprite(500, 425, 'hack').setInteractive()
    const computerBase = this.add.sprite(400, 300, 'computerbase')
    computerBase.setScale(1.5)
    this.hackButton.input.enabled = false
    this.hackButton.on('pointerdown', _ => {
      if (!this.hackButton.anims.isPlaying && !this.scene.get(this.currentGame).done) {
        this.hackButton.play('hacking')
        this.scene.get(this.currentGame).recieveTilt()
        this.tetherMiniGame(this.scene.get(this.currentGame))
      }
    })
    this.hackButton.setScale(2)
  }

  loadMiniGame(key, game) {
    this.minigames.push(game)
    this.scene.add(key, game, true)
    this.scene.sendToBack(key)
  }

  displayMiniGame(key, imposter) {
    this.hackButton.setVisible(false)
    this.hackButton.input.enabled = false
    if (!this.scene.get(key).count < 15 && !imposter) {
      this.scene.get(key).bar.input.enabled = true
      this.tetherMiniGame(this.scene.get(key))
    } else if (imposter) {
      this.scene.get(key).bar.input.enabled = false
      this.hackButton.input.enabled = true
      this.hackButton.setVisible(true)
      this.scene.bringToTop(this.hackButton)
    }
    this.scene.bringToTop(this.baseKey)
    this.currentGame = key
    this.scene.moveAbove(this.baseKey, key)
  }

  tetherMiniGame(game) {
    const barPos = {
      x: game.bar.x,
      y: game.bar.y
    }
    if (this.miniGameBarLastPosition != barPos) {
      const msg = this.buildMessage(barPos, game.handle)
      this.ws.sendMessage(msg)
      this.miniGameBarLastPosition = barPos
    }
  }

  buildMessage(position, handle) {
    return {
      type: handle,
      data: position
    }
  }

  calculateGame() {
    const results = []
    this.minigames.forEach(game => {
      if (game.done) {
        results.push(game.checkWin())
      }
    })
    if (results.filter(el => el === false).length === 5) {
      return 'imposters'
    } else if (results.length === this.minigames.length) {
      return 'scientists'
    }
  }

  reset() {
    this.minigames.forEach(game => game.resetGame())
  }

  hideMiniGame() {
    if (this.currentGame) {
      this.scene.get(this.currentGame).bar.input.enabled = false
    }
    if (this.imp) {
      this.imp = false
    }
    this.scene.sendToBack(this.baseKey)
    this.scene.moveBelow(this.baseKey, this.currentGame)
    this.miniGameBarLastPosition = {}
  }

  imposterScreen() {
    const games = ['15', '178', '1826', '152', '4453', '5439', '5223', '543']
    let result = ''
    if (this.count < games.length) {
      result = games[this.count]
      this.count++
    }
    if (this.count === games.length) {
      this.count = 0
    }
    return result
  }

  setSocket(socket) {
    this.ws = socket
  }

}