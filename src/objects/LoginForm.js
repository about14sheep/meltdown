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

export default class LoginForm extends Phaser.GameObjects.DOMElement {
  constructor(scene, x, y) {
    super(scene, x, y)
    this.scene = scene
    this.createFromHTML('<div style="background-color: lime; width: 320px; height: 400px; font: 48px Arial"><input type="text" placeholder="Username" id="username"><input type="password" placeholder="Password" id="password"><br /><input type="submit" id="submit"></div>')
    this.usernameInput = this.getChildByID('username')
    this.passwordInput = this.getChildByID('password')
    this.configureSubmitEvent()
    scene.add.existing(this)
  }

  configureSubmitEvent() {
    const submit = this.getChildByID('submit')
    submit.addEventListener('click', this.submitHandler.bind(this))
  }

  submitHandler() {
    this.scene.loginUser(this.usernameInput.value, this.passwordInput.value)
  }

}