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

import GameChat from '../objects/GameChat'

export default class Meeting extends Phaser.Scene {
  constructor(handle, state) {
    super(handle)
    this.gameState = state
    this.players = []
  }

  create() {
    this.chat = new GameChat(this, 400, 300)
  }

  update() {
    const chatMsg = this.gameState.newMessage
    if (chatMsg) {
      this.addMessage(chatMsg)
      this.gameState.newMessage = null
    }
  }

  callMeeting(players) {
    this.players = players
    this.chat.loadChat()
  }

  addMessage(msg) {
    this.chat.addMsgToChat(msg)
  }

  sendMessage(msg) {
    this.gameState.sendChatMessage(msg)
  }

}