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

export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ui', active: true })
    this.readyChecked = false
  }

  preload() {
    this.load.spritesheet('readyButton', ReadyButton, {
      frameWidth: 35,
      frameHeight: 21
    })
  }

  create() {
    this.readyButton = this.add.sprite(400, 500, 'readyButton').setInteractive()
    this.readyButton.setScale(3)
    this.readyButton.on('pointerdown', _ => {
      this.readyChecked ? this.readyChecked = false : this.readyChecked = true
    })
  }

  update() {
    this.readyChecked ? this.readyButton.setFrame(1) : this.readyButton.setFrame(0)
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