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

const PLAYER_MODEL = 'PLAYER_MODEL'

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, id, username) {
    super(scene, x, y, 'scientist')
    this.imposter = false
    this.gameOver = false
    this.active = false
    this.isReady = false
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
    this.configureAnimations(scene)
  }

  update() {
    this.active = false
    const keys = this.keys
    let currentAnimKey = 'idle'
    this.body.setVelocityY(0)
    this.body.setVelocityX(0)

    if (keys.A.isDown) {
      this.active = true
      this.body.setVelocityX(-this.velocity)
      this.setFlipX(true)
    } else if (keys.D.isDown) {
      this.active = true
      this.body.setVelocityX(this.velocity)
      this.setFlipX(false)
    }

    if (keys.W.isDown) {
      this.active = true
      this.body.setVelocityY(-this.velocity)
    } else if (keys.S.isDown) {
      this.active = true
      this.body.setVelocityY(this.velocity)
    }

    if (this.body.velocity.x != 0 || this.body.velocity.y != 0) {
      this.isPlayerUsing = false
      currentAnimKey = 'walking'
    } else if (this.isPlayerUsing) {
      currentAnimKey = 'using'
    } else {
      currentAnimKey = 'idle'
    }
    if (this.lastAnim !== currentAnimKey) {
      this.active = true
      this.lastAnim = currentAnimKey
      this.anims.play(currentAnimKey, true)
    }
  }

  playerUpdater() {
    return {
      type: PLAYER_MODEL,
      lobby: this.lobby,
      data: {
        player: this.ID,
        position: {
          x: this.x,
          y: this.y
        },
        direction: this.flipX,
        animation: this.lastAnim
      }
    }
  }

  setReady(bool) {
    this.isReady = bool
  }

  configureAnimations(scene) {
    scene.anims.create({
      key: 'walking',
      frames: scene.anims.generateFrameNumbers('scientist', {
        start: 3, end: 2
      }),
      frameRate: 4,
      repeat: -1
    })

    scene.anims.create({
      key: 'idle',
      frames: [{ key: 'scientist', frame: 0 }],
      frameRate: 1,
    })

    scene.anims.create({
      key: 'using',
      frames: [{ key: 'scientist', frame: 1 }],
      frameRate: 1,
    })
  }

  reset() {
    this.setPosition(400, 300)
    if (this.gameOver === true) {
      this.imposter = false
    }
  }

}