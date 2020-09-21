import ComputerBaseImage from '../assets/computer_screen_base.png'
export default class ComputerBase extends Phaser.Scene {
  constructor() {
    super({ key: 'computer', active: true })
    this.currentGame = ''
    this.ws = null
    this.baseKey = 'computer'
  }

  preload() {
    this.load.image('computerbase', ComputerBaseImage)
  }

  create() {
    const computerBase = this.add.sprite(400, 300, 'computerbase')
    computerBase.setScale(1.5)
  }

  loadMiniGame(key, game) {
    this.scene.add(key, game, true)
    this.scene.sendToBack(key)
  }

  displayMiniGame(key) {
    this.scene.bringToTop(this.baseKey)
    this.currentGame = key
    this.scene.get(key).bar.input.enabled = true
    this.scene.moveAbove(this.baseKey, key)
  }

  hideMiniGame() {
    if (this.currentGame) {
      this.scene.get(this.currentGame).bar.input.enabled = false
    }
    this.scene.sendToBack(this.baseKey)
    this.scene.moveBelow(this.baseKey, this.currentGame)
  }

  setWebSocket(ws) {
    this.ws = ws
  }

  sendMiniGameUpdate() {
    this.ws ? this.scene.get(this.currentGame).sendGameStatus(this.ws) : null
  }

}