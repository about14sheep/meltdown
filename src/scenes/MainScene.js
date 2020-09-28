// Meltdown Atomic City
// Copyright (C) 2020 Austin Burger

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>

import Player from '../objects/Player'
import GameState from '../objects/GameState'
import { sliderGame, sliderGameKey, upSliderGameKey, upSliderGame, bottomGame, bottomGameKey, downloadGame, downloadGameKey, employeeGame, employeeGameKey, placeGame, placeGameKey, serverGameKey, serverGame, trashGame, trashGameKey } from '../actions/MiniGames'

import ScientistSpritesheet from '../assets/scientist_spritesheet.png'
import Grass from '../assets/grass.png'
import FactoryTiles from '../assets/factory_tileset.png'
import layout from '../assets/meltdown_start_room.json'


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
    this.impGame = null
    const tileset = this.map.addTilesetImage("factory_tileset", "tiles")
    const [walls, usableTops, computers, desks, usableBottoms, pipes] = this.configureMapLayersFromTileset(tileset)
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
    this.cameras.main.startFollow(this.player)
    this.computer = this.scene.get('computer')
    this.ui = this.scene.get('ui')
    this.ui.setGameState(this.gameState)
    this.computer.setGameState(this.gameState)
    this.computer.loadMiniGame(sliderGameKey, sliderGame)
    this.computer.loadMiniGame(upSliderGameKey, upSliderGame)
    this.computer.loadMiniGame(trashGameKey, trashGame)
    this.computer.loadMiniGame(bottomGameKey, bottomGame)
    this.computer.loadMiniGame(downloadGameKey, downloadGame)
    this.computer.loadMiniGame(employeeGameKey, employeeGame)
    this.computer.loadMiniGame(placeGameKey, placeGame)
    this.computer.loadMiniGame(serverGameKey, serverGame)
    this.scene.bringToTop('ui')
  }

  update() {
    this.player.update()
    this.gameState.update()
    if (this.computer.calculateGame() === 'imposters') {
      this.gameState.impostersScore++
      console.log(`imposters won; ${this.gameState.minutesToMidnight()} minutes to midnight`)
      this.reset()
    } else if (this.computer.calculateGame() === 'scientists') {
      this.gameState.playersScore++
      console.log(`scientists won; ${this.gameState.minutesToMidnight()} minutes to midnight`)
      this.reset()
    }
    if (this.player.isPlayerUsing) {
      const tile = this.getTile(this.player.x, this.player.y)
      if (this.player.imposter && !this.impGame) {
        this.impGame = this.computer.imposterScreen()
      }
      if (tile) {
        this.player.imposter ? this.computer.displayMiniGame(this.impGame, this.player.imposter) : this.computer.displayMiniGame(tile)
      }
    } else {
      this.computer.hideMiniGame()
      this.impGame = null
    }

  }

  reset() {
    this.computer.reset()
    this.gameState.reset()
    this.player.reset()
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

}