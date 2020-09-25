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
import ServerGameAnim from '../assets/minigames_pdf/server_game/server_game_anim.png'
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


import MiniGameFactory from '../scenes/MiniGameFactory'


export const sliderGameKey = '15'
export const upSliderGameKey = '543'
export const bottomGameKey = '152'
export const downloadGameKey = '1826'
export const employeeGameKey = '4453'
export const placeGameKey = '5439'
export const serverGameKey = '5223'
export const trashGameKey = '178'

export const upSliderGame = new MiniGameFactory(upSliderGameKey, 'upslider', {
  x: 245,
  y: 400
}, {
  x: 245,
  y: 400
}, {
  x: {
    min: 245,
    max: 245
  },
  y: {
    min: 175,
    max: 212
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
export const trashGame = new MiniGameFactory(trashGameKey, '', {
  x: 440,
  y: 590
}, {
  x: 393,
  y: 324
}, {
  x: {
    min: 450,
    max: 590
  },
  y: {
    min: 335,
    max: 440
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
export const sliderGame = new MiniGameFactory(sliderGameKey, 'slider', {
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
export const bottomGame = new MiniGameFactory(bottomGameKey, '', {
  x: 580,
  y: 420
}, {
  x: 557,
  y: 179
}, {
  x: {
    min: 220,
    max: 580
  },
  y: {
    min: 368,
    max: 420
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
export const downloadGame = new MiniGameFactory(downloadGameKey, '', {
  x: 610,
  y: 440
}, {
  x: 245,
  y: 300
}, {
  x: {
    min: 475,
    max: 610
  },
  y: {
    min: 165,
    max: 440
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
export const employeeGame = new MiniGameFactory(employeeGameKey, '', {
  x: 570,
  y: 420
}, {
  x: 385,
  y: 255
}, {
  x: {
    min: 200,
    max: 570
  },
  y: {
    min: 370,
    max: 420
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
export const placeGame = new MiniGameFactory(placeGameKey, '', {
  x: 575,
  y: 433
}, {
  x: 278,
  y: 397
}, {
  x: {
    min: 440,
    max: 575
  },
  y: {
    min: 177,
    max: 433
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
export const serverGame = new MiniGameFactory(serverGameKey, '', {
  x: 555,
  y: 430
}, {
  x: 435,
  y: 300
}, {
  x: {
    min: 495,
    max: 555
  },
  y: {
    min: 150,
    max: 430
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