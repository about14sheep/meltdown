import Phaser from 'phaser'

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'main', active: true })
  }

  preload() {
    this.load.image('grass', 'assets/grass.png')
    this.load.image('grass', '../assets/grass.png')
    this.load.spritesheet('tiles', '../assets/factory_tileset.png', {
      frameWidth: 16,
      frameHeight: 16
    })
    this.load.spritesheet('scientist', 'assets/scientist_spritesheet.png', {
      frameWidth: 48,
      frameHeight: 48
    })
    this.load.tilemapTiledJSON('map', '../assets/meltdown_start_room.json')
  }

  create() {
    this.grass = this.add.image(400, 300, 'grass')
    this.grass.setScale(2.5)
    this.map = this.make.tilemap({ key: 'map' })
    const tileset = map.addTilesetImage("factory_tileset", "tiles")
    this.configureMapLayersFromTileset(tileset)
    this.createAnimsForScientist()

  }

  configureMapLayersFromTileset(tileset) {
    const floor = map.createStaticLayer('floor', tileset, 0, 0)
    floor.setScale(3)

    const walls = map.createStaticLayer('walls', tileset, 0, 0)
    walls.setScale(3)
    walls.setCollisionBetween(1, 10000)

    const desks = map.createStaticLayer('desks', tileset, 0, 0)
    desks.setScale(3)
    desks.setCollisionBetween(1, 10000)

    const computers = map.createStaticLayer('pressure_comps', tileset, 0, 0)
    computers.setScale(3)
    computers.setCollisionBetween(1, 10000)

    const usableBottoms = map.createStaticLayer('usable_bottom', tileset, 0, 0)
    usableBottoms.setScale(3)

    const usableTops = map.createStaticLayer('usable_top', tileset, 0, 0)
    usableTops.setScale(3)
    usableTops.setCollisionBetween(1, 10000)

    const pipes = map.createStaticLayer('pipes', tileset, 0, 0)
    pipes.setScale(3)
    pipes.setCollisionBetween(0, 10000)

    const accents = map.createStaticLayer('accents', tileset, 0, 0)
    accents.setScale(3)

    this.physics.add.collider(this.player, walls)
    this.physics.add.collider(this.player, usableTops)
    this.physics.add.collider(this.player, computers)
    this.physics.add.collider(this.player, desks)
    this.physics.add.overlap(this.player, usableBottoms)
    this.physics.add.collider(this.player, pipes)
  }

  createAnimsForScientist() {
    this.anims.create({
      key: 'walking',
      frames: this.anims.generateFrameNumbers('scientist', {
        prefix: 'scientist_', start: 3, end: 2
      }),
      frameRate: 4,
      repeat: 0
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

}