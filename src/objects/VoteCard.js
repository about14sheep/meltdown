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

export default class VoteCard extends Phaser.GameObjects.DOMElement {
  constructor(scene, x, y, players) {
    super(scene, x, y)
    this.scene = scene
    this.votes = this.configurePlayers(players)
    this.createButtons(players)
  }

  configurePlayers(players) {
    const res = {}
    players.forEach(player => {
      res[player] = null
    })
    return res
  }

  createButtons(players) {
    let res = ''
    this.buttons = players.forEach((el, i) => {
      res += `<button id=${el.username}>${el.username}</button>`
    })
    this.createFromHTML(res)
  }

  setVote(player, vote) {
    this.votes[player] = vote
  }

  tallyVote() {

  }
}