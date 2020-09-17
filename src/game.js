import 'phaser'

import MainScene from './scenes/MainScene'
import ComputerBase from './scenes/ComputerBase'
import Login from './scenes/Login'

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
  },
  parent: 'menus-overlay',
  dom: {
    createContainer: true
  },
  scene: [Login, ComputerBase]
}

export const game = new Phaser.Game(config)