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

export const getLobbies = async _ => {
  const res = await fetch('http://localhost:3000/api/lobbies')
  if (res.ok) {
    const { lobbies } = await res.json()
    return lobbies
  } else {
    const error = await res.json()
    console.error('An error occured getting all lobbies: ', error)
  }
}

export const checkLobby = async id => {
  const res = await fetch(`http://localhost:3000/api/lobby/${id}`)
  if (res.ok) {
    const { player_max, player_count } = await res.json()
    return player_count === player_max
  } else {
    const error = await res.json()
    console.error(`An error occured checking lobby ${id}: `, error)
    return true
  }
}

export const joinLobby = async (lobbyId, user) => {
  const res = await fetch(`http://localhost:3000/api/lobby/${lobbyId}`, {
    methos: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
  if (res.ok) {
    const data = await res.json()
    return data
  } else {
    const error = await res.json()
    console.error(`An error occured joining lobby ${lobbyId}: `, error)
    return false
  }
}