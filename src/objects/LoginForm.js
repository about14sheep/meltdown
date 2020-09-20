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