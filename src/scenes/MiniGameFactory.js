// Meltdown Atomic City
// Copyright (C) 2020 Austin Burger

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>

export default class MiniGameFactory extends Phaser.Scene {
  constructor(handle, type, barMax, barStart, barGoal, base, bar, anim) {
    super(handle)
    this.handle = handle
    this.type = type
    this.done = false
    this.barMax = barMax
    this.barStart = barStart
    this.barGoal = barGoal
    this.countDownStarted = false
    this.count = 0
    this.isActive = false
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
    // this.load.setBaseURL('/static')
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
    this.bar.input.enabled = false
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
        this.bar.on('drag', (_, dragX, dragY) => {
          if (dragY < this.barMax.y && dragY > this.barGoal.y.min) {
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
      this.bar.setInteractive(false)
      this.count = 0
      this.done = true
      clearInterval(this.timer)
    }
  }

  animateGoal() {
    this.count++
    this.anim.setVisible(!this.anim.visible)
  }

  syncGame(data) {
    this.bar.setPosition(data.x, data.y)
  }

  recieveTilt() {
    this.bar.setPosition(this.barStart.x, this.barStart.y)
  }

  resetGame() {
    clearInterval(this.timer)
    this.recieveTilt()
    this.countDownStarted = false
    this.done = false
    this.anim.setVisible(!this.anim.visible)
  }

  checkWin() {
    return (this.bar.y <= this.barGoal.y.max && this.bar.y >= this.barGoal.y.min) && (this.bar.x <= this.barGoal.x.max && this.bar.x >= this.barGoal.x.min)
  }


}