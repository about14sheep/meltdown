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

import ReadyButton from '../assets/ready_button_spritesheet.png'
import EmergencyButton from '../assets/emergency_button.png'
import KillButton from '../assets/kill_button_spritesheet.png'
import UIAlertTicker from '../objects/UIAlertTicker'

export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ui', active: true })
    this.readyChecked = false
  }

  preload() {
    this.load.setBaseURL('/static')
    this.load.image('emButton', EmergencyButton)
    this.load.spritesheet('killButton', KillButton, {
      frameWidth: 35,
      frameHeight: 21
    })

    this.load.spritesheet('readyButton', ReadyButton, {
      frameWidth: 35,
      frameHeight: 21
    })

  }

  create() {
    this.readyButton = this.add.sprite(400, 500, 'readyButton').setInteractive()
    this.killButton = this.add.sprite(700, 500, 'killButton')
    this.emButton = this.add.sprite(100, 500, 'emButton')
    this.emButton.setScale(2)
    this.emButton.setVisible(false)
    this.killButton.setScale(3)
    this.killButton.setVisible(false)
    this.killButton.setFrame(1)
    this.ticker = new UIAlertTicker(this)
    this.readyButton.setScale(3)
    this.emButton.on('pointerdown', _ => {
      this.gameState.callMeeting()
    })
    this.killButton.on('pointerdown', _ => {
      this.killButton.setFrame(0)
      this.gameState.killPlayer()
    })
    this.readyButton.on('pointerdown', _ => {
      this.gameState.readyPlayerOne(!this.readyChecked)
      this.readyChecked = !this.readyChecked
    })
  }

  update() {
    this.readyChecked ? this.readyButton.setFrame(1) : this.readyButton.setFrame(0)
    if (this.gameState) {
      this.ticker.updateTicker(this.gameState.alertMessage())
      if (this.gameState.gameStarted) {
        this.ticker.updateTicker(this.gameState.gameStartMessage())
        this.readyButton.disableInteractive()
        this.readyButton.setVisible(false)
      }
    }
  }

  setGameState(state) {
    this.gameState = state
  }

  showEmButton() {
    this.emButton.setInteractive()
    this.emButton.setVisible(true)
  }

  hideEmButton() {
    this.emButton.disableInteractive()
    this.emButton.setVisible(false)
  }

  showPVPButton() {
    this.killButton.setFrame(1)
    this.killButton.setInteractive()
    this.killButton.setVisible(true)
  }

  hidePVPButton() {
    this.killButton.disableInteractive()
    this.killButton.setVisible(false)
  }

  startGame() {
    this.readyButton.disableInteractive()
    this.readyButton.setVisible(false)
  }

  reset() {
    this.readyButton.setInteractive()
    this.readyButton.setVisible(true)
  }

}