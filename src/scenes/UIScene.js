import ReadyButton from '../assets/ready_button_spritesheet.png'

export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ui', active: true })
    this.playerReady = false
  }

  preload() {
    this.load.spritesheet('readyButton', ReadyButton, {
      frameWidth: 35,
      frameHeight: 21
    })
  }

  create() {
    this.readyButton = this.add.sprite(400, 400, 'readyButton').setInteractive()
    this.readyButton.setScale(1.5)
    this.readyButton.on('pointerdown', _ => {
      this.playerReady ? this.playerReady = false : this.playerReady = true
    })
  }

  update() {
    this.playerReady ? this.readyButton.setFrame(1) : this.readyButton.setFrame(0)
  }

}