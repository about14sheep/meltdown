export default class MiniGameFactory extends Phaser.Scene {
  constructor(handle, type, barMax, barStart, barGoal, base, bar, anim) {
    super(handle)
    this.type = type
    this.barMax = barMax
    this.barStart = barStart
    this.barGoal = barGoal
    this.countDownStarted = false
    this.count = 0
    this.baseImage = {
      string: base.string,
      image: base.image
    }
    this.barImage = {
      string: bar.string,
      image: bar.image
    }
    this.animImage = {
      string: anim.string,
      image: anim.image
    }
  }

  preload() {
    this.load.image(this.baseImage.string, this.baseImage.image)
    this.load.image(this.barImage.string, this.barImage.image)
    this.load.image(this.animImage.string, this.animImage.image)
  }

  create() {
    const base = this.add.sprite(400, 300, this.baseImage.string)
    this.bar = this.add.sprite(this.barStart.x, this.barStart.y, this.barImage.string).setInteractive({ draggable: true })
    this.anim = this.add.sprite(400, 300, this.animImage.string)
    this.anim.setVisible(false)
    this.bar.setScale(1.5)
    this.anim.setScale(1.5)
    base.setScale(1.5)
    this.typeSwitch()
  }

  typeSwitch() {
    switch (this.type) {
      case 'slider':
        this.bar.on('drag', (_, dragX) => {
          if (dragX < this.barMax.x && dragX > this.barStart.x) {
            this.bar.x = dragX
          }
        })
        break
      case 'upslider':
        this.bar.on('drag', (_, dragY) => {
          if (dragY < this.barMax.y && dragY > this.barStart.y) {
            this.bar.y = dragY
          }
        })
        break
      default:
        this.bar.on('drag', (_, dragX, dragY) => {
          this.bar.setPosition(dragX, dragY)
        })
    }
  }

  update() {
    if (this.checkWin() && !this.countDownStarted) {
      this.countDownStarted = true
      this.anim.setVisible(true)
      this.timer = setInterval(this.animateGoal.bind(this), 1000)
    }
    if (this.count === 15) {
      this.anim.setVisible(true)
      this.bar.input.enabled = false
      this.count = 0
      clearInterval(this.timer)
      console.log(this.checkWin() ? 'youve won my guy' : 'youve lost you fucking fool')
    }

  }

  getSuccess() {
    return this.gameSuccess
  }

  animateGoal() {
    this.count++
    this.anim.setVisible(!this.anim.visible)
  }

  sendGameStatus(ws) {
    ws.send(JSON.stringify(this.socketMsg))
  }

  recieveTilt() {
    this.bar.setPosition(this.barStart.x, this.barStart.y)
  }

  checkWin() {
    return (this.bar.y <= this.barGoal.y.max && this.bar.y >= this.barGoal.y.min) && (this.bar.x <= this.barGoal.x.max && this.bar.x >= this.barGoal.x.min)
  }


}