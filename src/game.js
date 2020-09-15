import Phaser from 'phaser'

import MainScene from './game_scenes/MainScene'
import ComputerBase from './game_scenes/ComputerBase'

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
  },
  scene: [MainScene]
}

export const game = new Phaser.Game(config)