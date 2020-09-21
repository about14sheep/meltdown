import Player from '../objects/Player'
import MiniGameFactory from './MiniGameFactory'
import Socket from '../objects/Socket'
import GameState from '../objects/GameState'

import ScientistSpritesheet from '../assets/scientist_spritesheet.png'
import Grass from '../assets/grass.png'
import FactoryTiles from '../assets/factory_tileset.png'
import layout from '../assets/meltdown_start_room.json'
import SliderGameBase from '../assets/minigames_pdf/slider_game/slidergame_base.png'
import SliderGameBar from '../assets/minigames_pdf/slider_game/slidergame_bar.png'
import SliderGameAnim from '../assets/minigames_pdf/slider_game/slidergame_anim.png'
import UpsliderGameBase from '../assets/minigames_pdf/upslider_game/upslider_game_base.png'
import UpsliderGameBar from '../assets/minigames_pdf/upslider_game/upslider_game_bar.png'
import UpsliderGameAnim from '../assets/minigames_pdf/upslider_game/upslider_game_anim.png'
import TrashGameBase from '../assets/minigames_pdf/trash_game/trash_game_base.png'
import TrashGameBar from '../assets/minigames_pdf/trash_game/trash_game_bar.png'
import TrashGameAnim from '../assets/minigames_pdf/trash_game/trash_game_anim.png'
import ServerGameBase from '../assets/minigames_pdf/server_game/server_game_base.png'
import ServerGameBar from '../assets/minigames_pdf/server_game/server_game_bar.png'
import ServerGameAnim from '../assets/minigames_pdf/place_game/place_game_anim.png'
import PlaceGameBase from '../assets/minigames_pdf/place_game/place_game_base.png'
import PlaceGameBar from '../assets/minigames_pdf/place_game/place_game_bar.png'
import PlaceGameAnim from '../assets/minigames_pdf/place_game/place_game_anim.png'
import EmployeeGameBase from '../assets/minigames_pdf/employee_game/employee_game_base.png'
import EmployeeGameBar from '../assets/minigames_pdf/employee_game/employee_game_bar.png'
import EmployeeGameAnim from '../assets/minigames_pdf/employee_game/employee_game_anim.png'
import DownloadGameBase from '../assets/minigames_pdf/download_game/download_game_base.png'
import DownloadGameBar from '../assets/minigames_pdf/download_game/download_game_bar.png'
import DownloadGameAnim from '../assets/minigames_pdf/download_game/download_game_anim.png'
import BottomGameBase from '../assets/minigames_pdf/bottom_game/bottom_game_base.png'
import BottomGameBar from '../assets/minigames_pdf/bottom_game/bottom_game_bar.png'
import BottomGameAnim from '../assets/minigames_pdf/bottom_game/bottom_game_anim.png'

export default class MainScene extends Phaser.Scene {
  constructor(handle, data, lobbyID) {
    super(handle)
    this.playerData = data
    this.lobbyID = lobbyID
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
    usableBottoms.setTileIndexCallback(['1325', '1277', '1329'], this.useTile, this.player, this.map)
    this.gameTiles = usableBottoms.filterTiles(this.checkForTiles).map(tile => `${tile.x}${tile.y}`)
    this.physics.add.collider(this.player, walls)
    this.physics.add.collider(this.player, usableTops)
    this.physics.add.collider(this.player, computers)
    this.physics.add.collider(this.player, desks)
    this.physics.add.overlap(this.player, usableBottoms)
    this.physics.add.collider(this.player, pipes)

    this.otherPlayers = this.physics.add.group()
    this.cameras.main.startFollow(this.player)
    this.computer = this.scene.get('computer')
    const sliderGameKey = '15'
    const upSliderGameKey = '543'
    const bottomGameKey = '152'
    const downloadGameKey = '1826'
    const employeeGameKey = '4453'
    const placeGameKey = '5439'
    const serverGameKey = '5223'
    const trashGameKey = '178'
    const upSliderGame = new MiniGameFactory(upSliderGameKey, 'upslider', {
      x: 555,
      y: 300
    }, {
      x: 245,
      y: 300
    }, {
      x: {
        min: 450,
        max: 486
      },
      y: {
        min: 300,
        max: 300
      }
    }, {
      string: 'UpsliderGameBase',
      image: UpsliderGameBase
    }, {
      string: 'UpsliderGameBar',
      image: UpsliderGameBar,
    }, {
      string: 'UpsliderGameAnim',
      image: UpsliderGameAnim
    })
    const trashGame = new MiniGameFactory(trashGameKey, '', {
      x: 555,
      y: 300
    }, {
      x: 245,
      y: 300
    }, {
      x: {
        min: 450,
        max: 486
      },
      y: {
        min: 300,
        max: 300
      }
    }, {
      string: 'TrashGameBase',
      image: TrashGameBase
    }, {
      string: 'TrashGameBar',
      image: TrashGameBar,
    }, {
      string: 'TrashGameAnim',
      image: TrashGameAnim
    })
    const sliderGame = new MiniGameFactory(sliderGameKey, 'slider', {
      x: 555,
      y: 300
    }, {
      x: 245,
      y: 300
    }, {
      x: {
        min: 450,
        max: 486
      },
      y: {
        min: 300,
        max: 300
      }
    }, {
      string: 'SliderGameBase',
      image: SliderGameBase
    }, {
      string: 'SliderGameBar',
      image: SliderGameBar,
    }, {
      string: 'SliderGameAnim',
      image: SliderGameAnim
    })
    const bottomGame = new MiniGameFactory(bottomGameKey, '', {
      x: 555,
      y: 300
    }, {
      x: 245,
      y: 300
    }, {
      x: {
        min: 450,
        max: 486
      },
      y: {
        min: 300,
        max: 300
      }
    }, {
      string: 'BottomGameBase',
      image: BottomGameBase
    }, {
      string: 'BottomGameBar',
      image: BottomGameBar
    }, {
      string: 'BottomGameAnim',
      image: BottomGameAnim
    })
    const downloadGame = new MiniGameFactory(downloadGameKey, '', {
      x: 555,
      y: 300
    }, {
      x: 245,
      y: 300
    }, {
      x: {
        min: 450,
        max: 486
      },
      y: {
        min: 300,
        max: 300
      }
    }, {
      string: 'DownloadGameBase',
      image: DownloadGameBase
    }, {
      string: 'DownloadGameBar',
      image: DownloadGameBar
    }, {
      string: 'DownloadGameAnim',
      image: DownloadGameAnim
    })
    const employeeGame = new MiniGameFactory(employeeGameKey, '', {
      x: 555,
      y: 300
    }, {
      x: 245,
      y: 300
    }, {
      x: {
        min: 450,
        max: 486
      },
      y: {
        min: 300,
        max: 300
      }
    }, {
      string: 'EmployeeGameBase',
      image: EmployeeGameBase
    }, {
      string: 'EmployeeGameBar',
      image: EmployeeGameBar
    }, {
      string: 'EmployeeGameAnim',
      image: EmployeeGameAnim
    })
    const placeGame = new MiniGameFactory(placeGameKey, '', {
      x: 555,
      y: 300
    }, {
      x: 245,
      y: 300
    }, {
      x: {
        min: 450,
        max: 486
      },
      y: {
        min: 300,
        max: 300
      }
    }, {
      string: 'PlaceGameBase',
      image: PlaceGameBase
    }, {
      string: 'PlaceGameBar',
      image: PlaceGameBar
    }, {
      string: 'PlaceGameAnim',
      image: PlaceGameAnim
    })
    const serverGame = new MiniGameFactory(serverGameKey, '', {
      x: 555,
      y: 300
    }, {
      x: 245,
      y: 300
    }, {
      x: {
        min: 450,
        max: 486
      },
      y: {
        min: 300,
        max: 300
      }
    }, {
      string: 'ServerGameBase',
      image: ServerGameBase
    }, {
      string: 'ServerGameBar',
      image: ServerGameBar
    }, {
      string: 'ServerGameAnim',
      image: ServerGameAnim
    })
    this.computer.loadMiniGame(sliderGameKey, sliderGame)
    this.computer.loadMiniGame(upSliderGameKey, upSliderGame)
    this.computer.loadMiniGame(trashGameKey, trashGame)
    this.computer.loadMiniGame(bottomGameKey, bottomGame)
    this.computer.loadMiniGame(downloadGameKey, downloadGame)
    this.computer.loadMiniGame(employeeGameKey, employeeGame)
    this.computer.loadMiniGame(placeGameKey, placeGame)
    this.computer.loadMiniGame(serverGameKey, serverGame)
  }

  update() {
    this.player.update()
    this.socket.update()
    if (this.player.isPlayerUsing) {
      const tile = this.getTile(this.player.x, this.player.y)
      tile ? this.computer.displayMiniGame(tile) : null
    } else {
      this.computer.hideMiniGame()
    }

  }

  checkForTiles(tile, value) {
    if (tile.index != -1) {
      return value
    }
  }

  getTile(x, y) {
    const tile = this.map.getTileAtWorldXY(x, y)
    return !tile ? null : `${tile.x}${tile.y}`
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