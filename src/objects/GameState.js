export default class GameState extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene)
    this.player = scene.player
    this.playersMap = new Map()
    this.otherPlayers = scene.physics.add.group()
  }

  addOtherPlayers(data) {
    const id = parseInt(data.player, 10)
    this.playersMap.set(id, data.position)
    if (id != this.player.ID) {
      const otherPlayer = new Player(this, data.position.x, data.position.y)
      otherPlayer.ID = id
      this.otherPlayers.add(otherPlayer)
    }
  }

  updatePositions(data) {
    this.otherPlayers.getChildren().forEach(otherPlayer => {
      if (otherPlayer.ID === parseInt(data.player, 10)) {
        otherPlayer.x = data.position.x
        otherPlayer.y = data.position.y
        otherPlayer.play('walking', true)
        otherPlayer.setFlipX(data.direction)
      }
    })
  }
}