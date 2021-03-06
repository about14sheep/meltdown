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

import 'phaser'

import UIScene from './scenes/UIScene'
import ComputerBase from './scenes/ComputerBase'
import Login from './scenes/Login'
import Background from './scenes/Background'
import Meeting from './scenes/Meeting'

const config = {
  type: Phaser.AUTO,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
  },
  parent: 'menus-overlay',
  dom: {
    createContainer: true
  },
  scene: [Meeting, UIScene, Login, Background, ComputerBase]
}

export const game = new Phaser.Game(config)