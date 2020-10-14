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
  constructor(scene, x, y) {
    super(scene, x, y)
    this.scene = scene
    this.players = []
    this.updateCard()
    scene.add.existing(this)
  }

  updateCard() {
    this.votes = this.configurePlayers()
    this.createFromHTML(this.createButtons())
    this.registerEvents()
  }

  configurePlayers() {
    const res = {}
    this.players.forEach(player => {
      res[player] = null
    })
    return res
  }

  createButtons() {
    let res = ''
    this.players.forEach(el => {
      res += `<button id=${el.username}>${el.username}</button>`
    })
    return `<div id="vote_container" style="width: 320px; height: 400px; background-color: #4E4E4E;">${res}</div>`
  }

  registerEvents() {
    const buttons = this.getChildByID('vote_container').childNodes
    buttons.forEach(el => el.addEventListener('click', this.voteHandler.bind(this)))
  }

  setPlayers(players) {
    this.players = players
    this.updateCard()
  }

  voteHandler(e) {
    console.log(e)
  }

  setVote(player, vote) {
    this.votes[player] = vote
  }

}