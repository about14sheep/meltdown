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

import { getLobbies, checkLobby, joinLobby } from '../actions/LobbyAPI'

export default class LobbyList extends Phaser.GameObjects.DOMElement {
  constructor(scene, x, y, user) {
    super(scene, x, y)
    this.scene = scene
    this.user = user
    this.createFromHTML('<div id="lobbies_container" style="background-color: lime; width: 320px; height: 400px; font: 48px Arial"></div>')
    this.loadLobbies()
    scene.add.existing(this)
  }

  renderLobbies(lobbyStrings) {
    let result = ''
    lobbyStrings.forEach((lobbyString) => {
      result += lobbyString
    })
    this.createFromHTML(result)
    this.configureLobbyEvents(lobbyStrings.length)
  }

  configureLobbyEvents(n) {
    let count = 0
    while (count < n) {
      this.getChildByID(`lobby_${count}`).addEventListener('click', this.clickHandler.bind(this))
      count++
    }
  }

  clickHandler(e) {
    const id = e.currentTarget.childNodes[e.currentTarget.childNodes.length - 1].value
    this.joinServer(id)
  }

  joinServer(id) {
    if (checkLobby(id)) {
      joinLobby(id, this.user)
      this.scene.lobbyId = id
    } else {
      console.log('lobby is full or an error has occured')
    }
  }

  createHtmlStrings(lobbies) {
    const lobbyHTMLStrings = lobbies.map((lobby, i) => `<div style="background-color: lime;" id="lobby_${i}"><p>Lobby: ${lobby.name}</p><p>Players: ${lobby.players.length}/${lobby.player_max}</p><input type="hidden" value="${lobby.id}"></div>`)
    this.renderLobbies(lobbyHTMLStrings)
  }

  async loadLobbies() {
    const res = await getLobbies()
    this.createHtmlStrings(res)
  }

  async submitHandler(e) {
    const check = await checkLobby(e.target.value)
    if (!check) {
      const lobby = await joinLobby(e.target.value, user)
      if (lobby) {
        this.scene.lobbyId = lobby.id
      } else {
        console.log('lobby is full')
      }
    } else {
      console.log('lobby is full')
    }
  }
}