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

export default class SignupForm extends Phaser.GameObjects.DOMElement {
  constructor(scene, x, y) {
    super(scene, x, y)
    this.scene = scene
    this.createFromHTML('<div style="display: flex; flex-direction: column; align-items: center; width: 320px; height: 400px; font: 48px Arial"><p style="text-align: center;">Meltdown \n Atomic City</p><input type="text" placeholder="create username" id="username" name="username"><input type="password" placeholder="set password" id="password" name="password"><div><button id="backToLogin" value="login"><- Login</button><input type="submit" id="signup" value="Sign-Up"></div></div>')
    this.usernameInput = this.getChildByID('username')
    this.passwordInput = this.getChildByID('password')
    this.configureLoginEvent()
    this.configureSignupEvent()
    scene.add.existing(this)
  }

  configureLoginEvent() {
    const login = this.getChildByID('backToLogin')
    login.addEventListener('click', this.loginHandler.bind(this))
  }

  configureSignupEvent() {
    const submit = this.getChildByID('signup')
    submit.addEventListener('click', this.signupHandler.bind(this))
  }

  loginHandler() {
    this.scene.showLogin()
  }

  signupHandler() {
    this.scene.createUser(this.usernameInput.value, this.passwordInput.value)
  }
}