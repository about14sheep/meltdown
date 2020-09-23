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
    this.loadLobbies = this.loadLobbies()
    this.createFromHTML('')
    this.configureConnectToLobbyEvent()
    scene.add.existing(this)
  }

  loadLobbies() {
    return await getLobbies()
  }

  configureConnectToLobbyEvent() {
    this.getChildByID('submit').addEventListener('click', this.submitHandler.bind(this))
  }

  submitHandler(e) {
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