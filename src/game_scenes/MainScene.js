import Phaser from 'phaser'
import Player from '../controllers/Player'

import ScientistSpritesheet from '../assets/scientist_spritesheet.png'
import Grass from '../assets/grass.png'
import FactoryTiles from '../assets/factory_tileset.png'
import layout from '../assets/meltdown_start_room.json'
export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'main', active: true })
    this.playersMap = new Map()
  }

  preload() {
    this.load.image('grass', Grass)
    this.load.spritesheet('tiles', FactoryTiles, {
      frameWidth: 16,
      frameHeight: 16
    })
    this.load.spritesheet('scientist', ScientistSpritesheet, {
      frameWidth: 48,
      frameHeight: 48
    })
    this.load.tilemapTiledJSON('map', layout)
  }

  create() {
    this.grass = this.add.image(400, 300, 'grass')
    this.grass.setScale(2.5)
    this.map = this.make.tilemap({ key: 'map' })

    const tileset = this.map.addTilesetImage("factory_tileset", "tiles")
    this.createAnimsForScientist()

    const [floor, walls, usableTops, computers, desks, usableBottoms, pipes] = this.configureMapLayersFromTileset(tileset)
    this.player = new Player(this, 400, 300)
    this.physics.add.collider(this.player, walls)
    this.physics.add.collider(this.player, usableTops)
    this.physics.add.collider(this.player, computers)
    this.physics.add.collider(this.player, desks)
    this.physics.add.overlap(this.player, usableBottoms)
    this.physics.add.collider(this.player, pipes)

    this.otherPlayers = this.physics.add.group()
    this.cameras.main.startFollow(this.player)
  }

  update() {
    this.player.update()
  }

  useTile(player) {
    player.isPlayerUsing = true
  }

  configureMapLayersFromTileset(tileset) {
    const floor = this.map.createStaticLayer('floor', tileset, 0, 0)
    floor.setScale(3)

    const walls = this.map.createStaticLayer('walls', tileset, 0, 0)
    walls.setScale(3)
    walls.setCollisionBetween(1, 10000)

    const desks = this.map.createStaticLayer('desks', tileset, 0, 0)
    desks.setScale(3)
    desks.setCollisionBetween(1, 10000)

    const computers = this.map.createStaticLayer('pressure_comps', tileset, 0, 0)
    computers.setScale(3)
    computers.setCollisionBetween(1, 10000)

    const usableBottoms = this.map.createStaticLayer('usable_bottom', tileset, 0, 0)
    usableBottoms.setScale(3)

    const usableTops = this.map.createStaticLayer('usable_top', tileset, 0, 0)
    usableTops.setScale(3)
    usableTops.setCollisionBetween(1, 10000)

    const pipes = this.map.createStaticLayer('pipes', tileset, 0, 0)
    pipes.setScale(3)
    pipes.setCollisionBetween(0, 10000)

    const accents = this.map.createStaticLayer('accents', tileset, 0, 0)
    accents.setScale(3)
    return [floor, walls, desks, computers, usableBottoms, usableTops, pipes, accents]

  }

  createAnimsForScientist() {
    this.anims.create({
      key: 'walking',
      frames: this.anims.generateFrameNumbers('scientist', {
        prefix: 'scientist_', start: 3, end: 2
      }),
      frameRate: 4,
      repeat: -1
    })

    this.anims.create({
      key: 'idle',
      frames: [{ key: 'scientist', frame: 0 }],
      frameRate: 1,
    })

    this.anims.create({
      key: 'using',
      frames: [{ key: 'scientist', frame: 1 }],
      frameRate: 1,
    })

  }

  addOtherPlayers(data) {
    const id = parseInt(data.player, 10)
    this.playersMap.set(id, data.position)
    if (id != this.player.ID) {
      const otherPlayer = new Player(this, data.position.x, data.position.y)
      otherPlayer.ID = id
      this.otherPlayers.add(otherPlayer)
    }
  }

}