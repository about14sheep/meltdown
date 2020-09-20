import login from '../actions/Login'

export default class LoginForm extends Phaser.GameObjects.DOMElement {
  constructor(scene, x, y) {
    super(scene, x, y)
    this.scene = scene
    this.createFromHTML('<div style="background-color: lime; width: 320px; height: 400px; font: 48px Arial"><input type="text" placeholder="Username" id="username"><input type="password" placeholder="Password" id="password"><br /><input type="submit" id="submit"></div>')
    this.login = login
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
    const login = this.login(this.usernameInput.value, this.passwordInput.value)
    this.scene.success = true
  }




}