export default class LobbyList extends Phaser.GameObjects.DOMElement {
  constructor(scene, x, y) {
    super(scene, x, y)
    this.scene = scene
    this.createFromHTML('')
    this.configureConnectToLobbyEvent()
    scene.add.existing(this)
  }

  configureConnectToLobbyEvent() {
    this.getChildByID('submit').addEventListener('click', this.submitHandler.bind(this))
  }

  submitHandler() {

  }
}