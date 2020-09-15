export default class Boot extends Phaser.State {
  preload() {
    this.game.stage.backgroundColor = '#000'
  }

  create() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_AL
    this.scale.pageAlignHorizontally = true
    this.scale.pageAlignVertically = true

    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.state.start('Preload')
  }
}