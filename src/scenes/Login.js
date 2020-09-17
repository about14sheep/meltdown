import LoginForm from '../objects/LoginForm'
import MainScreen from '../scenes/MainScene'


export default class Login extends Phaser.Scene {
  constructor() {
    super({ key: 'login', active: true })
  }

  preload() {
    this.token = window.localStorage.getItem('meltdown/auth/token')
    this.user = window.localStorage.getItem('meltdown/auth/user')
  }

  create() {
    if (!this.token || !this.user) {
      const domElement = new LoginForm(this, 400, 300)
    } else {
      const main = new MainScreen({ key: 'main', active: true }, JSON.parse(this.user))
      this.game.scene.add('main', main)
    }
  }


}