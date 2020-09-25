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
import SignupForm from '../objects/SignupForm'

import login from '../actions/LoginAPI'

export default class Login extends Phaser.Scene {
  constructor() {
    super({ key: 'login', active: true })
    this.login = login
    this.success = false
    this.lobbyId = null
  }

  preload() {
    this.token = window.localStorage.getItem('meltdown/auth/token')
    this.user = window.localStorage.getItem('meltdown/auth/user')
  }

  create() {
    if (!this.token || !this.user) {
      this.loginForm = new LoginForm(this, 400, 300)
    } else {
      this.success = true
    }
  }

  update() {
    if (this.success) {
      if (this.loginForm) {
        this.loginForm.destroy()
        this.signupForm.destroy()
      }
    }
    if (this.success && !this.lobbyId && !this.lobbyList) {
      this.lobbyList = new LobbyList(this, 400, 300, this.user)
    } else if (this.success && this.lobbyId) {
      this.success = false
      this.lobbyList.destroy()
      this.loadGameScene()
    }
  }

  showLogin() {
    this.signupForm.destroy()
    this.loginForm = new LoginForm(this, 400, 300)
  }

  showSignup() {
    this.loginForm.destroy()
    this.signupForm = new SignupForm(this, 400, 300)
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

  createUser(username, password) {
    console.log('yeah your good totally in there brother ' + `${username}.`)
  }

}