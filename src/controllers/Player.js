import Phaser from 'phaser'

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'scientist')
    this.scene = scene
    this.isPlayerUsing = false
    this.lastAnim = null
    this.velocity = 200
    this.ID = null
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.keys = this.scene.input.keyboard.addKeys('W,S,A,D')
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