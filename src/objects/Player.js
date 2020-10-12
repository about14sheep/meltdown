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
  constructor(scene, x, y, id, username, nameTag) {
    super(scene, x, y, 'scientist')
    this.imposter = false
    this.gameOver = false
    this.isRett = false
    this.isAlive = true
    this.targetId = null
    this.emMeeting = false
    this.hitbox = this.playerHitBox()
    this.scene = scene
    this.lobby = scene.lobbyID
    this.game = this.scene.game
    this.isPlayerUsing = false
    this.lastAnim = null
    this.velocity = 250
    this.nameTag = scene.add.text(x - 16, (y - 40), username).setVisible(nameTag)
    this.keys = scene.input.keyboard.addKeys('W,S,A,D')
    this.ID = id
    this.username = username
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.configureAnimations(scene)
  }

  update() {
    this.isAlive ? this.setVisible(true) : this.setVisible(false)
    const keys = this.keys
    let currentAnimKey = 'idle'
    this.zeroSpeed()
    this.updateHitBoxPosition()

    if (this.targetId && this.checkDistance(this.targetId) > 120) {
      this.targetId = null
    }

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
      this.targetId = null
      this.isPlayerUsing = false
      currentAnimKey = 'walking'
    } else if (this.isPlayerUsing) {
      currentAnimKey = 'using'
    } else {
      currentAnimKey = 'idle'
    }
    if (this.lastAnim !== currentAnimKey) {
      this.lastAnim = currentAnimKey
      this.anims.play(currentAnimKey, true)
    }
  }

  zeroSpeed() {
    this.body.setVelocityY(0)
    this.body.setVelocityX(0)
  }

  playerHitBox() {
    const hitbox = this.scene.physics.add.sprite(this.x, this.y, 'hitbox').setVisible(false)
    hitbox.setSize(this.displayWidth * 3, this.displayHeight * 3)
    return hitbox
  }

  updateHitBoxPosition() {
    this.hitbox.setPosition(this.x, this.y)
  }

  updateNameTag() {
    this.nameTag.setPosition(this.x - (this.nameTag.displayWidth / 2), this.y - 40)
    this.updateHitBoxPosition()
  }

  toggleEmMeeting() {
    this.emMeeting = !this.emMeeting
  }

  playerUpdater() {
    return {
      type: PLAYER_MODEL,
      lobby: this.lobby,
      data: {
        username: this.username,
        imposter: this.imposter,
        player: this.ID,
        isAlive: this.isAlive,
        position: {
          x: this.x,
          y: this.y
        },
        direction: this.flipX,
        ready: this.isRett,
        animation: this.lastAnim
      }
    }
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

  checkDistance(player) {
    return Math.sqrt(Math.pow((this.x - player.x), 2) + Math.pow((this.y - player.y), 2))
  }

  reset() {
    this.setPosition(400, 300)
    if (this.gameOver === true) {
      this.isAlive = true
      this.imposter = false
      this.toggleEmMeeting()
      this.gameOver = false
    }
  }

}