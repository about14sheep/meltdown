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

import LoginForm from '../objects/LoginForm'
import LobbyList from '../objects/LobbyList'
import MainScene from './MainScene'

import login from '../actions/LoginAPI'

export default class Login extends Phaser.Scene {
  constructor() {
    super({ key: 'login', active: true })
    this.lobbyId = null
  }

  preload() {
    this.user = window.localStorage.getItem('meltdown/auth/user')
  }

  create() {
    this.user ? this.loadLobbyList() : this.loadLoginForm()
  }

  update() {
    if (this.lobbyId) {
      this.lobbyList.destroy()
      this.loadGameScene()
      this.lobbyId = null
    }
  }

  loadGameScene() {
    console.log(this.user)
    const user = JSON.parse(this.user)
    const main = new MainScene({ key: 'main', active: true }, user, this.lobbyId)
    this.game.scene.add('main', main)
  }

  loadLoginForm() {
    this.loginForm = new LoginForm(this, 400, 300)
  }

  loadLobbyList() {
    if (this.loginForm) {
      this.loginForm.destroy()
    }
    this.lobbyList = new LobbyList(this, 400, 300, this.user)
  }

  loginUser(username) {
    this.user = JSON.stringify(login(username))
    this.loadLobbyList()
  }

}