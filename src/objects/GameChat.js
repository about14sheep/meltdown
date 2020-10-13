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
    this.createFromHTML(`<div style="width: 320px; height: 400px; background-color: blue;"><div id="msgLog"></div><input type="text" placeholder="say something" id="chatBox" name="chatBox"><input type="submit" id="submit" value="Send"></div>`)
    this.input = this.getChildByID('chatBox')
    this.msgLog = this.getChildByID('msgLog')
    this.close = scene.add.text(550, 100, 'CLOSE').setInteractive()
    this.close.on('pointerdown', _ => {
      this.gameState.inMeeting = false
    })
    this.messageElements = []
    this.configureSendMessageEvent()
    scene.add.existing(this)
  }

  loadChat() {
    this.messageElements = []
  }

  addMsgToChat(msg) {
    this.messageElements.push(`<p><span>${msg.username}:</span> ${msg.message}<p>`)
    return this.updateChat()
  }

  updateChat() {
    this.msgLog.appendChild(this.messageElements(this.messageElements.length - 1))
  }

  updater() {
    this.gameState.chatMessages.forEach((el, i) => {
      this.scene.add.text(400, 150 + (30 * i), `${el.username}: ${el.message}`)
    })
  }

  configureSendMessageEvent() {
    const send = this.getChildByID('submit')
    send.addEventListener('click', this.sendChatHandler.bind(this))
  }

  sendChatHandler() {
    this.scene.sendMessage({ player: this.gameState.player.username, text: this.chatBox.value })
    this.chatBox.value = ''
  }
}