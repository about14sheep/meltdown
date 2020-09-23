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
import MainScene from './MainScene'
import login from '../actions/LoginAPI'

export default class Login extends Phaser.Scene {
  constructor() {
    super({ key: 'login', active: true })
    this.login = login
    this.success = false
    this.lobbyId = 1
  }

  preload() {
    this.token = window.localStorage.getItem('meltdown/auth/token')
    this.user = window.localStorage.getItem('meltdown/auth/user')
  }

  create() {
    if (!this.token || !this.user) {
      this.loginForm = new LoginForm(this, 400, 300)
    } else {
      this.loadGameScene()
    }
  }

  update() {
    if (this.success && this.lobbyId) {
      this.loginForm.destroy()
      this.success = false
      this.loadGameScene()
    }
  }

  loadGameScene() {
    const user = JSON.parse(this.user)
    const main = new MainScene({ key: 'main', active: true }, user, this.lobbyId)
    this.game.scene.add('main', main)
  }

  loginUser(username, password) {
    this.user = JSON.stringify(this.login(username, password))
    this.success = true
  }

}