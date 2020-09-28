export default class UIAlertTicker extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene)
    this.scene = scene
    this.text = scene.add.text(0, 0, '')
  }

  updateTicker(msg) {
    this.text.setText(msg)
    this.text.setPosition(400 - (this.text.displayWidth / 2), 100)
  }
}