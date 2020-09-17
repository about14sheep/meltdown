export default class LoginForm extends Phaser.GameObjects.DOMElement {
  constructor(scene, x, y) {
    super(scene, x, y)
    this.createFromHTML('<div style="background-color: lime; width: 320px; height: 400px; font: 48px Arial"><input type="text" placeholder="Username" id="username"><input type="password" placeholder="Password" id="password"><br /><input type="submit" id="submit"></div>')
    this.usernameInput = this.getChildByID('username')
    this.passwordInput = this.getChildByID('password')
    this.configureSubmitEvent()
    scene.add.existing(this)
  }

  async login(username, password) {
    const res = await fetch('http://localhost:3000/api/session', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    const data = await res.json()
    console.log(data)
    return data
  }

  configureSubmitEvent() {
    const submit = this.getChildByID('submit')
    submit.addEventListener('click', this.submitHandler.bind(this))
  }

  submitHandler() {
    const login = this.login(this.usernameInput.value, this.passwordInput.value)
  }




}