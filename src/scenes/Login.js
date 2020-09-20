import LoginForm from '../objects/LoginForm'
import MainScene from '../scenes/MainScene'
import login from '../actions/Login'

export default class Login extends Phaser.Scene {
  constructor() {
    super({ key: 'login', active: true })
    this.login = login
    this.success = false
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
    if (this.success) {
      this.loginForm.destroy()
      this.success = false
      this.loadGameScene()
    }
  }

  loadGameScene() {
    const user = JSON.parse(this.user)
    const main = new MainScene({ key: 'main', active: true }, user, 1)
    this.game.scene.add('main', main)
  }

}