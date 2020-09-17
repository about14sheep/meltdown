import 'phaser'

import MainScene from './scenes/MainScene'
import ComputerBase from './scenes/ComputerBase'
import Menus from './scenes/Menus'

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
  scene: [Menus, ComputerBase]
}

export const game = new Phaser.Game(config)