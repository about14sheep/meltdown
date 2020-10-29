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

export default class GameChat extends Phaser.GameObjects.DOMElement {
  constructor(scene, x, y) {
    super(scene, x, y)
    this.updateChat()
    this.messageElements = []
    scene.add.existing(this)
  }

  loadChat() {
    this.messageElements = []
  }

  addMsgToChat(msg) {
    this.messageElements.unshift(`<p style="max-width: 250px; word-break: break-all; white-space: normal;"><span style="font-weight: bold; color: white;">${msg.username}:</span> ${msg.message}</p>`)
    this.updateChat()
  }

  updateChat() {
    this.createFromHTML(`<div style="position: relative; padding: 10px; width: 320px; height: 400px; background-color: #4E4E4E;"><div id="msgLog" style="display: flex; flex-direction: column-reverse; position: absolute; top: 0; width: 95%; height: 95%; overflow-y: scroll;">${this.messageElements ? this.messageElements.reduce((el, accum) => accum += el) : ''}</div><div style="position: absolute; bottom: 0; right: 0;"><input type="text" placeholder="say something" id="chatBox" name="chatBox"><input type="submit" id="submit" value="Send"></div></div>`)
    this.input = this.getChildByID('chatBox')
    this.msgLog = this.getChildByID('msgLog')
    this.configureSendMessageEvent()
  }

  setState(state) {
    this.gameState = state
  }

  configureSendMessageEvent() {
    const send = this.getChildByID('submit')
    send.addEventListener('click', this.sendChatHandler.bind(this))
  }

  sendChatHandler() {
    this.scene.sendMessage({ player: this.gameState.player.username, text: this.input.value })
    this.input.value = ''
  }
}