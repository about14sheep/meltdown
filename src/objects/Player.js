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


const PLAYER_POSITION = 'PLAYER_POSITION'
const PLAYER_USING = 'PLAYER_USING'
const PLAYER_IDLE = 'PLAYER_IDLE'

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, id, username) {
    super(scene, x, y, 'scientist')
    this.ws = scene.socket
    this.imposter = false
    this.gameOver = false
    if (username === 'Dean') {
      this.imposter = true
    }
    this.scene = scene
    this.lobby = scene.lobbyID
    this.game = this.scene.game
    this.isPlayerUsing = false
    this.lastAnim = null
    this.velocity = 250
    this.keys = scene.input.keyboard.addKeys('W,S,A,D')
    this.ID = id
    this.username = username
    scene.add.existing(this)
    scene.physics.add.existing(this)
  }

  update() {
    const keys = this.keys
    let currentAnimKey = 'idle'
    this.body.setVelocityY(0)
    this.body.setVelocityX(0)

    if (keys.A.isDown) {
      this.body.setVelocityX(-this.velocity)
      this.setFlipX(true)
    } else if (keys.D.isDown) {
      this.body.setVelocityX(this.velocity)
      this.setFlipX(false)
    }

    if (keys.W.isDown) {
      this.body.setVelocityY(-this.velocity)
    } else if (keys.S.isDown) {
      this.body.setVelocityY(this.velocity)
    }

    if (this.body.velocity.x != 0 || this.body.velocity.y != 0) {
      this.isPlayerUsing = false
      currentAnimKey = 'walking'
      this.sendPosition()
    } else if (this.isPlayerUsing) {
      currentAnimKey = 'using'
    } else {
      currentAnimKey = 'idle'
    }
    if (this.lastAnim !== currentAnimKey) {
      this.lastAnim = currentAnimKey
      this.animSwitch(currentAnimKey)
      this.anims.play(currentAnimKey, true)
    }
  }

  reset() {
    this.setPosition(400, 300)
    if (this.gameOver === true) {
      this.imposter = false
    }
  }

  animSwitch(key) {
    switch (key) {
      case 'using':
        this.sendUsing()
        break
      default:
        this.sendIdle()
    }
  }

  sendPosition() {
    const msg = {
      type: PLAYER_POSITION,
      lobby: this.lobby,
      data: {
        player: this.ID,
        position: {
          x: this.x,
          y: this.y
        },
        direction: this.flipX
      }
    }
    return this.ws.sendMessage(msg)
  }

  sendIdle() {
    const msg = {
      type: PLAYER_IDLE,
      lobby: this.lobby,
      data: {
        player: this.ID
      }
    }
    return this.ws.sendMessage(msg)
  }

  sendUsing() {
    const msg = {
      type: PLAYER_USING,
      lobby: this.lobby,
      data: {
        player: this.ID
      }
    }
    return this.ws.sendMessage(msg)
  }
}