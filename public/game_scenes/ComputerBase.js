class ComputerBase extends Phaser.Scene {
  constructor(handle) {
    super(handle)
  }

  preload() {
    this.load.image('computer', '../assets/computer_screen_base.png')
  }

  create() {
    this.computer = this.add.sprite(400, 300, 'computer')
    this.computer.setScale(1.60)
  }
}