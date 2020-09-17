import ReconnectingWebSocket from 'reconnecting-websocket'

export default class Socket extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene)
    this.incoming = new ReconnectingWebSocket('ws://localhost:3000/receive')
    this.outgoing = new ReconnectingWebSocket('ws://localhost:3000/submit')
  }

  update() {
    this.incoming.onmessage = async function (e) {
      const res = await e.data.text()
      const data = JSON.parse(res)
      // console.log(data.data)
    }
  }

  sendMessage(msg) {
    this.outgoing.send(JSON.stringify(msg))
  }

}