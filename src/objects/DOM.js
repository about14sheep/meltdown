export default class DOM extends Phaser.GameObjects.DOMElement {
  constructor(scene, x, y, element, style, innerText) {
    super(scene, x, y, element, style, innerText)
    scene.add.existing(this)
  }
}