import Phaser from 'phaser'

import ComputerBaseImage from '../assets/computer_screen_base.png'
import AttemptButton from '../assets/minigame_button.png'
export default class ComputerBase extends Phaser.Scene {
  constructor() {
    super({ key: 'computer', active: true })
    this.currentGame = ''
    this.ws = null
    this.baseKey = 'computer'
  }

  preload() {
    this.load.image('computerbase', ComputerBaseImage)
    this.load.image('attemptButton', AttemptButton)
  }

  create() {
    const computerBase = this.add.sprite(400, 300, 'computerbase')
    const attemptButton = this.add.sprite(400, 425, 'attemptButton').setInteractive()
    attemptButton.on('pointerdown', _ => {
      const game = this.scene.get(this.currentGame)
      if (game.attempts > 0) {
        console.log(game.checkWin())
      } else {
        console.log('out of chances my guy')
      }
    })
    attemptButton.setScale(1.5)
    computerBase.setScale(1.5)
  }

  loadMiniGame(key, game) {
    this.scene.add(key, game, true)
    this.scene.sendToBack(key)
  }

  displayMiniGame(key) {
    this.scene.bringToTop(this.baseKey)
    this.currentGame = key
    this.scene.moveAbove(this.baseKey, key)
  }

  hideMiniGame() {
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