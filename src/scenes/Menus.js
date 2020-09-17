import DOM from '../objects/DOM'

export default class Menus extends Phaser.Scene {
  constructor() {
    super({ key: 'menus', active: true })
  }

  create(){
    const domElement = new DOM(this, 400, 300, 'input', 'background-color: lime; width: 220px; height: 100px; font: 48px Arial', 'Phaser')
  }
}