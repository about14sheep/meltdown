import Player from './Player'

export default class GameState extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene)
    this.scene = scene
    this.player = scene.player
    this.playersMap = new Map()
    this.otherPlayers = scene.physics.add.group()
  }

  addOtherPlayers(data) {
    if (!data) return
    const id = data.player
    if (this.playersMap.get(id)) return
    this.playersMap.set(id, data.position)
    if (id != this.player.ID) {
      const otherPlayer = new Player(this.scene, data.position.x, data.position.y, id, data.username)
      otherPlayer.ID = id
      this.otherPlayers.add(otherPlayer)
    }
  }

  updatePositions(data) {
    if (!this.playersMap.get(data.player)) this.addOtherPlayers(data)
    this.otherPlayers.getChildren().forEach(otherPlayer => {
      if (otherPlayer.ID === data.player) {
        otherPlayer.x = data.position.x
        otherPlayer.y = data.position.y
        otherPlayer.play('walking', true)
        otherPlayer.setFlipX(data.direction)
      }
    })
  }

  updateIdle(data) {
    if (!this.playersMap.get(data.player)) this.addOtherPlayers(data)
    this.otherPlayers.getChildren().forEach(player => {
      if (player.ID === data.player) {
        player.play('idle', true)
      }
    })
  }

  updateUsing(data) {
    if (!this.playersMap.get(data.player)) this.addOtherPlayers(data)
    this.otherPlayers.getChildren().forEach(player => {
      if (player.ID === data.player) {
        player.play('using', true)
      }
    })
  }

  removePlayers(data) {
    if (!this.playersMap.get(data.player)) return
    this.playersMap.delete(data.player)
    this.otherPlayers.getChildren().forEach(player => {
      if (player.ID === data.player) {
        player.destroy()
      }
    })
  }
}