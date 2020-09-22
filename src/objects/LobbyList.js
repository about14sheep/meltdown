import { getLobbies, checkLobby, joinLobby } from '../actions/LobbyAPI'

export default class LobbyList extends Phaser.GameObjects.DOMElement {
  constructor(scene, x, y, user) {
    super(scene, x, y)
    this.scene = scene
    this.user = user
    this.loadLobbies = this.loadLobbies()
    this.createFromHTML('')
    this.configureConnectToLobbyEvent()
    scene.add.existing(this)
  }

  loadLobbies() {
    return await getLobbies()
  }

  configureConnectToLobbyEvent() {
    this.getChildByID('submit').addEventListener('click', this.submitHandler.bind(this))
  }

  submitHandler(e) {
    const check = await checkLobby(e.target.value)
    if (!check) {
      const lobby = await joinLobby(e.target.value, user)
      if (lobby) {
        this.scene.lobbyId = lobby.id
      } else {
        console.log('lobby is full')
      }
    } else {
      console.log('lobby is full')
    }
  }
}