import Phaser from 'phaser'

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'scientist')
    this.scene = scene
    this.isPlayerUsing = false
    this.lastAnim = null
    this.velocity = 200
    this.ID = null

    this.scene.world.enable(this)
    this.scene.add.existing(this)

    const { A, D, W, S } = Phaser.Input.Keyboard.KeyCodes
    this.keys = this.scene.input.keyboard.addKeys({
      left: A,
      right: D,
      up: W,
      down: S
    })
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta)

    const keys = this.keys
    let currentAnimKey = 'idle'

    this.body.setVelocityY(0)
    this.body.setVelocityX(0)

    if (keys.left.isDown) {
      this.body.setVelocityX(-this.velocity)
      this.setFlipX(true)
    } else if (keys.right.isDown) {
      this.body.setVelocityX(this.velocity)
      this.setFlipX(false)
    }

    if (keys.up.isDown) {
      this.body.setVelocityY(this.velocity)
    } else if (keys.down.isDown) {
      this.body.setVelocityY(-this.velocity)
    }

    if (this.body.velocity != 0) {
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
}