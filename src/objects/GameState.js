import ReconnectingWebSocket from 'reconnecting-websocket'

export default class GameState extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene)
    this.incoming = new ReconnectingWebSocket('ws://localhost:3000/recieve')
    this.outgoing = new ReconnectingWebSocket('ws://localhost:3000/submit')
    this.otherPlayers = scene.physics.add.group()
    this.playerID = 1
  }

  create() {

    this.outgoing.onopen = e => {
      const msg = {
        type: 'message',
        data: 'Outgoing route open'
      }
      this.outgoing.send(JSON.stringify(msg))
    }

    this.incoming.onmessage = e => {
      const data = JSON.parse(e.data)
      console.log(data)
    }

  }

}