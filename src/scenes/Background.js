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

import Grass from '../assets/grass.png'

export default class Background extends Phaser.Scene {
  constructor() {
    super({ key: 'background', active: true })
  }

  preload() {
    // this.load.setBaseURL('/static')
    this.load.image('grass', Grass)
  }

  create() {
    this.grass = this.add.image(400, 300, 'grass')
    this.grass.setScale(2.5)
  }
}