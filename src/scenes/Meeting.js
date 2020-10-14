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
import VoteCard from '../objects/VoteCard'

export default class Meeting extends Phaser.Scene {
  constructor() {
    super({ key: 'meeting', active: false })
    this.players = []
  }

  create() {
    this.chat = new GameChat(this, 400, 300)
    this.voteCard = new VoteCard(this, 400, 300)
    this.chat.setVisible(false)
    this.voteCard.setVisible(false)
  }

  update() {
    if (!this.gameState) return
    const chatMsg = this.gameState.newMessage
    if (chatMsg) {
      this.addMessage(chatMsg)
      this.gameState.newMessage = null
    }
  }

  showSelf() {
    this.scene.setActive(true)
    this.chat.setVisible(true)
    this.voteCard.setVisible(true)
  }

  hideSelf() {
    this.scene.setActive(false)
    this.chat.setVisible(false)
    this.voteCard.setVisible(false)
  }

  setState(state) {
    this.gameState = state
    this.chat.setState(state)
  }

  callMeeting(players) {
    this.players = players
    this.voteCard.setPlayers(players)
    this.chat.loadChat()
  }

  addMessage(msg) {
    this.chat.addMsgToChat(msg)
  }

  sendMessage(msg) {
    this.gameState.sendChatMessage(msg)
  }

}