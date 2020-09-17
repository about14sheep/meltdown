import Player from '../objects/Player'
import SliderGame from './SliderGame'
import Socket from '../objects/Socket'
import GameState from '../objects/GameState'

import ScientistSpritesheet from '../assets/scientist_spritesheet.png'
import Grass from '../assets/grass.png'
import FactoryTiles from '../assets/factory_tileset.png'
import layout from '../assets/meltdown_start_room.json'

export default class MainScene extends Phaser.Scene {
  constructor(handle, data) {
    super(handle)
    this.playerData = data
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

    const [walls, usableTops, computers, desks, usableBottoms, pipes] = this.configureMapLayersFromTileset(tileset)
    this.socket = new Socket(this)
    this.player = new Player(this, 400, 300, this.playerData.id, this.playerData.username)
    this.gameState = new GameState(this)
    usableBottoms.setTileIndexCallback(['1325', '1277'], this.useTile, this.player)
    this.physics.add.collider(this.player, walls)
    this.physics.add.collider(this.player, usableTops)
    this.physics.add.collider(this.player, computers)
    this.physics.add.collider(this.player, desks)
    this.physics.add.overlap(this.player, usableBottoms)
    this.physics.add.collider(this.player, pipes)

    this.otherPlayers = this.physics.add.group()
    this.cameras.main.startFollow(this.player)
    this.computer = this.scene.get('computer')
    const sliderGameKey = 'sliderGame'
    const sliderGame = new SliderGame(sliderGameKey)
    this.computer.loadMiniGame(sliderGameKey, sliderGame)
  }

  update() {
    this.player.update()
    this.socket.update()
    if (this.player.isPlayerUsing) {
      this.computer.displayMiniGame('sliderGame')
    } else {
      this.computer.hideMiniGame()
    }

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
    pipes.setCollisionBetween(1, 10000)

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

}