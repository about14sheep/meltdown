import LoginForm from '../objects/LoginForm'

export default class Menus extends Phaser.Scene {
  constructor() {
    super({ key: 'menus', active: true })
  }

  create() {
    const domElement = new LoginForm(this, 400, 300)
  }


}