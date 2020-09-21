import ComputerBaseImage from '../assets/computer_screen_base.png'
import HackIcon from '../assets/hack_icon_spritesheet.png'
export default class ComputerBase extends Phaser.Scene {
  constructor() {
    super({ key: 'computer', active: true })
    this.currentGame = ''
    this.minigames = []
    this.ws = null
    this.count = 0
    this.baseKey = 'computer'
  }

  preload() {
    this.load.image('computerbase', ComputerBaseImage)
    this.load.spritesheet('hack', HackIcon, {
      frameWidth: 54,
      frameHeight: 48
    })
  }

  create() {
    this.anims.create({
      key: 'hacking',
      frames: this.anims.generateFrameNumbers('hack', { prefix: 'hack_icon_', start: 1, end: 0 }),
      frameRate: 1,
      repeat: 5
    })

    const computerBase = this.add.sprite(400, 300, 'computerbase')
    computerBase.setScale(1.5)
    this.hackButton = this.add.sprite(500, 425, 'hack').setInteractive()
    this.hackButton.on('pointerdown', _ => {
      if (!this.hackButton.anims.isPlaying && !this.scene.get(this.currentGame).done) {
        this.hackButton.play('hacking')
        this.scene.get(this.currentGame).recieveTilt()
      }
    })
    this.hackButton.setScale(2)
  }

  loadMiniGame(key, game) {
    this.minigames.push(game)
    this.scene.add(key, game, true)
    this.scene.sendToBack(key)
  }

  displayMiniGame(key, imposter) {
    this.hackButton.setVisible(false)
    this.hackButton.input.enabled = false
    if (!this.scene.get(key).count < 15 && !imposter) {
      this.scene.get(key).bar.input.enabled = true
    } else if (imposter) {
      this.scene.bringToTop(this.hackButton)
      this.scene.get(key).bar.input.enabled = false
      this.hackButton.input.enabled = true
      this.hackButton.setVisible(true)
    }

    this.scene.bringToTop(this.baseKey)
    this.currentGame = key
    this.scene.moveAbove(this.baseKey, key)
  }

  calculateGame() {
    const results = []
    this.minigames.forEach(game => {
      if (game.done) {
        results.push(game.checkWin())
      }
    })
    if (results.filter(el => el === false).length === 5) {
      return 'imposters'
    } else if (results.length === this.minigames.length) {
      return 'scientists'
    }
  }

  reset() {
    this.minigames.forEach(game => game.resetGame())
  }

  hideMiniGame() {
    if (this.currentGame) {
      this.scene.get(this.currentGame).bar.input.enabled = false
    }
    if (this.imp) {
      this.imp = false
    }
    this.scene.sendToBack(this.baseKey)
    this.scene.moveBelow(this.baseKey, this.currentGame)
  }

  imposterScreen() {
    const games = ['15', '178', '1826', '152', '4453', '5439', '5223', '543']
    let result = ''
    if (this.count < games.length) {
      result = games[this.count]
      this.count++
    }
    if (this.count === games.length) {
      this.count = 0
    }

    return result
  }

}