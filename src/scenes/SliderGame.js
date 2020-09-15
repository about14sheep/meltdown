import SliderGameBaseImage from '../assets/slidergame_assets/slidergame_base.png'
import SliderGameBar from '../assets/slidergame_assets/slidergame_bar.png'
export default class SliderGame extends Phaser.Scene {
  constructor(handle) {
    super(handle)
    this.barMax = 555
    this.barStart = 245
    this.attempts = 3
    this.barGoal = {
      min: 467,
      max: 486
    }
  }

  preload() {
    this.load.image('sliderGameBase', SliderGameBaseImage)
    this.load.image('sliderGameBar', SliderGameBar)
  }

  create() {
    const sliderGameBase = this.add.sprite(400, 300, 'sliderGameBase')
    this.bar = this.add.sprite(245, 300, 'sliderGameBar').setInteractive({ draggable: true })
    this.bar.on('drag', (e, dragX) => {
      if (dragX < this.barMax && dragX > this.barStart) {
        this.bar.x = dragX
      }
    })
    this.bar.setScale(1.5)
    sliderGameBase.setScale(1.5)
  }

  sendGameStatus(ws) {
    const msg = {
      type: 'SLIDER_GAME',
      data: {
        positionX: this.bar.x
      }
    }
    ws.send(JSON.stringify(msg))
  }

  recieveGameStatus(data) {
    this.bar.x = data.positionX
  }

  checkWin() {
    const check = this.bar.x < this.barGoal.max && this.bar.x > this.barGoal.min
    this.bar.x = this.barStart
    this.attempts--
    return check
  }

}