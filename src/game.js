import 'phaser'
import ReconnectingWebSocket from 'reconnecting-websocket'

import MainScene from './scenes/MainScene'
import ComputerBase from './scenes/ComputerBase'

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
  },
  scene: [ComputerBase, MainScene]
}

export const game = new Phaser.Game(config)
export const incoming = new ReconnectingWebSocket('ws://localhost:3000/recieve')
export const outgoing = new ReconnectingWebSocket('ws://localhost:3000/submit')